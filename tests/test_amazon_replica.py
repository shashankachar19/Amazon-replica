import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time

@pytest.fixture
def driver():
    service = Service('/usr/bin/chromedriver')
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--remote-debugging-port=9222')
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

class TestAmazonReplica:
    
    def test_google_login_button(self, driver):
        driver.get("http://localhost:5173/login")
        
        # Check Google login button exists
        google_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Google') or contains(@class, 'google')]")
        assert google_btn is not None
    
    def test_admin_login(self, driver):
        driver.get("http://localhost:5173/login")
        
        # Login with admin credentials
        driver.find_element(By.NAME, "email").send_keys("admin@lec.com")
        driver.find_element(By.NAME, "password").send_keys("admin@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for redirect
        time.sleep(3)
        assert driver.current_url == "http://localhost:5173/" or "home" in driver.current_url.lower()
    
    def test_browse_products(self, driver):
        # Login as admin
        driver.get("http://localhost:5173/login")
        driver.find_element(By.NAME, "email").send_keys("admin@lec.com")
        driver.find_element(By.NAME, "password").send_keys("admin@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)
        
        # Check products are displayed
        products = driver.find_elements(By.CSS_SELECTOR, ".product-card, [class*='product']")
        assert len(products) > 0
    
    def test_add_to_cart(self, driver):
        # Login as admin
        driver.get("http://localhost:5173/login")
        driver.find_element(By.NAME, "email").send_keys("admin@lec.com")
        driver.find_element(By.NAME, "password").send_keys("admin@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)
        
        # Add first product to cart
        add_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Add to Cart')]")
        if add_buttons:
            add_buttons[0].click()
            time.sleep(1)
    
    def test_view_cart(self, driver):
        # Login as admin
        driver.get("http://localhost:5173/login")
        driver.find_element(By.NAME, "email").send_keys("admin@lec.com")
        driver.find_element(By.NAME, "password").send_keys("admin@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)
        
        # Navigate to cart
        cart_link = driver.find_element(By.LINK_TEXT, "Cart")
        cart_link.click()
        time.sleep(1)
        
        # Verify cart page
        assert "cart" in driver.current_url.lower() or "Cart" in driver.page_source
    
    def test_filter_by_category(self, driver):
        # Login as admin
        driver.get("http://localhost:5173/login")
        driver.find_element(By.NAME, "email").send_keys("admin@lec.com")
        driver.find_element(By.NAME, "password").send_keys("admin@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)
        
        # Click on a category
        categories = driver.find_elements(By.XPATH, "//button[contains(text(), 'Electronics') or contains(text(), 'Books')]")
        if categories:
            categories[0].click()
            time.sleep(1)
