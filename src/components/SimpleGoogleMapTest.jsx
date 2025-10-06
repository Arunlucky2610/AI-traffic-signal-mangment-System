import React, { useState, useEffect, useRef } from 'react';

const SimpleGoogleMap = () => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
    
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      setError('API key not configured');
      return;
    }

    const initMap = () => {
      console.log('🗺️ Initializing simple map...');
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
          zoom: 13,
        });
        console.log('✅ Simple map created successfully');
        setIsLoaded(true);
      } catch (error) {
        console.error('❌ Map creation error:', error);
        setError(`Map creation failed: ${error.message}`);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    window.initSimpleMap = initMap;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initSimpleMap`;
    script.onerror = () => {
      console.error('❌ Script loading failed');
      setError('Failed to load Google Maps API');
    };
    
    script.onload = () => {
      console.log('✅ Script loaded successfully');
    };
    
    window.gm_authFailure = () => {
      console.error('❌ Authentication failed');
      setError('Google Maps authentication failed - check API key restrictions');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
      delete window.initSimpleMap;
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px' }}>
        <h3 style={{ color: '#c00' }}>Google Maps Test Error</h3>
        <p>{error}</p>
        <p><strong>Check:</strong></p>
        <ul>
          <li>API key is correct in .env file</li>
          <li>Maps JavaScript API is enabled in Google Cloud Console</li>
          <li>API key restrictions allow localhost</li>
          <li>Billing is enabled for your Google Cloud project</li>
        </ul>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Google Maps Test</h2>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '2px solid #ccc',
          borderRadius: '8px'
        }}
      />
      <p style={{ marginTop: '10px', color: isLoaded ? 'green' : 'orange' }}>
        Status: {isLoaded ? '✅ Map loaded successfully!' : '⏳ Loading...'}
      </p>
    </div>
  );
};

export default SimpleGoogleMap;