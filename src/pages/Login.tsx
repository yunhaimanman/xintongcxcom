 import { useState, useContext } from 'react';
 import { useNavigate, useSearchParams } from 'react-router-dom';
 import { toast } from 'sonner';
 import { motion } from 'framer-motion';
 import { AuthContext } from '@/contexts/authContext';
 import { validateMakerLogin } from '@/data/makers';
 import Header from '@/components/Header';
 import Footer from '@/components/Footer';
 

 export default function Login() {
   const navigate = useNavigate();
   const { setIsAuthenticated } = useContext(AuthContext);
   const [searchParams] = useSearchParams();
   const [formData, setFormData] = useState({
     username: '',
     password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    
     // 模拟API请求延迟
     setTimeout(() => {
       // 判断是管理员登录还是创客登录
       const loginType = searchParams.get('type');
       
       if (loginType === 'maker') {
         // 创客登录逻辑
         const maker = validateMakerLogin(formData.username, formData.password);
         if (maker) {
           setIsAuthenticated(true, formData.username, 'maker');
           toast.success('创客登录成功！');
           navigate('/maker');
         } else {
           setError('用户名或密码不正确');
         }
       } else {
         // 管理员登录逻辑
         if (formData.username === 'admin' && formData.password === 'admin') {
           setIsAuthenticated(true, formData.username, 'admin');
           toast.success('管理员登录成功，欢迎回来！');
           navigate('/tool-management');
         } else {
           setError('用户名或密码不正确');
         }
       }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
               <h2 className="text-2xl font-bold mb-1">{searchParams.get('type') === 'maker' ? '创客登录' : '管理员登录'}</h2>
               <p className="opacity-90">{searchParams.get('type') === 'maker' ? '请输入创客账号密码' : '请输入管理员账号密码'}</p>
             </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      用户名
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa-solid fa-user text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="输入用户名"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa-solid fa-lock text-gray-400"></i>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="输入密码"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <i className="fa-solid fa-exclamation-circle mr-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        登录中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-sign-in-alt mr-2"></i>
                        登录
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
              <i className="fa-solid fa-info-circle mr-1"></i>
               {searchParams.get('type') === 'maker' ? '只有授权的创客可以登录' : '只有管理员可以访问工具管理页面'}
             </p>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
