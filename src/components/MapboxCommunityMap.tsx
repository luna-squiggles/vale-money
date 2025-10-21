import React, { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
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
  const [popupInfo, setPopupInfo] = useState<MapPin | null>(null);
  
  // Vale of Glamorgan coordinates
  const [viewState, setViewState] = useState({
    longitude: -3.4833,
    latitude: 51.4167,
    zoom: 11
  });

  return (
    <div className="w-full h-[600px] relative">
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
              className="w-6 h-6 bg-brand-red rounded-full border-3 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setPopupInfo(pin);
              }}
            />
          </Marker>
        ))}

        {/* Popup on click */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <p className="font-medium text-gray-800">{popupInfo.label}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxCommunityMap;

