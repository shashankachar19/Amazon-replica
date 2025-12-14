#!/usr/bin/env python3
"""
Complete Test Suite Runner for Amazon Replica
Run all tests and generate comprehensive report
"""

import subprocess
import sys
import time

def run_test_suite(test_file, test_name):
    """Run a test suite and return results"""
    print(f"\n{'='*60}")
    print(f"Running {test_name}")
    print('='*60)
    
    try:
        result = subprocess.run([sys.executable, "-m", "pytest", test_file, "-v"], 
                              capture_output=True, text=True)
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"Error running {test_name}: {e}")
        return False

def main():
    """Run all test suites"""
    print("Amazon Replica - Comprehensive Test Suite")
    print("="*60)
    
    test_suites = [
        ("simple_test.py", "Basic API Tests"),
        ("complete_test.py", "Core Functionality Tests"),
        ("integration_test.py", "Integration Tests"),
        ("error_handling_test.py", "Error Handling Tests"),
        ("database_test.py", "Database Tests"),
        ("equivalence_class_test.py", "Equivalence Class Testing"),
        ("boundary_value_test.py", "Boundary Value Testing"),
        ("decision_table_test.py", "Decision Table Testing"),
        ("state_transition_test.py", "State Transition Testing"),
        ("pairwise_test.py", "Pairwise Testing"),
        ("mutation_test.py", "Mutation Testing")
    ]
    
    results = {}
    total_start = time.time()
    
    for test_file, test_name in test_suites:
        start_time = time.time()
        success = run_test_suite(test_file, test_name)
        end_time = time.time()
        
        results[test_name] = {
            'success': success,
            'duration': end_time - start_time
        }
    
    total_end = time.time()
    
    # Print summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY REPORT")
    print('='*60)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result['success'] else "❌ FAILED"
        duration = f"{result['duration']:.2f}s"
        print(f"{test_name:<30} {status:<10} ({duration})")
        
        if result['success']:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests Suites: {len(test_suites)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Total Duration: {total_end - total_start:.2f}s")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Your application is working perfectly!")
    else:
        print(f"\n⚠️  {failed} test suite(s) failed. Check the output above.")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)