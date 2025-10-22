import React, { useState, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPin {
  id: string;
  lng: number;
  lat: number;
  label: string;
}

interface MapboxInteractiveMapProps {
  onComplete?: (pins: MapPin[]) => void;
  onSubmit?: (pins: MapPin[]) => void;
}

const translations = {
  en: {
    mapTitle: "Where should we invest?",
    mapInstruction: "Click anywhere on the map to add a pin and shape local investment",
    modalTitle: "What would you like to see here?",
    placeholder: "New Playground, Cycle Lane",
    cancel: "Cancel",
    addPin: "Add Pin",
  },
  cy: {
    mapTitle: "Ble ddylem ni fuddsoddi?",
    mapInstruction: "Cliciwch unrhyw le ar y map i ychwanegu pin a dweud wrthym beth hoffech chi ei weld yn yr ardal honno",
    modalTitle: "Beth hoffech chi ei weld yma?",
    placeholder: "Maes Chwarae Newydd, Llwybr Beicio",
    cancel: "Canslo",
    addPin: "Ychwanegu Pin",
  }
};

const MapboxInteractiveMap: React.FC<MapboxInteractiveMapProps> = ({ onComplete, onSubmit }) => {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<{ lng: number; lat: number } | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const mapRef = useRef(null);
  const { language } = useLanguage();
  const t = translations[language];

  // Vale of Glamorgan coordinates
  const [viewState, setViewState] = useState({
    longitude: -3.4833,
    latitude: 51.4167,
    zoom: 11
  });

  const handleMapClick = useCallback((event: any) => {
    if (isAddingPin) return;
    
    const { lngLat } = event;
    setNewPinPosition({ lng: lngLat.lng, lat: lngLat.lat });
    setIsAddingPin(true);
  }, [isAddingPin]);

  const handleAddPin = async () => {
    if (!newPinPosition || !labelInput.trim()) return;

    const newPin: MapPin = {
      id: Date.now().toString(),
      lng: newPinPosition.lng,
      lat: newPinPosition.lat,
      label: labelInput.trim(),
    };

    const updatedPins = [...pins, newPin];
    setPins(updatedPins);
    setIsAddingPin(false);
    setNewPinPosition(null);
    setLabelInput('');

    // Submit pin immediately to Supabase
    if (onSubmit) {
      try {
        await onSubmit([newPin]);
        console.log('Pin submitted successfully:', newPin);
      } catch (error) {
        console.error('Failed to submit pin:', error);
      }
    }

    // Update parent component with new pins
    if (onComplete) {
      onComplete(updatedPins);
    }

    // If this is the first pin, automatically scroll to form after 2 seconds
    if (pins.length === 0) {
      setTimeout(() => {
        document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }
  };

  const handleCancelPin = () => {
    setIsAddingPin(false);
    setNewPinPosition(null);
    setLabelInput('');
  };

  const handleRemovePin = (id: string) => {
    const updatedPins = pins.filter(pin => pin.id !== id);
    setPins(updatedPins);
    
    if (onComplete) {
      onComplete(updatedPins);
    }
  };

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="w-full h-[800px] relative">
        {/* Floating Instructions Overlay */}
        <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="text-lg font-bold text-brand-blue mb-2">
            {t.mapTitle}
          </h3>
          <p className="text-sm text-gray-600">
            {t.mapInstruction}
          </p>
        </div>

        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Navigation Controls */}
          <NavigationControl position="top-right" />

          {/* Existing Pins */}
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              longitude={pin.lng}
              latitude={pin.lat}
              anchor="bottom"
            >
              <div className="relative group">
                {/* Pin */}
                <div className="w-8 h-8 bg-brand-red rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePin(pin.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-sm font-medium text-gray-800 pointer-events-none">
                  {pin.label}
                </div>
              </div>
            </Marker>
          ))}

          {/* New Pin Preview */}
          {newPinPosition && (
            <Marker
              longitude={newPinPosition.lng}
              latitude={newPinPosition.lat}
              anchor="bottom"
            >
              <div className="w-8 h-8 bg-brand-red/50 rounded-full border-4 border-white shadow-lg" />
            </Marker>
          )}
        </Map>
      </div>

      {/* Label Input Modal */}
      <AnimatePresence>
        {isAddingPin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleCancelPin}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-xl font-bold text-brand-blue mb-4">
                {t.modalTitle}
              </h4>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && labelInput.trim()) {
                    handleAddPin();
                  }
                }}
                placeholder={t.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCancelPin}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleAddPin}
                  disabled={!labelInput.trim()}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.addPin}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapboxInteractiveMap;

