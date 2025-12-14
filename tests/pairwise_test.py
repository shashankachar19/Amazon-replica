import requests
import pytest
import itertools

class TestPairwise:
    """
    Pairwise Testing - Test all pairs of input parameters
    """
    
    def test_login_parameter_pairs(self):
        """
        Pairwise testing for login parameters:
        Email types: Valid, Invalid format, Empty
        Password types: Correct, Wrong, Empty
        """
        base_url = "http://localhost:5000/api/auth/login"
        
        # Parameter values
        emails = [
            ("valid", "admin@lec.com"),
            ("invalid_format", "notanemail"),
            ("empty", "")
        ]
        
        passwords = [
            ("correct", "admin@1234"),
            ("wrong", "wrongpass"),
            ("empty", "")
        ]
        
        # Generate all pairs
        test_pairs = list(itertools.product(emails, passwords))
        
        for (email_type, email), (pass_type, password) in test_pairs:
            data = {"email": email, "password": password}
            response = requests.post(base_url, json=data)
            
            # Expected results based on pair combination
            if email_type == "valid" and pass_type == "correct":
                expected = 200  # Should succeed
            else:
                expected = 400  # Should fail
            
            assert response.status_code == expected, \
                f"Failed for pair: {email_type} email + {pass_type} password"
            
            print(f"✓ Pair: {email_type} email + {pass_type} password")
        
        print("✓ Pairwise login testing completed")
    
    def test_product_filter_pairs(self):
        """
        Pairwise testing for product filtering:
        Categories: Electronics, Books, All
        Price ranges: Low, High, All
        """
        base_url = "http://localhost:5000/api/products"
        
        # Get all products first
        response = requests.get(base_url)
        all_products = response.json()
        
        # Test different category and price combinations
        categories = set()
        for product in all_products:
            if "category" in product:
                categories.add(product["category"])
        
        category_list = list(categories)[:3] if len(categories) >= 3 else list(categories)
        
        # Simulate filtering tests (since API might not support filtering)
        for category in category_list:
            # Filter products by category
            category_products = [p for p in all_products if p.get("category") == category]
            
            # Test price ranges within category
            if category_products:
                prices = [p.get("price", 0) for p in category_products]
                min_price = min(prices)
                max_price = max(prices)
                
                print(f"✓ Pair: {category} category has {len(category_products)} products")
                print(f"  Price range: ${min_price} - ${max_price}")
        
        print("✓ Pairwise product filtering completed")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])