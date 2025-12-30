import { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/Message';
import { TypingIndicator } from './components/Message';
import ChatInput from './components/ChatInput';

// Initial conversation data
const initialMessages = [
  {
    id: 1,
    type: 'bot',
    textLines: ['Chào bạn! Tôi là trợ lý ảo Zalo.', 'Tôi có thể giúp gì cho bạn hôm nay?'],
    timestamp: '09:00'
  },
  {
    id: 2,
    type: 'user',
    textLines: ['Tôi muốn tra cứu thông tin.'],
    timestamp: '09:01'
  },
  {
    id: 3,
    type: 'bot',
    textLines: ['Tuyệt vời! Bạn muốn tra cứu thông tin về gì?', 'Tôi có thể giúp bạn tìm kiếm về:'],
    timestamp: '09:01'
  },
  {
    id: 4,
    type: 'bot',
    textLines: ['• Thời tiết', '• Tin tức', '• Kết quả xổ số', '• Tỷ giá hối đoái'],
    timestamp: '09:01'
  }
];

// Bot responses for simulation
const botResponses = [
  ['Cảm ơn bạn đã nhắn tin!', 'Tôi sẽ giúp bạn xử lý yêu cầu này.'],
  ['Đã ghi nhận.', 'Hãy cho tôi biết thêm chi tiết nhé!'],
  ['Tuyệt vời!', 'Tôi đang tìm kiếm thông tin cho bạn...'],
  ['Vâng, tôi hiểu rồi.', 'Có gì tôi có thể giúp thêm không?'],
  ['Để tôi kiểm tra', 'và trả lời bạn ngay nhé!']
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle sending new message
  const handleSendMessage = (text) => {
    // Add user message
    const newMessage = {
      id: Date.now(),
      type: 'user',
      textLines: [text],
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, newMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        textLines: randomResponse,
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="device-frame">
      <div className="device-screen">
        <ChatHeader title="Zalo Chatbot Official" />

        <div className="chat-body" ref={chatBodyRef}>
          <div className="date-separator">
            <span>Hôm nay</span>
          </div>

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              type={message.type}
              textLines={message.textLines}
              timestamp={message.timestamp}
              userInitial="B"
            />
          ))}

          {isTyping && <TypingIndicator />}
        </div>

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

export default App;
