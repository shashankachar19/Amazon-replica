import requests
import pytest

class TestErrorHandling:
    
    def test_404_endpoints(self):
        """Test non-existent endpoints return 404"""
        response = requests.get("http://localhost:5000/api/nonexistent")
        assert response.status_code == 404
        print("✓ 404 errors handled correctly")
    
    def test_invalid_login_data(self):
        """Test various invalid login scenarios"""
        # Empty credentials
        response = requests.post("http://localhost:5000/api/auth/login", json={})
        assert response.status_code == 400
        
        # Invalid email format
        invalid_data = {"email": "notanemail", "password": "test"}
        response = requests.post("http://localhost:5000/api/auth/login", json=invalid_data)
        assert response.status_code == 400
        
        # Missing password
        missing_pass = {"email": "test@test.com"}
        response = requests.post("http://localhost:5000/api/auth/login", json=missing_pass)
        assert response.status_code == 400
        
        print("✓ Invalid login data handled correctly")
    
    def test_unauthorized_access(self):
        """Test accessing protected routes without token"""
        response = requests.get("http://localhost:5000/api/cart")
        assert response.status_code in [401, 403]
        print("✓ Unauthorized access blocked")
    
    def test_invalid_token(self):
        """Test invalid JWT token handling"""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get("http://localhost:5000/api/cart", headers=headers)
        assert response.status_code in [401, 403]
        print("✓ Invalid tokens rejected")
    
    def test_malformed_requests(self):
        """Test malformed JSON requests"""
        # Send invalid JSON
        headers = {"Content-Type": "application/json"}
        response = requests.post("http://localhost:5000/api/auth/login", 
                               data="invalid json", headers=headers)
        assert response.status_code == 400
        print("✓ Malformed requests handled")
    
    def test_server_error_handling(self):
        """Test server handles errors gracefully"""
        # Try to access with very long invalid data
        long_email = "a" * 1000 + "@test.com"
        data = {"email": long_email, "password": "test"}
        response = requests.post("http://localhost:5000/api/auth/login", json=data)
        assert response.status_code in [400, 500]
        print("✓ Server errors handled gracefully")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])