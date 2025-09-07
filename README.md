# Civic Portal — MERN Auth Starter (Signup & Login)

This is a minimal, working starter for your government portal project.

## Quick Start

1) **Install Node.js LTS** (if not already).  
2) Create a free **MongoDB Atlas** cluster and copy the connection string.

```bash
# Unzip this project, then open a terminal in the root folder:
cd civic-portal

# Install runner deps (root) and client/server deps
npm install
npm install --prefix client
npm install --prefix server
```

3) **Configure MongoDB**: edit `server/.env`
```
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=change_this_secret_key
```

4) **Run both apps**:
```bash
npm run dev
```
- Client: http://localhost:5173
- Server: http://localhost:5000

Try **Signup** then **Login**. A JWT token will be stored in `localStorage`.

## Folder Structure

- `client/` — React (Vite) app (Login/Signup pages, API helpers)
- `server/` — Express + Mongoose (Auth routes, Mongo connection)
- `server/.env` — secrets (Mongo URI, JWT secret)

## Next Steps
- Switch JWT to HttpOnly cookies for better security.
- Add protected routes and your core features (Problem, Scheme, Admin dashboard).
- Add image upload (e.g., Cloudinary).
```



Admin -: yagnik@gmail.com
Password :- yagnik1505