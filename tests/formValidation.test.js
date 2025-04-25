import { jest } from '@jest/globals';

describe('Form Validation Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loginMessage" class="errorMessage" style="display:none;"></div>
      <form>
        <input id="Name" type="text" placeholder="Name">
        <input id="Email" type="email" placeholder="Email">
        <input id="Password" type="password" placeholder="Password">
        <button id="loginBtn" type="submit">Login</button>
        <button id="signupBtn" type="submit">Sign Up</button>
      </form>
    `;
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  test('isValidEmail should correctly validate email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('user123@gmail.com')).toBe(true);
    
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('test@domain.')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
  
  test('Form should validate required fields', () => {
    const validateForm = () => {
      const name = document.getElementById('Name').value;
      const email = document.getElementById('Email').value;
      const password = document.getElementById('Password').value;
      
      if (!name || !email || !password) {
        return { valid: false, message: "Please fill in all fields." };
      }
      
      if (!isValidEmail(email)) {
        return { valid: false, message: "Please enter a valid email address." };
      }
      
      if (password.length < 6) {
        return { valid: false, message: "Password should be at least 6 characters." };
      }
      
      return { valid: true };
    };
    
    expect(validateForm().valid).toBe(false);
    expect(validateForm().message).toBe("Please fill in all fields.");
    
    document.getElementById('Name').value = 'Test User';
    expect(validateForm().valid).toBe(false);
    expect(validateForm().message).toBe("Please fill in all fields.");
    
    document.getElementById('Email').value = 'invalid-email';
    document.getElementById('Password').value = 'password123';
    expect(validateForm().valid).toBe(false);
    expect(validateForm().message).toBe("Please enter a valid email address.");
    
    document.getElementById('Email').value = 'test@example.com';
    document.getElementById('Password').value = '12345';
    expect(validateForm().valid).toBe(false);
    expect(validateForm().message).toBe("Password should be at least 6 characters.");
    
    document.getElementById('Password').value = '123456';
    expect(validateForm().valid).toBe(true);
  });
  
  test('Form submission should validate inputs before processing', () => {
    const showMessage = jest.fn();
    
    const handleFormSubmission = (e) => {
      e.preventDefault();
      
      const name = document.getElementById('Name').value;
      const email = document.getElementById('Email').value;
      const password = document.getElementById('Password').value;
      
      if (!name || !email || !password) {
        showMessage("Please fill in all fields.");
        return false;
      }
      
      if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.");
        return false;
      }
      
      return true;
    };
    
    const mockEvent = { preventDefault: jest.fn() };
    expect(handleFormSubmission(mockEvent)).toBe(false);
    expect(showMessage).toHaveBeenCalledWith("Please fill in all fields.");
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    showMessage.mockClear();
    mockEvent.preventDefault.mockClear();
    
    document.getElementById('Name').value = 'Test User';
    document.getElementById('Email').value = 'invalid-email';
    document.getElementById('Password').value = 'password123';
    
    expect(handleFormSubmission(mockEvent)).toBe(false);
    expect(showMessage).toHaveBeenCalledWith("Please enter a valid email address.");
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    showMessage.mockClear();
    mockEvent.preventDefault.mockClear();
    
    document.getElementById('Email').value = 'test@example.com';
    
    expect(handleFormSubmission(mockEvent)).toBe(true);
    expect(showMessage).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});