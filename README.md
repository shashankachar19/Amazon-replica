# Amazon Replica - Full Stack E-commerce Application

A complete Amazon-like e-commerce application built for software testing purposes. Features user authentication, product catalog, shopping cart, and category browsing.

## 🚀 Features

- **User Authentication**: Login/Register system with secure password hashing
- **Product Catalog**: 5 categories with 5 products each (25 total products)
- **Shopping Cart**: Add, remove, update quantities, view cart total
- **Category Browsing**: Browse products by category
- **Responsive Design**: Amazon-like UI with dark theme
- **Local Storage**: MongoDB for data persistence (no cloud dependencies)

## 📁 Project Structure

```
amazon-replica/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── data/               # Sample product data
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── public/images/      # Product images
│   └── server.js           # Main server file
└── client/                 # React frontend
    ├── src/
    │   ├── components/     # React components
    │   └── App.jsx         # Main app component
    └── package.json
```

## 🛠 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher)
2. **npm** or **yarn** package manager

**Note:** Uses SQLite database - no external database installation required!

## 📦 Installation & Setup

### 1. Navigate to Project

**Linux/Mac:**
```bash
cd /path/to/amazon-replica
```

**Windows:**
```cmd
cd C:\path\to\amazon-replica
```

### 2. Backend Setup

**Linux/Mac:**
```bash
cd backend
npm install
npm run data:import
npm run dev
```

**Windows:**
```cmd
cd backend
npm install
npm run data:import
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

**Linux/Mac:**
```bash
cd client
npm install
npm run dev
```

**Windows:**
```cmd
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Quick Start Scripts

**Linux/Mac:**
```bash
./start.sh  # Setup only
```

**Windows:**
```cmd
start-app.bat  # Starts both servers
```

## 🗄 Database Setup

The application uses **SQLite** - a file-based database that works on all platforms.

**Database File**: `backend/database.sqlite`

### Import Sample Data
```bash
cd backend
npm run data:import
```

This will create:
- 25 products across 5 categories
- Clear any existing data

### Reset Database
```bash
cd backend
npm run data:destroy
```

## 🏪 Product Categories

1. **Electronics** (5 products)
   - AirPods Pro, Smart TV, Keyboard, Headphones, Bluetooth Speaker

2. **Apparel** (5 products)
   - Hiking Socks, Hoodie, Jeans, T-Shirt, Wallet

3. **Home & Kitchen** (5 products)
   - Cookware Set, Blender, Cutting Boards, Towels, Aroma Diffuser

4. **Books** (5 products)
   - The Midnight Library, Atomic Habits, Project Hail Mary, etc.

5. **Sports & Outdoors** (5 products)
   - Camping Chair, Yoga Mat, Headlamp, Water Bottle, Football

## 🧪 Testing Features

Perfect for software testing with these testable features:

### Authentication Testing
- User registration with validation
- Login/logout functionality
- Protected routes
- Session management

### E-commerce Testing
- Product browsing and filtering
- Add to cart functionality
- Cart quantity updates
- Remove items from cart
- Price calculations

### UI/UX Testing
- Responsive design
- Navigation between pages
- Form validations
- Error handling
- Loading states

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item

## 🎯 Usage Instructions

1. **Start the Application**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd client && npm run dev`

2. **Create Account**
   - Go to `http://localhost:5173`
   - Click "Create your ST Store account"
   - Fill in username, email, password

3. **Browse Products**
   - Login to access the main store
   - Click on categories to view products
   - Use "Add to Cart" buttons

4. **Manage Cart**
   - Click "Cart" in header
   - Update quantities or remove items
   - View total price

## 🔍 Testing Scenarios

### Functional Testing
- User registration and login
- Product catalog browsing
- Cart operations (add, update, remove)
- Navigation between pages
- Data persistence

### Security Testing
- Password hashing verification
- Protected route access
- Input validation
- XSS prevention

### Performance Testing
- Page load times
- Database query performance
- Image loading
- API response times

## 🚨 Troubleshooting

### Port Conflicts

**Linux/Mac:**
```bash
lsof -i :5000  # Check port 5000
lsof -i :5173  # Check port 5173
```

**Windows:**
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Common Issues
1. **"Products not loading"** - Run `npm run data:import` in backend
2. **"Cart not working"** - Check if user is logged in
3. **"Images not showing"** - Verify backend server is running
4. **Database locked** - Close all connections and restart server

## 📝 Environment Variables

Backend `.env` file (already configured):
```
PORT=5000
JWT_SECRET=DEV_SUPER_SECRET_AMAZON_REPLICA_KEY_191125
FRONTEND_URL=http://localhost:5173
```

See `.env.example` for all available options.

## 🎨 Styling

The application uses:
- Dark theme similar to Amazon
- Amazon-inspired color scheme (#FFD814 for accents)
- Responsive design
- Inline styles for simplicity

## 📊 Test Data

- **Users**: Create your own through registration
- **Products**: 25 pre-loaded products with images
- **Categories**: 5 main categories
- **Images**: Placeholder images included

## 🔄 Development Workflow

1. Make changes to code
2. Backend auto-restarts with nodemon
3. Frontend hot-reloads with Vite
4. Test changes in browser
5. Use DB Browser for SQLite to view database

## 💾 Cross-Platform Notes

- ✅ **SQLite database** - Works on Windows, Mac, Linux
- ✅ **No external services** - Everything runs locally
- ✅ **Portable** - Zip and run on any OS
- ✅ **Same commands** - npm scripts work everywhere

### Transferring Between OS
1. Zip the entire project folder
2. Extract on target OS
3. Run `npm install` in backend and client
4. Run `npm run data:import` in backend
5. Start servers

**Note:** Delete `node_modules` and `database.sqlite` before zipping to reduce size.

## 📈 Scaling Considerations

For production or larger testing:
- Add product search functionality
- Implement user reviews and ratings
- Add order management
- Include payment processing
- Add admin panel
- Implement caching
- Add comprehensive error logging

---

**Perfect for Software Testing!** This application provides a realistic e-commerce environment with all the complexity needed for comprehensive testing scenarios.