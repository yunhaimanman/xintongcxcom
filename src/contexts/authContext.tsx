import { createContext, useState, ReactNode, PropsWithChildren } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username?: string;
  setIsAuthenticated: (value: boolean, username?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
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

  const updateAuthStatus = (value: boolean, user?: string) => {
    setIsAuthenticated(value);
    
    // 保存到localStorage
    localStorage.setItem('isAuthenticated', value.toString());
    
    if (user) {
      setUsername(user);
      localStorage.setItem('username', user);
    } else if (!value) {
      setUsername(undefined);
      localStorage.removeItem('username');
    }
  };

  const logout = () => {
    updateAuthStatus(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username,
      setIsAuthenticated: updateAuthStatus, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}