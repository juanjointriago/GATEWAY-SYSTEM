import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-gray-300',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const interactiveClasses = onClick || hoverable ? 'cursor-pointer hover:shadow-lg' : '';
  const variantClasses = variants[variant];
  const paddingClasses = paddings[padding];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${paddingClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Card;
