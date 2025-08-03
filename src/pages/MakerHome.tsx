import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { getProjects } from '@/data/makers';
import ProjectList from './ProjectList';
import ProjectPublish from './ProjectPublish';
import ProjectDetail from './ProjectDetail';
import { getMakers } from '@/data/makers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function MakerHome() {
  const { style } = useTheme();
  const { isAuthenticated, userRole, currentMaker } = useContext(AuthContext);
  const projects = getProjects();
  const makers = getMakers();
  
  // 检查用户是否是已授权的创客
  const isAuthorizedMaker = userRole === 'maker' && currentMaker?.isAuthorized;
  
  return (
    <div className={style.variables.backgroundColor + " min-h-screen " + style.variables.textColor + " flex flex-col transition-colors duration-300"}>
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              {/* 创客板块头部 */}
              <div className={style.variables.sectionBg + " mb-12 text-center rounded-xl p-8"}>
                <h1 className={style.variables.primaryTextColor + " text-4xl font-bold mb-4"}>创客空间</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                  连接创意与资源，打造创业合作平台。在这里，您可以找到志同道合的合作伙伴，共同实现创新项目。
                </p>
                
                {!isAuthenticated ? (
                  <div className="flex justify-center gap-4">
                    <Link 
                      to="/maker/apply" 
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-user-plus mr-2"></i>立刻入驻
                    </Link>
                     <Link 
                       to="/login?type=maker" 
                       className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                     >
                       <i className="fa-solid fa-sign-in-alt mr-2"></i>创客登录
                     </Link>
                  </div>
                ) : !isAuthorizedMaker ? (
                  <div className="flex justify-center gap-4">
                    <Link 
                      to="/maker/apply" 
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-user-plus mr-2"></i>申请入驻
                    </Link>
                    <Link 
                      to="/login?type=maker" 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-sign-in-alt mr-2"></i>创客登录
                    </Link>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Link 
                      to="/maker/projects/publish" 
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-lightbulb mr-2"></i>发布项目
                    </Link>
                    <Link 
                      to="/maker/projects" 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-list-ul mr-2"></i>浏览项目
                    </Link>
                    <Link 
                      to="/maker/my-projects" 
                      className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-user-tie mr-2"></i>我的项目
                    </Link>
                  </div>
                )}
              </div>
              
              {/* 创客数据概览 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className={style.variables.cardColor + " " + style.variables.borderColor + " p-6 rounded-xl shadow-md"}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">活跃创客</p>
                      <h3 className="text-3xl font-bold mt-1">{makers.length}</h3>
                    </div>
                    <div className={style.variables.secondaryColor + " p-3 rounded-full"}>
                      <i className={style.variables.primaryTextColor + " fa-solid fa-users text-xl"}></i>
                    </div>
                  </div>
                </div>
                
                <div className={style.variables.cardColor + " " + style.variables.borderColor + " p-6 rounded-xl shadow-md"}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">合作项目</p>
                      <h3 className="text-3xl font-bold mt-1">{projects.length}</h3>
                    </div>
                    <div className={style.variables.secondaryColor + " p-3 rounded-full"}>
                      <i className={style.variables.primaryTextColor + " fa-solid fa-project-diagram text-xl"}></i>
                    </div>
                  </div>
                </div>
                
                <div className={style.variables.cardColor + " " + style.variables.borderColor + " p-6 rounded-xl shadow-md"}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">创意积分</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {currentMaker ? currentMaker.积分 : '0'}
                      </h3>
                    </div>
                    <div className={style.variables.secondaryColor + " p-3 rounded-full"}>
                      <i className={style.variables.primaryTextColor + " fa-solid fa-star text-xl"}></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 最新项目展示 */}
              <div className={style.variables.cardColor + " " + style.variables.borderColor + " mb-10 rounded-xl shadow-md overflow-hidden"}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold flex items-center">
                    <i className="fa-solid fa-lightbulb text-yellow-500 mr-3"></i>
                    最新项目
                  </h2>
                </div>
                
                <div className="p-6">
                  {projects.length > 0 ? (
                    <div className="space-y-6">
                      {projects.slice(0, 3).map(project => {
                        const creator = makers.find(m => m.id === project.creatorId);
                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold hover:text-blue-500 transition-colors">
                                <Link to={`/maker/projects/${project.id}`}>
                                  {project.title}
                                </Link>
                              </h3>
                              <span className={project.status === 'open' 
                                  ? 'px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                                  : project.status === 'in_progress'
                                  ? 'px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                                  : 'px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}>
                                {project.status === 'open' ? '招募中' : project.status === 'in_progress' ? '进行中' : '已完成'}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                                  <i className="fa-solid fa-user text-gray-600 dark:text-gray-400"></i>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {creator?.name || '未知创建者'}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(project.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-box-open text-4xl mb-3"></i>
                      <p>暂无项目数据，成为第一个发布项目的创客吧！</p>
                    </div>
                  )}
                  
                  {projects.length > 3 && (
                    <div className="text-center mt-8">
                      <Link 
                        to="/maker/projects" 
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        查看全部项目 <i className="fa-solid fa-arrow-right ml-2"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 创客权益说明 */}
              <div className={style.variables.sectionBg + " rounded-xl p-8"}>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <i className="fa-solid fa-award text-blue-500 mr-3"></i>
                  创客权益
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                      <i className="fa-solid fa-handshake text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">项目合作</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      发布创意项目，寻找合作伙伴，组建创业团队，共同实现创新想法。
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                      <i className="fa-solid fa-star text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">创意积分</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      参与项目合作可获得创意积分，积分可用于兑换多种权益和资源支持。
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                      <i className="fa-solid fa-network-wired text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">资源对接</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      优质项目有机会获得资源对接和孵化支持，加速项目落地和发展。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}