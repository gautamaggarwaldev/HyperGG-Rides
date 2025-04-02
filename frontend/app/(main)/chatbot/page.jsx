'use client';
import { useState, useRef, useEffect } from 'react';
import { processCarQuery } from '@/actions/chatbot';
import { Image, Loader2Icon, Send, X, Maximize2, Minimize2, Car } from 'lucide-react';

export default function CarChatbot() {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your car expert assistant. Ask me anything about vehicles, upload car images, or request comparisons!", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Better special character handling - preserves HTML tags while removing other problematic characters
  const cleanResponseText = (text) => {
    // This regex preserves HTML tags like ** while removing other unwanted characters
    return text.replace(/<\/?[^>]+(>|$)/g, match => {
      // Temporarily encode HTML tags
      return `###HTML_TAG###${encodeURIComponent(match)}###`;
    }).replace(/[^\u0020-\u007F]/,"") // <- Problem is here
      .replace(/###HTML_TAG###([^#]+)###/g, (_, encoded) => {
        // Decode HTML tags back
        return decodeURIComponent(encoded);
      });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !imagePreview) || isLoading) return;

    // Add user message
    const userMessage = { 
      text: input || 'Analyze this car image', 
      sender: 'user',
      image: imagePreview,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      let response;
      
      if (imagePreview) {
        const base64Data = imagePreview.split(',')[1];
        response = await processCarQuery({
          question: input,
          imageData: base64Data
        });
      } else {
        response = await processCarQuery({ question: input });
      }

      // Clean the response text
      const cleanedResponse = cleanResponseText(response);
      
      setMessages(prev => [...prev, { 
        text: cleanedResponse, 
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (err) {
      setError(err.message || 'Failed to get response');
    } finally {
      setIsLoading(false);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      formRef.current?.reset();
    }
  };

  // Format message time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Parse HTML in bot responses
  const renderHTML = (html) => {
    return { __html: html };
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleChatbot} 
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <Car size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed ${isFullScreen ? 'inset-0' : 'bottom-6 right-6 w-[calc(100%-3rem)] max-w-md h-[600px]'} bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-300`}>
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Car size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Car Expert Assistant</h2>
            <p className="text-xs opacity-90">Powered by Gemini AI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isFullScreen ? 'Minimize' : 'Maximize'}
          >
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            onClick={toggleChatbot}
            className="p-2 rounded-full hover:bg-white/20 transition-colors" 
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 relative ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'}`}
              >
                {msg.image && (
                  <div className="mb-3 relative group">
                    <img 
                      src={msg.image} 
                      alt="Uploaded car" 
                      className="rounded-lg w-full max-w-[300px] h-auto object-cover border-2 border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Car image</span>
                    </div>
                  </div>
                )}
                {msg.sender === 'bot' ? (
                  <div 
                    className="whitespace-pre-wrap text-sm md:text-base"
                    dangerouslySetInnerHTML={renderHTML(msg.text)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm md:text-base">{msg.text}</p>
                )}
                <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} flex items-center`}>
                  {formatTime(msg.timestamp)}
                  {msg.sender === 'bot' && (
                    <span className="ml-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <span>Car Expert</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-md border border-gray-100">
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                  <span className="text-sm ml-3 text-gray-500">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {error && (
          <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        {imagePreview && (
          <div className="relative mb-3 group animate-fadeIn">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="rounded-lg w-full max-w-[200px] h-auto object-cover border-2 border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any car model, specs, or features..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50 shadow-sm"
            disabled={isLoading}
            aria-label="Upload image"
          >
            <Image className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !imagePreview)}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Ask about specs, compare models, upload images, or get recommendations
        </p>
      </div>
    </div>
  );
}