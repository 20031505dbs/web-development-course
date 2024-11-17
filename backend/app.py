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

# Configure CORS to allow requests from http://localhost:5180
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

# Get Products with Filters
@app.route('/api/products', methods=['GET'])
def get_products():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    cursor = connection.cursor()

    # Base query
    query = "SELECT * FROM products WHERE 1=1"
    filters = []

    # Apply filters if they exist
    category = request.args.get('category')
    if category:
        query += " AND category = %s"
        filters.append(category)

    fabric_type = request.args.get('fabric_type')
    if fabric_type:
        query += " AND fabric_type = %s"
        filters.append(fabric_type)

    colors = request.args.get('colors')
    if colors:
        query += " AND FIND_IN_SET(%s, colors)"
        filters.append(colors)

    sizes = request.args.get('sizes')
    if sizes:
        query += " AND FIND_IN_SET(%s, sizes)"
        filters.append(sizes)

    product_type = request.args.get('type')
    if product_type:
        query += " AND type = %s"
        filters.append(product_type)

    min_price = request.args.get('min_price')
    if min_price:
        query += " AND price >= %s"
        filters.append(min_price)

    max_price = request.args.get('max_price')
    if max_price:
        query += " AND price <= %s"
        filters.append(max_price)

    cursor.execute(query, filters)
    product_list = cursor.fetchall()
    cursor.close()
    connection.close()
    
    return jsonify(product_list), 200

# Add to Cart
@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()

    product_id = data['product_id']
    quantity = data['quantity']
    user_id = data['user_id']

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    cursor = connection.cursor()
    
    # Check current stock
    cursor.execute('SELECT stock FROM products WHERE id = %s', (product_id,))
    product = cursor.fetchone()
    if product['stock'] < quantity:
        cursor.close()
        connection.close()
        return jsonify({'error': 'Insufficient stock available'}), 400
    
    # Insert item into cart
    cursor.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (%s, %s, %s)', (user_id, product_id, quantity))
    
    # Update stock
    cursor.execute('UPDATE products SET stock = stock - %s WHERE id = %s', (quantity, product_id))
    
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'message': 'Item added to cart!','status': 201}), 201

# Get Cart Items
@app.route('/api/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('user_id')
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    cursor = connection.cursor()
    cursor.execute('SELECT * FROM cart_items WHERE user_id = %s', (user_id,))
    user_cart_items = cursor.fetchall()
    
    cart_details = []
    for item in user_cart_items:
        cursor.execute('SELECT * FROM products WHERE id = %s', (item['product_id'],))
        product = cursor.fetchone()
        item['product'] = product
        cart_details.append(item)
    cursor.close()
    connection.close()
    return jsonify(cart_details), 200

# Remove from Cart
@app.route('/api/cart', methods=['DELETE'])
def remove_from_cart():
    data = request.get_json()

    product_id = data['product_id']
    user_id = data['user_id']

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    cursor = connection.cursor()
    
    # Find the item in the cart
    cursor.execute('SELECT quantity FROM cart_items WHERE user_id = %s AND product_id = %s', (user_id, product_id))
    cart_item = cursor.fetchone()
    if not cart_item:
        cursor.close()
        connection.close()
        return jsonify({'error': 'Item not found in cart'}), 404

    # Remove item from cart
    cursor.execute('DELETE FROM cart_items WHERE user_id = %s AND product_id = %s', (user_id, product_id))
    
    # Update stock
    cursor.execute('UPDATE products SET stock = stock + %s WHERE id = %s', (cart_item['quantity'], product_id))
    
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'message': 'Item removed from cart!'}), 200

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)