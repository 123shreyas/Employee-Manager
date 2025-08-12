
# Employee Management System

A full-stack **Employee Management System** with **role-based authentication** built using:

- **Frontend:** React, Bootstrap, Axios  
- **Backend:** Node.js, Express.js, JWT, Firebase Firestore  

## 📂 Project Structure

```

project-root/
│
├── frontend/       # React application
│
└── backend/        # Node.js + Express.js server

````

---

## 🚀 Features

- **Role-based authentication** (Admin / Employee)
- **Admin Panel** to manage employees
- **Employee Dashboard** to view assigned tasks & profile
- **JWT-based secure authentication**
- **Protected Routes** for authorized access
- **Firestore Database** for storage

---

## 🖥 Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend


2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:

   ```sh
   npm start
   ```
4. Build production version:

   ```sh
   npm run build
   ```

## ⚙ Backend Setup

1. Navigate to the backend folder:

   ```sh
   cd backend
   ```
2. Install dependencies:

   ```sh
   npm install
   ```
3. Start the backend server:

   ```sh
   node index.js
   ```

---

## 🛠 Create Default Admin User

To create a default admin with:

* Email: **[admin@company.com](mailto:admin@company.com)**
* Password: **Admin\@123**

Run:

```sh
npm run create-admin
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with:

```
PORT=5000
JWT_SECRET=your_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

⚠ **Do not commit `.env` to version control.**

---

## 📌 API Endpoints

| Method | Endpoint         | Description                        | Auth Required |
| ------ | ---------------- | ---------------------------------- | ------------- |
| POST   | `/auth/register` | Register new user                  | ❌ No          |
| POST   | `/auth/login`    | Login and receive JWT token        | ❌ No          |
| GET    | `/users`         | Get list of all users (Admin only) | ✅ Yes         |
| GET    | `/users/:id`     | Get single user details            | ✅ Yes         |
| PUT    | `/users/:id`     | Update user details                | ✅ Yes         |
| DELETE | `/users/:id`     | Delete user                        | ✅ Yes         |

---

## 📌 Additional Notes

* Ensure **Firebase Firestore** is set up before running.
* Passwords are **hashed** before being stored.
* `ProtectedRoute` ensures only users with correct roles can access pages.
* Update backend CORS settings if frontend requests are blocked.

```

---

If you want, I can also **write the `package.json` script for `npm run create-admin`** so that it automatically inserts `admin@company.com` with password `Admin@123` into Firestore. That way the command will be ready to use immediately.
```
