import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { getApprovedPins } from '../services/submissionService';
import { useLanguage } from '../contexts/LanguageContext';

interface PinSubmission {
  id?: string;
  x: number;
  y: number;
  label: string;
  created_at?: string;
  approved?: boolean;
}

const translations = {
  en: {
    title: "Community Suggestions",
    subtitle: "See what your neighbours want to see in the Vale of Glamorgan",
    loading: "Loading community suggestions...",
    noSuggestions: "No suggestions yet. Be the first to share your ideas!",
    totalSuggestions: "Total suggestions",
    suggestionTypes: "Suggestion types",
  },
  cy: {
    title: "Awgrymiadau'r Gymuned",
    subtitle: "Gweld beth mae eich cymdogion eisiau ei weld ym Mro Morgannwg",
    loading: "Llwytho awgrymiadau'r gymuned...",
    noSuggestions: "Dim awgrymiadau eto. Byddwch y cyntaf i rannu eich syniadau!",
    totalSuggestions: "Cyfanswm awgrymiadau",
    suggestionTypes: "Mathau o awgrymiadau",
  }
};

const CommunitySuggestionsPage: React.FC = () => {
  const [pins, setPins] = useState<PinSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    loadApprovedPins();
  }, []);

  const loadApprovedPins = async () => {
    try {
      setLoading(true);
      console.log('Fetching approved pins...');
      const approvedPins = await getApprovedPins();
      console.log('Approved pins received:', approvedPins);
      setPins(approvedPins);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error('Error loading pins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique suggestion types for stats
  const suggestionTypes = [...new Set(pins.map(pin => pin.label.toLowerCase()))];
  
  // Group pins by type for better visualization
  const pinsByType = pins.reduce((acc, pin) => {
    const type = pin.label.toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(pin);
    return acc;
  }, {} as Record<string, PinSubmission[]>);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Interactive Map with All Pins */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {pins.length === 0 ? (
            <ScrollReveal direction="up">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">
                  {t.noSuggestions}
                </h3>
                <a
                  href="/sign"
                  className="inline-block px-8 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-colors"
                >
                  Add Your Suggestion
                </a>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal direction="up">
              <div className="mb-12">
                {/* Map Container */}
                <div className="relative w-full bg-gray-100 overflow-hidden">
                  <img
                    src="/Map.png"
                    alt="Vale of Glamorgan Map"
                    className="w-full h-auto object-contain"
                    draggable={false}
                  />
                  
                  {/* All Pins */}
                  {pins.map((pin, index) => (
                    <motion.div
                      key={pin.id || index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="absolute"
                      style={{
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        transform: 'translate(-50%, -100%)',
                      }}
                    >
                      <div className="relative group">
                        {/* Pin */}
                        <div className="w-6 h-6 bg-brand-red rounded-full border-3 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                        </div>
                        {/* Label - shows on hover */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {pin.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Stats below map */}
                <div className="text-center mt-6">
                  <div className="text-2xl font-bold text-brand-blue">
                    {pins.length} Community Suggestions
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

    </div>
  );
};

export default CommunitySuggestionsPage;
