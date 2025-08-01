export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} 工具导航 - 所有工具仅供参考
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/article/3" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <i className="fa-solid fa-question-circle mr-1"></i>帮助
            </a>
            <a href="/article/4" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <i className="fa-solid fa-file-text mr-1"></i>关于我们
            </a>
            <a href="/article/5" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <i className="fa-solid fa-envelope mr-1"></i>联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}