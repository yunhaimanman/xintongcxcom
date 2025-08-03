// 文章分类类型定义
export interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
}

// 文章类型定义
export interface Article {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 默认文章分类数据
 const defaultArticleCategories: ArticleCategory[] = [
   { id: 'news', name: '新闻资讯', description: '最新行业动态和新闻', icon: 'fa-newspaper' },
   { id: 'tutorial', name: '教程指南', description: '使用教程和指南', icon: 'fa-book' },
   { id: 'review', name: '评测文章', description: '产品评测和体验', icon: 'fa-star' },
   { id: 'website', name: '网站介绍', description: '网站相关信息介绍', icon: 'fa-info-circle' },
 ];

// 从localStorage获取所有文章分类
export const getArticleCategories = (): ArticleCategory[] => {
  const categoriesJson = localStorage.getItem('articleCategories');
  if (!categoriesJson) return defaultArticleCategories;
  
  try {
    return JSON.parse(categoriesJson) as ArticleCategory[];
  } catch (error) {
    console.error('Failed to parse article categories:', error);
    return defaultArticleCategories;
  }
};

// 添加新文章分类
export const addArticleCategory = (category: Omit<ArticleCategory, 'id'>): ArticleCategory => {
  const categories = getArticleCategories();
  
  // 生成唯一ID
  const newId = 'article_cat_' + Date.now();
  
  const newCategory: ArticleCategory = {
    ...category,
    id: newId
  };
  
  categories.push(newCategory);
  localStorage.setItem('articleCategories', JSON.stringify(categories));
  
  return newCategory;
};

// 更新文章分类
export const updateArticleCategory = (id: string, updatedData: Partial<Omit<ArticleCategory, 'id'>>): ArticleCategory | null => {
  const categories = getArticleCategories();
  const index = categories.findIndex(cat => cat.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory = {
    ...categories[index],
    ...updatedData
  };
  
  categories[index] = updatedCategory;
  localStorage.setItem('articleCategories', JSON.stringify(categories));
  
  return updatedCategory;
};

// 删除文章分类
export const deleteArticleCategory = (id: string): boolean => {
  const categories = getArticleCategories();
  const initialLength = categories.length;
  
  // 不能删除最后一个分类
  if (initialLength <= 1) {
    return false;
  }
  
  const filteredCategories = categories.filter(cat => cat.id !== id);
  
  if (filteredCategories.length === initialLength) return false;
  
  localStorage.setItem('articleCategories', JSON.stringify(filteredCategories));
  
  // 更新使用该分类的文章
  const articles = getArticles();
  const defaultCategoryId = filteredCategories[0].id;
  
  const updatedArticles = articles.map(article => 
    article.categoryId === id ? { ...article, categoryId: defaultCategoryId } : article
  );
  
  localStorage.setItem('articles', JSON.stringify(updatedArticles));
  
  return true;
};

 // 默认文章数据
  export const defaultArticles: Article[] = [
   {
     id: '1',
     title: '欢迎使用图文管理系统',
     content: '这是一个示例文章，您可以在管理后台中添加、编辑和删除文章。',
     categoryId: 'news',
     imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=welcome+to+content+management+system&sign=71f72147d0ad8b223e3e7698d8809902',
     createdAt: new Date('2025-07-01'),
     updatedAt: new Date('2025-07-01')
   },
   {
     id: '2',
     title: '图文管理系统使用指南',
     content: '本指南将帮助您快速上手图文管理系统的各项功能...',
     categoryId: 'tutorial',
     imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=content+management+tutorial&sign=dec74af1c8769db0ad9662852fd75b95',
     createdAt: new Date('2025-07-10'),
     updatedAt: new Date('2025-07-10')
   },
   {
     id: '3',
     title: '帮助中心',
     content: '这里是小桐导航的帮助中心，您可以在这里找到常见问题的解答...',
     categoryId: 'website',
     imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=help+center&sign=21d0bb58af929cb1c4f8feec7aa8ff3f',
     createdAt: new Date('2025-07-20'),
     updatedAt: new Date('2025-07-20')
   },
   {
     id: '4',
     title: '关于我们',
     content: '小桐导航是一个集合各类实用工具的导航网站，致力于为用户提供便捷的工具查找和使用体验...',
     categoryId: 'website',
     imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=about+us&sign=1c39835c4a4f8eef106a09bcdb93ff2b',
     createdAt: new Date('2025-07-20'),
     updatedAt: new Date('2025-07-20')
   },
   {
     id: '5',
     title: '联系我们',
     content: '如果您有任何问题或建议，请通过以下方式联系我们...',
     categoryId: 'website',
     imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=contact+us&sign=2d2ebbe5f066339a158388b5e1027f48',
     createdAt: new Date('2025-07-20'),
     updatedAt: new Date('2025-07-20')
     },
     {
       id: '6',
       title: '网站公告',
       content: '本次风格设计已完成优化，新增多种视觉风格供选择。网站所有功能已更新，数据存储在本地浏览器中，无需服务器支持即可使用。感谢您的使用与支持！',
       categoryId: 'website',
       imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=website+announcement+notification&sign=39b1f2ab0e5e17e4865b29677ec6c92f',
       createdAt: new Date('2025-08-02'),
       updatedAt: new Date('2025-08-02')
     },
       {
         id: '7',
         title: '更新记录',
         content: '网站全部需求清单与更新记录：\n\n### 2025年8月3日 更新\n\n#### 数据库管理模块\n- 实现独立的数据库管理模块，仅限管理员访问\n- 添加数据表结构可视化功能\n- 实现数据表的增删改查操作\n- 增加数据导入/导出功能，支持JSON格式备份\n\n#### 图文管理功能\n- 完善文章分类管理系统\n- 新增网站介绍模块\n- 添加"更新记录"文章，记录网站开发历程\n- 优化文章展示页面布局\n\n### 2025年7月20日 更新\n\n#### 工具管理功能\n- 添加、编辑和删除工具\n- 工具分类管理\n- 工具数据导出为XML格式\n- 工具数据从XML导入\n\n#### 资源管理功能\n- 资源添加、编辑和删除\n- 资源分类管理\n- 云盘链接管理\n\n### 2025年7月10日 更新\n\n#### 用户认证功能\n- 管理员登录/注销\n- 权限控制\n- 后台操作日志\n\n#### 样式管理功能\n- 多风格切换\n- 主题定制\n- 自定义颜色方案\n\n### 2025年7月1日 更新\n\n#### 留言板功能\n- 留言发布与删除\n- 管理员回复功能\n- 留言审核机制\n\n#### 其他功能\n- 响应式设计适配\n- 本地数据存储优化\n- 网站公告系统\n- 性能优化与bug修复',
         categoryId: 'website',
         imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=website+update+history+documentation&sign=3fe323f01ed3f3a9845c74cf3bbf9087',
         createdAt: new Date('2025-08-03'),
         updatedAt: new Date() // 更新为当前时间确保置顶
       }
 ];

// 从localStorage获取所有文章
export const getArticles = (): Article[] => {
  const articlesJson = localStorage.getItem('articles');
  let articles: Article[] = [];
  
  try {
    if (articlesJson) {
      articles = JSON.parse(articlesJson) as Article[];
      // 将字符串日期转换为Date对象
      articles = articles.map(article => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt)
      }));
      
      // 确保"更新记录"文章存在
      const updateRecordExists = articles.some(article => article.id === '7');
      if (!updateRecordExists) {
        // 从默认文章中找到"更新记录"文章并添加
        const updateRecordArticle = defaultArticles.find(a => a.id === '7');
        if (updateRecordArticle) {
          articles.push(updateRecordArticle);
          localStorage.setItem('articles', JSON.stringify(articles));
        }
      }
    } else {
      articles = defaultArticles;
    }
  } catch (error) {
    console.error('Failed to parse articles:', error);
    articles = defaultArticles;
  }
  
  return articles;
}

// 添加新文章
export const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article => {
  const articles = getArticles();
  
  // 生成唯一ID
  const newId = 'article_' + Date.now();
  const now = new Date();
  
  const newArticle: Article = {
    ...article,
    id: newId,
    createdAt: now,
    updatedAt: now
  };
  
  articles.push(newArticle);
  localStorage.setItem('articles', JSON.stringify(articles));
  
  return newArticle;
};

// 更新文章
export const updateArticle = (id: string, updatedData: Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>): Article | null => {
  const articles = getArticles();
  const index = articles.findIndex(article => article.id === id);
  
  if (index === -1) return null;
  
  const updatedArticle = {
    ...articles[index],
    ...updatedData,
    updatedAt: new Date() // 更新修改时间
  };
  
  articles[index] = updatedArticle;
  localStorage.setItem('articles', JSON.stringify(articles));
  
  return updatedArticle;
};

// 删除文章
export const deleteArticle = (id: string): boolean => {
  const articles = getArticles();
  const initialLength = articles.length;
  
  const filteredArticles = articles.filter(article => article.id !== id);
  
  if (filteredArticles.length === initialLength) return false;
  
  localStorage.setItem('articles', JSON.stringify(filteredArticles));
  
  return true;
};

// 获取特定分类下的文章
export const getArticlesByCategory = (categoryId: string): Article[] => {
  const articles = getArticles();
  return articles.filter(article => article.categoryId === categoryId);
}