import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourceItem, ResourceCategory, CloudLink, getResourceItems, getResourceCategories, addResourceItem, updateResourceItem, deleteResourceItem, addResourceLink, updateResourceLink, deleteResourceLink, getResourcesByCategory } from '@/data/resources';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 链接编辑组件
const LinkEditModal = ({ 
  isOpen, 
  link,
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  link: Partial<CloudLink> | null;
  onClose: () => void; 
  onSave: (linkData: Omit<CloudLink, 'id'>) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: ''
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (link) {
      setFormData({
        name: link.name || '',
        url: link.url || ''
      });
    } else {
      setFormData({
        name: '',
        url: ''
      });
    }
    setError('');
  }, [link]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入云盘名称');
      return false;
    }
    
    if (!formData.url.trim()) {
      setError('请输入云盘链接');
      return false;
    }
    
    try {
      new URL(formData.url);
    } catch (err) {
      setError('请输入有效的URL链接');
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {link ? '编辑云盘链接' : '添加云盘链接'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="link-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    云盘名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="link-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="例如：百度云、阿里云"
                  />
                </div>
                
                <div>
                  <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    云盘链接 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="link-url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入完整URL链接"
                  />
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-save mr-2"></i>
                    保存
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

// 资料编辑模态框组件
const ResourceEditModal = ({ 
  isOpen, 
  resource, 
  categories,
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  resource: ResourceItem | null; 
  categories: ResourceCategory[];
  onClose: () => void; 
  onSave: (updatedResource: Omit<ResourceItem, 'id' | 'createdAt' | 'updatedAt' | 'links'> & { links: CloudLink[] }) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    links: [] as CloudLink[]
  });
  const [error, setError] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<CloudLink> | null>(null);
  
  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        description: resource.description || '',
        categoryId: resource.categoryId,
        links: [...resource.links]
      });
    } else if (categories.length > 0) {
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0].id,
        links: []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        links: []
      });
    }
    setError('');
  }, [resource, categories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入资料名称');
      return false;
    }
    
    if (!formData.categoryId) {
      setError('请选择资料分类');
      return false;
    }
    
    if (formData.links.length === 0) {
      setError('请至少添加一个云盘链接');
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
  
  const handleAddLink = () => {
    setCurrentLink(null);
    setIsLinkModalOpen(true);
  };
  
  const handleEditLink = (link: CloudLink) => {
    setCurrentLink(link);
    setIsLinkModalOpen(true);
  };
  
  const handleDeleteLink = (index: number) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData(prev => ({ ...prev, links: newLinks }));
  };
  
  const handleSaveLink = (linkData: Omit<CloudLink, 'id'>) => {
    if (currentLink && currentLink.id) {
      // 更新现有链接
      const updatedLinks = formData.links.map(link => 
        link.id === currentLink.id ? { ...link, ...linkData } : link
      );
      setFormData(prev => ({ ...prev, links: updatedLinks }));
    } else {
      // 添加新链接
      const newLink: CloudLink = {
        ...linkData,
        id: 'link_' + Date.now()
      };
      setFormData(prev => ({ ...prev, links: [...prev.links, newLink] }));
    }
    setIsLinkModalOpen(false);
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {resource ? '编辑资料' : '添加资料'}
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
                  <label htmlFor="resource-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    资料名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="resource-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入资料名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="resource-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    资料描述
                  </label>
                  <textarea
                    id="resource-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="输入资料描述（可选）"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="resource-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    资料分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="resource-category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">-- 选择分类 --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      云盘链接 <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-plus mr-1"></i> 添加链接
                    </button>
                  </div>
                  
                  {formData.links.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        尚未添加云盘链接，点击"添加链接"按钮开始添加
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.links.map((link, index) => (
                        <div key={link.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">{link.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</div>
                          </div>
                          <div className="flex space-x-2 ml-3">
                            <button
                              type="button"
                              onClick={() => handleEditLink(link)}
                              className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(index)}
                              className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-save mr-2"></i>
                    保存资料
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
      
      <LinkEditModal
        isOpen={isLinkModalOpen}
        link={currentLink}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
      />
    </AnimatePresence>
  );
};

// 确认删除模态框
const ConfirmDeleteModal = ({ 
  isOpen, 
  resourceName,
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  resourceName?: string;
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
                您确定要删除资料 <span className="font-medium text-gray-900 dark:text-white">{resourceName}</span> 吗？
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

export default function ResourceManagement() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<ResourceItem | null>(null);
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // 加载资料和分类数据
  useEffect(() => {
    const loadResources = () => {
      if (selectedCategory === 'all') {
        setResources(getResourceItems().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      } else {
        setResources(getResourceItems()
          .filter(resource => resource.categoryId === selectedCategory)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      }
    };
    
    const loadCategories = () => {
      setCategories(getResourceCategories());
    };
    
    loadResources();
    loadCategories();
  }, [selectedCategory]);
  
  // 处理添加/编辑资料
  const handleSaveResource = (resourceData: Omit<ResourceItem, 'id' | 'createdAt' | 'updatedAt' | 'links'> & { links: CloudLink[] }) => {
    try {
      if (selectedResource) {
        // 更新现有资料
        const updatedResource = updateResourceItem(selectedResource.id, {
          name: resourceData.name,
          description: resourceData.description,
          categoryId: resourceData.categoryId
        });
        
        // 更新链接
        // 先删除所有现有链接
        selectedResource.links.forEach(link => {
          deleteResourceLink(selectedResource.id, link.id);
        });
        
        // 添加新链接
        resourceData.links.forEach(link => {
          addResourceLink(selectedResource.id, { name: link.name, url: link.url });
        });
        
        if (updatedResource) {
          toast.success('资料更新成功！');
        } else {
          toast.error('资料更新失败');
        }
      } else {
        // 添加新资料
        const newResource = addResourceItem({
          name: resourceData.name,
          description: resourceData.description,
          categoryId: resourceData.categoryId,
          links: resourceData.links
        });
        
        toast.success('资料添加成功！');
      }
      
      // 刷新资料列表
      if (selectedCategory === 'all') {
        setResources(getResourceItems().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      } else {
        setResources(getResourceItems()
          .filter(resource => resource.categoryId === selectedCategory)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      }
    } catch (err) {
      console.error('Failed to save resource:', err);
      toast.error(selectedResource ? '更新资料失败，请重试' : '添加资料失败，请重试');
    }
  };
  
  // 处理编辑资料
  const handleEdit = (resource: ResourceItem) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };
  
  // 处理删除资料
  const handleDelete = (resource: ResourceItem) => {
    setResourceToDelete(resource);
    setIsDeleteModalOpen(true);
  };
  
  // 确认删除资料
  const confirmDelete = () => {
    if (!resourceToDelete) return;
    
    try {
      const deleted = deleteResourceItem(resourceToDelete.id);
      if (deleted) {
        toast.success('资料删除成功！');
        // 刷新资料列表
        setResources(resources.filter(r => r.id !== resourceToDelete.id));
      } else {
        toast.error('资料删除失败');
      }
      
      setIsDeleteModalOpen(false);
      setResourceToDelete(null);
    } catch (err) {
      console.error('Failed to delete resource:', err);
      toast.error('删除资料失败，请重试');
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
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                 <h2 className="text-3xl font-bold flex items-center">
                   <i className="fa-solid fa-database text-blue-500 mr-3"></i>
                   资料管理
                 </h2>
                 <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                   <button
                     onClick={() => {
                       setSelectedResource(null);
                       setIsEditModalOpen(true);
                     }}
                     className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center flex-shrink-0"
                   >
                     <i className="fa-solid fa-plus mr-2"></i>
                     添加资料
                   </button>
                   
                   <button
                     onClick={() => navigate('/resource-category-management')}
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
                               const resources = JSON.parse(event.target?.result as string);
                               // 保存导入的资料数据
                               localStorage.setItem('resources', JSON.stringify(resources));
                                toast.success('资料数据导入成功！');
                                // 重新加载资源
                                const loadResources = () => {
                                  if (selectedCategory === 'all') {
                                    setResources(getResourceItems().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
                                  } else {
                                    setResources(getResourcesByCategory(selectedCategory).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
                                  }
                                };
                                loadResources();
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
                       const resources = selectedCategory === 'all' ? getResourceItems() : getResourcesByCategory(selectedCategory);
                       const jsonStr = JSON.stringify(resources, null, 2);
                       const blob = new Blob([jsonStr], { type: 'application/json' });
                       const url = URL.createObjectURL(blob);
                       const a = document.createElement('a');
                       a.href = url;
                       a.download = `resources_${new Date().toISOString().slice(0,10)}.json`;
                       document.body.appendChild(a);
                       a.click();
                       document.body.removeChild(a);
                       URL.revokeObjectURL(url);
                       toast.success('资料数据导出成功！');
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
                    全部资料
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
              
              {/* 资料列表 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-list-ul mr-2"></i>
                    资料列表 ({resources.length})
                  </h3>
                </div>
                
                {resources.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <i className="fa-solid fa-folder-open text-4xl mb-3"></i>
                    <p>暂无资料数据，请添加资料</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            资料名称
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            分类
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            链接数
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
                        {resources.map((resource) => {
                          const category = categories.find(c => c.id === resource.categoryId);
                          return (
                            <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-start">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</div>
                                    {resource.description && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-md">
                                        {resource.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                                  {category?.name || '未分类'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                                  {resource.links.length}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(resource.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button
                                 onClick={() => handleEdit(resource)}
                                 className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                               >
                                 <i className="fa-solid fa-edit mr-1"></i> 编辑
                               </button>
                               <button
                                 onClick={() => handleDelete(resource)}
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
      
      {/* 资料编辑模态框 */}
      <ResourceEditModal
        isOpen={isEditModalOpen}
        resource={selectedResource}
        categories={categories}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveResource}
      />
      
      {/* 删除确认模态框 */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        resourceName={resourceToDelete?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <Footer />
    </div>
  );
}