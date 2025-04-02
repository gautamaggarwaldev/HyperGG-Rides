'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, X } from 'lucide-react';

export default function ChatButton() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Show notification every 10 seconds, but only if it's not already showing
  // and if it hasn't been permanently dismissed
  useEffect(() => {
    // Don't show on first render
    if (notificationCount === 0) {
      setNotificationCount(1);
      return;
    }
    
    // If notification is permanently dismissed, don't show it again
    if (notificationDismissed) return;
    
    const interval = setInterval(() => {
      setShowNotification(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [notificationDismissed, notificationCount]);
  
  // Navigate to chat page
  const handleChatClick = () => {
    router.push('/chatbot');
  };
  
  // Close notification temporarily
  const handleCloseNotification = (e) => {
    e.stopPropagation();
    setShowNotification(false);
  };
  
  // Permanently dismiss notification
  const handleDismissNotification = (e) => {
    e.stopPropagation();
    setShowNotification(false);
    setNotificationDismissed(true);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification Popup */}
      {showNotification && (
        <div 
          className="bg-white rounded-lg shadow-xl p-4 mb-4 w-64 animate-bounce-subtle relative cursor-pointer"
          onClick={handleChatClick}
        >
          <button 
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={handleDismissNotification}
          >
            <X size={16} />
          </button>
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Try our new AI Car Expert!</h4>
              <p className="text-xs text-gray-600">Ask any question about cars, models, specs & more</p>
            </div>
          </div>
          <div 
            className="mt-2 text-xs text-blue-600 flex justify-end"
            onClick={handleCloseNotification}
          >
            Not now
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <button 
        onClick={handleChatClick}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative transition-all duration-300 hover:scale-105"
      >
        <MessageSquare size={24} />
        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
      </button>
    </div>
  );
}