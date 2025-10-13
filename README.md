
# GovConnect — Civic Portal (MERN)


GovConnect is a comprehensive web platform built with the MERN stack (MongoDB, Express.js, React, Node.js) designed to bridge the gap between citizens and government services. The portal empowers users to:

- **Report local crises:** Citizens can quickly report emergencies or issues (such as natural disasters, infrastructure failures, or public safety concerns) with detailed descriptions and image uploads, ensuring authorities are promptly informed.
- **Access and apply for government schemes:** Users can browse, filter, and apply for a variety of government welfare schemes and scholarships, streamlining the application process and increasing transparency.
- **Track application status:** Applicants can monitor the progress of their submissions for schemes and scholarships in real time.
- **Admin management:** Government officials and administrators have access to a secure dashboard to review crisis reports, manage scheme and scholarship applications, and oversee user activity.
- **Secure authentication:** The platform uses JWT-based authentication and role-based access control to ensure data privacy and secure access for both citizens and administrators.

GovConnect aims to modernize civic engagement, making it easier for citizens to interact with government programs and for officials to respond efficiently to community needs.

---

## Backend & Frontend Installation

### 1. Clone the repository
```sh
git clone https://github.com/yagnik1505/GovConnect---A-Mern-Project.git
cd civic-portal
```

### 2. Install dependencies
#### Backend (server):
```sh
cd server
npm install
```
#### Frontend (client):
```sh
cd ../client
npm install
```

---

## Environment Variables Setup

1. Copy the following as `server/.env` (see example below):
	```env
	PORT=5000
	MONGO_URI=mongodb://127.0.0.1:27017/civic_portal
	JWT_SECRET=change_this_secret_key
	```
2. Edit values as needed for your environment.

---

## Database Setup

To restore the sample database (using MongoDB tools):

```sh
mongorestore --db civic_portal ./db-backup/civic_portal
```

This will populate users, crises, schemes, and other collections.

---

## How to Run the Project

### Start Backend
```sh
cd server
npm run dev
```

### Start Frontend (in a new terminal)
```sh
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## Admin Credentials (Demo)

- Email: yagnik@gmail.com
- Password: yagnik1505

---

## Notes
- Make sure MongoDB is running locally or update `MONGO_URI` for Atlas/cloud.
- For more details, see code comments and folder structure.

---

## Folder Structure
```
civic-portal/
├── client/           # React frontend
│   ├── src/
│   │   ├── api/      # API calls
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/    # Page components (Dashboard, Login, etc.)
│   │   └── utils/    # Utility functions
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/           # Node.js/Express backend
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── middleware/ # Auth and other middleware
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # Express routes
│   │   └── uploads/  # Uploaded files
│   └── package.json
├── hashPassword.js   # Utility script
├── package.json      # Root package.json (if any)
└── README.md         # Project documentation
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
