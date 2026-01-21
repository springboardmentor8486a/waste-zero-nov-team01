import React from 'react';
import MapView from './MapView';

export default function MapPanel({ pickups = [], opportunities = [] }) {
  return (
    <div className="mb-4">
      <MapView pickups={pickups} opportunities={opportunities} />
    </div>
  );
}
