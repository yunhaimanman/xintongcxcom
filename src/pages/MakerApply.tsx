import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { validateAuthCode, addMaker, markAuthCodeAsUsed, getMakers } from '@/data/makers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function MakerApply() {
  const { style } = useTheme();
  const { username, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    authCode: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    projectInfo: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateStep1 = (): boolean => {
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return false;
    }
    
    // 检查用户名格式
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      setError('用户名只能包含字母、数字和下划线，长度3-20个字符');
      return false;
    }
    
    // 检查用户名是否已存在
    const existingMakers = getMakers();
    if (existingMakers.some(maker => maker.username === formData.username)) {
      setError('用户名已被占用，请选择其他用户名');
      return false;
    }
    
    if (!formData.authCode.trim()) {
      setError('请输入授权码');
      return false;
    }
    
    // 验证授权码
    if (!validateAuthCode(formData.authCode)) {
      setError('无效的授权码或授权码已被使用');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = (): boolean => {
    if (!formData.password.trim()) {
      setError('请设置密码');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('密码长度不能少于6位');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    
    return true;
  };
  
  const validateStep3 = (): boolean => {
    if (!formData.name.trim()) {
      setError('请输入姓名或团队名称');
      return false;
    }
    
    if (!formData.company.trim()) {
      setError('请输入公司或组织名称');
      return false;
    }
    
    if (!formData.projectInfo.trim()) {
      setError('请简要描述您的项目或创意');
      return false;
    }
    
    return true;
  };
  
  const handleSubmitStep = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    // 最后一步提交表单
    if (step === 3) {
      setIsLoading(true);
      
      try {
        // 创建创客账户
      const newMaker = addMaker({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        company: formData.company,
        projectInfo: formData.projectInfo,
        isAuthorized: true,
        authCode: formData.authCode
      });
        
        // 标记授权码为已使用
        markAuthCodeAsUsed(formData.authCode, newMaker.id);
        
        // 更新认证状态为创客角色
        setIsAuthenticated(true, username, 'maker');
        
        toast.success('恭喜！创客入驻申请成功！');
        navigate('/maker');
      } catch (err) {
        console.error('Failed to apply for maker:', err);
        toast.error('入驻申请失败，请重试');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // 进入下一步
    setStep(prev => prev + 1);
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
            <div className="max-w-md mx-auto">
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden`}>
                <div className={`p-6 ${style.variables.primaryColor} text-white`}>
                  <h2 className="text-2xl font-bold">创客入驻申请</h2>
                  <p className="opacity-90 mt-1">请完成以下步骤成为认证创客</p>
                </div>
                
                {/* 步骤指示器 */}
                <div className="px-6 pt-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        1
                      </div>
                      <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">验证授权码</span>
                    </div>
                    
                    <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        2
                      </div>
                      <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">设置密码</span>
                    </div>
                    
                    <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        3
                      </div>
                      <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">完善信息</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {step === 1 && (
                    <div className="space-y-5">
                       <div>
                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           用户名 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="text"
                           id="username"
                           name="username"
                           value={formData.username}
                           onChange={handleInputChange}
                           className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                           placeholder="请设置登录用户名"
                         />
                       </div>
                       <div>
                         <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           授权码 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="text"
                           id="authCode"
                           name="authCode"
                           value={formData.authCode}
                           onChange={handleInputChange}
                           className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                           placeholder="请输入您的授权码"
                         />
                       </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                        <i className="fa-solid fa-info-circle mr-2"></i>
                        授权码由管理员发放，如您没有授权码，请联系管理员获取。
                      </div>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          密码 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="设置您的密码"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          确认密码 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="再次输入密码"
                        />
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          姓名/团队名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="请输入您的姓名或团队名称"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          公司/组织名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="请输入公司或组织名称"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          联系方式 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="请输入您的联系电话或邮箱"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="projectInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          项目/创意简介 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="projectInfo"
                          name="projectInfo"
                          value={formData.projectInfo}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="请简要描述您的项目或创意"
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-4 text-red-500 text-sm flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <i className="fa-solid fa-exclamation-circle mr-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => step > 1 && setStep(prev => prev - 1)}
                      disabled={step === 1 || isLoading}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-arrow-left mr-1"></i>
                      上一步
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSubmitStep}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          处理中...
                        </>
                      ) : step < 3 ? (
                        <>
                          下一步 <i className="fa-solid fa-arrow-right ml-1"></i>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check mr-2"></i>
                          完成入驻
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => navigate('/maker')}
                  className="hover:text-blue-500 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i>
                  返回创客首页
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