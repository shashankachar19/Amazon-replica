import requests
import pytest

class TestDatabase:
    
    def test_data_retrieval(self):
        """Test database data retrieval operations"""
        response = requests.get("http://localhost:5000/api/products")
        assert response.status_code == 200
        products = response.json()
        
        # Verify data structure
        assert isinstance(products, list)
        assert len(products) > 0
        
        # Check first product structure
        product = products[0]
        required_fields = ["id", "name", "price", "category"]
        for field in required_fields:
            assert field in product
        
        print(f"✓ Retrieved {len(products)} products from database")
    
    def test_data_consistency(self):
        """Test data consistency across requests"""
        # Make multiple requests
        response1 = requests.get("http://localhost:5000/api/products")
        response2 = requests.get("http://localhost:5000/api/products")
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        products1 = response1.json()
        products2 = response2.json()
        
        # Data should be consistent
        assert len(products1) == len(products2)
        assert products1[0]["id"] == products2[0]["id"]
        
        print("✓ Database data consistency verified")
    
    def test_user_data_operations(self):
        """Test user-related database operations"""
        # Test login (reads user from database)
        login_data = {"email": "admin@lec.com", "password": "admin@1234"}
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        
        assert response.status_code == 200
        user_data = response.json()
        
        # Verify user data structure
        assert "user" in user_data
        assert "email" in user_data["user"]
        assert user_data["user"]["email"] == "admin@lec.com"
        
        print("✓ User database operations work")
    
    def test_product_categories(self):
        """Test product categorization in database"""
        response = requests.get("http://localhost:5000/api/products")
        products = response.json()
        
        # Check categories exist
        categories = set()
        for product in products:
            if "category" in product:
                categories.add(product["category"])
        
        assert len(categories) > 0
        print(f"✓ Found {len(categories)} product categories")
    
    def test_data_validation(self):
        """Test database data validation"""
        response = requests.get("http://localhost:5000/api/products")
        products = response.json()
        
        for product in products:
            # Check required fields exist
            assert "id" in product
            assert "name" in product
            assert "price" in product
            
            # Check data types
            assert isinstance(product["id"], (int, str))
            assert isinstance(product["name"], str)
            assert isinstance(product["price"], (int, float))
            
            # Check price is positive
            assert product["price"] > 0
        
        print("✓ Database data validation passed")
    
    def test_database_performance(self):
        """Test database response performance"""
        import time
        
        start_time = time.time()
        response = requests.get("http://localhost:5000/api/products")
        end_time = time.time()
        
        response_time = end_time - start_time
        
        assert response.status_code == 200
        assert response_time < 2.0  # Should respond within 2 seconds
        
        print(f"✓ Database response time: {response_time:.3f}s")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])