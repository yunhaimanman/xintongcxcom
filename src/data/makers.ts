import { v4 as uuidv4 } from 'uuid';

// 创客会员类型定义
export interface Maker {
  id: string;
  username: string;
  password: string;
  name: string;
  company: string;
  contact: string; // 联系方式
  projectInfo: string;
  isAuthorized: boolean;
  authCode?: string;
  积分: number;
  joinDate: Date;
  projects: string[]; // 参与的项目ID列表
  teams: string[]; // 参与的小组ID列表
}

// 授权码类型定义
export interface AuthCode {
  id: string;
  code: string;
  isUsed: boolean;
  initialPoints: number; // 初始积分
  createdAt: Date;
  usedBy?: string; // 使用者ID
  usedAt?: Date;
}

// 项目类型定义
export interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  members: string[]; // 成员ID列表
  status: 'open' | 'in_progress' | 'completed';
  requirements: string;
  tags: string[];
}

// 创业小组类型定义
export interface Team {
  id: string;
  name: string;
  projectId: string;
  members: string[]; // 成员ID列表
  leaderId: string;
  createdAt: Date;
}

// 默认授权码数据
const defaultAuthCodes: AuthCode[] = [
  {
    id: 'auth_1',
    code: 'MAKER2025001',
    isUsed: false,
    initialPoints: 100,
    createdAt: new Date()
  },
  {
    id: 'auth_2',
    code: 'MAKER2025002',
    isUsed: false,
    initialPoints: 200,
    createdAt: new Date()
  },
  {
    id: 'auth_3',
    code: 'MAKER2025003',
    isUsed: false,
    initialPoints: 150,
    createdAt: new Date()
  }
];

// 默认创客数据
const defaultMakers: Maker[] = [
  {
    id: 'maker_1',
    username: 'innovator',
    password: 'maker123',
    name: '创新者团队',
    company: '未来科技有限公司',
    contact: 'contact@example.com',
    projectInfo: '专注于AI技术研发与应用',
    isAuthorized: true,
    authCode: 'MAKER2025001',
    积分: 100,
    joinDate: new Date(),
    projects: [],
    teams: []
  }
];

// 默认项目数据
export const defaultProjects: Project[] = [
  {
    id: 'project_1',
    title: '人工智能助手开发',
    description: '开发一款基于GPT的智能助手应用，用于提高工作效率',
    creatorId: 'maker_1',
    creatorName: '创新者团队',
    createdAt: new Date(),
    members: ['maker_1'],
    status: 'open',
    requirements: '需要前端、后端和AI算法工程师',
    tags: ['AI', '应用开发', '效率工具']
  }
];
  
  // 确保默认项目始终可用
  console.log('Default projects initialized:', defaultProjects);

// 默认团队数据
const defaultTeams: Team[] = [];

// 创客相关本地存储操作

// 授权码相关函数
export const getAuthCodes = (): AuthCode[] => {
  const codesJson = localStorage.getItem('makerAuthCodes');
  if (!codesJson) return defaultAuthCodes;
  
  try {
    return JSON.parse(codesJson) as AuthCode[];
  } catch (error) {
    console.error('Failed to parse auth codes:', error);
    return defaultAuthCodes;
  }
};

export const generateAuthCode = (initialPoints: number = 100): AuthCode => {
  const codes = getAuthCodes();
  
  // 生成随机授权码
  const newCode = 'MAKER' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  const newAuthCode: AuthCode = {
    id: 'auth_' + Date.now(),
    code: newCode,
    isUsed: false,
    initialPoints,
    createdAt: new Date()
  };
  
  codes.push(newAuthCode);
  localStorage.setItem('makerAuthCodes', JSON.stringify(codes));
  
  return newAuthCode;
};

export const validateAuthCode = (code: string): {valid: boolean, points?: number} => {
  const codes = getAuthCodes();
  const foundCode = codes.find(c => c.code === code && !c.isUsed);
  
  return foundCode ? {valid: true, points: foundCode.initialPoints} : {valid: false};
};

export const markAuthCodeAsUsed = (code: string, makerId: string): {success: boolean, points?: number} => {
  const codes = getAuthCodes();
  const codeIndex = codes.findIndex(c => c.code === code && !c.isUsed);
  
  if (codeIndex === -1) return {success: false};
  
  const points = codes[codeIndex].initialPoints;
  
  codes[codeIndex].isUsed = true;
  codes[codeIndex].usedBy = makerId;
  codes[codeIndex].usedAt = new Date();
  
  localStorage.setItem('makerAuthCodes', JSON.stringify(codes));
  
  // 更新创客积分
  updateMaker积分(makerId, points);
  
  return {success: true, points};
};

// 创客相关函数
export const getMakers = (): Maker[] => {
  const makersJson = localStorage.getItem('makers');
  if (!makersJson) return defaultMakers;
  
  try {
    return JSON.parse(makersJson) as Maker[];
  } catch (error) {
    console.error('Failed to parse makers:', error);
    return defaultMakers;
  }
};

export const getMakerById = (id: string): Maker | null => {
  const makers = getMakers();
  const maker = makers.find(m => m.id === id);
  return maker || null;
};

export const getMakerByUsername = (username: string): Maker | null => {
  const makers = getMakers();
  const maker = makers.find(m => m.username === username);
  return maker || null;
};

export const addMaker = (makerData: Omit<Maker, 'id' | 'joinDate' | '积分' | 'projects' | 'teams'>): Maker => {
  const makers = getMakers();
  
  const newMaker: Maker = {
    ...makerData,
    id: 'maker_' + Date.now(),
    joinDate: new Date(),
    积分: 0,
    projects: [],
    teams: []
  };
  
  makers.push(newMaker);
  localStorage.setItem('makers', JSON.stringify(makers));
  
  return newMaker;
};

export const updateMakerPassword = (makerId: string, newPassword: string): boolean => {
  const makers = getMakers();
  const makerIndex = makers.findIndex(m => m.id === makerId);
  
  if (makerIndex === -1) return false;
  
  makers[makerIndex].password = newPassword;
  localStorage.setItem('makers', JSON.stringify(makers));
  return true;
};

export const updateMaker积分 = (makerId: string, points: number): boolean => {
  const makers = getMakers();
  const makerIndex = makers.findIndex(m => m.id === makerId);
  
  if (makerIndex === -1) return false;
  
  makers[makerIndex].积分 += points;
  localStorage.setItem('makers', JSON.stringify(makers));
  return true;
};

// 项目相关函数
export const getProjects = (): Project[] => {
  const projectsJson = localStorage.getItem('makerProjects');
  if (!projectsJson) return defaultProjects;
  
  try {
    const projects = JSON.parse(projectsJson) as Project[];
    
    // Convert string dates back to Date objects
    return projects.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
    }));
  } catch (error) {
    console.error('Failed to parse projects:', error);
    
    // Try to recover by returning default projects with proper dates
    return defaultProjects.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
    }));
  }
};

export const getProjectsByCreator = (creatorId: string): Project[] => {
  const projects = getProjects();
  return projects.filter(project => project.creatorId === creatorId);
};

export const getProjectById = (id: string): Project | null => {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  return project || null;
};

export const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'members'>): Project => {
  const projects = getProjects();
  
  const newProject: Project = {
    ...projectData,
    id: 'project_' + Date.now(),
    createdAt: new Date(),
    members: [projectData.creatorId]
  };
  
  projects.push(newProject);
  localStorage.setItem('makerProjects', JSON.stringify(projects));
  
  // 更新创客的项目列表
  const makers = getMakers();
  const makerIndex = makers.findIndex(m => m.id === projectData.creatorId);
  
  if (makerIndex !== -1) {
    makers[makerIndex].projects.push(newProject.id);
    localStorage.setItem('makers', JSON.stringify(makers));
  }
  
  return newProject;
};

export const joinProject = (projectId: string, makerId: string): boolean => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return false;
  
  // 检查用户是否已在项目中
  if (projects[projectIndex].members.includes(makerId)) return true;
  
  projects[projectIndex].members.push(makerId);
  localStorage.setItem('makerProjects', JSON.stringify(projects));
  
  // 更新创客的项目列表
  const makers = getMakers();
  const makerIndex = makers.findIndex(m => m.id === makerId);
  
  if (makerIndex !== -1) {
    makers[makerIndex].projects.push(projectId);
    localStorage.setItem('makers', JSON.stringify(makers));
  }
  
  return true;
};

// 团队相关函数
export const getTeams = (): Team[] => {
  const teamsJson = localStorage.getItem('makerTeams');
  if (!teamsJson) return defaultTeams;
  
  try {
    return JSON.parse(teamsJson) as Team[];
  } catch (error) {
    console.error('Failed to parse teams:', error);
    return defaultTeams;
  }
};

export const getTeamsByMember = (makerId: string): Team[] => {
  const teams = getTeams();
  return teams.filter(team => team.members.includes(makerId));
};

export const createTeam = (teamData: Omit<Team, 'id' | 'createdAt'>): Team => {
  const teams = getTeams();
  
  const newTeam: Team = {
    ...teamData,
    id: 'team_' + Date.now(),
    createdAt: new Date()
  };
  
  teams.push(newTeam);
  localStorage.setItem('makerTeams', JSON.stringify(teams));
  
  // 更新创客的团队列表
  const makers = getMakers();
  teamData.members.forEach(memberId => {
    const makerIndex = makers.findIndex(m => m.id === memberId);
    if (makerIndex !== -1) {
      if (!makers[makerIndex].teams.includes(newTeam.id)) {
        makers[makerIndex].teams.push(newTeam.id);
      }
    }
  });
  
  localStorage.setItem('makers', JSON.stringify(makers));
  
  return newTeam;
};

// 创客登录验证
export const validateMakerLogin = (username: string, password: string): Maker | null => {
  const makers = getMakers();
  const maker = makers.find(m => m.username === username && m.password === password);
  
  return maker || null;
};