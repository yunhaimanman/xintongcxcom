// 留言数据类型定义
export interface MessageReply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
}

export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  replies: MessageReply[];
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
    timestamp: new Date(),
    replies: []
  };
  
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  
  // 通知其他组件数据已更新
  window.dispatchEvent(new Event('messageUpdated'));
  
  return newMessage;
}

// 删除留言
export const deleteMessage = (id: string): boolean => {
  const messages = getMessages();
  const initialLength = messages.length;
  
  const filteredMessages = messages.filter(msg => msg.id !== id);
  
  if (filteredMessages.length === initialLength) return false;
  
  localStorage.setItem('messages', JSON.stringify(filteredMessages));
  
  // 通知其他组件数据已更新
  window.dispatchEvent(new Event('messageUpdated'));
  return true;
};

// 添加留言回复
export const addReply = (messageId: string, reply: Omit<MessageReply, 'id' | 'timestamp' | 'isAdmin'> & { isAdmin: boolean }): MessageReply | null => {
  const messages = getMessages();
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex === -1) return null;
  
  const newReply: MessageReply = {
    ...reply,
    id: `reply_${Date.now()}`,
    timestamp: new Date()
  };
  
  messages[messageIndex].replies.push(newReply);
  localStorage.setItem('messages', JSON.stringify(messages));
  
  // 通知其他组件数据已更新
  window.dispatchEvent(new Event('messageUpdated'));
  return newReply;
};