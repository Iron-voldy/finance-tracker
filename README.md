## **📌 Personal Finance Tracker API**
A **secure RESTful API** built using **Node.js, Express, and MongoDB** to manage personal finances, track expenses, set budgets, and generate financial reports.

---

## **🚀 Features**
✅ **User Authentication (JWT-based)**  
✅ **Role-Based Access (Admin & User)**  
✅ **Expense & Income Tracking**  
✅ **Tagging Transactions for Better Analysis**  
✅ **Recurring Transactions (Daily, Weekly, Monthly, Yearly)**  
✅ **Budget Management with Notifications**  
✅ **Financial Reports & Spending Trends**  
✅ **Multi-Currency Support with Exchange Rate Conversion**  
✅ **Personalized User Dashboard**  
✅ **Export Data as CSV & Excel**  
✅ **Unit Testing with Jest & Supertest**  

---

## **📂 Project Structure**
```
personal-finance-tracker/
│── node_modules/              # Installed dependencies
│── src/                      
│   ├── config/                # Configuration files (Database, Env setup)
│   │   ├── db.js              
│   ├── controllers/           # Handles business logic
│   │   ├── authController.js   
│   │   ├── userController.js   
│   │   ├── transactionController.js  
│   │   ├── categoryController.js    
│   │   ├── budgetController.js    
│   │   ├── reportController.js    
│   │   ├── notificationController.js   
│   │   ├── dashboardController.js    
│   ├── middlewares/            # Auth, Error Handling Middleware
│   │   ├── authMiddleware.js    
│   │   ├── errorHandler.js      
│   ├── models/                 # MongoDB Models
│   │   ├── userModel.js        
│   │   ├── transactionModel.js  
│   │   ├── categoryModel.js     
│   │   ├── budgetModel.js       
│   │   ├── reportModel.js       
│   ├── routes/                  # API Routes
│   │   ├── authRoutes.js        
│   │   ├── userRoutes.js        
│   │   ├── transactionRoutes.js  
│   │   ├── categoryRoutes.js     
│   │   ├── budgetRoutes.js       
│   │   ├── reportRoutes.js       
│   │   ├── notificationRoutes.js  
│   │   ├── dashboardRoutes.js    
│   ├── services/                 # Business logic & helper functions
│   │   ├── notificationService.js 
│   │   ├── transactionService.js  
│   │   ├── currencyService.js     
│   ├── utils/                     # Utility functions (Validation, Logging)
│   │   ├── validation.js          
│   │   ├── logger.js              
│   ├── app.js                     # Main Express App
│   ├── server.js                   # Server Entry Point
│── tests/                          # Unit Tests (Jest & Supertest)
│   ├── auth.test.js                 
│   ├── transaction.test.js          
│   ├── budget.test.js              
│   ├── report.test.js              
│   ├── setupTestDB.js              
│── .env                            # Environment Variables
│── .gitignore                      # Ignore node_modules & sensitive files
│── package.json                    # Dependencies
│── README.md                       # Project Documentation
│── postman_collection.json         # Postman API Collection
```

---

## **🛠️ Setup Instructions**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
📜 **Create a `.env` file** and add:
```
MONGO_URI=mongodb+srv://admin:password@your-cluster.mongodb.net/personal-finance
JWT_SECRET=your_jwt_secret
PORT=5000
```

### **4️⃣ Start the Server**
```sh
npm start
```
✅ **Server running at:** `http://localhost:5000`

### **5️⃣ Run Tests**
```sh
npm test
```
✅ Runs **Unit Tests (Jest & Supertest)**.

---

## **📡 API Documentation**
| **Feature** | **Endpoint** | **Method** | **Auth Required** |
|------------|-------------|------------|------------------|
| **User Registration** | `/api/auth/register` | `POST` | ❌ No |
| **User Login** | `/api/auth/login` | `POST` | ❌ No |
| **Get User Profile** | `/api/users/me` | `GET` | ✅ Yes |
| **Create Transaction** | `/api/transactions` | `POST` | ✅ Yes |
| **Get All Transactions** | `/api/transactions` | `GET` | ✅ Yes |
| **Update Transaction** | `/api/transactions/:id` | `PUT` | ✅ Yes |
| **Delete Transaction** | `/api/transactions/:id` | `DELETE` | ✅ Yes |
| **Create Budget** | `/api/budgets` | `POST` | ✅ Yes |
| **Get Reports** | `/api/reports/monthly-spending` | `GET` | ✅ Yes |
| **Export Transactions as CSV** | `/api/export/csv` | `GET` | ✅ Yes |
| **Export Transactions as Excel** | `/api/export/excel` | `GET` | ✅ Yes |
| **Admin Dashboard** | `/api/dashboard/admin` | `GET` | ✅ Admin Only |

🔹 **Full API documentation available in**: [`postman_collection.json`](./postman_collection.json)  

---

## **🔐 Role-Based Access**
| **Role** | **Permissions** |
|---------|---------------|
| **Admin** | Can manage users, transactions, reports, budgets |
| **User** | Can manage personal transactions, budgets, reports |

🔹 **To create an admin:** Update MongoDB:
```sh
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## **🔍 Testing with Postman**
1. **Import `postman_collection.json` into Postman**
2. **Run the API requests**
3. **Use JWT Token for secured endpoints**

---

## **🚀 Deployment**
### **Deploy to Clever Cloud**
1. Push to GitHub
2. Create a Clever Cloud App (Node.js)
3. Configure **MongoDB URI** in Environment Variables
4. Deploy & get live API URL

✅ **Your API is now hosted live!** 🎉

---

## **🛠️ Contribution Guide**
### **1️⃣ Fork the Repository**
Click on **Fork** in GitHub to create your copy.

### **2️⃣ Create a New Branch**
```sh
git checkout -b feature-new-feature
```

### **3️⃣ Make Changes & Commit**
```sh
git add .
git commit -m "Added new feature"
```

### **4️⃣ Push & Create a Pull Request**
```sh
git push origin feature-new-feature
```
Submit a **Pull Request (PR)** on GitHub.

---

## **📌 Final Summary**
✅ **Complete Personal Finance Tracker API**  
✅ **All features implemented**  
✅ **Secure Authentication (JWT) & Role-Based Access**  
✅ **Full API Documentation & Testing**  
✅ **Ready for Deployment!**
