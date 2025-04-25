import { jest } from '@jest/globals';

describe('Message Display Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loginMessage" class="errorMessage" style="display:none;"></div>
      <div id="signupMessage" class="errorMessage" style="display:none;"></div>
    `;
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });
  
  const showMessage = (message) => {
    const messageBox = document.getElementById("loginMessage");
    if (!messageBox) return;
  
    messageBox.textContent = message;
    messageBox.style.display = "block";
    messageBox.style.opacity = "1";
    messageBox.style.pointerEvents = "auto";
  
    setTimeout(() => {
      messageBox.style.opacity = "0";
      messageBox.style.pointerEvents = "none";
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 500);
    }, 4000);
  };
  
  test('showMessage should update text content and display the message', () => {
    showMessage("Test error message");
    
    const messageEl = document.getElementById("loginMessage");
    
    expect(messageEl.textContent).toBe("Test error message");
    expect(messageEl.style.display).toBe("block");
    expect(messageEl.style.opacity).toBe("1");
    expect(messageEl.style.pointerEvents).toBe("auto");
  });
  
  test('showMessage should hide the message after the timeout', () => {
    showMessage("Test error message");
    
    const messageEl = document.getElementById("loginMessage");
    
    jest.advanceTimersByTime(4000);
    
    expect(messageEl.style.opacity).toBe("0");
    expect(messageEl.style.pointerEvents).toBe("none");
    
    jest.advanceTimersByTime(500);
    
    expect(messageEl.style.display).toBe("none");
  });
  
  test('showMessage should do nothing if message element is not found', () => {
    document.body.innerHTML = '';
    
    expect(() => showMessage("Test message")).not.toThrow();
  });
});