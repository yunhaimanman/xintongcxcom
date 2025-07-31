import { getCategories, getTools, toolCategories } from '@/data/tools';
import ToolCategory from '@/components/ToolCategory';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const tools = getTools();
  const categories = getCategories();
  const [showTutorial, setShowTutorial] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <SearchBar />
          
          {/* 执行教程按钮 */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <i className="fa-solid fa-book mr-2"></i>
              {showTutorial ? '隐藏执行教程' : '查看执行教程'}
            </button>
          </div>
          
          {/* 执行教程卡片 */}
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10 max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">项目执行教程</h3>
              
              <div className="space-y-6">
                {/* 前提条件 */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                    前提条件
                  </h4>
                  <ul className="pl-8 space-y-2 text-gray-700 dark:text-gray-300 list-disc">
                    <li>安装Node.js (v14.0.0或更高版本)</li>
                    <li>安装pnpm包管理器</li>
                    <li>代码编辑器（推荐VS Code）</li>
                  </ul>
                </div>
                
                {/* 本地开发环境搭建 */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                    本地开发环境搭建
                  </h4>
                  <ol className="pl-8 space-y-3 text-gray-700 dark:text-gray-300 list-decimal">
                    <li>克隆项目代码到本地</li>
                    <li>打开终端，进入项目目录</li>
                    <li>安装依赖包:
                      <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                        pnpm install
                      </div>
                    </li>
                    <li>启动开发服务器:
                      <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                        pnpm dev
                      </div>
                    </li>
                    <li>在浏览器中访问: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:3000</code></li>
                  </ol>
                </div>
                
                {/* 项目构建 */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                    项目构建
                  </h4>
                  <p className="pl-8 text-gray-700 dark:text-gray-300 mb-2">生成生产环境代码:</p>
                  <div className="pl-8">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                      pnpm build
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">构建后的文件将保存在 <code>dist</code> 目录中</p>
                  </div>
                </div>
                
                {/* 部署步骤 */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">4</span>
                    部署步骤
                  </h4>
                  <div className="pl-8 space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                      <h5 className="font-medium mb-1">选项1: Netlify部署</h5>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>访问 <a href="https://www.netlify.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Netlify</a> 并注册账号</li>
                        <li>点击"New site from Git"</li>
                        <li>选择项目仓库</li>
                        <li>构建命令设置为: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">pnpm build</code></li>
                        <li>发布目录设置为: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">dist</code></li>
                        <li>点击"Deploy site"</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">选项2: Vercel部署</h5>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>访问 <a href="https://vercel.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Vercel</a> 并注册账号</li>
                        <li>点击"New Project"</li>
                        <li>导入项目仓库</li>
                        <li>框架预设选择"Vite"</li>
                        <li>构建命令设置为: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">pnpm build</code></li>
                        <li>输出目录设置为: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">dist</code></li>
                        <li>点击"Deploy"</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                {/* 管理员登录 */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">5</span>
                    管理员登录
                  </h4>
                  <div className="pl-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">默认管理员账号:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">用户名</p>
                        <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">admin</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">密码</p>
                        <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">admin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* 工具分类展示 */}
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * toolCategories.indexOf(category) }}
            >
              <ToolCategory 
                category={category} 
                tools={tools.filter(tool => tool.category === category.id)} 
              />
            </motion.div>
          ))}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}