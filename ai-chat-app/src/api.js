  // Custom API mock functions to simulate a backend
  const mockApi = {
    // Simulates a backend endpoint to create a user session
    createSession: (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (name) {
            // Simulate a successful response with a session token
            resolve({ success: true, token: `${Date.now()}` });
          } else {
            // Simulate a failure
            reject(new Error('Name cannot be empty.'));
          }
        }, 1500); // Simulate network delay
      });
    },

    // Simulates a backend endpoint for the chat
    sendMessage: (userMessage) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate a basic LLM response
          const botResponse = `I received your message: "${userMessage}". I am a mock chatbot. How can I help you?`;
          resolve({ response: botResponse });
        }, 2000); // Simulate network delay
      });
    },

    // Simulates a backend endpoint to end a session and clear history
    endSession: (token) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real application, you would send a request with the token
          // and the backend would invalidate it and clear any stored data.
          console.log(`Simulating end of session for token: ${token}`);
          resolve({ success: true });
        }, 1000);
      });
    }
  };

export default mockApi;
