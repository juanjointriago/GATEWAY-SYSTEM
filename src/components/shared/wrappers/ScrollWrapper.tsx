import { useEffect, useState } from 'react';

interface ScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollWrapper = ({ children, className = '' }: ScrollWrapperProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`
        ${isMobile 
          ? 'overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch' 
          : 'overflow-auto'
        }
        ${className}
      `}
      style={{
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'auto',
        scrollbarWidth: 'thin'
      }}
    >
      {children}
    </div>
  );
};
