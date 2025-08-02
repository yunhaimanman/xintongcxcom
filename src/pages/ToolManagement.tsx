import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool, ToolCategory, Category, addTool, addCategory, updateCategory, deleteCategory, toolCategories, getTools, updateTool, deleteTool, getCategories } from '@/data/tools';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 工具编辑模态框组件
const ToolEditModal = ({ 
  isOpen, 
  tool, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  tool: Tool | null; 
  onClose: () => void; 
  onSave: (updatedTool: Partial<Omit<Tool, 'id' | 'icon' | 'color'>>) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: toolCategories[0].id as ToolCategory
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        url: tool.url,
        description: tool.description,
        category: tool.category
      });
    }
  }, [tool]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入工具名称');
      return false;
    }
    
    if (!formData.url.trim()) {
      setError('请输入工具网址');
      return false;
    }
    
    try {
      new URL(formData.url);
    } catch (err) {
      setError('请输入有效的网址（需要包含http://或https://）');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('请输入工具描述');
      return false;
    }
    
    return true;
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
      console.error('Failed to update tool:', err);
      toast.error('更新工具失败，请重试');
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {tool ? '编辑工具' : '添加工具'}
                </h3>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    工具名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入工具名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    工具网址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="edit-url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入工具网址 (http:// 或 https://)"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    工具描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入工具描述"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    工具分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {toolCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
                        保存
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
  onClose, 
  onConfirm, 
  toolName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  toolName?: string;
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
                您确定要删除工具 <span className="font-medium text-gray-900 dark:text-white">{toolName}</span> 吗？
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

export default function ToolManagement() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 工具列表状态
  const [tools, setTools] = useState<Tool[]>([]);
  // 添加工具表单状态
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: toolCategories[0].id as ToolCategory
  });
  // 编辑模态框状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  // 删除确认模态框状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: 'fa-folder'
  });
  const [categoryError, setCategoryError] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [selectedIcon, setSelectedIcon] = useState<string>(categoryFormData.icon);
  
  // 可用图标列表
  const availableIcons = [
    'fa-folder', 'fa-wrench', 'fa-code', 'fa-paint-brush', 'fa-bolt', 'fa-cogs', 
    'fa-tools', 'fa-laptop', 'fa-mobile-alt', 'fa-tablet-alt', 'fa-desktop', 
    'fa-server', 'fa-database', 'fa-cloud', 'fa-globe', 'fa-map-marker-alt',
    'fa-file-code', 'fa-pencil-alt', 'fa-image', 'fa-video', 'fa-music', 'fa-camera'
  ];

  // 处理分类表单输入变化
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
    setCategoryError('');
  };

   // 处理分类提交
   const handleCategorySubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     // 简单验证
     if (!categoryFormData.name.trim()) {
       setCategoryError('请输入分类名称');
       return;
     }
     
     setIsCategoryLoading(true);
     
     try {
       if (selectedCategory) {
         // 更新现有分类
         const updatedCategory = updateCategory(selectedCategory.id, categoryFormData);
         if (updatedCategory) {
           toast.success('分类更新成功！');
         } else {
           toast.error('分类更新失败');
         }
       } else {
         // 添加新分类
         const newCategory = addCategory(categoryFormData);
         toast.success('分类添加成功！');
       }
       
       // 重置表单和状态
       setCategoryFormData({
         name: '',
         icon: 'fa-folder'
       });
       setSelectedCategory(null);
       
       // 刷新分类列表
       setCategories(getCategories());
     } catch (err) {
       console.error('Failed to save category:', err);
       toast.error(selectedCategory ? '更新分类失败，请重试' : '添加分类失败，请重试');
     } finally {
       setIsCategoryLoading(false);
       setIsCategoryModalOpen(false);
     }
   };

  // 处理分类编辑
  const handleCategoryEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFormData({
      name: category.name,
      icon: category.icon
    });
    setIsCategoryModalOpen(true);
  };

  // 处理分类删除
  const handleCategoryDelete = (category: Category) => {
    if (window.confirm(`确定要删除分类 "${category.name}" 吗？该分类下的工具将被移至默认分类。`)) {
      try {
        const deleted = deleteCategory(category.id);
        if (deleted) {
          toast.success('分类删除成功！');
          setCategories(getCategories()); // 刷新分类列表
          setTools(getTools()); // 刷新工具列表，因为分类变化可能影响工具
        } else {
          toast.error('分类删除失败，至少保留一个分类');
        }
      } catch (err) {
        console.error('Failed to delete category:', err);
        toast.error('删除分类失败，请重试');
      }
    }
  };


  // 加载工具列表
  useEffect(() => {
    const loadTools = () => {
      setTools(getTools());
    };
    
    loadTools();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  


  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入工具名称');
      return false;
    }
    
    if (!formData.url.trim()) {
      setError('请输入工具网址');
      return false;
    }
    
    // 简单URL验证
    try {
      new URL(formData.url);
    } catch (err) {
      setError('请输入有效的网址（需要包含http://或https://）');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('请输入工具描述');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 添加新工具
      const newTool = addTool(formData);
      
      // 显示成功提示
      toast.success('工具添加成功！');
      
      // 重置表单
      setFormData({
        name: '',
        url: '',
        description: '',
        category: toolCategories[0].id as ToolCategory
      });
      
      // 刷新工具列表
      setTools(getTools());
    } catch (err) {
      console.error('Failed to add tool:', err);
      toast.error('添加工具失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 编辑工具相关函数
  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData: Partial<Omit<Tool, 'id' | 'icon' | 'color'>>) => {
    if (!selectedTool) return;
    
    try {
      const updatedTool = updateTool(selectedTool.id, updatedData);
      if (updatedTool) {
        toast.success('工具更新成功！');
        setTools(getTools()); // 刷新工具列表
      } else {
        toast.error('工具更新失败');
      }
    } catch (err) {
      console.error('Failed to update tool:', err);
      toast.error('更新工具失败，请重试');
    }
  };

  // 删除工具相关函数
  const handleDelete = (tool: Tool) => {
    setToolToDelete(tool);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!toolToDelete) return;
    
    try {
      const deleted = deleteTool(toolToDelete.id);
      if (deleted) {
        toast.success('工具删除成功！');
        setTools(getTools()); // 刷新工具列表
        setIsDeleteModalOpen(false);
        setToolToDelete(null);
      } else {
        toast.error('工具删除失败');
      }
    } catch (err) {
      console.error('Failed to delete tool:', err);
      toast.error('删除工具失败，请重试');
    }
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
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <i className="fa-solid fa-wrench text-blue-500 mr-3"></i>
                工具管理
              </h2>
              
              {/* 新工具管理模块 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-wrench text-blue-500 mr-2"></i>
                  新工具管理
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 工具名称 */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      工具名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="输入工具名称"
                    />
                  </div>
                  
                  {/* 工具网址 */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      工具网址 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="输入工具网址 (http:// 或 https://)"
                    />
                  </div>
                  
                  {/* 工具描述 */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      工具描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="输入工具描述"
                    ></textarea>
                  </div>
                  
                  {/* 工具分类 */}
                   <div>
                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       工具分类 <span className="text-red-500">*</span>
                     </label>
                     <div className="flex space-x-3">
                     <select
                       id="category"
                       name="category"
                       value={formData.category}
                       onChange={handleInputChange}
                       className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                     >
                       {getCategories().map(category => (
                         <option key={category.id} value={category.id}>
                           {category.name}
                         </option>
                       ))}
                      </select>
                      </div>
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
                       className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                     >
                       {isLoading ? (
                         <>
                           <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                           保存中...
                         </>
                       ) : (
                         <>
                           <i className="fa-solid fa-plus-circle mr-2"></i>
                           添加工具
                         </>
                       )}
                     </button>
                     
                     <button
                       type="button"
                       onClick={() => navigate('/')}
                       className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                     >
                       <i className="fa-solid fa-arrow-left mr-1"></i>
                       返回
                     </button>
                   </div>
                </form>
              </div>
              
              {/* 现有工具列表 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-list-ul mr-2"></i>
                  现有工具 ({tools.length})
                </h3>
                
                {tools.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <i className="fa-solid fa-box-open text-3xl mb-3"></i>
                    <p>暂无工具数据，请添加工具</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            工具名称
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            分类
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            网址
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tools.map((tool) => (
                          <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tool.color} mr-3`}>
                                  <i className={`fa-solid ${tool.icon} text-white`}></i>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{tool.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                                {getCategories().find(c => c.id === tool.category)?.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">
                                  {tool.url}
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(tool)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                              >
                                <i className="fa-solid fa-edit mr-1"></i> 编辑
                              </button>
                              <button
                                onClick={() => handleDelete(tool)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                <i className="fa-solid fa-trash mr-1"></i> 删除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {/* 新工具分类管理模块 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-folder text-purple-500 mr-2"></i>
                  新工具分类管理
                </h3>
                
                <form onSubmit={handleCategorySubmit} className="space-y-6 mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        分类名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="category-name"
                        name="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryInputChange as any}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="输入分类名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        分类图标 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                          <i className={`fa-solid ${categoryFormData.icon} text-xl text-purple-600 dark:text-purple-400`}></i>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(null);
                            setIsCategoryModalOpen(true);
                          }}
                          className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center"
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          选择图标
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {categoryError && (
                    <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <i className="fa-solid fa-exclamation-circle mr-2"></i>
                      {categoryError}
                    </div>
                  )}
                  
                   <button
                     type="submit"
                     disabled={isCategoryLoading}
                     className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
                   >
                     {isCategoryLoading ? (
                       <>
                         <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                         {selectedCategory ? '更新中...' : '添加中...'}
                       </>
                     ) : selectedCategory ? (
                       <>
                         <i className="fa-solid fa-save mr-2"></i>
                         更新分类
                       </>
                     ) : (
                       <>
                         <i className="fa-solid fa-plus-circle mr-2"></i>
                         添加分类
                       </>
                     )}
                   </button>
                </form>
                
                {/* 现有分类列表 */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <i className="fa-solid fa-list mr-2 text-gray-500"></i>
                    现有分类 ({categories.length})
                  </h4>
                  
                  {categories.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-folder-open text-3xl mb-3"></i>
                      <p>暂无分类数据，请添加分类</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                              <i className={`fa-solid ${category.icon} text-xl`}></i>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">{category.name}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {tools.filter(t => t.category === category.id).length} 个工具
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCategoryEdit(category)}
                              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                              title="编辑分类"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(category)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="删除分类"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-700 dark:text-blue-300">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  使用说明
                </h3>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>工具管理：添加、编辑和删除工具，分配工具分类</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>分类管理：创建自定义分类，选择分类图标，查看分类下工具数量</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>分类删除：删除分类后，该分类下的工具将自动移至默认分类</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* 图标选择模态框 */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                   {selectedCategory ? '编辑分类图标' : '选择分类图标'}
                 </h3>
                 <button 
                   onClick={() => setIsCategoryModalOpen(false)}
                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                 >
                   <i className="fa-solid fa-times"></i>
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => {
                        setCategoryFormData(prev => ({ ...prev, icon }));
                        setSelectedIcon(icon);
                      }}
                      className={`p-4 rounded-lg transition-all flex flex-col items-center justify-center ${
                        selectedIcon === icon 
                          ? 'bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <i className={`fa-solid ${icon} text-2xl mb-2 ${
                        selectedIcon === icon ? 'text-purple-600 dark:text-purple-400' : ''
                      }`}></i>
                      <span className="text-xs text-center">{icon.replace('fa-', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => {
                    setCategoryFormData(prev => ({ ...prev, icon: selectedIcon }));
                    setIsCategoryModalOpen(false);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  确认选择
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* 编辑工具模态框 */}
      <ToolEditModal
        isOpen={isEditModalOpen}
        tool={selectedTool}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
      
      {/* 删除确认模态框 */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        toolName={toolToDelete?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
      
      {/* 分类管理功能正在开发中 */}
      
      <Footer />
    </div>
  );
}
