import React from 'react';
import CalendarView from './CalendarView';

export default function CalendarPanel({ pickups = [], opportunities = [] }) {
  return (
    <div className="mb-4">
      <CalendarView pickups={pickups} opportunities={opportunities} />
    </div>
  );
}
