import { useLocation } from 'react-router-dom';

function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="mobile-nav">
      <ul>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <a 
                href={item.path}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileNav;