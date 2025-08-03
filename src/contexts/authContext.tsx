import { createContext, useState, ReactNode, PropsWithChildren, useEffect } from "react";
import { Maker, getMakers } from '@/data/makers';

interface AuthContextType {
  isAuthenticated: boolean;
  username?: string;
  userRole: 'admin' | 'maker' | 'visitor';
  currentMaker?: Maker;
  setIsAuthenticated: (value: boolean, username?: string, role?: 'admin' | 'maker') => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: 'visitor',
  setIsAuthenticated: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  // 从localStorage加载认证状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });
  
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('username') || undefined;
  });
  
  const [userRole, setUserRole] = useState<'admin' | 'maker' | 'visitor'>(() => {
    const role = localStorage.getItem('userRole');
    return role === 'admin' ? 'admin' : role === 'maker' ? 'maker' : 'visitor';
  });
  
  const [currentMaker, setCurrentMaker] = useState<Maker>();

  useEffect(() => {
    // 如果是创客角色，加载创客信息
    if (userRole === 'maker' && username) {
      const makers = getMakers();
      const maker = makers.find(m => m.username === username);
      setCurrentMaker(maker);
    } else {
      setCurrentMaker(undefined);
    }
  }, [userRole, username]);

  const updateAuthStatus = (value: boolean, user?: string, role?: 'admin' | 'maker') => {
    setIsAuthenticated(value);
    
    // 保存到localStorage
    localStorage.setItem('isAuthenticated', value.toString());
    
    if (user && role) {
      setUsername(user);
      setUserRole(role);
      localStorage.setItem('username', user);
      localStorage.setItem('userRole', role);
    } else if (!value) {
      setUsername(undefined);
      setUserRole('visitor');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
  };

  const logout = () => {
    updateAuthStatus(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username,
      userRole,
      currentMaker,
      setIsAuthenticated: updateAuthStatus, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}