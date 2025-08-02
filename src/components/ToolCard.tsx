import { Tool } from '@/data/tools';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { style } = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group"
    >
        <a 
          href={tool.url} 
          className={`flex flex-col items-center p-5 ${style.variables.cardColor} ${style.variables.borderColor} ${style.variables.borderRadius || 'rounded-xl'} ${style.variables.shadow || 'shadow-md'} hover:shadow-lg transition-all duration-300 h-full`}
       >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white mb-4",
          tool.color,
          "group-hover:opacity-90 transition-opacity"
        )}>
          <i className={`fa-solid ${tool.icon} text-xl`}></i>
        </div>
        <h3 className="text-lg font-semibold text-center mb-1 text-gray-800 dark:text-white">{tool.name}</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
      </a>
    </motion.div>
  );
}