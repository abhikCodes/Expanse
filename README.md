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

### **Kubernetes Deployment (Optional)**

1. Navigate to the root directory:
   ```bash
   minikube start
   ```

2. Run the below command:
   ```bash
   kubectl apply -f kubernetes/config/ -f kubernetes/deployments/ -f kubernetes/hpa/ -f kubernetes/services/
   ```

3. Check the status of the pods:
   ```bash
   kubectl get pods -o wide
   ```

5. Once the pods are running, access the app via:
   ```
   http://localhost:3000
   ```

---

### **Test Kubernetes HPA  (Optional)**

1. Navigate to the root directory:
   ```bash
   minikube start
   ```

2. Run the below command:
   ```bash
   kubectl apply -f kubernetes/config/ -f kubernetes/deployments/ -f kubernetes/hpa/ -f kubernetes/services/
   ```

3. Check the status of the pods:
   ```bash
   kubectl get pods -o wide
   ```

4. Once the pods are running, port forward each service:
   ```bash
   kubectl port-forward service/courses-topics 8080:8080
   kubectl port-forward service/discussion-forum 8081:8081
   kubectl port-forward service/quiz-service 8082:8082
   ```

5. Install metrics-server
   ```bash
   kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
   ```

6. Verify if metrics server is running
   ```bash
   kubectl get pods -n kube-system
   ```

7. Edit the metrics server deployment yaml
   ```bash
   kubectl get deployment metrics-server -n kube-system -o yaml > metrics-server.yaml
   ```

8. Open it up on VSCode
   ```bash
   code metrics-server.yaml
   ```
   
9. Apply the new metrics server configurations
   ```bash
   kubectl apply -f metrics-server.yaml
   ```

10. Run the below command to check CPU utilization
   ```bash
   kubectl get hpa -w
   ```

11. Run the Apache Benchmark to simulate load
   ```bash
   ab -n 10000 -c 100 http://localhost:8082/get-score
   ```


---

## 📑 **Project Report**

The full project report is available in the root folder:  
**[Project Report](./survey_corps_expanse_online_learning_platform_report.pdf)**

---

## 🎥 **Project Demo Video**

Watch the video showcasing the project here:  
**[Project Demo Video](https://youtu.be/yLhtQ48VjLc)**

---
