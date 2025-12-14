import requests
import pytest

class TestBoundaryValue:
    """
    Boundary Value Testing - Test at boundaries of input domains
    """
    
    def test_email_length_boundaries(self):
        """Test email length boundaries"""
        base_url = "http://localhost:5000/api/auth/login"
        
        # Boundary values for email length
        # Minimum: 1 character
        min_email = "a@b.c"  # 5 chars (minimum valid)
        
        # Maximum: typical limit around 254 characters
        long_domain = "a" * 240 + ".com"
        max_email = f"test@{long_domain}"
        
        # Just above maximum
        very_long_domain = "a" * 300 + ".com" 
        above_max_email = f"test@{very_long_domain}"
        
        # Test minimum boundary
        data = {"email": min_email, "password": "admin@1234"}
        response = requests.post(base_url, json=data)
        assert response.status_code in [200, 400]  # Valid format, may not exist
        
        # Test maximum boundary
        data = {"email": max_email, "password": "admin@1234"}
        response = requests.post(base_url, json=data)
        assert response.status_code in [200, 400]
        
        # Test above maximum (should fail)
        data = {"email": above_max_email, "password": "admin@1234"}
        response = requests.post(base_url, json=data)
        assert response.status_code == 400
        
        print("✓ Email length boundaries tested")
    
    def test_password_length_boundaries(self):
        """Test password length boundaries"""
        base_url = "http://localhost:5000/api/auth/login"
        
        # Boundary values for password length
        boundaries = [
            ("", 400),           # Empty (0 chars)
            ("a", 400),          # 1 character
            ("ab", 400),         # 2 characters  
            ("abc", 400),        # 3 characters
            ("admin@1234", 200), # Valid password (10 chars)
            ("a" * 50, 400),     # 50 characters
            ("a" * 100, 400),    # 100 characters
        ]
        
        for password, expected_status in boundaries:
            data = {"email": "admin@lec.com", "password": password}
            response = requests.post(base_url, json=data)
            
            if expected_status == 200:
                assert response.status_code == 200
            else:
                assert response.status_code == 400
        
        print("✓ Password length boundaries tested")
    
    def test_product_price_boundaries(self):
        """Test product price boundaries"""
        response = requests.get("http://localhost:5000/api/products")
        products = response.json()
        
        prices = [p.get("price", 0) for p in products]
        min_price = min(prices)
        max_price = max(prices)
        
        # Test boundary conditions
        boundary_tests = [
            ("Minimum price", min_price, min_price >= 0),
            ("Maximum price", max_price, max_price > 0),
            ("Price range", max_price - min_price, max_price > min_price)
        ]
        
        for test_name, value, condition in boundary_tests:
            assert condition, f"{test_name} boundary failed: {value}"
        
        print(f"✓ Price boundaries: Min={min_price}, Max={max_price}")
    
    def test_api_response_time_boundaries(self):
        """Test API response time boundaries"""
        import time
        
        # Boundary: Response should be under 5 seconds
        start_time = time.time()
        response = requests.get("http://localhost:5000/api/products")
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Boundary conditions
        assert response_time < 5.0, f"Response time {response_time}s exceeds 5s boundary"
        assert response_time > 0, "Response time should be positive"
        assert response.status_code == 200
        
        print(f"✓ Response time boundary: {response_time:.3f}s < 5.0s")
    
    def test_product_count_boundaries(self):
        """Test product count boundaries"""
        response = requests.get("http://localhost:5000/api/products")
        products = response.json()
        
        product_count = len(products)
        
        # Boundary conditions for product count
        assert product_count > 0, "Should have at least 1 product"
        assert product_count <= 1000, "Should not exceed 1000 products"
        assert isinstance(product_count, int), "Count should be integer"
        
        print(f"✓ Product count boundary: {product_count} products")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])