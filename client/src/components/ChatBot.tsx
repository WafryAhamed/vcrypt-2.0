import React, { useEffect, useState, useRef } from 'react';
import { useChat, QuickAction } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import { XIcon, SendIcon, MessageSquareIcon, Loader2Icon } from 'lucide-react';
const ChatBot: React.FC = () => {
  const {
    messages,
    isOpen,
    isTyping,
    sendMessage,
    toggleChat,
    closeChat,
    quickActions
  } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.question);
  };
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 z-50 group"
        aria-label="Open chat assistant">
        
        <MessageSquareIcon size={24} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          1
        </span>
        <span className="absolute bottom-full mb-2 right-0 bg-blue-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Need help?
        </span>
      </button>);

  }
  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl z-50 flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full mr-2">
            <MessageSquareIcon
              size={18}
              className="text-blue-600 dark:text-blue-400" />
            
          </div>
          <div>
            <h3 className="font-medium">BTRA Assistant</h3>
            <p className="text-xs text-blue-100">Blockchain Vehicle Registry</p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="text-white hover:bg-blue-800 dark:hover:bg-blue-900 p-1.5 rounded-full"
          aria-label="Close chat">
          
          <XIcon size={18} />
        </button>
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800">
        {messages.map((message) =>
        <ChatMessage key={message.id} message={message} />
        )}
        {isTyping &&
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0 mr-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <BotIcon
                size={16}
                className="text-blue-600 dark:text-blue-400" />
              
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                <div
                className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                style={{
                  animationDelay: '0ms'
                }}>
              </div>
                <div
                className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                style={{
                  animationDelay: '150ms'
                }}>
              </div>
                <div
                className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                style={{
                  animationDelay: '300ms'
                }}>
              </div>
              </div>
            </div>
          </div>
        }
        <div ref={messagesEndRef} />
      </div>
      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-2">
          {quickActions.map((action) =>
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 whitespace-nowrap transition-colors">
            
              {action.label}
            </button>
          )}
        </div>
      </div>
      {/* Chat input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-700">
        
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about vehicle registration..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 py-2 px-1" />
          
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`ml-2 p-1.5 rounded-full ${inputValue.trim() ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'} transition-colors`}
            aria-label="Send message">
            
            <SendIcon size={16} />
          </button>
        </div>
      </form>
    </div>);

};
// Bot icon component
const BotIcon: React.FC<{
  size: number;
  className?: string;
}> = ({ size, className }) =>
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className={className}>
  
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>;

export default ChatBot;