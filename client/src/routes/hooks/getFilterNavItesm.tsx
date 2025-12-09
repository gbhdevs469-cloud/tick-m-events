import { NavItem, UserRole } from "src/layouts/config-nav-dashboard";

export const getFilteredNavItems = (navItems: NavItem[], userRole?: UserRole): NavItem[] => {
    if (!userRole) return []; // Or return common items only
    
    return navItems.filter(item => {
      // If no roles specified, show to all
      if (!item.roles) return true;
      
      // Check if user's role is included
      const hasAccess = item.roles.includes(userRole);
      
      // Filter children recursively if they exist
      if (item.children) {
        const filteredChildren = getFilteredNavItems(item.children, userRole);
        return hasAccess || filteredChildren.length > 0;
      }
      
      return hasAccess;
    });
  };