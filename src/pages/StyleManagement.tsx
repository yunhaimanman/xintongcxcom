import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AppStyle, getStyles, setCurrentStyle, getCurrentStyle } from '@/data/styles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function StyleManagement() {
  const navigate = useNavigate();
  const { style } = useTheme();
  const [styles, setStyles] = useState<AppStyle[]>([]);
  const [currentStyle, setCurrentStyleState] = useState<AppStyle | null>(null);
  
  // Load styles on component mount
  useEffect(() => {
    const loadStyles = () => {
      const allStyles = getStyles();
      const current = getCurrentStyle();
      
      setStyles(allStyles);
      setCurrentStyleState(current);
    };
    
    loadStyles();
    
    // Listen for style changes
    const handleStyleChange = () => loadStyles();
    window.addEventListener('styleChanged', handleStyleChange);
    
    return () => {
      window.removeEventListener('styleChanged', handleStyleChange);
    };
  }, []);
  
  // Handle style selection
  const handleStyleSelect = (styleId: string) => {
    const success = setCurrentStyle(styleId);
    if (success) {
      toast.success('风格切换成功！');
      setCurrentStyleState(getCurrentStyle());
    } else {
      toast.error('风格切换失败，请重试');
    }
  };
  
  if (!currentStyle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="container mx-auto px-4 py-6">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载风格配置中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
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
                <i className="fa-solid fa-palette text-purple-500 mr-3"></i>
                风格管理
              </h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold mb-6">可用风格</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {styles.map((style) => (
                    <div 
                      key={style.id}
                      className={`rounded-xl overflow-hidden transition-all duration-300 ${
                        currentStyle.id === style.id 
                          ? 'border-2 border-blue-500 shadow-lg scale-[1.02]' 
                          : 'border border-gray-200 dark:border-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-5 ${style.variables.primaryColor}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-bold text-white">{style.name}</h4>
                            <p className="text-white/80 text-sm mt-1">{style.description}</p>
                          </div>
                          {style.isDefault && (
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                              默认风格
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="space-y-3 mb-5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">主色调</span>
                            <div className={`w-8 h-8 rounded-full ${style.variables.primaryColor}`}></div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">辅助色</span>
                            <div className={`w-8 h-8 rounded-full ${style.variables.secondaryColor}`}></div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">强调色</span>
                            <div className={`w-8 h-8 rounded-full ${style.variables.accentColor}`}></div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleStyleSelect(style.id)}
                          disabled={currentStyle.id === style.id}
                          className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${
                            currentStyle.id === style.id
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-not-allowed'
                              : `${style.variables.primaryColor} text-white hover:opacity-90`
                          }`}
                        >
                          {currentStyle.id === style.id ? (
                            <>
                              <i className="fa-solid fa-check mr-2"></i>当前使用
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-check mr-2"></i>选择使用
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
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
                    <span>选择不同的风格将改变网站的整体外观，包括颜色方案和背景等</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>当前已提供默认风格和现代风格两种选择</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-2"></i>
                    <span>风格更改将立即生效，并保存在您的浏览器本地存储中</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}