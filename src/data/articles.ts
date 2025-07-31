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
 const defaultArticles: Article[] = [
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
   }
 ];

// 从localStorage获取所有文章
export const getArticles = (): Article[] => {
  const articlesJson = localStorage.getItem('articles');
  if (!articlesJson) return defaultArticles;
  
  try {
    const articles = JSON.parse(articlesJson) as Article[];
    // 将字符串日期转换为Date对象
    return articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to parse articles:', error);
    return defaultArticles;
  }
};

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