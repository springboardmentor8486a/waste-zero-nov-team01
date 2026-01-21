import React, { useEffect, useRef, useState } from 'react';

// MapView: tries Google Maps (if API key present); falls back to Leaflet + OpenStreetMap if Google isn't available
// Expects pickups/opportunities: [{ id, lat, lng, label, address, title }]
export default function MapView({ pickups = [], opportunities = [] }) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [error, setError] = useState(null);

  const points = [...(pickups || []), ...(opportunities || [])].filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));

  // Helper to inject scripts/styles
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      // If script already exists, wait a tick and check for globals (best-effort)
      setTimeout(() => resolve(), 50);
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(s);
  });
  const loadCss = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  };

  const waitForContainer = async (attempts = 10, delay = 100) => {
    for (let i = 0; i < attempts; i++) {
      if (mapRef.current && mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0) return true;
      // try to give layout a chance to render
      await new Promise(r => setTimeout(r, delay));
    }
    return false;
  };

  const initGoogle = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return false;
    try {
      const center = points.length ? { lat: points[0].lat, lng: points[0].lng } : { lat: 0, lng: 0 };
      // Guard: ensure container is ready
      if (!mapRef.current.offsetWidth || !mapRef.current.offsetHeight) {
        console.warn('Google maps init deferred: container has no size');
        return false;
      }
      googleMapRef.current = new window.google.maps.Map(mapRef.current, { zoom: points.length ? 12 : 2, center });
      points.forEach((pt) => {
        new window.google.maps.Marker({ position: { lat: pt.lat, lng: pt.lng }, map: googleMapRef.current, title: pt.label || pt.title || pt.address || '' });
      });
      return true;
    } catch (e) {
      console.warn('Google maps init failed:', e);
      return false;
    }
  };

  const initLeaflet = async () => {
    const cssHref = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const scriptCandidates = [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
    ];

    try {
      loadCss(cssHref);

      let loaded = false;
      for (const url of scriptCandidates) {
        try {
          await loadScript(url);
          if (window.L) { loaded = true; break; }
        } catch (err) {
          console.warn('Leaflet script load failed for', url, err);
        }
      }

      if (!loaded || !window.L) throw new Error('Leaflet not available');

      // cleanup any existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const ok = await waitForContainer(20, 100);
      if (!ok) throw new Error('Map container not found or has no size. Container may be hidden or rendering later.');

      const center = points.length ? [points[0].lat, points[0].lng] : [0, 0];
      const map = window.L.map(mapRef.current, { center, zoom: points.length ? 12 : 2 });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      points.forEach(pt => {
        window.L.marker([pt.lat, pt.lng]).addTo(map).bindPopup(pt.title || pt.address || pt.label || '');
      });

      leafletMapRef.current = map;
      return true;
    } catch (e) {
      console.error('Leaflet init failed:', e);
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;
    const initialized = { value: false };

    const tryMaps = async () => {
      if (initialized.value) return true;
      setError(null);

      // If an existing Google or Leaflet map exists, remove/clear it
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Prefer Google if key provided
      if (key) {
        try {
          if (!window.google || !window.google.maps) {
            await loadScript(`https://maps.googleapis.com/maps/api/js?key=${key}`);
          }
          const ok = initGoogle();
          if (ok) {
            initialized.value = true;
            return true;
          }
          // fall back to leaflet
          const lOk = await initLeaflet();
          if (lOk) {
            initialized.value = true;
            return true;
          }
          if (!cancelled) setError('Failed to initialize any map provider');
          return false;
        } catch (e) {
          // If Google fails, try Leaflet
          console.warn('Google Maps load failed, attempting Leaflet', e);
          const lOk = await initLeaflet();
          if (lOk) {
            initialized.value = true;
            return true;
          }
          if (!cancelled) setError('Failed to initialize any map provider');
          return false;
        }
      }

      // No Google API key — use Leaflet
      const lOk = await initLeaflet();
      if (lOk) {
        initialized.value = true;
        return true;
      }
      if (!cancelled) setError('Failed to initialize map');
      return false;
    };

    // Attempt immediately; if it fails due to container size, set up observers to retry when container gets sized
    (async () => {
      const ok = await tryMaps();
      if (ok) return;

      // Wait for the map container to be shown/resized
      let observer;
      try {
        if (typeof ResizeObserver !== 'undefined' && mapRef.current) {
          observer = new ResizeObserver(async (entries) => {
            for (const entry of entries) {
              const cr = entry.contentRect || {};
              if (cr.width > 0 && cr.height > 0) {
                console.debug('MapView: container resized, retrying map init');
                const r = await tryMaps();
                if (r && observer) {
                  observer.disconnect();
                }
              }
            }
          });
          observer.observe(mapRef.current);
        }
      } catch (e) {
        console.warn('MapView: resize observer failed', e);
      }

      // Also attempt when window resizes as a last resort
      const onResize = async () => {
        console.debug('MapView: window resized, retrying map init');
        const r = await tryMaps();
        if (r && observer) observer.disconnect();
      };
      window.addEventListener('resize', onResize);

      // If nothing triggers in 5s, give one final attempt
      const finalTimer = setTimeout(async () => {
        console.debug('MapView: final retry after timeout');
        await tryMaps();
      }, 5000);

      // clean up
      return () => {
        cancelled = true;
        if (observer) observer.disconnect();
        window.removeEventListener('resize', onResize);
        clearTimeout(finalTimer);
      };
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(points)]);

  // If we don't have any points to show, provide a simple fallback list + link
  if (!points.length) {
    const labels = [...(pickups || []), ...(opportunities || [])].map(p => p.address || p.title || p.label).filter(Boolean);
    if (!labels.length) return <div className="py-6 text-center text-slate-500">No locations to show on map.</div>;
    const q = encodeURIComponent(labels.join(' | '));
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
    return (
      <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="mb-3 text-sm text-slate-600">No coordinates available — showing list view.</div>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline">Open locations in Google Maps</a>
        <div className="mt-3 text-sm text-slate-500 space-y-1">
          {labels.slice(0, 8).map((l, i) => <div key={i}>• {l}</div>)}
        </div>
      </div>
    );
  }

  if (error) return <div className="py-6 text-center text-rose-600">{error}</div>;

  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden shadow-sm h-48">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}