import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourceCategory, getResourceCategories, addResourceCategory, updateResourceCategory, deleteResourceCategory } from '@/data/resources';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 图标选择模态框组件
const IconSelectionModal = ({ 
  isOpen, 
  selectedIcon,
  onClose, 
  onSelectIcon 
}: { 
  isOpen: boolean; 
  selectedIcon: string;
  onClose: () => void; 
  onSelectIcon: (icon: string) => void; 
}) => {
  // 可用图标列表
  const availableIcons = [
    'fa-folder', 'fa-database', 'fa-file-text', 'fa-file-alt', 'fa-book', 
    'fa-book-open', 'fa-tags', 'fa-tag', 'fa-cloud', 'fa-cloud-download-alt',
    'fa-download', 'fa-file-archive', 'fa-file-pdf', 'fa-file-image', 'fa-file-video',
    'fa-file-audio', 'fa-file-code', 'fa-laptop', 'fa-server', 'fa-tools'
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">选择分类图标</h3>
              <button 
                onClick={onClose}
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
                    onClick={() => onSelectIcon(icon)}
                    className={`p-4 rounded-lg transition-all flex flex-col items-center justify-center ${
                      selectedIcon === icon 
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <i className={`fa-solid ${icon} text-2xl mb-2 ${
                      selectedIcon === icon ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}></i>
                    <span className="text-xs text-center">{icon.replace('fa-', '')}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                确认选择
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 分类编辑模态框组件
const CategoryEditModal = ({ 
  isOpen, 
  category, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  category: ResourceCategory | null; 
  onClose: () => void; 
  onSave: (categoryData: Omit<ResourceCategory, 'id'>) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fa-folder'
  });
  const [error, setError] = useState('');
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'fa-folder'
      });
    }
    setError('');
  }, [category]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSelectIcon = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
    setIsIconModalOpen(false);
  };
  
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入分类名称');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
    onClose();
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {category ? '编辑分类' : '添加分类'}
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
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分类名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入分类名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分类描述
                  </label>
                  <textarea
                    id="category-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入分类描述（可选）"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分类图标 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                      <i className={`fa-solid ${formData.icon} text-xl text-blue-600 dark:text-blue-400`}></i>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsIconModalOpen(true)}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      选择图标
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <i className="fa-solid fa-exclamation-circle mr-2"></i>
                    {error}
                  </div>
                )}
                
                <div className="flex space-x-4 pt-2"><button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <i className="fa-solid fa-save mr-2"></i>
                    保存分类
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
      
      <IconSelectionModal
        isOpen={isIconModalOpen}
        selectedIcon={formData.icon}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={handleSelectIcon}
      />
    </AnimatePresence>
  );
};

// 确认删除模态框
const ConfirmDeleteModal = ({ 
  isOpen, 
  categoryName,
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  categoryName?: string;
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
                您确定要删除分类 <span className="font-medium text-gray-900 dark:text-white">{categoryName}</span> 吗？
                此操作无法撤销，该分类下的资料将被移动到默认分类。
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

export default function ResourceCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ResourceCategory | null>(null);
  
  // 加载分类数据
  useEffect(() => {
    loadCategories();
  }, []);
  
  // 从localStorage加载分类
  const loadCategories = () => {
    setCategories(getResourceCategories());
  };
  
  // 处理添加/编辑分类
  const handleSaveCategory = (categoryData: Omit<ResourceCategory, 'id'>) => {
    try {
      if (selectedCategory) {
        // 更新现有分类
        const updatedCategory = updateResourceCategory(selectedCategory.id, categoryData);
        if (updatedCategory) {
          toast.success('分类更新成功！');
        } else {
          toast.error('分类更新失败');
        }
      } else {
        // 添加新分类
        addResourceCategory(categoryData);
        toast.success('分类添加成功！');
      }
      
      loadCategories(); // 刷新分类列表
    } catch (err) {
      console.error('Failed to save category:', err);
      toast.error(selectedCategory ? '更新分类失败，请重试' : '添加分类失败，请重试');
    }
  };
  
  // 处理编辑分类
  const handleEdit = (category: ResourceCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  
  // 处理删除分类
  const handleDelete = (category: ResourceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };
  
  // 确认删除分类
  const confirmDelete = () => {
    if (!categoryToDelete) return;
    
    try {
      const deleted = deleteResourceCategory(categoryToDelete.id);
      if (deleted) {
        toast.success('分类删除成功！');
        loadCategories(); // 刷新分类列表
      } else {
        toast.error('分类删除失败，至少保留一个分类');
      }
      
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('删除分类失败，请重试');
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
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold flex items-center">
                  <i className="fa-solid fa-tags text-blue-500 mr-3"></i>
                  资料分类管理
                </h2>
                
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  添加分类
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-list-ul mr-2"></i>
                  分类列表 ({categories.length})
                </h3>
                
                {categories.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <i className="fa-solid fa-folder-open text-4xl mb-3"></i>
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
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <i className={`fa-solid ${category.icon} text-xl`}></i>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{category.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {category.description || '无描述'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                            title="编辑分类"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
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
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-700 dark:text-blue-300">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  使用说明
                </h3>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>添加分类：创建新的资料分类，设置名称、描述和图标</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>编辑分类：修改现有分类的名称、描述或图标</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>删除分类：删除不需要的分类，该分类下的资料将自动移至默认分类</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* 分类编辑模态框 */}
      <CategoryEditModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCategory}
      />
      
      {/* 删除确认模态框 */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        categoryName={categoryToDelete?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <Footer />
    </div>
  );
}