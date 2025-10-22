import React, { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPin {
  id?: string;
  lng: number;
  lat: number;
  label: string;
}

interface MapboxCommunityMapProps {
  pins: MapPin[];
}

const MapboxCommunityMap: React.FC<MapboxCommunityMapProps> = ({ pins }) => {
  const [hoveredPin, setHoveredPin] = useState<MapPin | null>(null);
  
  // Vale of Glamorgan coordinates
  const [viewState, setViewState] = useState({
    longitude: -3.4833,
    latitude: 51.4167,
    zoom: 11
  });

  return (
    <div className="w-full h-[640px] relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />

        {/* All Community Pins */}
        {pins.map((pin, index) => (
          <Marker
            key={pin.id || index}
            longitude={pin.lng}
            latitude={pin.lat}
            anchor="bottom"
          >
            <div
              className="relative group"
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div className="w-6 h-6 bg-brand-red rounded-full border-3 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" />
              
              {/* Hover Tooltip */}
              {hoveredPin && hoveredPin === pin && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 whitespace-nowrap z-10">
                  <div className="text-sm font-medium text-gray-800">
                    {pin.label}
                  </div>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              )}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapboxCommunityMap;

