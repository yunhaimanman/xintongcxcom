import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, ArticleCategory, getArticles, addArticle, updateArticle, deleteArticle, getArticleCategories, getArticlesByCategory } from '@/data/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 文章编辑模态框组件
const ArticleEditModal = ({ 
  isOpen, 
  article, 
  categories,
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  article: Article | null; 
  categories: ArticleCategory[];
  onClose: () => void; 
  onSave: (updatedArticle: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void; 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: categories[categories.length > 0 ? 0 : -1]?.id || '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        categoryId: article.categoryId,
        imageUrl: article.imageUrl || ''
      });
      setImagePreview(article.imageUrl || null);
    } else {
      setFormData({
        title: '',
        content: '',
        categoryId: categories[categories.length > 0 ? 0 : -1]?.id || '',
        imageUrl: ''
      });
      setImagePreview(null);
    }
  }, [article, categories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 如果是图片URL，更新预览
    if (name === 'imageUrl') {
      setImagePreview(value || null);
    }
    
    setError('');
  };
  
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('请输入文章标题');
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('请输入文章内容');
      return false;
    }
    
    if (!formData.categoryId) {
      setError('请选择文章分类');
      return false;
    }
    
    // 图片URL验证（如果提供）
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      setError('请输入有效的图片URL');
      return false;
    }
    
    return true;
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save article:', err);
      toast.error('保存文章失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {article ? '编辑文章' : '添加文章'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="article-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    文章标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="article-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入文章标题"
                  />
                </div>
                
                <div>
                  <label htmlFor="article-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    文章分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="article-category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="article-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    图片URL
                  </label>
                  <input
                    type="text"
                    id="article-image"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入图片URL（可选）"
                  />
                  
                  {imagePreview && (
                    <div className="mt-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <img 
                        src={imagePreview} 
                        alt="预览" 
                        className="max-w-full max-h-64 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="article-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    文章内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="article-content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入文章内容"
                  ></textarea>
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <i className="fa-solid fa-exclamation-circle mr-2"></i>
                    {error}
                  </div>
                )}
                
                <div className="flex space-x-4 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        保存中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save mr-2"></i>
                        保存文章
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <i className="fa-solid fa-times mr-1"></i>
                    取消
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 确认删除模态框
const ConfirmDeleteModal = ({ 
  isOpen, 
  articleTitle,
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  articleTitle?: string;
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <i className="fa-solid fa-exclamation-triangle text-xl mr-3"></i>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">确认删除</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您确定要删除文章 <span className="font-medium text-gray-900 dark:text-white">{articleTitle}</span> 吗？
                此操作无法撤销。
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  删除
                </button>
                
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors py-3 px-4"
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function ArticleManagement() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>(getArticles());
  const [categories, setCategories] = useState<ArticleCategory[]>(getArticleCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  
  // 加载文章数据
  useEffect(() => {
    loadArticles();
    setCategories(getArticleCategories());
  }, [selectedCategory]);
  
  // 加载文章，支持按分类筛选
  const loadArticles = () => {
    if (selectedCategory === 'all') {
      setArticles(getArticles());
    } else {
      setArticles(getArticlesByCategory(selectedCategory));
    }
  };
  
  // 处理添加/编辑文章
  const handleSaveArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedArticle) {
        // 更新现有文章
        const updatedArticle = updateArticle(selectedArticle.id, articleData);
        if (updatedArticle) {
          toast.success('文章更新成功！');
        } else {
          toast.error('文章更新失败');
        }
      } else {
        // 添加新文章
        addArticle(articleData);
        toast.success('文章添加成功！');
      }
      
      loadArticles(); // 刷新文章列表
    } catch (err) {
      console.error('Failed to save article:', err);
      toast.error(selectedArticle ? '更新文章失败，请重试' : '添加文章失败，请重试');
    }
  };
  
  // 处理编辑文章
  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };
  
  // 处理删除文章
  const handleDelete = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };
  
  // 确认删除文章
  const confirmDelete = () => {
    if (!articleToDelete) return;
    
    try {
      const deleted = deleteArticle(articleToDelete.id);
      if (deleted) {
        toast.success('文章删除成功！');
        loadArticles(); // 刷新文章列表
      } else {
        toast.error('文章删除失败');
      }
      
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error('Failed to delete article:', err);
      toast.error('删除文章失败，请重试');
    }
  };
  
  // 格式化日期时间
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
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
            <div className="max-w-4xl mx-auto">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                 <h2 className="text-3xl font-bold flex items-center">
                   <i className="fa-solid fa-file-text text-blue-500 mr-3"></i>
                   文章管理
                 </h2>
                 <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                   <button
                     onClick={() => {
                       setSelectedArticle(null);
                       setIsEditModalOpen(true);
                     }}
                     className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center flex-shrink-0"
                   >
                     <i className="fa-solid fa-plus mr-2"></i>
                     添加文章
                   </button>
                   
                   <button
                     onClick={() => navigate('/article-category-management')}
                     className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center flex-shrink-0"
                   >
                     <i className="fa-solid fa-tags mr-2"></i>
                     分类管理
                   </button>
                   
                   {/* 数据导入按钮 */}
                   <button
                     onClick={() => {
                       // 实现导入功能
                       const input = document.createElement('input');
                       input.type = 'file';
                       input.accept = '.json';
                       input.onchange = (e: any) => {
                         const file = e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onload = (event) => {
                             try {
                               const articles = JSON.parse(event.target?.result as string);
                               // 保存导入的文章数据
                               localStorage.setItem('articles', JSON.stringify(articles));
                               toast.success('文章数据导入成功！');
                               loadArticles();
                             } catch (error) {
                               toast.error('导入失败，请确保文件格式正确');
                             }
                           };
                           reader.readAsText(file);
                         }
                       };
                       input.click();
                     }}
                     className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center flex-shrink-0"
                   >
                     <i className="fa-solid fa-upload mr-2"></i>
                     导入数据
                   </button>
                   
                   {/* 数据导出按钮 */}
                   <button
                     onClick={() => {
                       // 实现导出功能
                       const articles = selectedCategory === 'all' ? getArticles() : getArticlesByCategory(selectedCategory);
                       const jsonStr = JSON.stringify(articles, null, 2);
                       const blob = new Blob([jsonStr], { type: 'application/json' });
                       const url = URL.createObjectURL(blob);
                       const a = document.createElement('a');
                       a.href = url;
                       a.download = `articles_${new Date().toISOString().slice(0,10)}.json`;
                       document.body.appendChild(a);
                       a.click();
                       document.body.removeChild(a);
                       URL.revokeObjectURL(url);
                       toast.success('文章数据导出成功！');
                     }}
                     className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center flex-shrink-0"
                   >
                     <i className="fa-solid fa-download mr-2"></i>
                     导出数据
                   </button>
                 </div>
              </div>
              
              {/* 分类筛选 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">分类筛选:</span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    全部文章
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <i className={`fa-solid ${category.icon} mr-1.5`}></i>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 文章列表 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-list-ul mr-2"></i>
                    文章列表 ({articles.length})
                  </h3>
                </div>
                
                {articles.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <i className="fa-solid fa-file-alt text-4xl mb-3"></i>
                    <p>暂无文章数据，请添加文章</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            标题
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            分类
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            更新时间
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {articles.map((article) => {
                          const category = categories.find(c => c.id === article.categoryId);
                          return (
                            <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-start">
                                  {article.imageUrl && (
                                    <img 
                                      src={article.imageUrl} 
                                      alt={article.title} 
                                      className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{article.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md">
                                      {article.content.length > 80 
                                        ? article.content.substring(0, 80) + '...' 
                                        : article.content}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                      {category?.name || '未分类'}
                       {article.id === '15' && <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full text-[10px]">重点文章</span>}
                     </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(article.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button
                                 onClick={() => handleEdit(article)}
                                 className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                               >
                                 <i className="fa-solid fa-edit mr-1"></i> 编辑
                               </button>
                               <button
                                 onClick={() => navigate(`/article/${article.id}`)}
                                 className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                               >
                                 <i className="fa-solid fa-eye mr-1"></i> 查看
                               </button>
                               <button
                                 onClick={() => handleDelete(article)}
                                 className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                               >
                                 <i className="fa-solid fa-trash mr-1"></i> 删除
                               </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* 文章编辑模态框 */}
      <ArticleEditModal
        isOpen={isEditModalOpen}
        article={selectedArticle}
        categories={categories}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveArticle}
      />
      
      {/* 删除确认模态框 */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        articleTitle={articleToDelete?.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <Footer />
    </div>
  );
}