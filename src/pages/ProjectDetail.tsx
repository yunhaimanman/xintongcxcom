import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getProjectById, joinProject, Project } from '@/data/makers';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function ProjectDetail() {
  const { style } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMaker } = useContext(AuthContext);
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
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
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};
  
  // 获取项目状态样式
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
  
  // 加载项目详情
  const loadProject = () => {
    if (!id) {
      navigate('/maker/projects');
      return;
    }
    
    setLoading(true);
    try {
      const foundProject = getProjectById(id);
      if (!foundProject) {
        toast.error('项目不存在或已被删除');
        navigate('/maker/projects');
        return;
      }
      
      setProject(foundProject);
      
      // 检查当前用户是否为项目成员
      if (currentMaker) {
        setIsMember(
          foundProject.creatorId === currentMaker.id || 
          foundProject.members.includes(currentMaker.id)
        );
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 加入项目
  const handleJoinProject = () => {
    if (!currentMaker || !project) return;
    
    setIsJoining(true);
    
    try {
      joinProject(project.id, currentMaker.id);
      setIsMember(true);
      toast.success('成功加入项目！');
      loadProject(); // 重新加载项目数据
    } catch (error) {
      console.error('Failed to join project:', error);
      toast.error('加入项目失败，请重试');
    } finally {
      setIsJoining(false);
    }
  };
  
  // 页面加载时获取项目详情
  useEffect(() => {
    loadProject();
  }, [id]);
  
  if (loading) {
    return (
      <div className={`min-h-screen ${style.variables.backgroundColor} flex flex-col`}>
        <div className="container mx-auto px-4 py-6">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">加载项目中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
  if (!project) {
    return null;
  }
  
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
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => navigate('/maker/projects')}
                  className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-3xl font-bold">项目详情</h2>
              </div>
              
              <div className={`rounded-xl overflow-hidden ${style.variables.cardColor} ${style.variables.borderColor} shadow-md mb-6`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <i className="fa-solid fa-user text-gray-600 dark:text-gray-400"></i>
                    </div>
                    <div>
                      <div className="font-medium">{project.creatorName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        创建于 {formatDate(project.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">项目描述</h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">项目需求</h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{project.requirements}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">项目标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                        <i className="fa-solid fa-users mr-1"></i>
                        成员: {project.members.length + 1}
                      </span>
                    </div>
                    
                    {project.status === 'open' && (
                      <button
                        onClick={handleJoinProject}
                        disabled={isMember || isJoining}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          isMember
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : isJoining
                            ? 'bg-blue-400 text-white cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isMember ? (
                          <>
                            <i className="fa-solid fa-check mr-1"></i>
                            已加入
                          </>
                        ) : isJoining ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                            处理中...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-user-plus mr-1"></i>
                            加入项目
                          </>
                        )}
                      </button>
                    )}
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