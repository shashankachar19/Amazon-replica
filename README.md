# 🛒 Amazon Replica - Full Stack E-commerce Application

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org/)
[![Tests](https://img.shields.io/badge/Tests-50+-brightgreen.svg)](#testing)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A comprehensive Amazon-like e-commerce application built for **software testing demonstration** and educational purposes. Features complete user authentication, product catalog, shopping cart functionality, and extensive automated testing suite.

## 🌟 Features

- **🔐 Authentication**: Google OAuth + Admin login system
- **📦 Product Catalog**: 40+ products across 5 categories
- **🛍️ Shopping Cart**: Add, remove, update quantities
- **🎨 Modern UI**: Amazon-inspired dark theme design
- **🔒 Security**: JWT tokens, input validation, protected routes
- **🧪 Comprehensive Testing**: 11 testing techniques, 50+ test cases
- **🌐 Cross-Platform**: Works on Windows, Mac, Linux

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [Python](https://python.org/) (v3.8+)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/amazon-replica.git
cd amazon-replica
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run data:import
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

4. **Testing Setup**
```bash
cd tests
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate.bat  # Windows
pip install -r requirements.txt
```

### 🎯 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: `admin@lec.com` / `admin@1234`

## 🧪 Testing Suite

This project demonstrates **professional software testing** with 11 different testing techniques:

### Run All Tests
```bash
cd tests
source venv/bin/activate
python run_all_tests.py
```

### Testing Techniques Covered

| Technique | Description | Tests |
|-----------|-------------|-------|
| **Equivalence Class** | Input partitioning | 3 tests |
| **Boundary Value** | Edge case testing | 5 tests |
| **Decision Table** | Logic combinations | 6 tests |
| **State Transition** | System state changes | 2 tests |
| **Pairwise** | Parameter combinations | 2 tests |
| **Mutation** | Input variations | 3 tests |
| **Integration** | Component interaction | 4 tests |
| **Error Handling** | Exception scenarios | 6 tests |
| **Database** | Data operations | 6 tests |
| **API** | Endpoint validation | 7 tests |
| **Performance** | Response time testing | 3 tests |

**Total: 50+ comprehensive test cases**

### Individual Test Execution
```bash
pytest equivalence_class_test.py -v    # Equivalence Class Testing
pytest boundary_value_test.py -v       # Boundary Value Testing
pytest decision_table_test.py -v       # Decision Table Testing
pytest integration_test.py -v          # Integration Testing
```

## 📁 Project Structure

```
amazon-replica/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database & auth config
│   ├── models/             # Data models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── context/        # State management
│   └── package.json
├── tests/                  # Comprehensive test suite
│   ├── equivalence_class_test.py
│   ├── boundary_value_test.py
│   ├── decision_table_test.py
│   └── ... (11 test files)
└── README.md
```

## 🔧 Configuration

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and configure:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`

## 🎨 Screenshots

### Login Page
![Login](https://via.placeholder.com/800x400?text=Login+Page)

### Product Catalog
![Products](https://via.placeholder.com/800x400?text=Product+Catalog)

### Shopping Cart
![Cart](https://via.placeholder.com/800x400?text=Shopping+Cart)

## 🔍 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/google         # Google OAuth
POST /api/auth/logout         # User logout
```

### Product Endpoints
```
GET  /api/products            # Get all products
GET  /api/products/:id        # Get product by ID
```

### Cart Endpoints
```
GET    /api/cart              # Get user cart
POST   /api/cart/add          # Add item to cart
PUT    /api/cart/update       # Update item quantity
DELETE /api/cart/remove/:id   # Remove item from cart
```

## 🧪 Testing for Educators

This project is perfect for demonstrating:

- **Black Box Testing**: Equivalence classes, boundary values, decision tables
- **White Box Testing**: State transitions, mutation testing
- **Integration Testing**: API and database integration
- **System Testing**: End-to-end functionality
- **Performance Testing**: Response time validation
- **Security Testing**: Authentication and authorization

### Test Report Generation
```bash
cd tests
python run_all_tests.py > test_report.txt
```

## 🚀 Deployment

### Local Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend  
cd client && npm run dev

# Run tests
cd tests && python run_all_tests.py
```

### Production Build
```bash
cd client
npm run build

cd ../backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Educational Use

This project is designed for:
- Software Engineering courses
- Software Testing demonstrations
- Full-stack development learning
- API development tutorials
- Authentication system examples

## 📞 Support

If you have any questions or issues:
- Create an [Issue](https://github.com/yourusername/amazon-replica/issues)
- Check the [Documentation](docs/)
- Review the [Test Reports](tests/)

## 🏆 Acknowledgments

- Built for educational and testing demonstration purposes
- Inspired by Amazon's e-commerce platform
- Uses modern web development best practices
- Comprehensive testing methodology implementation

---

**⭐ Star this repository if it helped you learn software testing!**