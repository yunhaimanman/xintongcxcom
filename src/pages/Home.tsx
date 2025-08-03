import { getCategories, getTools, toolCategories } from '@/data/tools';
import ToolCategory from '@/components/ToolCategory';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const tools = getTools();
  const categories = getCategories();
  const [showTutorial, setShowTutorial] = useState(false); // 默认隐藏部署指南
  
  const { style } = useTheme();
  
  return (
    <div className={`min-h-screen ${style.variables.backgroundColor} ${style.variables.textColor} ${style.variables.shadow || ''} flex flex-col transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <SearchBar />
          
           {/* 网站公告 */}
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 mb-8 max-w-3xl mx-auto">
    <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-700 dark:text-blue-300">
      <i className="fa-solid fa-bullhorn mr-2"></i>
      网站公告
    </h3>
    <p className="text-sm text-blue-600 dark:text-blue-400">
      本次风格设计已完成优化，新增多种视觉风格供选择。网站所有功能已更新，数据存储在本地浏览器中，无需服务器支持即可使用。感谢您的使用与支持！
    </p>
    <div className="mt-4">
      <a 
        href="/article/7" 
        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i className="fa-solid fa-history mr-2"></i>
        查看更新记录
      </a>
    </div>
  </div>
          
           {/* 部署指南内容已移除 */}
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
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">4</span>
                    部署步骤
                  </h4>
                  <div className="pl-8 space-y-6 text-gray-700 dark:text-gray-300">
                    {/* 部署前检查 */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-300 flex items-center">
                        <i className="fa-solid fa-check-circle mr-2"></i>
                        部署前准备与检查
                      </h5>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700 dark:text-blue-400">
                        <li>确保本地可以成功构建: <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">pnpm build</code></li>
                        <li>本地预览构建结果: <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">pnpm preview</code></li>
                        <li>确认项目中包含netlify.toml配置文件</li>
                        <li>确保没有未提交的本地修改</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">选项1: Netlify部署 (推荐)</h5>
                      
                       <div className="mb-4">
                         <h6 className="text-sm font-medium mb-2">方式A: 通过Netlify网站界面部署 (Gitee仓库)</h6>
                         <ol className="list-decimal pl-5 space-y-2 text-sm">
                           <li>访问 <a href="https://app.netlify.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">https://app.netlify.com</a> 并登录</li>
                           <li>点击"New site from Git"</li>
                           <li>选择"Gitee"作为仓库源 (如果没有Gitee选项，点击"Configure the Netlify app on Gitee"进行授权)</li>
                           <li>授权Netlify访问您的Gitee账户后，选择您上传代码的仓库</li>
                           <li>选择要部署的分支 (通常是main或master)</li>
                           <li>构建配置设置:
                             <ul className="list-disc pl-5 mt-1 space-y-1">
                               <li><strong>Build command:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">pnpm build</code></li>
                               <li><strong>Publish directory:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">dist</code></li>
                             </ul>
                           </li>
                           <li>点击"Deploy site"开始部署</li>
                         </ol>
                       </div>
                       
                       <div>
                         <h6 className="text-sm font-medium mb-2">方式B: 通过Netlify CLI部署Gitee仓库 (高级用户)</h6>
                         <ol className="list-decimal pl-5 space-y-2 text-sm">
                           <li>安装Netlify CLI: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">npm install -g netlify-cli</code></li>
                           <li>登录Netlify: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">netlify login</code></li>
                           <li>从Gitee克隆您的仓库: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">git clone https://gitee.com/您的用户名/您的仓库名.git</code></li>
                           <li>进入项目目录: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">cd 您的仓库名</code></li>
                           <li>初始化Netlify项目: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">netlify init</code></li>
                           <li>部署项目: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">netlify deploy --prod</code></li>
                         </ol>
                       </div>
                    </div>
                    
                     <div>
                       <h5 className="font-medium mb-2">选项2: Vercel部署 (Gitee仓库)</h5>
                       <ol className="list-decimal pl-5 space-y-2 text-sm">
                         <li>访问 <a href="https://vercel.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Vercel</a> 并注册账号</li>
                         <li>点击"New Project"</li>
                         <li>在导入仓库页面，点击"Import from Git Repository"下方的"Gitee"选项</li>
                         <li>如果是首次使用，授权Vercel访问您的Gitee账户</li>
                         <li>从列表中选择您上传代码的Gitee仓库</li>
                         <li>框架预设选择"Vite"</li>
                         <li>构建配置确认:
                           <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li><strong>Build Command:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">pnpm build</code></li>
                             <li><strong>Output Directory:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">dist</code></li>
                           </ul>
                         </li>
                         <li>点击"Deploy"开始部署</li>
                       </ol>
                     </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">选项3: 腾讯云部署</h5>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>访问 <a href="https://console.cloud.tencent.com/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">腾讯云控制台</a> 并完成注册和实名认证</li>
                        <li>进入<a href="https://console.cloud.tencent.com/tcb" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">云开发CloudBase</a>服务</li>
                        <li>创建新环境，选择"静态网站托管"类型</li>
                        <li>安装CloudBase CLI: 
                          <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                            npm install -g @cloudbase/cli
                          </div>
                        </li>
                        <li>登录CloudBase: 
                          <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                            tcb login
                          </div>
                        </li>
                        <li>在项目根目录执行构建: 
                          <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                            pnpm build
                          </div>
                        </li>
                        <li>部署到腾讯云: 
                          <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                            tcb hosting deploy dist -e [您的环境ID]
                          </div>
                        </li>
                        <li>访问腾讯云提供的默认域名或绑定自定义域名</li>
                      </ol>
                    </div>
                    
                    
                     <div>
                       <h5 className="font-medium mb-2">选项4: 华为云部署</h5>
                       <ol className="list-decimal pl-5 space-y-2 text-sm">
                         <li>访问 <a href="https://console.huaweicloud.com/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">华为云控制台</a> 并完成注册和实名认证</li>
                         <li>进入<a href="https://console.huaweicloud.com/obs/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">对象存储服务OBS</a>控制台</li>
                         <li>创建OBS桶:
                           <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>选择区域（建议选择离您目标用户最近的区域）</li>
                             <li>设置桶名称（全局唯一）</li>
                             <li>设置存储类别为"标准存储"</li>
                             <li>其他选项保持默认，完成创建</li>
                           </ul>
                         </li>
                         <li>配置静态网站托管:
                           <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>进入创建好的桶，选择"静态网站托管"选项</li>
                             <li>点击"设置静态网站托管"</li>
                             <li>开启"静态网站托管"功能</li>
                             <li>默认首页设置为"index.html"</li>
                             <li>错误页面设置为"index.html"（适配SPA路由）</li>
                             <li>点击"确定"保存配置</li>
                           </ul>
                         </li>
                         <li>安装华为云CLI: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             pip install huaweicloud-sdk-python-obs
                           </div>
                         </li>
                         <li>从Gitee克隆您的仓库: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             git clone https://gitee.com/您的用户名/您的仓库名.git
                           </div>
                         </li>
                         <li>进入项目目录: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             cd 您的仓库名
                           </div>
                         </li>
                         <li>安装依赖并执行构建: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             pnpm install && pnpm build
                           </div>
                         </li>
                         <li>配置华为云凭证: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             hcloud configure set --access-key YOUR_ACCESS_KEY --secret-key YOUR_SECRET_KEY --region YOUR_REGION
                           </div>
                         </li>
                         <li>部署到华为云: 
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             hcloud obs cp --recursive dist/ obs://YOUR_BUCKET_NAME/
                           </div>
                         </li>
                         <li>访问华为云提供的默认域名或绑定自定义域名</li>
                       </ol>
                     </div>
                     
                     <div>
                       <h5 className="font-medium mb-2">选项5: Gitee Pages部署</h5>
                       <ol className="list-decimal pl-5 space-y-2 text-sm">
                         <li>登录您的Gitee账户，进入已上传的仓库</li>
                         <li>点击仓库顶部的"服务"，然后选择"Gitee Pages"</li>
                         <li>在Gitee Pages设置页面:
                           <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>选择构建分支: 通常为main或master</li>
                             <li>选择构建目录: 输入"dist"</li>
                             <li>勾选"强制使用HTTPS"</li>
                           </ul>
                         </li>
                         <li>由于Gitee Pages默认不支持SPA路由，需要创建特殊的404页面:
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             cp dist/index.html dist/404.html
                           </div>
                         </li>
                         <li>提交404.html文件到Gitee:
                           <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                             git add dist/404.html<br/>
                             git commit -m "Add 404.html for SPA routing"<br/>
                             git push
                           </div>
                         </li>
                         <li>返回Gitee Pages设置页面，点击"更新"按钮开始部署</li>
                         <li>部署完成后，通过Gitee提供的域名访问您的网站</li>
                       </ol>
                     </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 mt-4">
                      <h5 className="font-medium mb-1 text-green-800 dark:text-green-300 flex items-center text-sm">
                        <i className="fa-solid fa-lightbulb mr-2"></i>
                        部署提示
                      </h5>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        部署完成后，您将获得一个随机生成的URL（如https://your-project.netlify.app）。您可以在项目设置中绑定自定义域名。
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 部署后设置与常见问题 */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">5</span>
                    部署后设置与常见问题
                  </h4>
                  <div className="pl-8 space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                      <h5 className="font-medium mb-2 text-sm">部署后必要设置</h5>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>访问部署后的网站URL，验证所有功能是否正常</li>
                        <li>在Netlify/Vercel控制台中设置自定义域名 (可选)</li>
                        <li>启用HTTPS (平台通常会自动提供免费SSL证书)</li>
                        <li>设置部署通知 (可选)</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2 text-sm">常见问题与解决方案</h5>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400">Q: 部署成功但页面显示空白？</p>
                          <p className="pl-4">A: 这通常是路由问题。确保Netlify/Vercel配置了SPA重定向规则，将所有请求指向index.html。</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400">Q: 构建失败或依赖安装错误？</p>
                          <p className="pl-4">A: 检查构建日志，确保平台使用了正确的Node.js版本。可以在项目根目录添加.nvmrc文件指定Node版本。</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400">Q: 网站资源加载404错误？</p>
                          <p className="pl-4">A: 检查Vite配置中的base选项是否正确，确保资源路径使用相对路径。</p>
                        </div>
                      </div>
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
               <div className={`p-6 rounded-xl ${style.variables.sectionBg} mb-8 transition-colors duration-300`}>
                 <ToolCategory 
                   category={category} 
                   tools={tools.filter(tool => tool.category === category.id)} 
                 />
               </div>
            </motion.div>
          ))}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}