import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Article, ArticleCategory, getArticles, getArticleCategories, getArticlesByCategory } from '@/data/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function Blog() {
  const { style } = useTheme();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // 获取分类和文章数据
  useEffect(() => {
    const loadCategories = () => {
      setCategories(getArticleCategories());
    };
    
    const loadArticles = () => {
      setLoading(true);
      try {
        if (selectedCategory === 'all') {
          // 获取所有文章并排序
          const allArticles = getArticles();
          // 查找更新记录文章
          const updateRecordArticle = allArticles.find(a => a.id === '7');
          // 其他文章按时间排序
          const otherArticles = allArticles.filter(a => a.id !== '7').sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          // 如果找到更新记录文章，将其放在最前面
          const sortedArticles = updateRecordArticle ? [updateRecordArticle, ...otherArticles] : otherArticles;
          setArticles(sortedArticles);
        } else {
          // 获取分类文章并排序
          const categoryArticles = getArticlesByCategory(selectedCategory);
          // 查找更新记录文章
          const updateRecordArticle = categoryArticles.find(a => a.id === '7');
          // 其他文章按时间排序
          const otherArticles = categoryArticles.filter(a => a.id !== '7').sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          // 如果找到更新记录文章，将其放在最前面
          const sortedArticles = updateRecordArticle ? [updateRecordArticle, ...otherArticles] : otherArticles;
          setArticles(sortedArticles);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
    loadArticles();
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
              {/* 博客标题区域 */}
              <div className={`mb-12 text-center ${style.variables.sectionBg} p-8 rounded-2xl`}>
                <h1 className={`text-4xl font-bold mb-4 ${style.variables.primaryTextColor}`}>博客</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  探索我们的文章分类，发现有价值的内容和见解
                </p>
              </div>
              
              {/* 分类导航 */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-tags mr-2 text-blue-500"></i>
                  文章分类
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
                    全部文章
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
              
              {/* 文章列表 */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <i className="fa-solid fa-newspaper mr-2 text-blue-500"></i>
                    {selectedCategory === 'all' ? '全部文章' : 
                      categories.find(cat => cat.id === selectedCategory)?.name || '文章列表'}
                  </h2>
                  <span className="text-gray-500 dark:text-gray-400">
                    {articles.length} 篇文章
                  </span>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                  </div>
                ) : articles.length === 0 ? (
                  <div className={`text-center py-16 rounded-xl ${style.variables.cardColor}`}>
                    <div className="text-gray-400 mb-4">
                      <i className="fa-solid fa-file-alt text-4xl"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">该分类下暂无文章</p>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        查看全部文章 <i className="fa-solid fa-arrow-right ml-1"></i>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map(article => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl overflow-hidden ${style.variables.cardColor} ${style.variables.borderColor} shadow-md hover:shadow-lg transition-all`}
                      >
                        {article.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                              {categories.find(cat => cat.id === article.categoryId)?.name}
                            </span>
                            <time className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(article.updatedAt)}
                            </time>
                   </div>
                   
                   {article.id === '7' && (
                     <div className="mt-2 inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium">
                       <i className="fa-solid fa-pinned mr-1"></i>置顶
                     </div>
                   )}
                   
                   <h3 className="text-xl font-bold mb-2 hover:text-blue-500 transition-colors">
                            <Link to={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                            {article.content.length > 150 
                              ? article.content.substring(0, 150) + '...' 
                              : article.content}
                          </p>
                          
                          <Link
                            to={`/article/${article.id}`}
                            className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                          >
                            阅读全文
                            <i className="fa-solid fa-arrow-right ml-1.5 text-xs"></i>
                          </Link>
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