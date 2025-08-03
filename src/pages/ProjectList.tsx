import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects, Project, defaultProjects } from '@/data/makers';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function ProjectList() {
  const { style } = useTheme();
  const { currentMaker } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // 格式化日期
const formatDate = (date: Date) => {
  // 检查日期是否有效
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
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
  
  // 加载项目列表
  const loadProjects = () => {
    console.log('Attempting to load projects...');
    setLoading(true);
    try {
      // 获取所有项目
      const allProjects = getProjects();
      console.log('All projects:', allProjects);
      
      // 确保有项目数据，没有则使用默认项目
      const projectsToLoad = allProjects.length > 0 ? allProjects : defaultProjects;
      console.log('Projects to load:', projectsToLoad);
      
      // 验证并修复日期对象
      const validProjects = projectsToLoad.map(project => ({
        ...project,
        createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
      })).filter(project => !isNaN(project.createdAt.getTime()));
      
      // 根据筛选条件过滤项目
      let filteredProjects = validProjects;
      
      // 我的项目筛选
      if (activeFilter === 'my' && currentMaker) {
        console.log('Filtering my projects for maker:', currentMaker.id);
        filteredProjects = projectsToLoad.filter(
          project => project.creatorId === currentMaker.id || project.members.includes(currentMaker.id)
        );
        console.log('My projects:', filteredProjects);
      } else if (activeFilter === 'all') {
        console.log('Showing all projects');
      }
      
      // 搜索词过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
        );
        console.log(`Filtered projects with query "${searchQuery}":`, filteredProjects);
      }
      
      // 按创建时间排序，最新的在前
      filteredProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setProjects(filteredProjects);
      console.log('Successfully loaded projects:', filteredProjects);
    } catch (error) {
      console.error('Detailed error loading projects:', error);
      console.error('Error type:', typeof error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
      
      // 强制使用默认项目作为最后的备选方案
      console.log('Forcing default projects to load');
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };
  
  // 页面加载和筛选条件变化时重新加载项目
  // 添加更全面的依赖项以确保数据正确刷新
  useEffect(() => {
    console.log('useEffect triggered - loading projects');
    loadProjects();
  }, [activeFilter, searchQuery, currentMaker]);
  
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
                  <i className="fa-solid fa-list-ul text-blue-500 mr-3"></i>
                  项目列表
                </h2>
              </div>
              
              {/* 搜索和筛选 */}
              <div className={`p-4 rounded-xl ${style.variables.cardColor} ${style.variables.borderColor} shadow-md mb-6`}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa-solid fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="搜索项目..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-3 rounded-lg transition-colors ${
                        activeFilter === 'all'
                          ? `${style.variables.primaryColor} text-white`
                          : `${style.variables.textColor} ${style.variables.cardColor} hover:bg-gray-100 dark:hover:bg-gray-700`
                      }`}
                    >
                      全部项目
                    </button>
                    
                    <button
                      onClick={() => setActiveFilter('my')}
                      className={`px-4 py-3 rounded-lg transition-colors ${
                        activeFilter === 'my'
                          ? `${style.variables.primaryColor} text-white`
                          : `${style.variables.textColor} ${style.variables.cardColor} hover:bg-gray-100 dark:hover:bg-gray-700`
                      }`}
                    >
                      我的项目
                    </button>
                    
                    <button
                      onClick={() => navigate('/maker/projects/publish')}
                      className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-plus mr-1"></i>
                      发布项目
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 项目列表 */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">加载项目中...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className={`text-center py-16 rounded-xl ${style.variables.cardColor}`}>
                  <div className="text-gray-400 mb-4">
                    <i className="fa-solid fa-folder-open text-4xl"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">暂无项目数据</p>
                  <button
                    onClick={() => navigate('/maker/projects/publish')}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-plus mr-1"></i>
                    发布第一个项目
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {projects.map(project => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl overflow-hidden transition-all ${style.variables.cardColor} ${style.variables.borderColor} shadow-md hover:shadow-lg`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <Link to={`/maker/projects/${project.id}`} className="hover:text-blue-500 transition-colors">
                            <div className="flex items-center">
                              <h3 className="text-xl font-bold">{project.title}</h3>
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                project.creatorId === currentMaker?.id
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                              }`}>
                                {project.creatorId === currentMaker?.id ? '已发布' : '已加入'}
                              </span>
                            </div>
                          </Link>
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
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-user text-gray-600 dark:text-gray-400"></i>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {project.creatorName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(project.createdAt)}
                            </div>
                            
                            <Link 
                              to={`/maker/projects/${project.id}`}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                            >
                              查看详情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}