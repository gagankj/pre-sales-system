import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems = [
    { name: 'Dashboard', href: '/', icon: Home }
  ];

  // Generate breadcrumb items based on current path
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    let name = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Custom names for specific routes
    switch (segment) {
      case 'leads':
        name = index === pathSegments.length - 1 ? 'Lead Management' : 'Leads';
        break;
      case 'add':
        name = 'Add New Lead';
        break;
      case 'followups':
        name = 'Follow-ups';
        break;
      case 'meetings':
        name = 'Meetings & Demos';
        break;
      case 'campaigns':
        name = 'Email Campaigns';
        break;
      case 'notifications':
        name = 'Notifications';
        break;
    }

    breadcrumbItems.push({
      name,
      href: currentPath
    });
  });

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
            )}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-sm font-medium text-gray-500 flex items-center">
                {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;