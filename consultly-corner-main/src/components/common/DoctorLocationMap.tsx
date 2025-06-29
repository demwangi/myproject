
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Doctor } from '@/data/doctors';

interface DoctorLocationMapProps {
  doctor: Doctor;
  className?: string;
}

export const DoctorLocationMap: React.FC<DoctorLocationMapProps> = ({ doctor, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [doctor.location.longitude, doctor.location.latitude],
      zoom: 13,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Add marker for doctor location
    const marker = new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([doctor.location.longitude, doctor.location.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<strong>Dr. ${doctor.name}</strong><p>${doctor.hospital}</p>`)
      )
      .addTo(map.current);
    
    // Open popup by default
    marker.togglePopup();
    
    return () => {
      map.current?.remove();
    };
  }, [doctor]);
  
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-sm border border-gray-100 ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
