import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTools } from '@/data/tools';
import { getArticles, getArticleCategories } from '@/data/articles';
import { getResourceItems, getResourceCategories } from '@/data/resources';
import { getStyles } from '@/data/styles';
import { getMessages } from '@/data/messages';

// 数据库管理模块 - 仅管理员可访问
export default function DatabaseManagement() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // 导出所有网站数据
  const handleExportAllData = async () => {
    if (!isAuthenticated) return;
    
    setIsExporting(true);
    toast.info('正在导出所有网站数据...');
    
    try {
      // 收集所有应用数据
      const allData = {
        tools: getTools(),
        toolCategories: getResourceCategories(),
        articles: getArticles(),
        articleCategories: getArticleCategories(),
        resources: getResourceItems(),
        resourceCategories: getResourceCategories(),
        styles: getStyles(),
        messages: getMessages()
      };
      
      // 转换为JSON格式
      const jsonContent = JSON.stringify(allData, null, 2);
      
      // 创建下载链接
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // 生成带时间戳的文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `website_database_export_${timestamp}.json`;
      a.download = fileName;
      
      // 添加到文档并触发下载
      document.body.appendChild(a);
      
      requestAnimationFrame(() => {
        a.click();
        
        // 清理资源
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success(`网站数据导出成功！\n文件: ${fileName}`);
          setIsExporting(false);
        }, 1000);
      });
    } catch (error) {
      console.error('数据导出失败:', error);
      toast.error('网站数据导出失败，请重试');
      setIsExporting(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/json') {
        toast.error('请选择JSON格式的文件');
        return;
      }
      setImportFile(file);
      setShowConfirmModal(true);
    }
  };

  // 确认导入数据
  const confirmImport = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    setShowConfirmModal(false);
    toast.info('正在导入网站数据...');
    
    try {
      // 读取文件内容
      const content = await importFile.text();
      const importedData = JSON.parse(content);
      
      // 验证导入数据结构
      if (!importedData || typeof importedData !== 'object') {
        throw new Error('无效的数据格式');
      }
      
      // 清空现有数据
      const storageKeys = [
        'tools', 'categories', 'articles', 'articleCategories', 
        'resources', 'resourceCategories', 'appStyles', 'messages'
      ];
      
      storageKeys.forEach(key => localStorage.removeItem(key));
      
      // 导入工具数据
      if (importedData.tools && Array.isArray(importedData.tools)) {
        localStorage.setItem('tools', JSON.stringify(importedData.tools));
      }
      
      // 导入工具分类
      if (importedData.toolCategories && Array.isArray(importedData.toolCategories)) {
        localStorage.setItem('categories', JSON.stringify(importedData.toolCategories));
      }
      
      // 导入文章数据
      if (importedData.articles && Array.isArray(importedData.articles)) {
        localStorage.setItem('articles', JSON.stringify(importedData.articles));
      }
      
      // 导入文章分类
      if (importedData.articleCategories && Array.isArray(importedData.articleCategories)) {
        localStorage.setItem('articleCategories', JSON.stringify(importedData.articleCategories));
      }
      
      // 导入资源数据
      if (importedData.resources && Array.isArray(importedData.resources)) {
        localStorage.setItem('resources', JSON.stringify(importedData.resources));
      }
      
      // 导入资源分类
      if (importedData.resourceCategories && Array.isArray(importedData.resourceCategories)) {
        localStorage.setItem('resourceCategories', JSON.stringify(importedData.resourceCategories));
      }
      
      // 导入样式配置
      if (importedData.styles && Array.isArray(importedData.styles)) {
        localStorage.setItem('appStyles', JSON.stringify(importedData.styles));
      }
      
      // 导入留言数据
      if (importedData.messages && Array.isArray(importedData.messages)) {
        localStorage.setItem('messages', JSON.stringify(importedData.messages));
      }
      
      toast.success('网站数据导入成功！页面将刷新以应用新数据');
      
      // 刷新页面以应用新数据
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('数据导入失败:', error);
      toast.error('网站数据导入失败，请检查文件格式');
      setIsImporting(false);
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
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <i className="fa-solid fa-database text-blue-500 mr-3"></i>
                网站数据库管理
              </h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6">数据库操作</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-semibold mb-4 flex items-center text-blue-700 dark:text-blue-300">
                      <i className="fa-solid fa-download mr-2"></i>
                      导出全部数据
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                      将网站所有数据（工具、文章、资源、样式等）导出为JSON文件，用于备份或迁移。
                    </p>
                    <button
                      onClick={handleExportAllData}
                      disabled={isExporting}
                      className="w-full bg-blue-600 hover:bg-blue-7０0 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isExporting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          导出中...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-file-export mr-2"></i>
                          导出数据
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                    <h4 className="text-lg font-semibold mb-4 flex items-center text-green-700 dark:text-green－300">
                      <i className="fa-solid fa-upload mr-2"></i>
                      导入全部数据
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                      从JSON文件导入网站数据，此操作将覆盖现有数据，请谨慎操作。
                    </p>
                    <div className="space-y-3">
                      <label className="block">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-input"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('file-input')?.click()}
                          disabled={isImporting || isExporting}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <i className="fa-solid fa-file-import mr-2"></i>
                          选择JSON文件
                        </button>
                      </label>
                      
                      {importFile && (
                        <div className="text-sm bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                          <div className="flex items-center truncate">
                            <i className="fa-solid fa-file-code text-gray-500 mr-2"></i>
                            <span className="truncate max-w-xs">{importFile.name}</span>
                          </div>
                          <button
                            onClick={() => setShowConfirmModal(true)}
                            disabled={isImporting || isExporting}
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            确认导入
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-base font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                    注意事项
                  </h4>
                  <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-2">
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                      <span>数据库操作仅管理员可执行，请确保您已了解操作风险</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                      <span>导入操作会覆盖现有数据，请在操作前做好备份</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                      <span>导出的数据包含网站全部内容，请注意妥善保管</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                      <span>系统数据存储在浏览器本地，清除浏览器数据会导致数据丢失</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* 导入确认模态框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                <i className="fa-solid fa-exclamation-triangle text-xl mr-3"></i>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">确认导入数据</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您确定要导入数据吗？此操作将覆盖网站所有现有数据，且无法撤销。
                <br/><br/>
                <span className="font-medium">导入文件:</span> {importFile?.name}
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={confirmImport}
                  disabled={isImporting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      导入中...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check mr-2"></i>
                      确认导入
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowConfirmModal(false)}
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
      
      <Footer />
    </div>
  );
}