// 留言数据类型定义
export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

// 从localStorage获取所有留言
export const getMessages = (): Message[] => {
  const messagesJson = localStorage.getItem('messages');
  if (!messagesJson) return [];
  
  try {
    const messages = JSON.parse(messagesJson) as Message[];
    // 将字符串日期转换为Date对象
    return messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Failed to parse messages:', error);
    return [];
  }
};

// 添加新留言到localStorage
export const addMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
  const messages = getMessages();
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date()
  };
  
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  
  return newMessage;
};