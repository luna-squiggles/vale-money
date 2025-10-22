import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileSignature, X, Info } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';
import MapboxCommunityMap from '../components/MapboxCommunityMap';
import { getApprovedPins } from '../services/submissionService';

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
      campaign: "Our Cash Your Call"
    },
    subheadline: "£41.5 million for the Vale: our community calling the shots on how it's spent",
    ctaTitle: "What's Happening?",
    ctaBody1: "People are tired of politicians wasting their money.\nSo in the Vale, we're doing things differently.\nWe've secured £41.5 million for local investment and you'll decide how it's spent.\nFrom high streets to youth projects, this time our community calls the shots.",
    ctaBody2: "",
    ctaButton: "Have Your Say",
    findOutMore: "Find out more",
    watchVideo: "Watch Video",
  },
  cy: {
    headline: {
      campaign: "Ein Arian Eich Penderfyniad"
    },
    subheadline: "£41.5 miliwn ar gyfer y Fro: ein cymuned yn penderfynu sut i'w wario",
    ctaTitle: "Beth Sy'n Digwydd?",
    ctaBody1: "Mae pobl yn flin o wleidyddion yn gwastraffu eu harian.\nFelly yn y Fro, rydym yn gwneud pethau'n wahanol.\nRydym wedi sicrhau £41.5 miliwn ar gyfer buddsoddiad lleol a chi fydd yn penderfynu sut i'w wario.\nO strydoedd uchel i brosiectau ieuenctid, y tro hwn ein cymuned sy'n penderfynu.",
    ctaBody2: "",
    ctaButton: "Cael Eich Dweud",
    findOutMore: "Darganfod mwy",
    watchVideo: "Gwyliwch y Fideo",
  }
};

const LandingPage: React.FC = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadApprovedPins();
  }, []);

  const loadApprovedPins = async () => {
    try {
      setLoading(true);
      const approvedPins = await getApprovedPins();
      
      // Filter out old x/y format pins and only show lng/lat pins
      const convertedPins = approvedPins.map(pin => {
        if ('x' in pin && 'y' in pin && !('lng' in pin)) {
          return null;
        }
        return pin;
      }).filter(Boolean);
      
      setPins(convertedPins);
    } catch (error) {
      console.error('Error loading pins:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Custom Cursor - Commented out */}
      {/* <motion.div
        className="fixed top-0 left-0 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full z-50 pointer-events-none"
        variants={cursorVariants}
        animate={isHoveringVideo ? 'hover' : 'default'}
      >
        {t.watchVideo}
      </motion.div> */}

      {/* Video Player Modal */}
      {isPlayerOpen && (
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
                src="/KN-Our-Cash-Your-Call.mp4"
                className="w-full h-full"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section with Video and Text */}
      <section className="relative min-h-screen flex items-center bg-white overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video on the Left */}
            <div>
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setIsPlayerOpen(true)}
                onMouseEnter={() => setIsHoveringVideo(true)}
                onMouseLeave={() => setIsHoveringVideo(false)}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/KN-Our-Cash-Your-Call.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 ml-1 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Text on the Right */}
            <div>
              <div className="space-y-6 md:pl-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-blue leading-tight">
                  {t.headline.campaign}
                </h1>
                <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
                  {t.subheadline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="relative bg-brand-red">
        {/* Top diagonal separator */}
        <div className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,35 100,0 100,100 0,65" fill="#B8336A" />
          </svg>
        </div>

        <section className="relative z-20 pt-16 pb-12 px-4 bg-brand-red">
           <div className="max-w-4xl mx-auto text-center pb-0">
             <ScrollReveal direction="up">
               <h2
                 className="text-4xl md:text-5xl font-bold mb-8 text-white"
               >
                 {t.ctaTitle}
               </h2>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t.ctaBody1}
              </p>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t.ctaBody2}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex justify-center items-center">
                <Link
                  to="/sign"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-brand-blue rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white"
                  onClick={() => setIsNavigating(true)}
                >
                  <FileSignature className="mr-3" size={24} />
                  {t.ctaButton}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
        {/* Bottom diagonal separator */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 w-full h-[12vw] max-h-48 -mb-[6vw]" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,35 100,0 100,65 0,100" fill="#B8336A" />
            </svg>
          </div>
        </div>
      </div>

      {/* Community Suggestions Map Section */}
      <section className="pt-28 pb-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-5">
                Community Ideas
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                See what matters to your community in the Vale
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <div className="w-full h-[520px] rounded-lg overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading community suggestions...</p>
                  </div>
                </div>
              ) : pins.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">
                      No suggestions yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Be the first to add your ideas for the Vale!
                    </p>
                    <Link
                      to="/sign"
                      className="inline-block px-6 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-colors"
                    >
                      Add Your Suggestion
                    </Link>
                  </div>
                </div>
              ) : (
                <MapboxCommunityMap pins={pins} />
              )}
            </div>
            
          </ScrollReveal>
        </div>
      </section>

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
