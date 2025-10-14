import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPin {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface InteractiveMapProps {
  onComplete?: (pins: MapPin[]) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onComplete }) => {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingPin || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewPinPosition({ x, y });
    setIsAddingPin(true);
  };

  const handleAddPin = () => {
    if (!newPinPosition || !labelInput.trim()) return;

    const newPin: MapPin = {
      id: Date.now().toString(),
      x: newPinPosition.x,
      y: newPinPosition.y,
      label: labelInput.trim(),
    };

    setPins([...pins, newPin]);
    setIsAddingPin(false);
    setNewPinPosition(null);
    setLabelInput('');
  };

  const handleCancelPin = () => {
    setIsAddingPin(false);
    setNewPinPosition(null);
    setLabelInput('');
  };

  const handleRemovePin = (id: string) => {
    setPins(pins.filter(pin => pin.id !== id));
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete(pins);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center px-4">
        <h3 className="text-2xl font-bold text-brand-blue mb-2">
          Where should we invest?
        </h3>
        <p className="text-gray-600">
          Click anywhere on the map to add a pin and tell us what you'd like to see in that area
        </p>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="relative w-full bg-gray-100 overflow-hidden cursor-crosshair"
        onClick={handleMapClick}
      >
        <img
          src="/Map.png"
          alt="Vale of Glamorgan Map"
          className="w-full h-auto object-contain"
          draggable={false}
        />
        
        {/* Darkening overlay when adding pin */}
        {isAddingPin && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        )}

        {/* Existing Pins */}
        {pins.map((pin) => (
          <motion.div
            key={pin.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
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
          </motion.div>
        ))}

        {/* New Pin Preview */}
        {newPinPosition && (
          <div
            className="absolute w-8 h-8 bg-brand-red/50 rounded-full border-4 border-white shadow-lg"
            style={{
              left: `${newPinPosition.x}%`,
              top: `${newPinPosition.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
          />
        )}

        {/* Continue Button - Overlaid on bottom of map */}
        {pins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContinue();
              }}
              className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-all duration-300 hover:scale-105 shadow-lg pointer-events-auto"
            >
              Continue to Form
            </button>
          </motion.div>
        )}
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
                What would you like to see here?
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
                placeholder="New Playground, Cycle Lane"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCancelPin}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPin}
                  disabled={!labelInput.trim()}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Pin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMap;

