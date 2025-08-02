import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ResourceItem, ResourceCategory, getResourceItems, getResourceCategories, getResourcesByCategory } from '@/data/resources';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function Resources() {
  const { style } = useTheme();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // 获取分类和资料数据
  useEffect(() => {
    const loadCategories = () => {
      setCategories(getResourceCategories());
    };
    
    const loadResources = () => {
      setLoading(true);
      try {
        if (selectedCategory === 'all') {
          setResources(getResourceItems().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
        } else {
          setResources(getResourcesByCategory(selectedCategory).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
        }
      } catch (error) {
        console.error('Failed to load resources:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
    loadResources();
  }, [selectedCategory]);
  
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
              {/* 资料标题区域 */}
              <div className={`mb-12 text-center ${style.variables.sectionBg} p-8 rounded-2xl`}>
                <h1 className={`text-4xl font-bold mb-4 ${style.variables.primaryTextColor}`}>资料中心</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  这里收集了各类实用资源，按分类整理，方便您查找和下载
                </p>
              </div>
              
              {/* 分类导航 */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-tags mr-2 text-blue-500"></i>
                  资料分类
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full transition-colors text-sm font-medium ${
                      selectedCategory === 'all'
                        ? `${style.variables.primaryColor} text-white`
                        : `${style.variables.cardColor} ${style.variables.textColor} hover:${style.variables.secondaryColor}`
                    }`}
                  >
                    全部资料
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full transition-colors text-sm font-medium flex items-center ${
                        selectedCategory === category.id
                          ? `${style.variables.primaryColor} text-white`
                          : `${style.variables.cardColor} ${style.variables.textColor} hover:${style.variables.secondaryColor}`
                      }`}
                    >
                      <i className={`fa-solid ${category.icon} mr-2`}></i>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 资料列表 */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-list mr-2 text-gray-500"></i>
                  {selectedCategory === 'all' ? '全部资料' : 
                    categories.find(cat => cat.id === selectedCategory)?.name || '资料列表'}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({resources.length})
                  </span>
                </h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                  </div>
                ) : resources.length === 0 ? (
                  <div className={`text-center py-16 rounded-xl ${style.variables.cardColor}`}>
                    <div className="text-gray-400 mb-4">
                      <i className="fa-solid fa-folder-open text-4xl"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">该分类下暂无资料</p>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        查看全部资料 <i className="fa-solid fa-arrow-right ml-1"></i>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {resources.map(resource => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl overflow-hidden ${style.variables.cardColor} ${style.variables.borderColor} shadow-md hover:shadow-lg transition-all`}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold mb-2 hover:text-blue-500 transition-colors">
                              {resource.name}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(resource.updatedAt)}
                            </span>
                          </div>
                          
                          {resource.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                              {resource.description}
                            </p>
                          )}
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <i className="fa-solid fa-link mr-2 text-gray-500"></i>
                              云盘链接 ({resource.links.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {resource.links.map(link => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <i className="fa-solid fa-cloud mr-2 text-blue-500"></i>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-white truncate">{link.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</div>
                                  </div>
                                  <i className="fa-solid fa-external-link text-gray-400 ml-2"></i>
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                              {categories.find(cat => cat.id === resource.categoryId)?.name}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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