import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface MapPickerProps {
    value?: { lat: number; lng: number };
    onChange?: (val: { lat: number; lng: number }) => void;
    readOnly?: boolean;
    height?: number | string;
}

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange, readOnly = false, height = 200 }) => {
    // For a real app, this would be a Google Maps / Leaflet component
    // For this demo, we'll use an iframe embed for display and a simulated picker
    
    const lat = value?.lat || 10.7769;
    const lng = value?.lng || 106.7009;

    const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    const handlePickLocation = () => {
        if (readOnly || !onChange) return;
        
        // Mocking a location pick - in reality this would come from a map click
        const mockLocations = [
            { lat: 10.7769, lng: 106.7009 }, // HCM
            { lat: 21.0285, lng: 105.8542 }, // Hanoi
            { lat: 16.0471, lng: 108.2067 }, // Danang
        ];
        const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        onChange(randomLoc);
    };

    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden', background: '#f5f5f5' }}>
            <div style={{ height, width: '100%', position: 'relative' }}>
                <iframe
                    title="Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen
                />
                
                {!readOnly && (
                    <div style={{ 
                        position: 'absolute', 
                        bottom: 12, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 10
                    }}>
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<EnvironmentOutlined />}
                            onClick={handlePickLocation}
                        >
                            Chọn vị trí trên bản đồ (Demo)
                        </Button>
                    </div>
                )}
            </div>
            {value && (
                <div style={{ padding: '4px 12px', fontSize: 12, color: '#666', background: '#fff' }}>
                    Tọa độ: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </div>
            )}
        </div>
    );
};

export default MapPicker;
