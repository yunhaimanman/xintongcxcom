import { useState, useEffect, useContext } from 'react';
import { getMessages, addMessage, deleteMessage, addReply, Message, MessageReply } from '@/data/messages';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/contexts/authContext';

export default function MessageBoard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    author: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  // 加载留言
  useEffect(() => {
    const loadMessages = () => {
      const storedMessages = getMessages();
      // 按时间戳降序排序，最新的在前面
      storedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setMessages(storedMessages);
    };

    loadMessages();
    // 添加事件监听器，以便在留言更新时刷新
    const handleMessageUpdated = () => loadMessages();
    window.addEventListener('messageUpdated', handleMessageUpdated);

    return () => {
      window.removeEventListener('messageUpdated', handleMessageUpdated);
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
      
      // 显示成功提示
      toast.success('留言发布成功！');
      
      // 重置表单
      setNewMessage({ author: '', content: '' });
      
      // 刷新留言列表
      const storedMessages = getMessages();
      storedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setMessages(storedMessages);
    } catch (err) {
      console.error('添加留言失败:', err);
      toast.error('添加留言失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理删除留言
  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('确定要删除这条留言吗？此操作无法撤销。')) {
      try {
        const deleted = deleteMessage(messageId);
        if (deleted) {
          toast.success('留言已删除');
          // 刷新留言列表
          const storedMessages = getMessages();
          storedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setMessages(storedMessages);
        } else {
          toast.error('删除失败，请重试');
        }
      } catch (err) {
        console.error('删除留言失败:', err);
        toast.error('删除留言失败，请重试');
      }
    }
  };

  // 处理回复相关函数
  const handleReplyClick = (messageId: string) => {
    if (replyingTo === messageId) {
      setReplyingTo(null);
      setReplyContent('');
    } else {
      setReplyingTo(messageId);
      setReplyContent('');
    }
  };

  const handleReplySubmit = (e: React.FormEvent, messageId: string) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast.error('请输入回复内容');
      return;
    }
    
    setIsReplySubmitting(true);
    
    try {
      // 添加回复
      const newReply = addReply(messageId, {
        author: '管理员',
        content: replyContent,
        isAdmin: true
      });
      
      if (newReply) {
        toast.success('回复成功');
        setReplyingTo(null);
        setReplyContent('');
        
        // 刷新留言列表
        const storedMessages = getMessages();
        storedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setMessages(storedMessages);
      } else {
        toast.error('回复失败，请重试');
      }
    } catch (err) {
      console.error('添加回复失败:', err);
      toast.error('添加回复失败，请重试');
    } finally {
      setIsReplySubmitting(false);
    }
  };

  // 格式化日期时间
const formatDate = (date: Date | string) => {
  // 确保日期是Date对象
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 检查日期是否有效
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
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
              
                {/* 管理员功能提示和功能说明 */}
                {isAuthenticated && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                    <h3 className="text-base font-semibold mb-1 flex items-center text-green-700 dark:text-green-300">
                      <i className="fa-solid fa-shield-alt mr-2"></i>
                      管理员功能
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      您已登录为管理员，可以删除留言和回复留言。
                    </p>
                  </div>
                )}

                {/* 功能说明 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <h3 className="text-base font-semibold mb-1 flex items-center text-blue-700 dark:text-blue-300">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    功能说明
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    所有用户可以查看留言，管理员可以回复和删除留言。
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-start">
                    <i className="fa-solid fa-server mr-2 mt-0.5"></i>
                    <span>当前演示环境使用本地存储模拟服务器功能，所有留言对所有访问者可见。在生产环境中，将使用后端数据库确保数据持久化和多用户共享。</span>
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
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
               <div className="space-y-6">
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
                       className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                     >
                       <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                           <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                             <i className="fa-solid fa-user-circle mr-2 text-blue-500"></i>
                             {message.author}
                           </h4>
                           <span className="text-xs text-gray-500 dark:text-gray-400">
                             {formatDate(message.timestamp)}
                           </span>
                         </div>
                         <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4">{message.content}</p>
                         
                         {/* 管理员操作按钮 */}
                         {isAuthenticated && (
                           <div className="flex justify-end space-x-2 mt-2">
                             <button
                               onClick={() => handleDeleteMessage(message.id)}
                               className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                               title="删除留言"
                             >
                               <i className="fa-solid fa-trash"></i>
                             </button>
                             <button
                               onClick={() => handleReplyClick(message.id)}
                               className={`text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${replyingTo === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                               title="回复留言"
                             >
                               <i className="fa-solid fa-reply"></i>
                             </button>
                           </div>
                         )}
                       </div>
                       
                       {/* 回复表单 */}
                       {replyingTo === message.id && isAuthenticated && (
                         <div className="px-5 pb-5 pt-0">
                           <form onSubmit={(e) => handleReplySubmit(e, message.id)} className="space-y-3">
                             <textarea
                               value={replyContent}
                               onChange={(e) => setReplyContent(e.target.value)}
                               rows={2}
                               className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                               placeholder="请输入回复内容..."
                             ></textarea>
                             <div className="flex justify-end space-x-2">
                               <button
                                 type="button"
                                 onClick={() => setReplyingTo(null)}
                                 className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors"
                               >
                                 取消
                               </button>
                               <button
                                 type="submit"
                                 disabled={isReplySubmitting}
                                 className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:bg-blue-400"
                               >
                                 {isReplySubmitting ? (
                                   <>
                                     <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                                     提交中
                                   </>
                                 ) : (
                                   "提交回复"
                                 )}
                               </button>
                             </div>
                           </form>
                         </div>
                       )}
                       
                       {/* 显示回复 */}
                       {message.replies && message.replies.length > 0 && (
                         <div className="bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 p-5">
                           <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                             <i className="fa-solid fa-reply-all mr-2 text-gray-500"></i>
                             回复 ({message.replies.length})
                           </h5>
                           <div className="space-y-4">
                             {message.replies.map((reply: MessageReply) => (
                               <div key={reply.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                 <div className="flex justify-between items-start mb-1">
                                   <h6 className="font-medium text-gray-900 dark:text-white flex items-center">
                                     <i className="fa-solid fa-user-circle mr-1 text-green-500 text-sm"></i>
                                     {reply.author}
                                     {reply.isAdmin && (
                                       <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded-full">管理员</span>
                                     )}
                                   </h6>
                                   <span className="text-xs text-gray-500 dark:text-gray-400">
                                     {formatDate(reply.timestamp)}
                                   </span>
                                 </div>
                                 <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
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