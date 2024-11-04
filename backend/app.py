from flask import Flask, request, jsonify, session, Response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import pymysql.cursors
import bcrypt
import re
import xml.etree.ElementTree as ET
from dotenv import load_dotenv
import os
import jwt  # Import PyJWT
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
JWT_SECRET = os.getenv('JWT_SECRET', 'your_jwt_secret')  # Make sure to set this in your .env file

# MySQL configurations
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

# Configure CORS to allow requests from http://localhost:5173
CORS(app, supports_credentials=True, origins=[os.getenv('FRONTEND_URL')])

# Set up rate limiter
limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])

def get_db_connection():
    try:
        connection = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Database connection successful!")
        return connection
    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL Database: {e}")
        return None

# Input sanitization helper
def sanitize_input(input_string):
    return re.sub(r'[^\w\s@.-]', '', input_string)

# User Registration with JWT
@app.route('/api/register', methods=['POST'])
@limiter.limit("50 per minute")
def register():
    data = request.get_json()
    username = sanitize_input(data['username'])
    email = sanitize_input(data['email'])
    password = data['password']
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        account = cursor.fetchone()
        
        if account:
            return jsonify({'error': 'User already exists!'}), 400

        cursor.execute(
            'INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
            (username, email, hashed_password)
        )
        connection.commit()
        
        # Fetch the newly created user
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
    connection.close()
    
    # Generate JWT token
    payload = {
        'user_id': user['id'],
        'username': user['username'],
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration (1 hour)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    
    return jsonify({
        'status': 201,
        'message': 'User registered successfully!',
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
    }), 201

# User Login with JWT
@app.route('/api/login', methods=['POST'])
@limiter.limit("100 per minute")
def login():
    data = request.get_json()
    email = sanitize_input(data['email'])
    password = data['password']

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # Generate JWT token
            payload = {
                'user_id': user['id'],
                'username': user['username'],
                'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration (1 hour)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

            return jsonify({
                'status': 'success',
                'message': 'Login successful!',
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email']
                }
            }), 200

    connection.close()
    return jsonify({'error': 'Invalid credentials!'}), 401

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)