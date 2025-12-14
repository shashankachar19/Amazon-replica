import requests
import time



def test_login():
    """Test login page loads"""
    response = requests.get("http://localhost:5173/login")
    assert response.status_code == 200
    print("✓ Login page loads")

def test_admin_login():
    """Test admin login API"""
    login_data = {
        "email": "admin@lec.com",
        "password": "admin@1234"
    }
    response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
    assert response.status_code == 200
    print("✓ Admin login works")

def test_products_api():
    """Test products API"""
    response = requests.get("http://localhost:5000/api/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    print(f"✓ Products API returns {len(data)} products")

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])