import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "@/pages/Home";
import MessageBoard from "@/pages/MessageBoard";
import ToolManagement from "@/pages/ToolManagement";
import Login from "@/pages/Login";
import Blog from "@/pages/Blog";
import Resources from "@/pages/Resources";
import ResourceManagement from "@/pages/ResourceManagement";
import ResourceCategoryManagement from "@/pages/ResourceCategoryManagement";
import { AuthContext, AuthProvider } from '@/contexts/authContext';
import ArticleManagement from "@/pages/ArticleManagement";
import StyleManagement from "@/pages/StyleManagement";
import ArticleCategoryManagement from "@/pages/ArticleCategoryManagement";
import ArticlePage from "@/pages/ArticlePage";
import MakerHome from "@/pages/MakerHome";
import MakerApply from "@/pages/MakerApply";
import ProjectList from "@/pages/ProjectList";
import MyProjects from "@/pages/MyProjects";
import ProjectPublish from "@/pages/ProjectPublish";
import ProjectDetail from "@/pages/ProjectDetail";
import MakerManagement from "@/pages/MakerManagement";
import DatabaseManagement from "@/pages/DatabaseManagement";

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    // 如果未认证，重定向到登录页
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
       <div className="pt-24">
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/message-board" element={<MessageBoard />} />
         <Route path="/login" element={<Login />} />
         <Route 
           path="/tool-management" 
           element={
             <ProtectedRoute>
               <ToolManagement />
             </ProtectedRoute>
           } 
         />
         <Route 
           path="/article-management" 
           element={
             <ProtectedRoute>
               <ArticleManagement />
             </ProtectedRoute>
           } 
         />
         <Route 
           path="/article-category-management" 
           element={
             <ProtectedRoute>
               <ArticleCategoryManagement />
             </ProtectedRoute>
           } 
         />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/blog" element={<Blog />} />
            <Route 
             path="/style-management" 
             element={
               <ProtectedRoute>
                 <StyleManagement />
               </ProtectedRoute>
             } 
           />
             <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
               <Route path="/maker" element={<MakerHome />} />
               <Route path="/maker/projects" element={<ProjectList />} />
               <Route path="/maker/my-projects" element={<MyProjects />} />
               <Route path="/maker/projects/publish" element={<ProjectPublish />} />
               <Route path="/maker/projects/:id" element={<ProjectDetail />} />
             <Route path="/maker/apply" element={<MakerApply />} />
             <Route 
               path="/maker/manage" 
               element={
                 <ProtectedRoute>
                   <MakerManagement />
                 </ProtectedRoute>
               } 
             />
            <Route path="/resources" element={<Resources />} />
            <Route 
              path="/resource-management" 
              element={
                <ProtectedRoute>
                  <ResourceManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resource-category-management" 
              element={
                <ProtectedRoute>
                  <ResourceCategoryManagement />
                </ProtectedRoute>
              } 
            />
             <Route 
               path="/database-management" 
               element={
                 <ProtectedRoute>
                   <DatabaseManagement />
                 </ProtectedRoute>
               } 
             />
          <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
       </div>
    </AuthProvider>
  );
}