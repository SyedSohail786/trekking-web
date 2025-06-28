# Aranya Vihaara - Trekking Web App 🌿⛰️

Aranya Vihaara is a MERN stack-based trekking web application where users can explore treks, check availability, book slots, write blogs, and interact with the admin. Admins can manage treks, availability, and view user interactions.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Zustand
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT, Cookies

---

## 📁 Folder Structure

aranyavihaara/



├── client/ # React Frontend

└── server/ # Node.js Backend


---

## ⚙️ Environment Variables

### 🖥️ Server `.env`

Create a `.env` file in the `server/` directory:

```env
PORT=8000
MONGO_URI = mongodb://localhost:27017/aranyavihaara 
JWT_SECRET= // user key
BACKEND_URL= http://localhost:8000
```

### 🌐 Client .env
Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:8000
```

### 📦 Installation

1. Clone the Repository
```
git clone https://github.com/your-username/aranyavihaara.git
cd aranyavihaara
```

2. Setup Backend
```
cd server
npm install
npm run dev
```

3. Setup Frontend
```
cd client
npm install
npm run dev
```

### 🔐 Authentication
Admin & User login handled with JWT tokens.

Tokens are stored in cookies for secure access and session management.

## ✨ Features
### 👤 User
Browse popular treks

Check slot availability

Book treks (requires login)

Write blogs and read others'

Contact admin

### 🛠️ Admin
Login secured with token

Add/manage treks and availability

View user messages (Inbox)

Manage visitor bookings and blogs

### 🧪 To Test
Register/login via /auth

Admin login via /admin

Test slot booking and trek creation

Write/view blogs

### 📝 License
This project is for educational purposes only.

### 💡 Credits
Built with ❤️ by Syed Sohail
