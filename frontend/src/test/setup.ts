import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

const mockMap = {
  setView: vi.fn().mockReturnThis(),
  remove: vi.fn(),
  flyTo: vi.fn().mockReturnThis(),
  on: vi.fn(),
  off: vi.fn(),
  invalidateSize: vi.fn(),
};

const mockMarker = {
  addTo: vi.fn().mockReturnThis(),
  setLatLng: vi.fn().mockReturnThis(),
  remove: vi.fn(),
};

const mockTileLayer = {
  addTo: vi.fn().mockReturnThis(),
};

// Mock Leaflet globally — uses browser APIs incompatible with JSDOM
vi.mock('leaflet', () => ({
  default: {
    Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
    icon: vi.fn(() => ({})),
    marker: vi.fn(() => mockMarker),
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => mockTileLayer),
    latLng: (lat: number, lng: number) => ({ lat, lng }),
  },
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'mock-map' }, children),
  TileLayer: () => null,
  Marker: () => null,
  useMap: () => ({ flyTo: vi.fn(), setView: vi.fn() }),
}));

vi.mock('leaflet/dist/leaflet.css', () => ({}));

// Global mocks for DOM APIs not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.scrollTo = () => {};
