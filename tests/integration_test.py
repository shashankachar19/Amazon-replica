import requests
import pytest
import time

class TestIntegration:
    
    def test_full_user_flow(self):
        """Test complete user journey from login to cart"""
        # Step 1: Login
        login_data = {"email": "admin@lec.com", "password": "admin@1234"}
        login_response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 2: Get products
        products_response = requests.get("http://localhost:5000/api/products")
        assert products_response.status_code == 200
        products = products_response.json()
        assert len(products) > 0
        
        # Step 3: Access cart
        cart_response = requests.get("http://localhost:5000/api/cart", headers=headers)
        assert cart_response.status_code in [200, 404]
        
        print("✓ Complete user flow works")
    
    def test_frontend_backend_integration(self):
        """Test frontend and backend communication"""
        # Test frontend can reach backend
        frontend_response = requests.get("http://localhost:5173")
        backend_response = requests.get("http://localhost:5000/api/products")
        
        assert frontend_response.status_code == 200
        assert backend_response.status_code == 200
        print("✓ Frontend-Backend integration works")
    
    def test_database_connectivity(self):
        """Test database operations through API"""
        # Test data retrieval
        response = requests.get("http://localhost:5000/api/products")
        assert response.status_code == 200
        data = response.json()
        
        # Verify data structure
        assert isinstance(data, list)
        if len(data) > 0:
            assert "id" in data[0]
            assert "name" in data[0]
            assert "price" in data[0]
        
        print("✓ Database connectivity verified")
    
    def test_session_management(self):
        """Test user session handling"""
        # Login and get token
        login_data = {"email": "admin@lec.com", "password": "admin@1234"}
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        assert response.status_code == 200
        
        token = response.json()["token"]
        assert token is not None
        assert len(token) > 20  # JWT tokens are long
        
        print("✓ Session management works")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])