# Selenium Testing Guide

## Setup

1. **Install Python dependencies:**
```bash
cd tests
bash setup.sh
source venv/bin/activate
```

2. **Start the application:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

3. **Create test user (first time only):**
- Go to http://localhost:5173
- Register with email: `test@test.com`, password: `Test123!`

## Run Tests

```bash
cd tests
source venv/bin/activate
pytest test_amazon_replica.py -v
```

## Run specific test:
```bash
source venv/bin/activate
pytest test_amazon_replica.py::TestAmazonReplica::test_login_user -v
```

## Test Coverage

- ✅ Google Login Button
- ✅ Admin Login
- ✅ Browse Products
- ✅ Add to Cart
- ✅ View Cart
- ✅ Filter by Category

## Notes

- Tests use Chrome browser
- Make sure both servers are running
- Uses admin credentials: `admin@lec.com` / `admin@1234`
