# 🛡️ ACME User Portal

This is a full-stack user management application with:

- **Frontend:** React
- **Backend:** Node.js, Express, SQLite
- **Authentication:** Secure login with JWT stored in HttpOnly cookies 
- **Authorization:** Role Based Access Controls
- **Reverse Proxy:** NGINX or Spring Cloud Gateway for BFF pattern (Pending implementation)

---

## 🚀 Setup Instructions

### 🧱 Prerequisites

- Node.js and npm    (Download from `https://nodejs.org/`)
- nginx (optional)

### Backend Setup

```bash
cd user-auth-backend
npm install
node db.js       # Initializes the SQLite database
node server.js   # Starts the backend server on port 3001
```

### Frontend Setup

```bash
# Open a different terminal window as backend is not setup as a background job yet
cd user-auth-frontend
npm install
npm run build         # Builds the React app for production
npm start             # Or use the Nginx config below to start Ngix server
```

---

## 🌐 NGINX (Optional)

**Minimal config:**

```nginx
server {
  listen 80;
  server_name localhost;

  location / {
    root /path/to/user-auth-frontend/build;
    index index.html;
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;

    # Forward cookies and headers
    proxy_set_header Host $host;
    proxy_set_header Cookie $http_cookie;
    proxy_pass_request_headers on;

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;

    proxy_cache_bypass $http_upgrade;
  }
}
```
- Start Nginx (`brew services stop nginx` for mac) and the app will be running on Nginx port (80 from above config)
- optionally you can remove setupProxy.js from user-auth-frontend > src > setupProxy.js (Nginx can handle the API routing)
---

## 🖥️ Using the UI

1. Visit `http://localhost:3000` (if using Nginx `http://localhost`)
2. If not logged in:
   - You’ll see options to **Login** or **Register**
3. Once logged in:
   - **Admins** can: (Sample user: kv1@gmail.com/testuser1)
     - View all users
     - Search users by email
     - Deactivate other users
     - Activate other users
   - **Audit users** can: (Sample user: kv2@gmail.com/testuser2)
     - Search users by email
   - **Regular users** can: (Sample user: kv3@gmail.com/testuser3)
     - Only view their own info via search

---

## Sample DB scripts
```bash
cd user-auth-backend  
sqlite3 users.db        # Connects to DB
SELECT * FROM USERS;    # To list all the users in the system
# To update role of a particular user
UPDATE USERS SET ROLE='admin' WHERE EMAIL='ka@ga.co'; 
# To delete a user record
DELETE FROM USERS WHERE EMAIL='ka@gm.com';
# To insert a user record, requires encrypted password to insert
INSERT INTO USERS (name, email, dob, job_title) VALUES ('kv3', 'kv3@gmail.com', '01/01/1970', 'Employee');
```

---

## Object Modelling
We have currently create two objects

- user
  - id INTEGER PRIMARY KEY 
  - name TEXT NOT NULL
  - email MAIL UNIQUE NOT NULL
  - password TEXT NOT NULL
  - role TEXT NOT NULL DEFAULT 'user'
  - dob TEXT NOT NULL
  - job_title TEXT
  - is_active INTEGER DEFAULT 1
- role

many to one mapping from user to role
---

## 📦 API Endpoints

### `POST /api/register`

Registers a new user.

**Request body:**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "dob": "01/01/1970",
  "job_title": "Engineer"
}
```

---

### `POST /api/login`

Authenticates user and sets JWT in an HttpOnly cookie.

**Request body:**

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

---

### `GET /api/users/me`

Returns the logged-in user's profile.

---

### `GET /api/users?email={query}&page=1&limit=5`

Searches for users. Partial email matches are supported.

- Only **admins** and **audit users** can perform search.
- Only **admins** can get the full list when no email is supplied.

**Response:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "dob": "01/01/1970",
      "job_title": "Engineer",
      "role": "admin"
    }
  ],
  "total": 1
}
```

---

### `PUT /api/users/activate`

Admin-only endpoint to mark a user as active.

**Request body:**

```json
{
  "email": "target@example.com"
}
```

---

### `PUT /api/users/deactivate`

Admin-only endpoint to mark a user as inactive.

**Request body:**

```json
{
  "email": "target@example.com"
}
```

**Note:** Admins **cannot deactivate themselves**.

---

## 🔐 Role-Based Access

| Role  | Search | List All | Deactivate |
|-------|--------|----------|------------|
| admin | ✅     | ✅       | ✅         |
| audit | ✅     | ❌       | ❌         |
| user  | self   | ❌       | ❌        |

---

## 🍪 Auth & Security

- JWT is stored in an **HttpOnly cookie**
- **BFF pattern** with Nginx ensures secure separation of concerns and prevents CORS issues
- Routes protected by middleware:
  - `authenticateToken`
  - `authorizeAdmin`
  - `authorizeAudit`
- Frontend doesn't access JWT directly

---

## 📂 Project Structure

```
project-root/
├── user-auth-backend/
│   ├── keys
│   │   ├── private.pem
│   │   ├── public.pem
│   ├── server.js
│   ├── db.js
│   ├── users.db
│   ├── migrate.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── index.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js
│
└── user-auth-frontend/
    └── src/
        ├── App.js
        ├── index.js
        ├── context/
        │   └── AuthContext.js
        └── components/
            ├── Home.js
            ├── Login.js
            ├── Logout.js
            ├── Register.js
            ├── UserList.js
            └── UserSearch.js
```

---

## 🛠 To-Do & Enhancements

- [x] Admin-only deactivation
- [x] JWT RS256
- [x] Role-based views
- [x] Pagination
- [ ] TLS setup and tuning cookie settings
- [ ] Session cookie translation to JWT token at the gateway (or) DPoP JWT flow
- [ ] Password rules like complexity, history, non dictionary words
- [ ] Bot protection from registration page using Google Captcha
- [ ] Audit logging
- [ ] Random generation of ids to avoid enumaration attacks

---

## 🧑‍💻 Author

Built with 💻, ☕, and ❤️ by [Karthick Vankayala].

---

## 📃 License

MIT License
