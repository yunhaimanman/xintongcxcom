import { Tool, Category } from '@/data/tools';
import ToolCard from './ToolCard';
import { useTheme } from '@/hooks/useTheme';

interface ToolCategoryProps {
  category: Category;
  tools: Tool[];
}

export default function ToolCategory({ category, tools }: ToolCategoryProps) {
  const { style } = useTheme();
  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
         <div className={`w-10 h-10 rounded-full ${style.variables.secondaryColor} flex items-center justify-center ${style.variables.primaryTextColor} mr-.3`}>
           <i className={`fa-solid ${category.icon}`}></i>
         </div>
         <h2 className={`text-2xl font-bold ${style.variables.primaryTextColor}`}>{category.name}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}