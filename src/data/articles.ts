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
      },
       {
         id: '8',
         title: '创业初期如何寻找天使投资',
         content: '创业初期寻找天使投资是许多创业者面临的挑战。本文分享了如何准备商业计划书、寻找合适的投资人以及成功融资的关键技巧。天使投资人不仅能提供资金支持，还能带来宝贵的行业经验和人脉资源。',
         categoryId: 'news',
         imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=startup+investment+angel+funding&sign=6a91e8ffac67a3ecfaeb985fc1d823b7',
         createdAt: new Date('2025-08-05'),
         updatedAt: new Date('2025-08-05')
       },
       {
         id: '11',
         title: '兼职创业者的时间管理策略',
         content: '兼职创业最大的挑战之一就是时间管理。本文分享了高效时间管理的五个实用技巧，包括如何设定明确目标、优先级排序、利用碎片时间、建立固定工作习惯以及学会委派任务。这些策略能帮助兼职创业者在有限时间内实现创业目标，同时不影响全职工作表现。',
         categoryId: 'news',
         imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=part-time+entrepreneur+time+management&sign=bb2a1a4c0da042b103733426b68d39ad',
         createdAt: new Date('2025-08-07'),
         updatedAt: new Date('2025-08-07')
       },
       {
         id: '12',
         title: '5个低风险兼职创业项目推荐',
         content: '对于想要低风险尝试创业的人来说，选择合适的项目至关重要。本文推荐了五个适合兼职创业的项目，包括：内容创作与自媒体运营、电商代购与分销、线上教育与技能培训、小型手工艺品制作与销售，以及专业咨询服务。每个项目都分析了启动成本、所需技能和潜在收益，帮助读者找到适合自己的创业方向。',
         categoryId: 'news',
         imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=low-risk+part-time+business+ideas&sign=31b6b2c0a1baf57ef4ceac3902d1286d',
         createdAt: new Date('2025-08-08'),
         updatedAt: new Date('2025-08-08')
       },
       {
         id: '13',
         title: '兼职创业如何平衡全职工作与副业',
         content: '兼顾全职工作和兼职创业需要精心规划和高效执行。本文探讨了如何在不影响主业的前提下发展副业，包括如何设定合理预期、与雇主保持透明沟通、建立支持系统、保持身心健康以及设定明确边界。文章还提供了识别倦怠信号的方法和防止精力过度分散的实用建议，帮助兼职创业者实现可持续发展。',
         categoryId: 'news',
         imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=balance+full-time+job+and+side+business&sign=5c63984e47052837ad106df7f9b5c5fd',
         createdAt: new Date('2025-08-09'),
         updatedAt: new Date('2025-08-09')
       },
       {
         id: '9',
        title: '精益创业：用最小可行产品验证商业模式',
        content: '精益创业理念强调通过快速迭代和用户反馈来优化产品。本文详细介绍了如何构建最小可行产品(MVP)，如何设计有效的用户测试，以及如何根据反馈调整商业模式。这种方法可以帮助创业者在投入大量资源前验证想法，降低失败风险。',
        categoryId: 'tutorial',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=lean+startup+mvp+business+model&sign=edd99737fa03bac5d1e58e326cb1286d',
        createdAt: new Date('2025-08-06'),
        updatedAt: new Date('2025-08-06')
      },
      {
        id: '10',
        title: '创业者必备的5项核心能力',
        content: '成功的创业者往往具备一些共同的核心能力。本文深入探讨了包括问题解决能力、领导力、沟通能力、适应能力和财务敏感度在内的关键素质，并提供了培养这些能力的实用建议。无论是技术背景还是商业背景的创业者，这些能力都是打造成功企业的基础。',
        categoryId: 'review',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=entrepreneur+skills+business+abilities&sign=dc4b751c83751c88c837878186d19feb',
        createdAt: new Date('2025-08-07'),
        updatedAt: new Date('2025-08-07')
        },
        {
          id: '14',
          title: '2024年大学生创新创业训练计划项目申报指南',
          content: '为深入贯彻落实《国务院办公厅关于深化高等学校创新创业教育改革的实施意见》，进一步提升大学生创新创业能力，现就2024年大学生创新创业训练计划项目申报工作通知如下：\n\n一、申报对象\n全国普通高等学校全日制本专科生均可申报，鼓励跨学科、跨专业、跨年级组队申报。团队成员一般不超过5人，每个项目配备1-2名指导教师。\n\n二、项目类型\n1. 创新训练项目：面向本科生个人或团队，在导师指导下，自主完成创新性研究项目设计、研究条件准备和项目实施、研究报告撰写等工作。\n2. 创业训练项目：面向本科生团队，在导师指导下，团队中每个学生在项目实施过程中扮演一个或多个具体角色，通过编制商业计划书、开展可行性研究、模拟企业运行等工作。\n3. 创业实践项目：是学生团队在学校导师和企业导师共同指导下，采用前期创新训练项目（或创新性实验）的成果，提出具有市场前景的创新性产品或服务，以此为基础开展创业实践活动。\n\n三、申报流程\n1. 项目申报：3月1日-3月31日\n2. 学校评审：4月1日-4月15日\n3. 省级推荐：4月16日-4月30日\n4. 国家级评审：5月\n\n四、注意事项\n1. 项目选题应具有一定的学术价值、创新性和现实意义\n2. 鼓励学生结合学科专业特点和地方经济社会发展需求选题\n3. 申报材料需完整、规范，按时提交',
          categoryId: 'news',
          imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=college+student+innovation+entrepreneurship+program+application+guide&sign=fc259b721a69aaa38163414b62d15d1e',
          createdAt: new Date('2025-08-10'),
          updatedAt: new Date('2025-08-10')
         },
         {
           id: '15',
           title: '百度百家号文章',
           content: '这是从百度百家号添加的文章内容。原文链接：https://baijiahao.baidu.com/s?id=1784541751711303467',
           categoryId: 'news',
           imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=news+article+image&sign=24947fdc1cbfa66032c94cff9af85c64',
           createdAt: new Date('2025-08-11'),
           updatedAt: new Date('2025-08-11')
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
      
  // 确保关键文章存在
  const requiredArticleIds = ['7', '15']; // 更新记录和百度百家号文章
  requiredArticleIds.forEach(id => {
    const articleExists = articles.some(article => article.id === id);
    if (!articleExists) {
      const requiredArticle = defaultArticles.find(a => a.id === id);
      if (requiredArticle) {
        articles.push(requiredArticle);
        localStorage.setItem('articles', JSON.stringify(articles));
      }
    }
  });
      
      // 如果没有文章数据，使用默认文章
      if (articles.length === 0) {
        articles = defaultArticles;
        localStorage.setItem('articles', JSON.stringify(articles));
      }
      
      // 如果没有文章数据，使用默认文章
      if (articles.length === 0) {
        articles = defaultArticles;
        localStorage.setItem('articles', JSON.stringify(articles));
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