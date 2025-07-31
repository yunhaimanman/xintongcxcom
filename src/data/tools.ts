// 工具分类类型定义
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// 工具分类ID类型
export type ToolCategory = 'productivity' | 'design' | 'development' | 'utilities' | string;

// 工具项类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory; // 使用分类ID类型
  color: string;
  url: string;
}

// 默认分类数据
const defaultCategories: Category[] = [
  { id: 'productivity', name: '生产力工具', icon: 'fa-bolt' },
  { id: 'design', name: '设计工具', icon: 'fa-paint-brush' },
  { id: 'development', name: '开发工具', icon: 'fa-code' },
  { id: 'utilities', name: '实用工具', icon: 'fa-wrench' },
];

// 从localStorage获取所有分类
export const getCategories = (): Category[] => {
  const categoriesJson = localStorage.getItem('categories');
  if (!categoriesJson) return defaultCategories;
  
  try {
    return JSON.parse(categoriesJson) as Category[];
  } catch (error) {
    console.error('Failed to parse categories:', error);
    return defaultCategories;
  }
};

// 添加新分类

// 获取所有分类并导出
export const toolCategories = getCategories();
export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const categories = getCategories();
  
  // 生成唯一ID
  const newId = 'cat_' + Date.now();
  
  const newCategory: Category = {
    ...category,
    id: newId
  };
  
  categories.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(categories));
  
  return newCategory;
};

// 更新分类
export const updateCategory = (id: string, updatedData: Partial<Omit<Category, 'id'>>): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex(cat => cat.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory = {
    ...categories[index],
    ...updatedData
  };
  
  categories[index] = updatedCategory;
  localStorage.setItem('categories', JSON.stringify(categories));
  
  return updatedCategory;
};

// 删除分类
export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const initialLength = categories.length;
  
  // 不能删除最后一个分类
  if (initialLength <= 1) {
    return false;
  }
  
  const filteredCategories = categories.filter(cat => cat.id !== id);
  
  if (filteredCategories.length === initialLength) return false;
  
  localStorage.setItem('categories', JSON.stringify(filteredCategories));
  
  // 更新使用该分类的工具
  const tools = getTools();
  const defaultCategoryId = filteredCategories[0].id;
  
  const updatedTools = tools.map(tool => 
    tool.category === id ? { ...tool, category: defaultCategoryId } : tool
  );
  
  localStorage.setItem('tools', JSON.stringify(updatedTools));
  
  return true;
};
// 默认工具数据
const defaultTools: Tool[] = [
  {
    id: '1',
    name: '在线计时器',
    description: '简单易用的在线计时器和秒表工具',
    icon: 'fa-clock',
    category: 'productivity',
    color: 'bg-blue-500',
    url: '#timer',
  },
  {
    id: '2',
    name: '单位转换器',
    description: '长度、重量、温度等各种单位转换',
    icon: 'fa-exchange-alt',
    category: 'utilities',
    color: 'bg-green-500',
    url: '#converter',
  },
  {
    id: '3',
    name: '代码格式化',
    description: '格式化各种编程语言代码，提高可读性',
    icon: 'fa-code',
    category: 'development',
    color: 'bg-purple-500',
    url: '#code-formatter',
  },
  {
    id: '4',
    name: '图片压缩',
    description: '在线压缩图片大小，保持画质',
    icon: 'fa-compress-arrows-alt',
    category: 'design',
    color: 'bg-red-500',
    url: '#image-compressor',
  },
  {
    id: '5',
    name: '在线便签',
    description: '快速记录想法和待办事项',
    icon: 'fa-sticky-note',
    category: 'productivity',
    color: 'bg-yellow-500',
    url: '#notes',
  },
  {
    id: '6',
    name: '颜色选择器',
    description: '选择和生成完美的颜色方案',
    icon: 'fa-palette',
    category: 'design',
    color: 'bg-indigo-500',
    url: '#color-picker',
  },
  {
    id: '7',
    name: 'JSON解析器',
    description: '格式化和验证JSON数据',
    icon: 'fa-file-code',
    category: 'development',
    color: 'bg-teal-500',
    url: '#json-parser',
  },
  {
    id: '8',
    name: '密码生成器',
    description: '创建安全的随机密码',
    icon: 'fa-key',
    category: 'utilities',
    color: 'bg-gray-500',
    url: '#password-generator',
  },
  {
    id: '9',
    name: '思维导图',
    description: '在线创建和编辑思维导图',
    icon: 'fa-project-diagram',
    category: 'productivity',
    color: 'bg-orange-500',
    url: '#mind-map',
  },
  {
    id: '10',
    name: '二维码生成',
    description: '将文本或URL转换为二维码',
    icon: 'fa-qrcode',
    category: 'utilities',
    color: 'bg-pink-500',
    url: '#qr-code',
  },
  {
    id: '11',
    name: '正则表达式测试',
    description: '测试和调试正则表达式',
    icon: 'fa-search',
    category: 'development',
    color: 'bg-cyan-500',
    url: '#regex-tester',
  },
  {
    id: '12',
    name: 'SVG编辑器',
    description: '在线创建和编辑SVG图形',
    icon: 'fa-draw-square',
    category: 'design',
    color: 'bg-lime-500',
    url: '#svg-editor',
  },
];

// 获取所有工具（从localStorage或使用默认数据）
export const getTools = (): Tool[] => {
  const storedTools = localStorage.getItem('tools');
  if (storedTools) {
    try {
      return JSON.parse(storedTools);
    } catch (error) {
      console.error('Failed to parse stored tools:', error);
      return defaultTools;
    }
  }
  return defaultTools;
};

// 添加新工具
export const addTool = (tool: Omit<Tool, 'id' | 'icon' | 'color'>): Tool => {
  const tools = getTools();
  
  // 为新工具生成ID
  const newId = (Math.max(...tools.map(t => parseInt(t.id)), 0) + 1).toString();
  
  // 根据分类分配默认颜色
  // 获取当前分类
  const categories = getCategories();
  const category = categories.find(cat => cat.id === tool.category);
  
  // 根据分类分配默认颜色和图标
  const defaultColors: Record<string, string> = {
    productivity: 'bg-blue-500',
    design: 'bg-purple-500',
    development: 'bg-green-500',
    utilities: 'bg-orange-500',
    default: 'bg-gray-500'
  };
  
  const newTool: Tool = {
    ...tool,
    id: newId,
    color: defaultColors[tool.category as keyof typeof defaultColors] || defaultColors.default,
    icon: category?.icon || 'fa-question'
  };
  
  tools.push(newTool);
  localStorage.setItem('tools', JSON.stringify(tools));
  
  return newTool;
};

// 更新工具
export const updateTool = (id: string, updatedData: Partial<Omit<Tool, 'id' | 'icon' | 'color'>>): Tool | null => {
  const tools = getTools();
  const index = tools.findIndex(tool => tool.id === id);
  
  if (index === -1) return null;
  
  // 如果分类变更，更新颜色和图标
  const shouldUpdateStyle = updatedData.category && updatedData.category !== tools[index].category;
  
  const categoryColors: Record<ToolCategory, string> = {
    productivity: 'bg-blue-500',
    design: 'bg-purple-500',
    development: 'bg-green-500',
    utilities: 'bg-orange-500'
  };
  
  const categoryIcons: Record<ToolCategory, string> = {
    productivity: 'fa-bolt',
    design: 'fa-paint-brush',
    development: 'fa-code',
    utilities: 'fa-wrench'
  };
  
  const updatedTool: Tool = {
    ...tools[index],
    ...updatedData,
    ...(shouldUpdateStyle && updatedData.category 
      ? { 
          color: categoryColors[updatedData.category as ToolCategory],
          icon: categoryIcons[updatedData.category as ToolCategory]
        } 
      : {})
  };
  
  tools[index] = updatedTool;
  localStorage.setItem('tools', JSON.stringify(tools));
  
  return updatedTool;
};

// 删除工具
export const deleteTool = (id: string): boolean => {
  const tools = getTools();
  const initialLength = tools.length;
  const filteredTools = tools.filter(tool => tool.id !== id);
  
  if (filteredTools.length === initialLength) return false;
  
  localStorage.setItem('tools', JSON.stringify(filteredTools));
  return true;
};
