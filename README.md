---

# 📚 **Expanse - Distributed Online Learning Platform**

## 👥 **Team Name:**
**Survey Corps**

---

## 📝 **Project Summary**

**Expanse** is an online learning platform designed to make education accessible, interactive, and personalized. It offers:

- Course management for students and educators.
- Collaborative learning through discussion forums.
- Real-time quizzes with automated assessments.
- Secure user authentication and role-based access control.
- Efficient file storage and retrieval.
- Real-time analytics for performance tracking.

Built with a **scalable microservices architecture**, Expanse ensures seamless interactions, reliable communication, and consistent user experience across services.

---

## ⚙️ **How to Compile and Run the Project**

### **Prerequisites:**

- **Node.js** (v14+)
- **Python** (v3.8+)
- **Docker** & **Docker Compose**
- **PostgreSQL** & **MongoDB**

### **Backend (FastAPI + gRPC)**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### **Frontend and Authentication Service (Next.js + TailwindCSS + GoogleAuth + NextAuth + Prisma ORM)**

1. Navigate to the frontend and Authentication service directory:
   ```bash
   cd frontend-with-auth
   ```
2. Create a .env file by referencing from .env.example.
   - For Google Client ID and Secret head over to this URL
     ```bash
     https://console.cloud.google.com/apis/credentials
     ```
     Setup OAuth consent screen and Create OAuth client ID.
     Once done you will get Google Client ID and Secret.
     <br>
3. Install frontend and Authentication Service dependencies:
   ```bash
   npm install
   npm install -g prisma
   ```
4. Setup Prisma for Authentication Service and userDB setup
   ```bash
   npx prisma generate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Access the application at:
   ```
   http://localhost:3000
   ```

### **Docker Deployment (Optional)**

1. Navigate to the root directory:
   ```bash
   docker-compose up --build
   ```
2. Access the app via:
   ```
   http://localhost:3000
   ```

---

## 📑 **Project Report**

The full project report is available in the root folder:  
**[Project Report](./report.pdf)**

---

## 🎥 **Project Demo Video**

Watch the video showcasing the project here:  
**[Project Demo Video](https://link-to-demo-video.com)**

---
