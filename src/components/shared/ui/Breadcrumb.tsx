import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  separator = (
    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  className = '',
}) => {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if no items provided
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbsFromPath(location.pathname);

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 flex-shrink-0">
                {separator}
              </span>
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              >
                {item.icon && (
                  <span className="mr-1.5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900 flex items-center">
                {item.icon && (
                  <span className="mr-1.5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from current path
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add home
  breadcrumbs.push({
    label: 'Inicio',
    href: '/',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  });

  // Add path segments
  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = isLast ? undefined : '/' + pathSegments.slice(0, index + 1).join('/');
    
    breadcrumbs.push({
      label: capitalize(segment.replace(/-/g, ' ')),
      href,
    });
  });

  return breadcrumbs;
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default Breadcrumb;
