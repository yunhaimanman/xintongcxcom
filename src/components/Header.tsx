import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  
  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
               小桐导航
             </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">发现实用的在线工具</p>
          </motion.div>
          
           <nav className="hidden md:block">
             <ul className="flex space-x-6">
               <li>
                 <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                   <i className="fa-solid fa-home mr-1"></i>
                   首页
                 </a>
               </li>
               <li>
                 <a href="/message-board" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                   <i className="fa-solid fa-comments mr-1"></i>
                   留言板
                 </a>
               </li>
               {isAuthenticated ? (
                 <>
                    <li>
                      <a href="/tool-management" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                        <i className="fa-solid fa-wrench mr-1"></i>
                        工具管理
                      </a>
                    </li>
                     <li>
                       <a href="/article-management" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                         <i className="fa-solid fa-file-text mr-1"></i>
                         图文管理
                       </a>
                     </li>
                    <li>
                     <button 
                       onClick={logout}
                       className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center"
                     >
                       <i className="fa-solid fa-sign-out-alt mr-1"></i>
                       退出登录
                     </button>
                   </li>
                 </>
               ) : (
                 <li>
                   <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                     <i className="fa-solid fa-user-circle mr-1"></i>
                     管理员登录
                   </a>
                 </li>
               )}
             </ul>
           </nav>

           <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon"></i>
              ) : (
                <i className="fa-solid fa-sun"></i>
              )}
            </button>
            
            <a 
              href="/" 
              className="md:hidden p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="首页"
            >
              <i className="fa-solid fa-home"></i>
            </a>
            <a 
              href="/message-board" 
              className="md:hidden p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="留言板"
            >
              <i className="fa-solid fa-comments"></i>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}