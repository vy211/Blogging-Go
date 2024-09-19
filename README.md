# Blogging Go

A full-stack blogging application built with React for the frontend, Node.js for the backend, and MongoDB for the database.

## Features

- User authentication (signup/login)
- Create, read, update, and delete blog posts
- Comment on posts
- Like and share posts
- Responsive design

## Technologies Used

- **Frontend:** React, Redux, Axios, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS, Bootstrap

## Installation

1. **Clone the repository:**

    ```bash
    https://github.com/vy211/Blogging-Go.git
    cd blogging-go
    ```

2. **Install dependencies for both frontend and backend:**

    ```bash
    # Install backend dependencies
    cd api
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the `api` directory and add the following:

    ```plaintext
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the application:**

    ```bash
    # Run backend server
    cd backend
    npm start

    # Run frontend server
    cd ../frontend
    npm start
    ```

    The backend server will run on `http://localhost:4000` and the frontend server will run on `http://localhost:3000`.

## Usage

1. **Sign up** for a new account or **log in** with an existing account.
2. **Create** new blog posts, **edit** or **delete** your posts.
3. **Comment** on posts and **like** or **share** posts.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

If you have any questions or suggestions, feel free to reach out to me at vy80091@gmail.com.

---

Happy coding! 😊
