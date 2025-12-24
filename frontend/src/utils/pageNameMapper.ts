/**
 * Maps page paths to friendly, human-readable page names
 */
export const getPageName = (path: string, title?: string): string => {
  // If title is provided and not empty, use it
  if (title && title.trim()) {
    return title;
  }

  // Normalize path
  const normalizedPath = path.toLowerCase().trim();

  // Map common paths to friendly names
  const pageNameMap: Record<string, string> = {
    // Homepage
    '/': 'Home Page',
    '/index': 'Home Page',
    '/home': 'Home Page',

    // Main pages
    '/make-claim': 'Make a Claim',
    '/contact': 'Contact Us',
    '/our-fleet': 'Our Fleet',
    '/car-sales': 'Car Sales',
    '/car-sale-buy': 'Car Sale/Buy',
    '/about': 'About Us',
    '/our-blogs': 'Our Blogs',
    '/what-we-do': 'Services',

    // Services
    '/personal-assistance': 'Personal Assistance',
    '/introducer-support': 'Introducer Support',
    '/insurance-services': 'Insurance Services',
    '/replacement-vehicle': 'Replacement Vehicle',
    '/accident-claim-management': 'Accident Claim Management',
    '/car-recovery-and-storage': 'Car Recovery and Storage',
    '/accidental-repair': 'Accidental Repair',
    '/personal-injury-claim': 'Personal Injury Claim',
    '/pco-replacement': 'Taxi Replacement/PCO Replacement',
    '/road-traffic-accidents': 'Road Traffic Accidents',

    // Admin pages (if tracked)
    '/admin/login': 'Admin Login',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/dashboard/operations': 'Client Operations',
    '/admin/register': 'Admin Register',

    // Common patterns

    '/services': 'Services',
    '/gallery': 'Gallery',
    '/faq': 'FAQ',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms & Conditions',
  };

  // Direct match
  if (pageNameMap[normalizedPath]) {
    return pageNameMap[normalizedPath];
  }

  // Check for partial matches (e.g., /news/123)
  for (const [key, value] of Object.entries(pageNameMap)) {
    if (normalizedPath.startsWith(key)) {
      // For dynamic routes, try to extract meaningful info
      if (normalizedPath.includes('/news/') || normalizedPath.includes('/blog/')) {
        return 'News Article';
      }
      if (normalizedPath.includes('/car-sales/')) {
        return 'Car Listing';
      }
      return value;
    }
  }

  // Try to extract from path segments
  const segments = normalizedPath.split('/').filter(Boolean);
  if (segments.length > 0) {
    // Capitalize and format the last segment
    const lastSegment = segments[segments.length - 1];
    const formatted = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formatted;
  }

  // Fallback: return the path itself, cleaned up
  return path
    .split('/')
    .filter(Boolean)
    .map(segment =>
      segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' > ') || 'Unknown Page';
};


