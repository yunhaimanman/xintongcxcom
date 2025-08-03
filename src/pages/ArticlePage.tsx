import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Article, getArticles, getArticlesByCategory, getArticleCategories } from '@/data/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import { ArticleCategory, defaultArticles } from '@/data/articles';

export default function ArticlePage() {
  const { style } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
// 获取文章内容
useEffect(() => {
  if (!id) {
    setError('无效的文章链接');
    setLoading(false);
    return;
  }
  
  try {
    // 获取所有文章和分类
    const allArticles = getArticles();
    const allCategories = getArticleCategories();
    
    // 根据ID查找文章
    const foundArticle = allArticles.find(art => art.id === id);
    
    if (foundArticle) {
      setArticle(foundArticle);
      setCategories(allCategories);
      
      // 获取相关文章（同分类但不同ID）
      const related = allArticles
        .filter(art => art.categoryId === foundArticle.categoryId && art.id !== id)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 4);
        
      setRelatedArticles(related);
    } else {
      // 特别处理"更新记录"文章不存在的情况
      if (id === '7') {
        setError('更新记录文章不存在，正在尝试恢复...');
        
        // 尝试从默认文章中恢复
        const defaultArticle = defaultArticles.find(a => a.id === '7');
        if (defaultArticle) {
          // 添加到localStorage
          const articles = [...allArticles, defaultArticle];
          localStorage.setItem('articles', JSON.stringify(articles));
          
          // 重新加载文章
          setArticle(defaultArticle);
          setCategories(allCategories);
          setError(''); // 清除错误
        }
      } else {
        setError('未找到指定文章');
      }
    }
  } catch (err) {
    console.error('Failed to fetch article:', err);
    setError('获取文章失败，请重试');
  } finally {
    setLoading(false);
  }
}, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="container mx-auto px-4 py-6">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载文章中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="container mx-auto px-4 py-6">
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md w-full">
              <i className="fa-solid fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">文章不存在</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error || '未能找到请求的文章内容'}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-home mr-2"></i>返回首页
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
  // 获取分类名称
  const categoryName = getArticleCategories().find(cat => cat.id === article.categoryId)?.name || '未分类';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
               {/* 文章头部 */}
               <div className="mb-8">
                 <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                   <Link to="/blog" className="hover:text-blue-500 transition-colors">
                     <i className="fa-solid fa-blog mr-1"></i>博客
                   </Link>
                   <i className="fa-solid fa-angle-right mx-2 text-xs"></i>
                   <Link to={`/blog?category=${article.categoryId}`} className="hover:text-blue-500 transition-colors">
                     {categoryName}
                   </Link>
                   <i className="fa-solid fa-angle-right mx-2 text-xs"></i>
                   <span>{article.title.substring(0, 30)}...</span>
                 </div>
                 
                 <div className="text-center">
                   <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                     {categoryName}
                   </span>
                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                     {article.title}
                   </h1>
                   <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                     <i className="fa-solid fa-calendar mr-1"></i>
                     <time dateTime={article.updatedAt.toISOString()}>
                       {formatDate(article.updatedAt)}
                     </time>
                   </div>
                 </div>
               </div>
              
              {/* 文章图片 */}
              {article.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              {/* 文章内容 */}
              <article className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-10">
                {/* 这里我们将简单地按换行符分割文本，实际应用中可能需要更复杂的HTML渲染 */}
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </article>
              
               {/* 相关文章 */}
               <div className={`mt-16 ${style.variables.sectionBg} rounded-xl p-8`}>
                 <h3 className="text-2xl font-bold mb-6">相关文章</h3>
                 
                 {relatedArticles.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {relatedArticles.map(article => (
                       <motion.div
                         key={article.id}
                         whileHover={{ y: -5 }}
                         transition={{ duration: 0.3 }}
                         className={`p-5 ${style.variables.cardColor} rounded-lg shadow-sm hover:shadow-md transition-shadow`}
                       >
                         <h4 className="font-semibold text-lg mb-2 hover:text-blue-500 transition-colors">
                           <Link to={`/article/${article.id}`}>
                             {article.title}
                           </Link>
                         </h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                           {article.content.substring(0, 100)}...
                         </p>
                         <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                           <span>
                             <i className="fa-solid fa-calendar mr-1"></i>
                             {formatDate(article.updatedAt)}
                           </span>
                           <span>
                             {categories.find(cat => cat.id === article.categoryId)?.name}
                           </span>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                     暂无相关文章
                   </p>
                 )}
               </div>
               
               {/* 返回按钮 */}
               <div className="text-center mb-12 mt-10">
                 <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-5 py-3 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  返回上一页
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}