import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  className = '',
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        className="text-slate-400 hover:text-cpvs-blue transition-colors focus:outline-none p-0.5 rounded-full hover:bg-slate-100 cursor-help"
        aria-label="Más información"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isVisible && (
        <div 
          className={`absolute z-50 w-56 sm:w-64 p-2.5 text-xs text-white bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl pointer-events-none transition-opacity duration-150 border border-slate-700/80 leading-relaxed font-normal normal-case tracking-normal ${getPositionClasses()}`}
          role="tooltip"
        >
          {content}
          {/* Triangulito decorativo */}
          <div 
            className={`absolute w-2 h-2 bg-slate-900 border-slate-700/80 transform rotate-45 ${
              position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2 border-t border-r' :
              position === 'right' ? '-left-1 top-1/2 -translate-y-1/2 border-b border-l' :
              '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
};
