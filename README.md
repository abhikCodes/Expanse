
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

### **Frontend (Next.js + TailwindCSS)**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at:
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
