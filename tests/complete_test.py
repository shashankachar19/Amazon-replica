import requests
import pytest
import time

class TestAmazonReplica:
    
    def test_frontend_loads(self):
        """Test that frontend application loads"""
        response = requests.get("http://localhost:5173")
        assert response.status_code == 200
        print("✓ Frontend application loads successfully")
    
    def test_login_page_loads(self):
        """Test that login page loads"""
        response = requests.get("http://localhost:5173/login")
        assert response.status_code == 200
        print("✓ Login page loads successfully")
    
    def test_admin_authentication(self):
        """Test admin login functionality"""
        login_data = {
            "email": "admin@lec.com",
            "password": "admin@1234"
        }
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == "admin@lec.com"
        print("✓ Admin authentication works")
    
    def test_invalid_login(self):
        """Test invalid login credentials"""
        login_data = {
            "email": "wrong@email.com",
            "password": "wrongpass"
        }
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        assert response.status_code == 400
        print("✓ Invalid login properly rejected")
    
    def test_products_api(self):
        """Test products API endpoint"""
        response = requests.get("http://localhost:5000/api/products")
        assert response.status_code == 200
        products = response.json()
        assert len(products) > 0
        assert "name" in products[0]
        assert "price" in products[0]
        print(f"✓ Products API returns {len(products)} products")
    
    def test_cart_functionality(self):
        """Test cart operations"""
        # Login first
        login_data = {"email": "admin@lec.com", "password": "admin@1234"}
        login_response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        token = login_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get cart
        cart_response = requests.get("http://localhost:5000/api/cart", headers=headers)
        assert cart_response.status_code in [200, 404]  # Cart might be empty
        print("✓ Cart API accessible")
    
    def test_google_oauth_endpoint(self):
        """Test Google OAuth endpoint exists"""
        response = requests.get("http://localhost:5000/api/auth/google", allow_redirects=False)
        assert response.status_code in [302, 200]  # Redirect to Google or success
        print("✓ Google OAuth endpoint configured")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])