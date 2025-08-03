import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects, getTeams, Team } from '@/data/makers';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function MyProjects() {
  const { style } = useTheme();
  const { currentMaker } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 格式化日期
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
    day: 'numeric'
  }).format(dateObj);
};
  
  // 获取项目状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'in_progress':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };
  
  // 获取项目状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return '招募中';
      case 'in_progress':
        return '进行中';
      case 'completed':
        return '已完成';
      default:
        return status;
    }
  };
  
  // 加载我的项目和团队
  const loadMyProjects = () => {
    if (!currentMaker) {
      navigate('/maker');
      return;
    }
    
    setLoading(true);
    
    try {
      const allProjects = getProjects();
      const allTeams = getTeams();
      
      // 我创建的项目
      const createdProjects = allProjects.filter(project => project.creatorId === currentMaker.id);
      
      // 我参与的团队项目
      const teamProjects = allTeams
        .filter(team => team.members.includes(currentMaker.id))
        .map(team => {
          const project = allProjects.find(p => p.id === team.projectId);
          return project ? { ...project, teamName: team.name, isTeamProject: true } : null;
        })
        .filter(Boolean);
        
      // 合并并去重
      const uniqueProjects = [...createdProjects, ...teamProjects].filter(
        (project, index, self) => 
          index === self.findIndex(p => p.id === project.id)
      );
      
      setMyProjects(uniqueProjects);
      setMyTeams(allTeams.filter(team => team.members.includes(currentMaker.id)));
    } catch (error) {
      console.error('Failed to load my projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMyProjects();
  }, [currentMaker]);
  
  return (
    <div className={`min-h-screen ${style.variables.backgroundColor} ${style.variables.textColor} flex flex-col transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => navigate('/maker')}
                  className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-3xl font-bold flex items-center">
                  <i className="fa-solid fa-user-tie text-blue-500 mr-3"></i>
                  我的项目
                </h2>
              </div>
              
              {/* 操作按钮 */}
              <div className="mb-8">
                <button
                  onClick={() => navigate('/maker/projects/publish')}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  发布新项目
                </button>
              </div>
              
              {/* 我创建的项目 */}
              <div className={`mb-10 ${style.variables.cardColor} ${style.variables.borderColor} rounded-xl shadow-md overflow-hidden`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
                    我创建的项目
                  </h3>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                    </div>
                  ) : (
                    <>
                      {myProjects.filter(p => !p.isTeamProject).length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <i className="fa-solid fa-folder-open text-4xl mb-3"></i>
                          <p>您还没有创建任何项目</p>
                          <button
                            onClick={() => navigate('/maker/projects/publish')}
                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-plus mr-1"></i>
                            创建第一个项目
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {myProjects.filter(p => !p.isTeamProject).map(project => (
                            <div key={project.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold hover:text-blue-500 transition-colors">
                                  <Link to={`/maker/projects/${project.id}`}>
                                    {project.title}
                                  </Link>
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
                                  {getStatusText(project.status)}
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
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  创建于 {formatDate(project.createdAt)}
                                </div>
                                
                                <Link 
                                  to={`/maker/projects/${project.id}`}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                >
                                  管理项目
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* 我参与的团队项目 */}
              <div className={`${style.variables.cardColor} ${style.variables.borderColor} rounded-xl shadow-md overflow-hidden`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-users text-purple-500 mr-2"></i>
                    我参与的团队项目
                  </h3>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                    </div>
                  ) : (
                    <>
                      {myProjects.filter(p => p.isTeamProject).length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <i className="fa-solid fa-users text-4xl mb-3"></i>
                          <p>您还没有参与任何团队项目</p>
                          <button
                            onClick={() => navigate('/maker/projects')}
                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-search mr-1"></i>
                            浏览项目并加入
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {myProjects.filter(p => p.isTeamProject).map(project => (
                            <div key={project.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="text-xl font-bold hover:text-blue-500 transition-colors">
                                    <Link to={`/maker/projects/${project.id}`}>
                                      {project.title}
                                    </Link>
                                  </h3>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    团队: {project.teamName}
                                  </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
                                  {getStatusText(project.status)}
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
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  加入于 {formatDate(new Date(project.createdAt))}
                                </div>
                                
                                <Link 
                                  to={`/maker/projects/${project.id}`}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                >
                                  查看详情
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
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