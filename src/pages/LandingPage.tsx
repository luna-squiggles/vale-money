import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileSignature, X, Info } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

const translations = {
  en: {
    headline: {
      campaign: "[Campaign Name]"
    },
    subheadline: "£[amount] for the Vale of Glamorgan. How we spend it is up to you.",
    ctaTitle: "What's Happening?",
    ctaBody1: "As part of Labour's [insert initiative] I have secured £[amount] for the Vale of Glamorgan",
    ctaBody2: "I'm opening the floor to you to help us decide how to use this exciting opportunity",
    ctaButton: "Have Your Say",
    findOutMore: "Find out more",
    watchVideo: "Watch Video",
  },
  cy: {
    headline: {
      campaign: "[Enw'r Ymgyrch]"
    },
    subheadline: "£[swm] ar gyfer Bro Morgannwg. Sut rydym yn ei wario sydd i fyny i chi.",
    ctaTitle: "Beth Sy'n Digwydd?",
    ctaBody1: "Fel rhan o [cynllun] Llafur, rydw i wedi sicrhau £[swm] ar gyfer Bro Morgannwg",
    ctaBody2: "Rydw i'n agor y llawr i chi i'n helpu i benderfynu sut i ddefnyddio'r cyfle cyffrous hwn",
    ctaButton: "Cael Eich Dweud",
    findOutMore: "Darganfod mwy",
    watchVideo: "Gwyliwch y Fideo",
  }
};

const LandingPage: React.FC = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const { x, y } = useMousePosition();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const { setIsNavigating } = useNavigationContext();

  const t = translations[language];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlayerOpen) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Autoplay was prevented:", error);
        });
      }
    }
  }, [isPlayerOpen]);

  const cursorVariants = {
    default: {
      opacity: 0,
      scale: 0,
      x: x - 16,
      y: y - 16,
    },
    hover: {
      opacity: 1,
      scale: 1,
      x: x - 60,
      y: y - 40,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Cursor - Commented out for image background */}
      {/* <motion.div
        className="fixed top-0 left-0 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full z-50 pointer-events-none"
        variants={cursorVariants}
        animate={isHoveringVideo ? 'hover' : 'default'}
      >
        {t.watchVideo}
      </motion.div> */}

      {/* Video Player Modal - Commented out for image background */}
      {/* {isPlayerOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsPlayerOpen(false)}
        >
          <div className="relative w-full max-w-4xl p-4">
            <button
              onClick={() => setIsPlayerOpen(false)}
              className="absolute -top-2 -right-2 bg-white text-black rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>
            <div className="aspect-video">
              <video
                src="/placeholder.mp4"
                className="w-full h-full"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </motion.div>
      )} */}

      {/* Hero Section with Image */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* To enable video click functionality, uncomment the following attributes:
             className="relative h-screen flex items-center justify-center overflow-hidden cursor-pointer"
             onClick={() => setIsPlayerOpen(true)}
             onMouseEnter={() => setIsHoveringVideo(true)}
             onMouseLeave={() => setIsHoveringVideo(false)}
        */}
        {/* Background Image */}
        <img
          src="/ValeofGlamorgan.jpeg"
          alt="Vale of Glamorgan"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Background Video - Commented out, uncomment to use video instead */}
        {/* <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/placeholder.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}

        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: 'rgba(252, 245, 229, 0.3)',
            zIndex: 1
          }}
        />

        {/* Overlay Content */}
        <div className="relative z-10 text-center text-white px-4 select-none">
          <ScrollReveal direction="fade">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
            >
              <span style={{ color: '#FFFFFF' }}>{t.headline.campaign}</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium drop-shadow-md text-gray-700 max-w-2xl mx-auto">
              {t.subheadline}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="relative bg-white">
        {/* Diagonal Separator */}
        <div className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw] z-10">
          <svg
            className="w-full h-full fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,35 100,0 100,65 0,100" />
          </svg>
        </div>
        <section className="relative z-20 pt-28 pb-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <h2
                className="text-4xl md:text-5xl font-bold mb-8 text-brand-blue"
              >
                {t.ctaTitle}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t.ctaBody1}
              </p>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t.ctaBody2}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex justify-center items-center space-x-4">
                <Link
                  to="/sign"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-brand-blue"
                  onClick={() => setIsNavigating(true)}
                >
                  <FileSignature className="mr-3" size={24} />
                  {t.ctaButton}
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-6 py-3 text-md font-semibold text-brand-blue rounded-full border-2 border-brand-blue transition-all duration-300 hover:bg-brand-blue hover:text-white hover:shadow-lg"
                  onClick={() => setIsNavigating(true)}
                >
                  <Info className="mr-2" size={20} />
                  {t.findOutMore}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* Additional Info Sections */}
      <section
        className="py-4 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
        </div>
      </section>
    </div>
  );
};

export default LandingPage;