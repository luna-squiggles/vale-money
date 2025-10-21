import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';
import InteractiveMap from '../components/InteractiveMap';
import MapboxInteractiveMap from '../components/MapboxInteractiveMap';
import { submitConsultationData } from '../services/submissionService';

const translations = {
  en: {
    title: "Get involved in the consultation",
    subtitle: "Your opinion matters. Join Kanishka in shaping the Vale by sharing your views. Together we can make the Vale work for everyone.",
    formTitle: "Have Your Say",
    infoTitle: "Why get involved?",
    impactTitle: "Collective Impact",
    impactBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    processTitle: "Democratic Process",
    processBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    findOutMore: "Find out more",
  },
  cy: {
    title: "Cymryd rhan yn yr ymgynghoriad",
    subtitle: "Mae eich barn yn bwysig. Ymunwch â Kanishka i siapio'r Fro trwy rannu eich barn. Gyda'n gilydd, gallwn wneud y Fro yn gweithio i bawb.",
    formTitle: "Cael Eich Dweud",
    infoTitle: "Pam gymryd rhan?",
    impactTitle: "Effaith Gyfunol",
    impactBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    processTitle: "Proses Ddemocrataidd",
    processBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    findOutMore: "Darganfod mwy",
  }
};

const SignPage: React.FC = () => {
  const { language } = useLanguage();
  const { setIsNavigating } = useNavigationContext();
  const t = translations[language];
  const [showForm, setShowForm] = useState(true);
  const [mapPins, setMapPins] = useState<any[]>([]);

  const handleMapComplete = (pins: any[]) => {
    setMapPins(pins);
    // Scroll to form section
    setTimeout(() => {
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFormSubmission = async (pins: any[]) => {
    try {
      // This will be called when pins are added or when the Tally form is submitted
      const formData = {
        submitted_at: new Date().toISOString(),
        has_pins: pins.length > 0,
        submission_type: pins.length === 1 ? 'pin_only' : 'full_submission'
      };
      
      await submitConsultationData(pins, formData);
      console.log('Consultation data submitted successfully', { pins, formData });
    } catch (error) {
      console.error('Failed to submit consultation data:', error);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="fade">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-brand-blue"
            >
              {t.title}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Diagonal Separator */}
      <div className="relative bg-white -mb-1">
        <div className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw] z-10">
          <svg
            className="w-full h-full fill-brand-red"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 100,35 100,100 0,65" />
          </svg>
        </div>
      </div>

      {/* Interactive Map Section */}
      <section className="pt-32 bg-white">
        <ScrollReveal direction="up" delay={300}>
            <MapboxInteractiveMap onComplete={handleMapComplete} onSubmit={handleFormSubmission} />
        </ScrollReveal>
      </section>

      {/* Diagonal Separator */}
      <div className="relative bg-white -mb-1 -mt-1">
        <div className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw] z-10">
          <svg
            className="w-full h-full fill-brand-green"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,35 100,0 100,65 0,100" />
          </svg>
        </div>
      </div>

      {/* Form Section */}
      <section 
        id="form-section"
        className="pt-32 pb-10 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" delay={300}>
            <div className="max-w-2xl mx-auto text-center">
              {/* Map Pins Summary */}
              {mapPins.length > 0 && (
                <div className="mb-8 p-4 bg-brand-blue/5 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Your suggestions from the map:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mapPins.map((pin) => (
                      <span key={pin.id} className="px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-sm">
                        {pin.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tally.so Embedded Form */}
              <div className="w-full">
                <h2 
                  className="text-3xl font-bold mb-4 text-brand-blue"
                >
                  {t.formTitle}
                </h2>
                <iframe
                  src="https://tally.so/embed/w2Q4kg?hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  width="100%"
                  height="900"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Vale Consultation Form"
                ></iframe>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Diagonal Separator */}
      <div className="relative bg-white -mb-1">
        <div className="absolute top-0 left-0 w-full h-[12vw] max-h-48 -mt-[6vw] z-10">
          <svg
            className="w-full h-full fill-brand-green"
            xmlns="http://www.w.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,35 100,0 100,65 0,100" />
          </svg>
        </div>
      </div>

      {/* Additional Info */}
      <section className="pt-28 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center">
              <h3 
                className="text-3xl font-bold mb-6 text-brand-blue"
              >
                {t.infoTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-3 text-brand-blue">
                    {t.impactTitle}
                  </h4>
                  <p className="text-gray-600">
                    {t.impactBody}
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-3 text-brand-blue">
                    {t.processTitle}
                  </h4>
                  <p className="text-gray-600">
                    {t.processBody}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default SignPage;