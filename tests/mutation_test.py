import requests
import pytest

class TestMutation:
    """
    Mutation Testing - Test with slightly modified inputs
    """
    
    def test_email_mutations(self):
        """Test email mutations to verify validation"""
        base_url = "http://localhost:5000/api/auth/login"
        base_email = "admin@lec.com"
        
        # Mutation 1: Case sensitivity
        mutations = [
            "Admin@lec.com",      # Capital A
            "admin@LEC.com",      # Capital domain
            "ADMIN@LEC.COM",      # All caps
            "admin@lec.COM"       # Capital extension
        ]
        
        for mutated_email in mutations:
            data = {"email": mutated_email, "password": "admin@1234"}
            response = requests.post(base_url, json=data)
            # Test if system handles case sensitivity properly
            print(f"✓ Mutation: {mutated_email} -> Status: {response.status_code}")
        
        # Mutation 2: Special characters
        special_mutations = [
            "admin+test@lec.com",    # Plus sign
            "admin.test@lec.com",    # Dot in local part
            "admin_test@lec.com"     # Underscore
        ]
        
        for mutated_email in special_mutations:
            data = {"email": mutated_email, "password": "admin@1234"}
            response = requests.post(base_url, json=data)
            print(f"✓ Special char mutation: {mutated_email} -> Status: {response.status_code}")
        
        print("✓ Email mutation testing completed")
    
    def test_password_mutations(self):
        """Test password mutations"""
        base_url = "http://localhost:5000/api/auth/login"
        base_password = "admin@1234"
        
        # Mutation 1: Character substitution
        mutations = [
            "admin@1235",     # Last digit changed
            "admin@1224",     # Middle digit changed
            "admin@2234",     # First digit changed
            "admin#1234",     # @ to #
            "Admin@1234"      # Capital A
        ]
        
        for mutated_password in mutations:
            data = {"email": "admin@lec.com", "password": mutated_password}
            response = requests.post(base_url, json=data)
            # Should fail for wrong passwords
            assert response.status_code == 400, f"Should reject: {mutated_password}"
            print(f"✓ Password mutation rejected: {mutated_password}")
        
        # Mutation 2: Length variations
        length_mutations = [
            "admin@123",      # Shorter
            "admin@12345",    # Longer
            "admin@",         # Much shorter
            "admin@1234567"   # Much longer
        ]
        
        for mutated_password in length_mutations:
            data = {"email": "admin@lec.com", "password": mutated_password}
            response = requests.post(base_url, json=data)
            assert response.status_code == 400, f"Should reject: {mutated_password}"
            print(f"✓ Length mutation rejected: {mutated_password}")
        
        print("✓ Password mutation testing completed")
    
    def test_api_endpoint_mutations(self):
        """Test API endpoint mutations"""
        base_endpoints = [
            "http://localhost:5000/api/products",
            "http://localhost:5000/api/auth/login"
        ]
        
        # Mutation 1: Case variations
        for endpoint in base_endpoints:
            mutations = [
                endpoint.replace("/api/", "/API/"),
                endpoint.replace("/api/", "/Api/"),
                endpoint.replace("products", "Products"),
                endpoint.replace("login", "Login")
            ]
            
            for mutated_endpoint in mutations:
                try:
                    response = requests.get(mutated_endpoint, timeout=5)
                    print(f"✓ Endpoint mutation: {mutated_endpoint} -> {response.status_code}")
                except:
                    print(f"✓ Endpoint mutation failed: {mutated_endpoint}")
        
        print("✓ API endpoint mutation testing completed")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])