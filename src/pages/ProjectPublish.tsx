import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { addProject } from '@/data/makers';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function ProjectPublish() {
  const { style } = useTheme();
  const { currentMaker } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('请输入项目标题');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('请输入项目描述');
      return false;
    }
    
    if (!formData.requirements.trim()) {
      setError('请输入项目需求');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!currentMaker) {
      toast.error('请先登录');
      navigate('/login?type=maker');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 处理标签
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // 添加项目
      addProject({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        tags: tags.length > 0 ? tags : ['未分类'],
        creatorId: currentMaker.id,
        creatorName: currentMaker.name,
        status: 'open'
      });
      
      toast.success('项目发布成功！');
      navigate('/maker/projects');
    } catch (err) {
      console.error('Failed to publish project:', err);
      toast.error('发布项目失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => navigate('/maker')}
                  className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-3xl font-bold flex items-center">
                  <i className="fa-solid fa-lightbulb text-yellow-500 mr-3"></i>
                  发布新项目
                </h2>
              </div>
              
              <div className={`rounded-xl overflow-hidden ${style.variables.cardColor} ${style.variables.borderColor} shadow-md`}>
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目标题 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="输入项目标题"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目描述 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="详细描述您的项目"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目需求 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="描述项目所需的技能、资源或团队成员"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目标签
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="输入标签，用逗号分隔（如：AI,应用开发,前端）"
                      />
                    </div>
                    
                    {error && (
                      <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <i className="fa-solid fa-exclamation-circle mr-2"></i>
                        {error}
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate('/maker')}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <i className="fa-solid fa-times mr-1"></i>
                        取消
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            发布中...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane mr-2"></i>
                            发布项目
                          </>
                        )}
                      </button>
                    </div>
                  </form>
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