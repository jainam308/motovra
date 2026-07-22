// Mock for leaflet in Vitest/JSDOM environment
const L = {
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: () => {},
    },
  },
  icon: () => ({}),
  marker: () => ({ addTo: () => {}, setLatLng: () => {}, remove: () => {} }),
  map: () => ({ setView: () => {}, remove: () => {}, flyTo: () => {} }),
  tileLayer: () => ({ addTo: () => {} }),
  latLng: (lat: number, lng: number) => ({ lat, lng }),
};

export default L;
