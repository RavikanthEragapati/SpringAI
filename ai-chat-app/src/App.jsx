import React, { useState, useRef, useEffect } from 'react';
import mockApi from './api';

// Main App component that contains all logic and rendering
const App = () => {
  // State to manage which page to display
  const [currentPage, setCurrentPage] = useState('landing');
  // State to store the user's name
  const [userName, setUserName] = useState('');
  // State to store the chat messages
  const [chatMessages, setChatMessages] = useState([]);
  // State for loading indicators during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State to simulate a session token from the backend
  const [sessionToken, setSessionToken] = useState(null);
  // State to manage the collapsible left sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // State for the chat input value
  const [chatInput, setChatInput] = useState('');

  // Ref to the chat messages container for auto-scrolling
  const messagesEndRef = useRef(null);
  // Ref for the textarea to dynamically adjust its height
  const textareaRef = useRef(null);

  // Scrolls the chat view to the bottom whenever a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Dynamically adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [chatInput]);

  // Handler for the landing page form submission
  const handleLandingSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsLoading(true);
    try {
      const response = await mockApi.createSession(userName);
      setSessionToken(response.token);
      setIsLoading(false);
      setCurrentPage('chat');
      // Add the initial welcome message from the bot
      setChatMessages([{ type: 'system', text: `Hi ${userName}, how may I help you today?` }]);
    } catch (error) {
      console.error("Failed to create session:", error);
      setIsLoading(false);
      console.error('Failed to start session. Please try again.');
    }
  };

  // Handler for sending a new message in the chat
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const input = chatInput.trim();
    if (!input) return;

    // Add user's message to the chat
    setChatMessages(prevMessages => [...prevMessages, { type: 'user', text: input }]);
    setChatInput('');

    setIsLoading(true);
    try {
      const response = await mockApi.sendMessage(input);
      // Add the bot's response to the chat
      setChatMessages(prevMessages => [...prevMessages, { type: 'system', text: response.response }]);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for ending the chat session
  const handleEndChat = async () => {
    setIsLoading(true);
    try {
      await mockApi.endSession(sessionToken);
      // Reset all states and go back to landing page
      setUserName('');
      setSessionToken(null);
      setChatMessages([]);
      setCurrentPage('landing');
    } catch (error) {
      console.error("Failed to end session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render the chat message bubbles
  const renderMessageBubble = (message, index) => {
    const isUser = message.type === 'user';
    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
      >
        <div className={`p-3 rounded-lg max-w-sm lg:max-w-md whitespace-pre-wrap ${isUser ? 'bg-blue-500 text-white rounded-bl-none' : 'bg-green-500 text-white rounded-br-none'}`}>
          {message.text}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="w-full min-h-screen bg-white shadow-2xl overflow-hidden flex flex-col relative">
        {/* --- Landing Page --- */}
        {currentPage === 'landing' && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            {/* Logo */}
            <svg
              className="w-70 h-40 -mt-50"
              fill="none"
              viewBox="0 0 520 5"
            >
              <g transform="translate(20,100)">
                <text font-family="Inter, Helvetica, Arial, sans-serif"
                  font-size="90"
                  font-weight="800"
                  letter-spacing="4">
                  <tspan fill="#111111">DISC</tspan>
                </text>
                <circle cx="270" cy="-33" r="40" fill="#FF7A00" />
                <text font-family="Inter, Helvetica, Arial, sans-serif"
                  font-size="90"
                  font-weight="800"
                  letter-spacing="4">
                  <tspan x="310" fill="#111111">VER</tspan>
                </text>
              </g>
            </svg>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to CPB KnowledgeBase AI</h1>
            <p className="text-gray-500 mb-8">Please enter your name to start a new session.</p>

            {/* Form for name input */}
            <form onSubmit={handleLandingSubmit} className="w-full max-w-sm">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 mb-6"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="w-full py-3 px-6 bg-orange-400 text-white font-bold rounded-full shadow-lg hover:bg-orange-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-orange-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Start Chat Session'
                )}
              </button>
            </form>
          </div>
        )}





        {/* --- Chat Page --- */}
        {currentPage === 'chat' && (
          <div className="flex h-screen w-full">
            {/* Left Sidebar */}
            <div className={`my-custom-color text-white p-4 transition-all duration-300 ease-in-out flex flex-col ${isSidebarCollapsed ? 'w-16' : 'w-2/10'}`}>
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 mb-4 rounded-full hover:bg-gray-700 transition-all">
                <svg className="w-6 h-6 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {!isSidebarCollapsed && (
                <div className="flex flex-col space-y-4 flex-grow">
                  <h3 className="text-xl font-semibold truncate">Hello, {userName}!</h3>
                  <div className="text-sm">
                    <p className="text-gray-400">Session ID:{sessionToken}</p>
                  </div>
                </div>
              )}
              {/* End Chat Button at the bottom */}
              <div className="mt-auto">
                {!isSidebarCollapsed && (
                  <button
                    onClick={handleEndChat}
                    className="w-full py-2 px-4 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all duration-300 ease-in-out disabled:bg-orange-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4 mx-auto text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'End Chat'
                    )}
                  </button>
                )}
              </div>
              {/* <image></image> */}
            </div>

            {/* Right Main Chat Container */}
            <div className={`flex flex-col h-full relative transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[calc(100%-4rem)]' : 'w-8/10'}`}>
              {/* Chat header */}
              <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200 shadow-md">
                <div className="flex items-center">
                  <div className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-pulse"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Chat with CPB KnowledgeBase AI</h2>
                </div>
              </header>

              {/* Message display area */}
              <div className="flex-grow p-4 pb-24 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {chatMessages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-center text-gray-400">
                    <p>Start the conversation by sending a message!</p>
                  </div>
                ) : (
                  chatMessages.map(renderMessageBubble)
                )}
                {/* Loading spinner for system response */}
                {isLoading && (
                  <div className="flex justify-end">
                    <div className="p-3 rounded-lg bg-gray-200 animate-pulse text-gray-600">
                      <div className="flex space-x-2">
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Element to auto-scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input form - now with absolute positioning */}
              <form onSubmit={handleChatSubmit} className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end">
                  <textarea
                    ref={textareaRef}
                    rows="1"
                    name="message"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 mr-2 resize-none overflow-hidden"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="p-3 bg-orange-400 text-white rounded-full shadow-lg hover:bg-orange-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-orange-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.149 1.442A1 1 0 003 18h14a1 1 0 00.894-1.442l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
