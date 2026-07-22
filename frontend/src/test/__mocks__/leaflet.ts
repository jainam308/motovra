// Mock for leaflet in Vitest/JSDOM environment
import { vi } from 'vitest';

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

const L = {
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: vi.fn(),
    },
  },
  icon: vi.fn(() => ({})),
  marker: vi.fn(() => mockMarker),
  map: vi.fn(() => mockMap),
  tileLayer: vi.fn(() => mockTileLayer),
  latLng: (lat: number, lng: number) => ({ lat, lng }),
};

export default L;
export { L };
