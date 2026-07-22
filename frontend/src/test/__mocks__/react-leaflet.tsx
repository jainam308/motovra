// Mock for react-leaflet in Vitest/JSDOM environment
import React from 'react';

export const MapContainer = ({ children }: { children?: React.ReactNode }) =>
  React.createElement('div', { 'data-testid': 'mock-map' }, children);

export const TileLayer = () => null;

export const Marker = () => null;

export const useMap = () => ({
  flyTo: () => {},
  setView: () => {},
  getZoom: () => 14,
});
