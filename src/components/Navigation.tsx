import { motion, LayoutGroup } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';

const translations = {
  en: {
    home: 'Home',
    sign: 'Have Your Say',
    about: 'About',
  },
  cy: {
    home: 'Hafan',
    sign: 'Cael Eich Dweud',
    about: 'Ynghylch',
  },
};

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { isNavigating, setIsNavigating } = useNavigationContext();
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { path: '/', label: t.home },
    { path: '/sign', label: t.sign },
    { path: '/about', label: t.about },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setHoveredPath(null);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
        <LayoutGroup>
          <div className="flex justify-between items-center h-16">
            {/* Desktop Navigation - Left aligned */}
            <div
              className="hidden md:flex space-x-8 relative"
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isHovered = hoveredPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-3 py-2 text-sm font-medium relative"
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onClick={() => setIsNavigating(true)}
                  >
                    <span className={`relative z-10 transition-colors duration-200 ${
                      (isActive && hoveredPath === null) || isHovered ? 'text-white' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>

                    {/* Combined active and hover states for a seamless transition */}
                    {(isHovered || (isActive && hoveredPath === null)) && !isNavigating && (
                      <motion.div
                        layoutId="desktop-nav-indicator"
                        className={`absolute inset-0 rounded-md z-0 ${
                          isHovered && !isActive ? 'bg-brand-blue/50' : 'bg-brand-blue'
                        }`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        initial={false}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Language Toggle and Mobile Menu Button */}
            <div className="flex items-center">
              {/* Language Toggle - Desktop */}
              <div className="hidden md:flex items-center mr-4">
                <motion.div
                  className="flex items-center bg-gray-200 rounded-full p-1 cursor-pointer relative"
                  onTap={() => setLanguage(language === 'en' ? 'cy' : 'en')}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center relative z-10">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-gray-600'}`}>
                      EN
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${language === 'cy' ? 'text-white' : 'text-gray-600'}`}>
                      CY
                    </span>
                  </div>
                  {/* Desktop language toggle - only animate when not navigating */}
                  {!isNavigating && (
                    <motion.div
                      className="absolute top-0 left-0 h-full w-1/2 bg-brand-blue rounded-full z-0"
                      layoutId="desktop-language-toggle"
                      initial={false}
                      animate={{ x: language === 'en' ? '0%' : '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Fallback positioning when navigating */}
                  {isNavigating && (
                    <div
                      className="absolute top-0 left-0 h-full w-1/2 bg-brand-blue rounded-full z-0 transition-transform duration-200"
                      style={{ transform: language === 'en' ? 'translateX(0%)' : 'translateX(100%)' }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-brand-blue"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </LayoutGroup>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <LayoutGroup>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${
                      location.pathname === item.path ? 'text-white' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {location.pathname === item.path && !isNavigating && (
                      <motion.div
                        layoutId="mobile-active-link"
                        className="absolute inset-0 bg-brand-blue rounded-md z-0"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
              {/* Language Toggle - Mobile */}
              <div className="px-2 pt-2 pb-3 border-t">
                <motion.div
                  className="flex items-center bg-gray-200 rounded-full p-1 cursor-pointer relative w-min"
                  onTap={() => {
                    setLanguage(language === 'en' ? 'cy' : 'en');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center relative z-10">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-gray-600'}`}>
                      EN
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${language === 'cy' ? 'text-white' : 'text-gray-600'}`}>
                      CY
                    </span>
                  </div>
                  {/* Mobile language toggle - only animate when not navigating */}
                  {!isNavigating && (
                    <motion.div
                      className="absolute top-0 left-0 h-full w-1/2 bg-brand-blue rounded-full z-0"
                      layoutId="mobile-language-toggle"
                      initial={false}
                      animate={{ x: language === 'en' ? '0%' : '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Fallback positioning when navigating */}
                  {isNavigating && (
                    <div
                      className="absolute top-0 left-0 h-full w-1/2 bg-brand-blue rounded-full z-0 transition-transform duration-200"
                      style={{ transform: language === 'en' ? 'translateX(0%)' : 'translateX(100%)' }}
                    />
                  )}
                </motion.div>
              </div>
            </LayoutGroup>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;