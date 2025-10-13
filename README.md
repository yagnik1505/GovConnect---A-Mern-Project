

# GovConnect — Civic Portal (MERN)

GovConnect is a comprehensive MERN stack web application that bridges the gap between citizens and government services. It allows users to:
- Report local crises with details and images
- Browse and apply for government schemes and scholarships
- Track application status
- Admins can manage users, crises, schemes, and applications via a secure dashboard

The platform uses JWT authentication and role-based access control for security and privacy.

---

## Project Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/yagnik1505/GovConnect---A-Mern-Project.git
cd civic-portal
```

### 2. Install dependencies
#### Backend (Express API)
```sh
cd backend
npm install
```
#### Frontend (React app)
```sh
cd ../frontend
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in both `backend/` and `frontend/` folders.
- Fill in the required values (see `.env.example` for variable names; do not commit real secrets).

### 4. Database Setup
- To restore the database, run:
	```sh
	mongorestore --db civic_portal ./db-backup/civic_portal
	```
- This will populate users, crises, schemes, and other collections.

### 5. How to Run the Project
- Start backend:
	```sh
	cd backend
	npm run dev
	```
- Start frontend (in a new terminal):
	```sh
	cd frontend
	npm run dev
	```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---


## <span style="color:#1976d2; font-weight:bold">Admin Information</span>

**<span style="color:#1976d2">Admin</span>**: **yagnik@gmail.com**  
**<span style="color:#1976d2">Password</span>**: **yagnik1505**

---


## Notes
- Make sure MongoDB is running locally or update `MONGO_URI` for Atlas/cloud.
- Do not include `node_modules/`, `dist/`, `build/`, or real `.env` files in your ZIP.
- Only include `.env.example` files with placeholder values.
- For more details, see code comments and folder structure.

---


## Folder Structure
```
my-project/
├─ backend/         # Express + MongoDB API
│   ├─ src/
│   ├─ package.json
│   ├─ .env.example
├─ frontend/        # React app
│   ├─ src/
│   ├─ package.json
│   ├─ .env.example
├─ db-backup/       # Database dump or seed data
├─ README.md        # Setup instructions
└─ .gitignore
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup Instructions

#### 1. Clone the repository
```sh
git clone https://github.com/yagnik1505/GovConnect---A-Mern-Project.git
cd civic-portal
```

#### 2. Install dependencies
##### For the server:
```sh
cd server
npm install
```
##### For the client:
```sh
cd ../client
npm install
```

#### 3. Configure Environment Variables
- Create a `.env` file in `server/` with your MongoDB URI and any required secrets.

#### 4. Run the Application
##### Start the server:
```sh
cd server
npm start
```
##### Start the client (in a new terminal):
```sh
cd client
npm run dev
```
- The client will run on `http://localhost:5173` (default Vite port)
- The server will run on `http://localhost:5000` (or as configured)

## Technologies Used
- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Other:** Multer (file uploads), Axios (API calls)

## Contributing
Contributions are welcome! Please fork the repo and submit a pull request.



## Admin Information :-

Email :- yagnik@gmil.com
Password :- yagnik1505
