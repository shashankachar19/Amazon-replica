import requests
import pytest

class TestDecisionTable:
    """
    Decision Table Testing - Test all combinations of conditions
    """
    
    def test_login_decision_table(self):
        """
        Decision Table for Login:
        Conditions: Valid Email (Y/N), Valid Password (Y/N), User Exists (Y/N)
        Actions: Login Success, Login Failure, Error Message
        """
        base_url = "http://localhost:5000/api/auth/login"
        
        # Decision Table Test Cases
        test_cases = [
            # Case 1: Valid email, Valid password, User exists -> Success
            {
                "email": "admin@lec.com",
                "password": "admin@1234", 
                "expected": 200,
                "description": "Valid credentials, existing user"
            },
            # Case 2: Valid email, Invalid password, User exists -> Failure
            {
                "email": "admin@lec.com",
                "password": "wrongpass",
                "expected": 400,
                "description": "Valid email, wrong password"
            },
            # Case 3: Invalid email format -> Failure
            {
                "email": "invalidemail",
                "password": "admin@1234",
                "expected": 400,
                "description": "Invalid email format"
            },
            # Case 4: Valid email, Valid password, User doesn't exist -> Failure
            {
                "email": "nonexistent@test.com",
                "password": "validpass123",
                "expected": 400,
                "description": "Valid format, non-existent user"
            },
            # Case 5: Empty email -> Failure
            {
                "email": "",
                "password": "admin@1234",
                "expected": 400,
                "description": "Empty email"
            },
            # Case 6: Empty password -> Failure
            {
                "email": "admin@lec.com",
                "password": "",
                "expected": 400,
                "description": "Empty password"
            }
        ]
        
        for i, case in enumerate(test_cases, 1):
            data = {"email": case["email"], "password": case["password"]}
            response = requests.post(base_url, json=data)
            
            assert response.status_code == case["expected"], \
                f"Case {i} failed: {case['description']}"
            
            print(f"✓ Case {i}: {case['description']}")
        
        print("✓ Login decision table completed")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])