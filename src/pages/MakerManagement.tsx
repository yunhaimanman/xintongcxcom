import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { getAuthCodes, generateAuthCode, getMakers, Maker, updateMakerPassword } from '@/data/makers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function MakerManagement() {
  // 密码重置相关状态
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [makerToReset, setMakerToReset] = useState<Maker | null>(null);
  
  // 删除授权码
  const handleDeleteAuthCode = (codeId: string) => {
    try {
      const authCodes = getAuthCodes();
      const updatedCodes = authCodes.filter(code => code.id !== codeId);
      localStorage.setItem('makerAuthCodes', JSON.stringify(updatedCodes));
      setAuthCodes(updatedCodes);
      toast.success('授权码删除成功！');
    } catch (error) {
      console.error('Failed to delete auth code:', error);
      toast.error('授权码删除失败，请重试');
    }
  };
  
  // 确认重置密码
  const confirmResetPassword = () => {
    if (!makerToReset) return;
    
    try {
      // 重置密码为默认值"888888"
      updateMakerPassword(makerToReset.id, "888888");
      toast.success('密码重置成功！新密码为"888888"');
      setResetModalOpen(false);
      setMakerToReset(null);
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('密码重置失败，请重试');
    }
  };
  const { style } = useTheme();
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [authCodes, setAuthCodes] = useState(getAuthCodes());
  const [makers, setMakers] = useState(getMakers());
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Maker | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 查看用户详情
  const handleViewUser = (makerId: string) => {
    const maker = makers.find(m => m.id === makerId);
    if (maker) {
      setCurrentUser(maker);
      setShowUserModal(true);
    }
  };
  
  // 检查用户是否是管理员
  useEffect(() => {
    if (userRole !== 'admin') {
      toast.error('您没有权限访问此页面');
      navigate('/');
    }
  }, [userRole, navigate]);
  
  // 刷新数据
  const refreshData = () => {
    setAuthCodes(getAuthCodes());
    setMakers(getMakers());
  };
  
  // 生成新授权码
  const handleGenerateCode = () => {
    setIsGenerating(true);
    
    try {
      const newCode = generateAuthCode();
      setGeneratedCode(newCode.code);
      setShowCodeModal(true);
      refreshData();
      toast.success('授权码生成成功');
    } catch (error) {
      console.error('Failed to generate auth code:', error);
      toast.error('授权码生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 复制授权码
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      toast.success('授权码已复制到剪贴板');
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('复制失败，请手动复制');
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
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
                <i className="fa-solid fa-user-cog text-blue-500 mr-3"></i>
                创客管理
              </h2>
              
              {/* 授权码管理 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-key text-purple-500 mr-2"></i>
                    授权码管理
                  </h3>
                  
                  <button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        生成中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-plus mr-2"></i>
                        生成授权码
                      </>
                    )}
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          授权码
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          状态
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          创建时间
                        </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                         使用人
                       </th>
                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                         操作
                       </th>
                     </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {authCodes.map((code) => (
                        <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={code.isUsed 
                              ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                              : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}>
                              {code.isUsed ? '已使用' : '未使用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(code.createdAt).toLocaleString()}
                          </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                         {code.isUsed && code.usedBy 
                           ? makers.find(m => m.id === code.usedBy)?.name || '未知用户'
                           : '-'}
                       </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {!code.isUsed && (
                            <button
                              onClick={() => handleDeleteAuthCode(code.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <i className="fa-solid fa-trash mr-1"></i> 删除
                            </button>
                          )}
                        </td>
                     </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 创客管理 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fa-solid fa-users text-blue-500 mr-2"></i>
                  创客列表
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-900">
                       <tr>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           用户名
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           姓名/团队名称
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           公司/组织
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           密码
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           积分
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           入驻时间
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                       {makers.map((maker) => (
                         <tr key={maker.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                           <td className="px-6 py-4 whitespace-nowrap font-medium">
                             {maker.username}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             {maker.name}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             {maker.company}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap font-mono">
                             {maker.password}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                               {maker.积分}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                             {new Date(maker.joinDate).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                             <button
                               onClick={() => setMakerToReset(maker)}
                               className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mr-4"
                             >
                               <i className="fa-solid fa-key mr-1"></i> 重置密码
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* 授权码生成成功模态框 */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-check-circle text-xl mr-3"></i>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">授权码生成成功</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-center text-lg mb-6">
                {generatedCode}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                请将此授权码提供给用户，用户可使用此授权码申请成为创客。
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-copy mr-2"></i>
                  复制授权码
                </button>
                
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors py-3 px-4"
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  关闭
                </button>
              </div>
            </div>
           </motion.div>
           
           {/* 用户详情模态框 */}
           {showUserModal && currentUser && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.2 }}
                 className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
               >
                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white">用户详情</h3>
                   <button 
                     onClick={() => setShowUserModal(false)}
                     className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                   >
                     <i className="fa-solid fa-times"></i>
                   </button>
                 </div>
                 
                 <div className="p-6">
                   <div className="space-y-4">
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">用户名</h4>
                       <p className="font-medium">{currentUser.username}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">姓名/团队名称</h4>
                       <p className="font-medium">{currentUser.name}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">公司/组织</h4>
                       <p className="font-medium">{currentUser.company}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">项目信息</h4>
                       <p className="font-medium">{currentUser.projectInfo}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">积分</h4>
                       <p className="font-medium">{currentUser.积分}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">入驻时间</h4>
                       <p className="font-medium">{new Date(currentUser.joinDate).toLocaleDateString()}</p>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
        </div>
      )}
      
      <Footer />
    {/* 密码重置确认模态框 */}
    {resetModalOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <i className="fa-solid fa-exclamation-triangle text-xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">确认重置密码</h3>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              您确定要将该创客的密码重置为 <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">888888</span> 吗？
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={confirmResetPassword}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-check mr-2"></i>
                确认重置
              </button>
              
              <button
                onClick={() => {
                  setResetModalOpen(false);
                  setMakerToReset(null);
                }}
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
    
    </div>
  );
}