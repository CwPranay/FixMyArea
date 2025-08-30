"use client";

import { useEffect, useRef, useState } from 'react';

interface Location {
    lat: number;
    lng: number;
    address: string;
}

interface LocationPickerProps {
    onLocationSelect: (location: Location) => void;
    selectedLocation?: Location;
}

declare global {
    interface Window {
        L: any;
    }
}

export default function LocationPicker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load Leaflet CSS and JS
        if (!window.L) {
            // Add Leaflet CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
            document.head.appendChild(link);

            // Add Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
            script.async = true;
            script.onload = () => setIsLoaded(true);
            document.head.appendChild(script);
        } else {
            setIsLoaded(true);
        }
    }, []);

   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
            {
                headers: {
                    'User-Agent': 'Your-App-Name/1.0 (your@email.com)' // Replace with your app info
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Construct address from components if available
        if (data.address) {
            const addr = data.address;
            let formattedAddress = '';
            
            // Build a hierarchical address
            if (addr.road) formattedAddress += `${addr.road}, `;
            if (addr.neighbourhood) formattedAddress += `${addr.neighbourhood}, `;
            if (addr.suburb) formattedAddress += `${addr.suburb}, `;
            if (addr.city) formattedAddress += `${addr.city}, `;
            if (addr.state) formattedAddress += `${addr.state}, `;
            if (addr.country) formattedAddress += addr.country;
            
            if (formattedAddress) return formattedAddress;
        }
        
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
};

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !window.L) return;

        // Add a small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            if (!mapRef.current) return;

            // Default to Mumbai coordinates
            const defaultCenter: [number, number] = [19.0760, 72.8777];
            
            // Use selected location if available
            const center: [number, number] = selectedLocation ? 
                [selectedLocation.lat, selectedLocation.lng] : 
                defaultCenter;

            try {
                // Initialize map
                const mapInstance = window.L.map(mapRef.current, {
                    center: center,
                    zoom: 15,
                    zoomControl: false,
                    preferCanvas: false,
                });

                // Add OpenStreetMap tiles
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                }).addTo(mapInstance);

                setMap(mapInstance);

                // Wait for map to be ready
                mapInstance.whenReady(() => {
                    // Create custom marker icon
                    const customIcon = window.L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="
                            background-color: #EA4335;
                            width: 20px;
                            height: 20px;
                            border-radius: 50% 50% 50% 0;
                            transform: rotate(-45deg);
                            border: 3px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 3px;
                                left: 3px;
                                width: 8px;
                                height: 8px;
                                background-color: white;
                                border-radius: 50%;
                            "></div>
                        </div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 20],
                        popupAnchor: [0, -20]
                    });

                    // Initialize marker
                    const markerInstance = window.L.marker(center, {
                        draggable: true,
                        icon: customIcon
                    }).addTo(mapInstance);

                    setMarker(markerInstance);

                    // Handle marker drag
                    markerInstance.on('dragend', async () => {
                        const position = markerInstance.getLatLng();
                        const lat = position.lat;
                        const lng = position.lng;
                        
                        const address = await reverseGeocode(lat, lng);
                        onLocationSelect({ lat, lng, address });
                    });

                    // Handle map click
                    mapInstance.on('click', async (event: any) => {
                        const lat = event.latlng.lat;
                        const lng = event.latlng.lng;
                        
                        // Move marker to clicked position
                        markerInstance.setLatLng([lat, lng]);
                        
                        const address = await reverseGeocode(lat, lng);
                        onLocationSelect({ lat, lng, address });
                    });
                });

            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }, 100);

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (map) {
                try {
                    map.remove();
                } catch (error) {
                    console.error('Error removing map:', error);
                }
            }
        };

    }, [isLoaded]);

    // Update marker position when selectedLocation changes externally
    useEffect(() => {
        if (marker && selectedLocation && map) {
            try {
                marker.setLatLng([selectedLocation.lat, selectedLocation.lng]);
                // Use setTimeout to ensure map is ready for setView
                setTimeout(() => {
                    if (map && map.getContainer()) {
                        map.setView([selectedLocation.lat, selectedLocation.lng], 15);
                    }
                }, 50);
            } catch (error) {
                console.error('Error updating marker position:', error);
            }
        }
    }, [selectedLocation?.lat, selectedLocation?.lng, marker, map]);

    if (!isLoaded) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading map...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2 z-[500]">
            <div 
                ref={mapRef} 
                className="w-full h-64 rounded-lg border border-gray-300"
                style={{ minHeight: '256px' }}
            />
            <p className="text-xs text-gray-500 text-center">
                Click on the map or drag the marker to select a location
            </p>
        </div>
    );
}