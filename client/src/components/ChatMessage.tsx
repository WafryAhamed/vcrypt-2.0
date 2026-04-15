import React from 'react';
import { ChatMessage as ChatMessageType } from '../context/ChatContext';
import { BotIcon, UserIcon } from 'lucide-react';
interface ChatMessageProps {
  message: ChatMessageType;
}
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const isSystem = message.type === 'system';
  if (isSystem) {
    return (
      <div className="text-center my-2 px-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {message.content}
        </span>
      </div>);

  }
  return (
    <div
      className={`flex items-start mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      
      {isBot &&
      <div className="flex-shrink-0 mr-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <BotIcon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      }
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${isBot ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700' : 'bg-blue-600 dark:bg-blue-700 text-white'}`}>
        
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        <div
          className={`text-xs mt-1 ${isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-200'}`}>
          
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {!isBot &&
      <div className="flex-shrink-0 ml-3">
          <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-full">
            <UserIcon size={16} className="text-white" />
          </div>
        </div>
      }
    </div>);

};
export default ChatMessage;