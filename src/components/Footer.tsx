import React from 'react';
import { useLocation } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import XIcon from './XIcon';

const Footer: React.FC = () => {
  const location = useLocation();

  const getColorScheme = () => {
    switch (location.pathname) {
      case '/':
        return {
          bgClass: 'bg-brand-green',
          clipPathColor: '#468189'
        };
      case '/sign':
      case '/about':
        return {
          bgClass: 'bg-brand-red',
          clipPathColor: '#B8336A'
        };
      default:
        return {
          bgClass: 'bg-brand-blue',
          clipPathColor: '#102542'
        };
    }
  };

  const { bgClass, clipPathColor } = getColorScheme();

  return (
    <div className="relative mt-20">
      <footer className={`relative pt-20 pb-10 px-4 ${bgClass}`}>
        <div
          className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw]"
          style={{
            clipPath: 'polygon(0 0, 100% 35%, 100% 100%, 0% 100%)',
            backgroundColor: clipPathColor,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xl text-white font-bold">Our Cash Your Call</p>
            <a href="mailto:kanishka.narayan.mp@parliament.uk" className="text-white/80 hover:text-white transition-colors">
              kanishka.narayan.mp@parliament.uk
            </a>
          </div>
          <div className="flex space-x-6">
            <a href="https://www.facebook.com/valewithkanishka" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
              <Facebook size={28} strokeWidth={2.5} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://www.instagram.com/valekanishka/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
              <Instagram size={28} strokeWidth={2.5} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://x.com/KanishkaNarayan" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
              <XIcon className="h-7 w-7 fill-current" />
              <span className="sr-only">X (Twitter)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer; 