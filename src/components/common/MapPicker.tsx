import React, { useEffect, useRef, useState } from 'react';
import { Spin, Alert } from 'antd';

interface MapPickerProps {
    value?: { lat: number; lng: number };
    onChange?: (val: { lat: number; lng: number }) => void;
    readOnly?: boolean;
    height?: number | string;
    address?: string; // Optional linked address for geocoding
}

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange, readOnly = false, height = 200, address }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);
    
    const apiKey = (window as any).env?.googleMapsApiKey;

    useEffect(() => {
        if (!apiKey) return;
        
        if ((window as any).google?.maps) {
            setIsSdkLoaded(true);
            return;
        }

        const scriptId = 'google-maps-sdk';
        if (document.getElementById(scriptId)) {
            // Already injected but maybe not loaded
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsSdkLoaded(true);
        script.onerror = () => setScriptError(true);
        document.head.appendChild(script);
    }, [apiKey]);

    // Initialize Map and Marker
    useEffect(() => {
        if (!isSdkLoaded || !mapRef.current || !apiKey) return;
        if (map) return; // Already initialized
        
        const google = (window as any).google;
        const initialLoc = value || { lat: 10.7769, lng: 106.7009 };
        
        const newMap = new google.maps.Map(mapRef.current, {
            center: initialLoc,
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: readOnly ? 'none' : 'auto'
        });

        const newMarker = new google.maps.Marker({
            position: initialLoc,
            map: newMap,
            draggable: !readOnly,
            animation: google.maps.Animation.DROP,
        });

        if (!readOnly && onChange) {
            newMap.addListener('click', (e: any) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                newMarker.setPosition(e.latLng);
                onChange({ lat, lng });
            });

            newMarker.addListener('dragend', (e: any) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                onChange({ lat, lng });
            });
        }

        setMap(newMap);
        setMarker(newMarker);
    }, [isSdkLoaded, apiKey, readOnly, map]); // Need map in deps so it only runs once

    // Update marker when value props change externally but not by the map itself
    useEffect(() => {
        if (map && marker && value) {
            const google = (window as any).google;
            const newPos = new google.maps.LatLng(value.lat, value.lng);
            if (!marker.getPosition()?.equals(newPos)) {
                marker.setPosition(newPos);
                map.panTo(newPos);
            }
        }
    }, [value, map, marker]);

    // Handle Geocoding from Address changes
    useEffect(() => {
        if (!isSdkLoaded || !map || !address || readOnly) return;
        
        const timeoutId = setTimeout(() => {
            const google = (window as any).google;
            if (!google.maps.Geocoder) return;
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                    const loc = results[0].geometry.location;
                    const lat = loc.lat();
                    const lng = loc.lng();
                    map.panTo(loc);
                    marker?.setPosition(loc);
                    if (onChange) {
                         if (!value || Math.abs(value.lat - lat) > 0.0001 || Math.abs(value.lng - lng) > 0.0001) {
                             onChange({ lat, lng });
                         }
                    }
                }
            });
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timeoutId);
    }, [address, isSdkLoaded, map, readOnly]);

    if (!apiKey) {
        return (
            <Alert 
                type="warning" 
                showIcon 
                message="Chưa cấu hình API Key" 
                description="Vui lòng cung cấp `googleMapsApiKey` trong file public/env.js để kích hoạt tính năng Bản Đồ Thực." 
            />
        );
    }

    if (scriptError) {
        return <Alert type="error" message="Lỗi tải thư viện Google Maps API" />;
    }

    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden', background: '#f5f5f5' }}>
            <div style={{ height, width: '100%', position: 'relative' }}>
                {!isSdkLoaded && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <Spin tip="Đang tải bản đồ..." />
                    </div>
                )}
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>
            {value && (
                <div style={{ padding: '4px 12px', fontSize: 12, color: '#666', background: '#fff' }}>
                    Tọa độ ghim: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </div>
            )}
        </div>
    );
};

export default MapPicker;
