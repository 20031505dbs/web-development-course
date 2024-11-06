## Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/20031505dbs/web-development-course.git
   cd web-development-course
   ```

# Backend README (Flask)

This is the backend for the project, built using Flask. It provides a RESTful API for user authentication, product management, and cart operations.

## Requirements

- Python 3.6+
- MySQL

## Go to Backend Directory

1. **Go to Backend**:

   ```sh
   cd backend
   ```

2. **Create a virtual environment**:

   ```sh
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:

   ```sh
   source venv/bin/activate
   ```

4. **Install dependencies**:

   ```sh
   pip install -r requirements.txt
   ```

5. **Set up MySQL database**:

   - Ensure MySQL is installed and running.
   - Create a database named `bootique`.
   - Update the MySQL configurations in `app.py` with your MySQL credentials.

6. **Run the Flask application**:

   ```sh
   python app.py
   ```

7. **Access the application**:
   Open your web browser and navigate to `http://127.0.0.1:5000`.

## API Endpoints

- **User Registration**: `POST /api/register`
- **User Login**: `POST /api/login`
- **Get Products with Filters**: `GET /api/products`
- **Add to Cart**: `POST /api/cart`
- **Get Cart Items**: `GET /api/cart`
- **Remove from Cart**: `DELETE /api/cart`

## License

This project is licensed under the MIT License.

# Frontend README (React + Vite)

This is the frontend for the project, built using React and Vite. It provides a user interface for interacting with the backend API.

## Requirements

- Node.js 14+

## Go to Frontend Directory

1. **Go to Backend**:

   ```sh
   cd frontend
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Run the development server**:

   ```sh
   npm run dev
   ```

4. **Build for production**:

   ```sh
   npm run build
   ```

5. **Preview the production build**:
   ```sh
   npm run serve
   ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run serve`: Serves the production build.

## License

This project is licensed under the MIT License.
