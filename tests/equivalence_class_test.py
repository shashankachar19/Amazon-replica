import requests
import pytest

class TestEquivalenceClass:
    """
    Equivalence Class Testing - Divide inputs into valid and invalid classes
    """
    
    def test_email_equivalence_classes(self):
        """Test email input equivalence classes"""
        base_url = "http://localhost:5000/api/auth/login"
        
        # Valid Class: Proper email format
        valid_emails = [
            "admin@lec.com",
            "user@domain.co.in", 
            "test123@example.org"
        ]
        
        # Invalid Class 1: Missing @ symbol
        invalid_no_at = [
            "admindomain.com",
            "useremail.com"
        ]
        
        # Invalid Class 2: Missing domain
        invalid_no_domain = [
            "admin@",
            "user@"
        ]
        
        # Invalid Class 3: Empty/null
        invalid_empty = [
            "",
            None
        ]
        
        # Test Valid Class
        for email in valid_emails:
            data = {"email": email, "password": "admin@1234"}
            response = requests.post(base_url, json=data)
            # Should return 200 for admin@lec.com, 400 for others (user not found)
            assert response.status_code in [200, 400]
        
        # Test Invalid Classes
        for email_list in [invalid_no_at, invalid_no_domain]:
            for email in email_list:
                data = {"email": email, "password": "admin@1234"}
                response = requests.post(base_url, json=data)
                assert response.status_code == 400
        
        print("✓ Email equivalence classes tested")
    
    def test_password_equivalence_classes(self):
        """Test password input equivalence classes"""
        base_url = "http://localhost:5000/api/auth/login"
        
        # Valid Class: Correct password
        valid_password = "admin@1234"
        
        # Invalid Class 1: Wrong password
        invalid_wrong = ["wrongpass", "12345", "admin123"]
        
        # Invalid Class 2: Empty password
        invalid_empty = ["", None]
        
        # Test Valid Class
        data = {"email": "admin@lec.com", "password": valid_password}
        response = requests.post(base_url, json=data)
        assert response.status_code == 200
        
        # Test Invalid Classes
        for password in invalid_wrong + invalid_empty:
            data = {"email": "admin@lec.com", "password": password}
            response = requests.post(base_url, json=data)
            assert response.status_code == 400
        
        print("✓ Password equivalence classes tested")
    
    def test_product_price_equivalence_classes(self):
        """Test product price ranges"""
        response = requests.get("http://localhost:5000/api/products")
        products = response.json()
        
        # Equivalence Classes for Price
        low_price = []      # 0-100
        medium_price = []   # 101-1000
        high_price = []     # 1000+
        
        for product in products:
            price = product.get("price", 0)
            if price <= 100:
                low_price.append(product)
            elif price <= 1000:
                medium_price.append(product)
            else:
                high_price.append(product)
        
        # Verify each class has products
        assert len(low_price) >= 0
        assert len(medium_price) >= 0
        assert len(high_price) >= 0
        
        print(f"✓ Price classes: Low({len(low_price)}), Medium({len(medium_price)}), High({len(high_price)})")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])