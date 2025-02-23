# ALT LIFE LAB - Library Management System

## 📌 Project Overview
This project is a **Library Management System** developed for **ALT LIFE LAB TASK**. It allows users to borrow books, track pending returns, and manage library operations efficiently. The project applies **TypeScript** for frontend development, **Node.js & Express.js** for backend, and **PostgreSQL** as the database. **Prisma ORM** is used for database interactions, including both structured queries and raw SQL queries.

---

## 🚀 Tech Stack
### **Frontend**
- **React.js** (with TypeScript)
- **Tailwind CSS** (for UI styling)

### **Backend**
- **Node.js** (Express.js framework)
- **Prisma ORM** (for database operations)
- **JWT Authentication** (for secured access control)
- **bcrypt.js** (for password hashing)

### **Database**
- **PostgreSQL** (hosted on a cloud service)
- **Prisma ORM** (schema management & queries)

---

## 📚 Features Implemented
### **🔹 User Management**
- Member registration & authentication (JWT-based)
- Role-based access control (Admin & Users)
- Secure password hashing using `bcrypt`

### **🔹 Book Borrowing System**
- Users can request book issuance.
- The admin can send a PUT request to accepted a book return from a member or reject borrow requests.
- Track borrowed books and pending returns.
- Display the **Top 10 most borrowed books**.

### **🔹 Data Handling & Queries**
- **Prisma ORM queries** for structured operations.
- **Raw SQL queries using Prisma** for custom queries like:
  - Books that were **never borrowed**.
  - List of **outstanding books** (currently borrowed but not returned).
  - **Top 10 borrowed books** & number of unique members who borrowed them.

### **🔹 Responsive UI**
- Designed with **Tailwind CSS** for responsiveness.
- Works smoothly across **mobile, tablet, and desktop**.

---

## 🛠 Setup & Installation
### **Prerequisites**
Ensure you have the following installed:
- **Node.js** 
- **PostgreSQL**
- **Prisma CLI**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/MUKILAN019/AltLifeLabs.git
cd AltLifeLabs
```


### **4️⃣ Run Database Migrations**
```sh
npx prisma migrate dev --name init
```

### **5️⃣ Start the Backend**
```sh
cd server
npm run dev
```

### **6️⃣ Start the Frontend**
```sh
cd client
npm run dev
```


### **2️⃣ Role-Based Access Control (RBAC)**
- Used `JWT` tokens to differentiate between **admin & normal users**.

### **3️⃣ Prisma Raw Queries vs ORM Queries**
- Used **Prisma ORM** for structured queries.
- Used **Raw SQL Queries** (`$queryRaw`) for complex analytics queries.



