import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

export default function Header() {
  const { theme, toggleTheme, style } = useTheme();
  const { isAuthenticated, username, logout, userRole } = useContext(AuthContext);
  
  return (
     <header className={`fixed top-0 left-0 right-0 z-50 py-6 ${style.variables.borderColor} ${style.variables.headerBg || ''} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <h1 className={`text-3xl font-bold ${style.variables.primaryTextColor}`}>
               小桐导航
             </h1>
            <p className={`mt-1 ${style.variables.textColor}`}>我们一直在路上</p>
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
                     <a href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                       <i className="fa-solid fa-blog mr-1"></i>
                       博客
                     </a>
                   </li>
                   <li>
                     <a href="/resources" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                       <i className="fa-solid fa-database mr-1"></i>
                       资料
                     </a>
                   </li>
                   <li>
                     <a href="/message-board" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                       <i className="fa-solid fa-comments mr-1"></i>
                       留言
                     </a>
                   </li>
                    <li>
                       <a href="/maker" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                         <i className="fa-solid fa-lightbulb mr-1"></i>
                         创客
                      </a>
                    </li>
                  {isAuthenticated ? (
                    <>
                      {/* 仅管理员显示管理菜单 */}
                      {userRole === 'admin' && (
                        <li className="relative group">
                          <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <i className="fa-solid fa-cog mr-1"></i>
                       控制台
                            <i className="fa-solid fa-chevron-down ml-1 text-xs transition-transform group-hover:rotate-180"></i>
                          </button>
                          {/* 下拉菜单内容 */}
                          <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95">
                            <li>
                              <a href="/tool-management" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-wrench mr-2"></i>工具管理
                              </a>
                            </li>
                            <li>
                              <a href="/resource-management" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-database mr-2"></i>资料管理
                              </a>
                            </li>
                            <li>
                              <a href="/style-management" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-palette mr-2"></i>风格管理
                              </a>
                            </li>
                            <li>
                              <a href="/article-management" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-file-text mr-2"></i>图文管理
                              </a>
                            </li>
                             <li>
                               <a href="/database-management" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                 <i className="fa-solid fa-database mr-2"></i>数据库管理
                               </a>
                             </li>
                             <li>
                               <a href="/maker/manage" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                 <i className="fa-solid fa-users mr-2"></i>创客管理
                               </a>
                             </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                            <li>
                              <button 
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                              </button>
                            </li>
                          </ul>
                        </li>
                      )}
                      
                      {/* 创客显示个人信息 */}
                      {userRole === 'maker' && (
                        <li className="relative group">
                          <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <i className="fa-solid fa-user mr-1"></i>
                            {username}
                            <i className="fa-solid fa-chevron-down ml-1 text-xs transition-transform group-hover:rotate-180"></i>
                          </button>
                          <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95">
                            <li>
                              <a href="/maker/projects" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-list-ul mr-2"></i>我的项目
                              </a>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                            <li>
                              <button 
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                              </button>
                            </li>
                          </ul>
                        </li>
                      )}
                    </>
                   ) : (
                     <li>
                        <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                          <i className="fa-solid fa-user-circle mr-1"></i>
                          登录
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
             
               <nav className="md:hidden flex justify-around w-full">
                 <a 
                   href="/" 
                   className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   aria-label="首页"
                 >
                   <i className="fa-solid fa-home text-sm"></i>
                 </a>
                 <a 
                   href="/blog" 
                   className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   aria-label="博客"
                 >
                   <i className="fa-solid fa-blog text-sm"></i>
                 </a>
                 <a 
                   href="/resources" 
                   className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   aria-label="资料"
                 >
                   <i className="fa-solid fa-database text-sm"></i>
                 </a>
                 <a 
                   href="/maker" 
                   className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   aria-label="创客"
                 >
                   <i className="fa-solid fa-lightbulb text-sm"></i>
                 </a>
               </nav>

           </div>

         </div>
       </div>
     </header>
  );
}