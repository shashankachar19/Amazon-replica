@echo off
echo Individual Test Runner (Windows)
echo =================================

call venv\Scripts\activate.bat

echo Select test to run:
echo 1. Basic API Tests
echo 2. Equivalence Class Testing
echo 3. Boundary Value Testing
echo 4. Decision Table Testing
echo 5. State Transition Testing
echo 6. Pairwise Testing
echo 7. Mutation Testing
echo 8. Integration Testing
echo 9. Error Handling Testing
echo 10. Database Testing
echo 11. All Tests

set /p choice="Enter choice (1-11): "

if "%choice%"=="1" pytest simple_test.py -v
if "%choice%"=="2" pytest equivalence_class_test.py -v
if "%choice%"=="3" pytest boundary_value_test.py -v
if "%choice%"=="4" pytest decision_table_test.py -v
if "%choice%"=="5" pytest state_transition_test.py -v
if "%choice%"=="6" pytest pairwise_test.py -v
if "%choice%"=="7" pytest mutation_test.py -v
if "%choice%"=="8" pytest integration_test.py -v
if "%choice%"=="9" pytest error_handling_test.py -v
if "%choice%"=="10" pytest database_test.py -v
if "%choice%"=="11" python run_all_tests.py

pause