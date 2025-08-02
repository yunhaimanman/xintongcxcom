

// Style type definition
export interface AppStyle {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  variables: Record<string, string>;
}

// Default styles
const defaultStyles: AppStyle[] = [
   {
     id: 'default',
     name: '默认风格',
     description: '专业稳重的蓝色系风格',
     isDefault: true,
     variables: {
       primaryColor: 'bg-blue-600',
       secondaryColor: 'bg-blue-100 dark:bg-blue-900/40',
       accentColor: 'bg-indigo-500',
       textColor: 'text-gray-800 dark:text-gray-200',
       backgroundColor: 'bg-gray-50 dark:bg-gray-900',
       cardColor: 'bg-white dark:bg-gray-800',
       borderColor: 'border-blue-100 dark:border-blue-900/30',
       borderRadius: 'rounded-xl',
       shadow: 'shadow-md',
       headerBg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950',
       primaryTextColor: 'text-blue-700 dark:text-blue-400',
       sectionBg: 'bg-blue-50 dark:bg-blue-900/20'
     }
   },
   {
     id: 'modern',
     name: '现代风格',
     description: '简约高级的中性色系风格',
     isDefault: false,
     variables: {
       primaryColor: 'bg-gray-800 dark:bg-gray-700',
       secondaryColor: 'bg-gray-100 dark:bg-gray-800',
       accentColor: 'bg-amber-500',
       textColor: 'text-gray-900 dark:text-gray-100',
       backgroundColor: 'bg-gray-50 dark:bg-gray-950',
       cardColor: 'bg-white dark:bg-gray-900',
       borderColor: 'border-gray-200 dark:border-gray-800',
       borderRadius: 'rounded-lg',
       shadow: 'shadow-sm',
       headerBg: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900',
       primaryTextColor: 'text-gray-800 dark:text-gray-200',
       sectionBg: 'bg-gray-50 dark:bg-gray-900'
     }
   },
   {
     id: 'vibrant',
     name: '活力风格',
     description: '鲜艳活力的橙紫色系风格，充满现代感',
     isDefault: false,
     variables: {
       primaryColor: 'bg-gradient-to-r from-orange-500 to-pink-500',
       secondaryColor: 'bg-orange-50 dark:bg-orange-900/30',
       accentColor: 'bg-purple-500',
       textColor: 'text-gray-900 dark:text-white',
       backgroundColor: 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-purple-950',
       cardColor: 'bg-white dark:bg-gray-800/80 backdrop-blur-sm',
       borderColor: 'border-orange-100 dark:border-orange-900/30',
       shadow: 'shadow-lg dark:shadow-orange-900/10',
       borderRadius: 'rounded-2xl',
       headerBg: 'bg-gradient-to-r from-orange-50 to-pink-50 dark:from-purple-950 dark:to-orange-950',
       primaryTextColor: 'text-orange-600 dark:text-orange-400',
       sectionBg: 'bg-orange-50 dark:bg-orange-900/20'
     }
   }
 ];

// Get all styles
export const getStyles = (): AppStyle[] => {
  const stylesJson = localStorage.getItem('appStyles');
  if (!stylesJson) return defaultStyles;
  
  try {
    return JSON.parse(stylesJson) as AppStyle[];
  } catch (error) {
    console.error('Failed to parse styles:', error);
    return defaultStyles;
  }
};

// Get current selected style
export const getCurrentStyle = (): AppStyle => {
  const currentStyleId = localStorage.getItem('currentStyleId');
  const styles = getStyles();
  
  if (currentStyleId) {
    const savedStyle = styles.find(style => style.id === currentStyleId);
    if (savedStyle) return savedStyle;
  }
  
  // Return default style if no style is selected
  return styles.find(style => style.isDefault) || styles[0];
};

// Set current style
export const setCurrentStyle = (styleId: string): boolean => {
  const styles = getStyles();
  const style = styles.find(s => s.id === styleId);
  
  if (!style) return false;
  
  localStorage.setItem('currentStyleId', styleId);
  
  // Dispatch event to notify app of style change
  window.dispatchEvent(new Event('styleChanged'));
  return true;
};

// Add new style
export const addStyle = (style: Omit<AppStyle, 'id'>): AppStyle => {
  const styles = getStyles();
  
  // Generate unique ID
  const newId = 'style_' + Date.now();
  
  const newStyle: AppStyle = {
    ...style,
    id: newId
  };
  
  // If this is set as default, unset other defaults
  if (newStyle.isDefault) {
    styles.forEach(s => s.isDefault = false);
  }
  
  styles.push(newStyle);
  localStorage.setItem('appStyles', JSON.stringify(styles));
  
  return newStyle;
};

// Update style
export const updateStyle = (id: string, updatedData: Partial<AppStyle>): AppStyle | null => {
  const styles = getStyles();
  const index = styles.findIndex(style => style.id === id);
  
  if (index === -1) return null;
  
  // If this is set as default, unset other defaults
  if (updatedData.isDefault) {
    styles.forEach(s => s.isDefault = false);
  }
  
  const updatedStyle = {
    ...styles[index],
    ...updatedData
  };
  
  styles[index] = updatedStyle;
  localStorage.setItem('appStyles', JSON.stringify(styles));
  
  // If this is the current style, update it
  if (getCurrentStyle().id === id) {
    setCurrentStyle(id);
  }
  
  return updatedStyle;
};