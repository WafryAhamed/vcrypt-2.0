import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext } from
'react';
// Define types for our chat messages
export type MessageType = 'user' | 'bot' | 'system';
export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}
// Define quick action buttons
export interface QuickAction {
  id: string;
  label: string;
  question: string;
}
// Define the shape of our context
interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  closeChat: () => void;
  quickActions: QuickAction[];
}
// Create the context
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isOpen: false,
  isTyping: false,
  sendMessage: () => {},
  toggleChat: () => {},
  closeChat: () => {},
  quickActions: []
});
export const useChat = () => useContext(ChatContext);
// Define the quick actions available in the chat
const defaultQuickActions: QuickAction[] = [
{
  id: 'register',
  label: 'How to register a vehicle?',
  question: 'How do I register a new vehicle on the blockchain?'
},
{
  id: 'verify',
  label: 'Verify ownership',
  question: 'How can I verify vehicle ownership?'
},
{
  id: 'transfer',
  label: 'Transfer process',
  question: 'What is the process to transfer vehicle ownership?'
},
{
  id: 'wallet',
  label: 'Wallet setup',
  question: 'How do I set up a wallet for registration?'
}];

// AI responses based on keywords
const getBotResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  // Registration related queries
  if (lowerMsg.includes('register') || lowerMsg.includes('registration')) {
    return "To register a vehicle on our blockchain platform, you'll need:\n\n1. Your vehicle's VIN/chassis number\n2. Current registration documents\n3. A connected blockchain wallet\n\nGo to the 'Register Vehicle' section in the dashboard and follow the guided process. The blockchain transaction will secure your ownership with immutable proof.";
  }
  // Verification related queries
  if (
  lowerMsg.includes('verify') ||
  lowerMsg.includes('verification') ||
  lowerMsg.includes('check'))
  {
    return "You can verify any vehicle's ownership and history by using our 'Verify Ownership' tool. Simply enter the vehicle's license plate or chassis number, and the blockchain will return the complete ownership record and transaction history. This provides transparent proof of legitimate ownership.";
  }
  // Transfer related queries
  if (
  lowerMsg.includes('transfer') ||
  lowerMsg.includes('sell') ||
  lowerMsg.includes('buy'))
  {
    return "Transferring vehicle ownership is simple and secure:\n\n1. The current owner initiates the transfer in the 'Transfer Ownership' section\n2. Enter the recipient's wallet address\n3. Both parties sign the transaction\n4. The blockchain records the transfer permanently\n\nThis eliminates paperwork and creates an immutable record of the transfer.";
  }
  // Wallet related queries
  if (lowerMsg.includes('wallet') || lowerMsg.includes('connect')) {
    return "To use our platform, you'll need a Cardano blockchain wallet. We recommend Lace or Eternl wallets for the best experience. Once installed, you can connect your wallet by clicking the 'Login' button and selecting 'Wallet Login'. Your wallet will securely sign all vehicle transactions without exposing your private keys.";
  }
  // Security related queries
  if (
  lowerMsg.includes('secure') ||
  lowerMsg.includes('security') ||
  lowerMsg.includes('safe'))
  {
    return 'Our blockchain vehicle registration system provides bank-level security. All ownership records are cryptographically secured and cannot be altered or forged. Your information is protected by the same technology that secures billions in cryptocurrency assets, making it virtually impossible for anyone to falsify vehicle records.';
  }
  // Help related queries
  if (
  lowerMsg.includes('help') ||
  lowerMsg.includes('support') ||
  lowerMsg.includes('contact'))
  {
    return "Our support team is available to help with any questions about the vehicle registration process. You can contact us through the 'Contact Support' button in the footer of the page. For technical blockchain issues, we recommend also checking our comprehensive FAQ section in the dashboard.";
  }
  // Fees related queries
  if (
  lowerMsg.includes('fee') ||
  lowerMsg.includes('cost') ||
  lowerMsg.includes('price'))
  {
    return 'Our blockchain registration system charges minimal transaction fees compared to traditional paper-based systems. Each registration costs a small network fee (approximately $5 equivalent in ADA) plus a platform fee that varies by region. Transfers typically cost less than new registrations. All fees are clearly displayed before you confirm any transaction.';
  }
  // Fallback response
  return "Thanks for your question. As your blockchain vehicle registration assistant, I can help with registration processes, ownership verification, transfers, and technical questions about our platform. Could you provide more details about what you're looking to do with your vehicle registration?";
};
export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] =
  useState<QuickAction[]>(defaultQuickActions);
  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content:
      "👋 Hello! I'm BTRA's AI assistant. How can I help you with your vehicle registration today?",
      type: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);
  // Function to send a user message and get a bot response
  const sendMessage = (content: string) => {
    // Create a user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date()
    };
    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    // Show typing indicator
    setIsTyping(true);
    // Simulate AI thinking time (between 1-2 seconds)
    const thinkingTime = Math.floor(Math.random() * 1000) + 1000;
    // Generate and add the bot response after the thinking time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: getBotResponse(content),
        type: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, thinkingTime);
  };
  // Toggle the chat open/closed
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };
  // Close the chat
  const closeChat = () => {
    setIsOpen(false);
  };
  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isTyping,
        sendMessage,
        toggleChat,
        closeChat,
        quickActions
      }}>
      
      {children}
    </ChatContext.Provider>);

};