import { useState, useEffect } from 'react';
import { getMessages, addMessage, Message } from '@/data/messages';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    author: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 加载留言
  useEffect(() => {
    const loadMessages = () => {
      const storedMessages = getMessages();
      // 按时间戳降序排序，最新的在前面
      storedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setMessages(storedMessages);
    };

    loadMessages();
    // 可以添加一个自定义事件监听器，以便在其他地方添加留言后刷新
    const handleMessageAdded = () => loadMessages();
    window.addEventListener('messageAdded', handleMessageAdded);

    
    return () => {
      window.removeEventListener('messageAdded', handleMessageAdded);
    };
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!newMessage.author.trim()) {
      setError('请输入您的昵称');
      return;
    }
    
    if (!newMessage.content.trim()) {
      setError('请输入留言内容');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 添加新留言
      const message = addMessage(newMessage);
      
      // 更新本地状态
      setMessages(prev => [message, ...prev]);
      
      // 重置表单
      setNewMessage({ author: '', content: '' });
      
      // 触发自定义事件，通知其他可能的组件
      window.dispatchEvent(new Event('messageAdded'));
    } catch (err) {
      console.error('添加留言失败:', err);
      setError('添加留言失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化日期时间
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <i className="fa-solid fa-comments text-blue-500 mr-3"></i>
                留言板
              </h2>
              
               {/* 功能说明 */}
               <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                 <h3 className="text-base font-semibold mb-1 flex items-center text-yellow-700 dark:text-yellow-300">
                   <i className="fa-solid fa-info-circle mr-2"></i>
                   功能说明
                 </h3>
                 <p className="text-sm text-yellow-600 dark:text-yellow-400">
                   当前留言板使用浏览器本地存储，仅在您自己的设备上可见。如需多用户共享功能，需要后端服务器支持。
                 </p>
               </div>
               
               {/* 留言表单 */}
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-4">添加留言</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      昵称
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={newMessage.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的昵称"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      留言内容
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={newMessage.content}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的留言..."
                    ></textarea>
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm flex items-center">
                      <i className="fa-solid fa-exclamation-circle mr-1"></i>
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        提交中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        发布留言
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* 留言列表 */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <i className="fa-solid fa-comment-dots text-gray-500 mr-2"></i>
                  最新留言 ({messages.length})
                </h3>
                
                {messages.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="text-gray-400 mb-4">
                      <i className="fa-solid fa-comment-slash text-4xl"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">暂无留言，来添加第一条留言吧！</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <i className="fa-solid fa-user-circle mr-2 text-blue-500"></i>
                          {message.author}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{message.content}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}