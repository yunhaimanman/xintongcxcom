import { v4 as uuidv4 } from 'uuid';

// 云盘链接类型定义
export interface CloudLink {
  id: string;
  name: string; // 云盘名称（如：百度云、阿里云等）
  url: string; // 云盘链接
}

// 资料项类型定义
export interface ResourceItem {
  id: string;
  name: string; // 资料名称
  description?: string; // 资料描述
  categoryId: string; // 所属分类ID
  links: CloudLink[]; // 云盘链接列表
  createdAt: Date;
  updatedAt: Date;
}

// 资料分类类型定义
export interface ResourceCategory {
  id: string;
  name: string; // 分类名称
  description?: string; // 分类描述
  icon: string; // 分类图标
}

// 默认资料分类
const defaultCategories: ResourceCategory[] = [
  { 
    id: 'category_1', 
    name: '学习资料', 
    description: '各类学习资源和教程', 
    icon: 'fa-book' 
  },
  { 
    id: 'category_2', 
    name: '软件工具', 
    description: '实用软件和工具安装包', 
    icon: 'fa-tools' 
  },
  { 
    id: 'category_3', 
    name: '文档模板', 
    description: '各类文档模板和格式', 
    icon: 'fa-file-alt' 
  }
];

// 默认资料项
const defaultResources: ResourceItem[] = [
  {
    id: 'resource_1',
    name: 'React 学习教程',
    description: 'React官方文档和入门教程',
    categoryId: 'category_1',
    links: [
      { id: 'link_1', name: '百度云', url: 'https://pan.baidu.com/s/1reacttutorial' },
      { id: 'link_2', name: '阿里云', url: 'https://aliyunpan.com/reacttutorial' }
    ],
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-15')
  },
  {
    id: 'resource_2',
    name: 'VS Code 安装包',
    description: 'VS Code最新版安装包，包含常用插件',
    categoryId: 'category_2',
    links: [
      { id: 'link_3', name: '腾讯云', url: 'https://cloud.tencent.com/vscode' },
      { id: 'link_4', name: '百度云', url: 'https://pan.baidu.com/s/2vscodeinstaller' }
    ],
    createdAt: new Date('2025-07-20'),
    updatedAt: new Date('2025-07-20')
  }
];

// 资料分类相关函数
export const getResourceCategories = (): ResourceCategory[] => {
  const categoriesJson = localStorage.getItem('resourceCategories');
  if (!categoriesJson) return defaultCategories;
  
  try {
    return JSON.parse(categoriesJson) as ResourceCategory[];
  } catch (error) {
    console.error('Failed to parse resource categories:', error);
    return defaultCategories;
  }
};

export const addResourceCategory = (category: Omit<ResourceCategory, 'id'>): ResourceCategory => {
  const categories = getResourceCategories();
  
  const newCategory: ResourceCategory = {
    ...category,
    id: 'res_cat_' + Date.now()
  };
  
  categories.push(newCategory);
  localStorage.setItem('resourceCategories', JSON.stringify(categories));
  
  return newCategory;
};

export const updateResourceCategory = (id: string, updatedData: Partial<Omit<ResourceCategory, 'id'>>): ResourceCategory | null => {
  const categories = getResourceCategories();
  const index = categories.findIndex(cat => cat.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory = {
    ...categories[index],
    ...updatedData
  };
  
  categories[index] = updatedCategory;
  localStorage.setItem('resourceCategories', JSON.stringify(categories));
  
  return updatedCategory;
};

export const deleteResourceCategory = (id: string): boolean => {
  const categories = getResourceCategories();
  const initialLength = categories.length;
  
  if (initialLength <= 1) {
    return false;
  }
  
  const filteredCategories = categories.filter(cat => cat.id !== id);
  
  if (filteredCategories.length === initialLength) return false;
  
  localStorage.setItem('resourceCategories', JSON.stringify(filteredCategories));
  
  // 更新使用该分类的资料
  const resources = getResourceItems();
  const defaultCategoryId = filteredCategories[0].id;
  
  const updatedResources = resources.map(resource => 
    resource.categoryId === id ? { ...resource, categoryId: defaultCategoryId } : resource
  );
  
  localStorage.setItem('resources', JSON.stringify(updatedResources));
  
  return true;
};

// 资料项相关函数
export const getResourceItems = (): ResourceItem[] => {
  const resourcesJson = localStorage.getItem('resources');
  if (!resourcesJson) return defaultResources;
  
  try {
    const resources = JSON.parse(resourcesJson) as ResourceItem[];
    return resources.map(resource => ({
      ...resource,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to parse resources:', error);
    return defaultResources;
  }
};

export const getResourcesByCategory = (categoryId: string): ResourceItem[] => {
  const resources = getResourceItems();
  return resources.filter(resource => resource.categoryId === categoryId);
};

export const addResourceItem = (resource: Omit<ResourceItem, 'id' | 'createdAt' | 'updatedAt'>): ResourceItem => {
  const resources = getResourceItems();
  const now = new Date();
  
  const newResource: ResourceItem = {
    ...resource,
    id: 'res_' + Date.now(),
    createdAt: now,
    updatedAt: now
  };
  
  resources.push(newResource);
  localStorage.setItem('resources', JSON.stringify(resources));
  
  return newResource;
};

export const updateResourceItem = (id: string, updatedData: Partial<Omit<ResourceItem, 'id' | 'createdAt' | 'updatedAt'>>): ResourceItem | null => {
  const resources = getResourceItems();
  const index = resources.findIndex(resource => resource.id === id);
  
  if (index === -1) return null;
  
  const updatedResource = {
    ...resources[index],
    ...updatedData,
    updatedAt: new Date()
  };
  
  resources[index] = updatedResource;
  localStorage.setItem('resources', JSON.stringify(resources));
  
  return updatedResource;
};

export const deleteResourceItem = (id: string): boolean => {
  const resources = getResourceItems();
  const initialLength = resources.length;
  
  const filteredResources = resources.filter(resource => resource.id !== id);
  
  if (filteredResources.length === initialLength) return false;
  
  localStorage.setItem('resources', JSON.stringify(filteredResources));
  
  return true;
};

// 云盘链接相关函数
export const addResourceLink = (resourceId: string, link: Omit<CloudLink, 'id'>): CloudLink | null => {
  const resources = getResourceItems();
  const index = resources.findIndex(resource => resource.id === resourceId);
  
  if (index === -1) return null;
  
  const newLink: CloudLink = {
    ...link,
    id: 'link_' + Date.now()
  };
  
  resources[index].links.push(newLink);
  resources[index].updatedAt = new Date();
  
  localStorage.setItem('resources', JSON.stringify(resources));
  
  return newLink;
};

export const updateResourceLink = (resourceId: string, linkId: string, updatedData: Partial<CloudLink>): CloudLink | null => {
  const resources = getResourceItems();
  const resourceIndex = resources.findIndex(resource => resource.id === resourceId);
  
  if (resourceIndex === -1) return null;
  
  const resource = resources[resourceIndex];
  const linkIndex = resource.links.findIndex(link => link.id === linkId);
  
  if (linkIndex === -1) return null;
  
  const updatedLink = {
    ...resource.links[linkIndex],
    ...updatedData
  };
  
  resource.links[linkIndex] = updatedLink;
  resource.updatedAt = new Date();
  
  resources[resourceIndex] = resource;
  localStorage.setItem('resources', JSON.stringify(resources));
  
  return updatedLink;
};

export const deleteResourceLink = (resourceId: string, linkId: string): boolean => {
  const resources = getResourceItems();
  const resourceIndex = resources.findIndex(resource => resource.id === resourceId);
  
  if (resourceIndex === -1) return false;
  
  const resource = resources[resourceIndex];
  const initialLinkCount = resource.links.length;
  
  resource.links = resource.links.filter(link => link.id !== linkId);
  
  if (resource.links.length === initialLinkCount) return false;
  
  resource.updatedAt = new Date();
  resources[resourceIndex] = resource;
  
  localStorage.setItem('resources', JSON.stringify(resources));
  
  return true;
};