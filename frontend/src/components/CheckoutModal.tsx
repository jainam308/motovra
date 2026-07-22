import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Navigation, ChevronRight, Package, Loader2, CheckCircle2, AlertCircle, User, Phone, Home, Building2, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getVehicleImage } from '../utils/imageMapper';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DeliveryForm {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CheckoutModalProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    price: number;
    imageUrl?: string;
    category: string;
  };
  onClose: () => void;
  onConfirm: (deliveryInfo: DeliveryForm) => void;
  isLoading: boolean;
}

// Component to move map view when coords change
function MapFlyTo({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { animate: true, duration: 1.2 });
  }, [coords, map]);
  return null;
}

const FIELD_CONFIG = [
  { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', icon: User, type: 'text', colSpan: 2 },
  { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', icon: Phone, type: 'tel', colSpan: 2 },
  { key: 'addressLine', label: 'Address Line', placeholder: '123, Park Street, Apt 4B', icon: Home, type: 'text', colSpan: 2 },
  { key: 'city', label: 'City', placeholder: 'Mumbai', icon: Building2, type: 'text', colSpan: 1 },
  { key: 'state', label: 'State', placeholder: 'Maharashtra', icon: Building2, type: 'text', colSpan: 1 },
  { key: 'postalCode', label: 'Postal Code', placeholder: '400001', icon: Hash, type: 'text', colSpan: 1 },
] as const;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ vehicle, onClose, onConfirm, isLoading }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<DeliveryForm>({
    fullName: '', phone: '', addressLine: '', city: '', state: '', postalCode: ''
  });
  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});
  const [coords, setCoords] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<DeliveryForm> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUseLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);
        setMapReady(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          setForm(prev => ({
            ...prev,
            addressLine: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || addr.display_name?.split(',')[0] || '',
            city: addr.city || addr.town || addr.county || addr.village || '',
            state: addr.state || '',
            postalCode: addr.postcode || '',
          }));
          setErrors({});
        } catch {
          setLocationError('Could not fetch address. Please fill manually.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocationError('Location access denied. Please allow location permission.');
        else setLocationError('Unable to detect location. Please fill manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const handleNext = () => {
    if (validate()) {
      setStep(2);
      if (!mapReady) setMapReady(true);
    }
  };

  const fieldChange = (key: keyof DeliveryForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0f0f11]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Step indicators */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${step >= 1 ? 'bg-amber-500 text-black' : 'bg-white/10 text-muted-foreground'}`}>1</div>
                <div className={`w-8 h-0.5 rounded transition-all ${step >= 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${step >= 2 ? 'bg-amber-500 text-black' : 'bg-white/10 text-muted-foreground'}`}>2</div>
              </div>
              <span className="text-white font-heading font-bold text-lg">
                {step === 1 ? 'Delivery Address' : 'Confirm Order'}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Address Form */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {/* Use My Location Button */}
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60 transition-all font-semibold text-sm disabled:opacity-50"
                >
                  {locating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Detecting your location...</>
                  ) : (
                    <><Navigation className="w-4 h-4" /> Use My Current Location</>
                  )}
                </button>

                {locationError && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {locationError}
                  </div>
                )}

                {/* Map Preview */}
                {mapReady && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 220 }}
                    className="rounded-xl overflow-hidden border border-white/10"
                  >
                    <MapContainer
                      center={coords}
                      zoom={14}
                      style={{ height: '220px', width: '100%' }}
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />
                      <Marker position={coords} />
                      <MapFlyTo coords={coords} />
                    </MapContainer>
                  </motion.div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#0f0f11] text-xs text-muted-foreground uppercase tracking-widest">
                      or fill manually
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {FIELD_CONFIG.map(({ key, label, placeholder, icon: Icon, type, colSpan }) => (
                    <div key={key} className={colSpan === 2 ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        <Icon className="w-3.5 h-3.5 inline mr-1.5 opacity-70" />
                        {label}
                      </label>
                      <Input
                        type={type}
                        value={form[key]}
                        onChange={e => fieldChange(key, e.target.value)}
                        placeholder={placeholder}
                        error={!!errors[key]}
                      />
                      {errors[key] && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors[key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={handleNext} className="w-full py-5 text-base bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Continue to Review <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Order Confirmation */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-5"
              >
                {/* Vehicle Summary Card */}
                <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <img
                      src={vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category)}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{vehicle.category}</p>
                    <h3 className="text-xl font-heading font-bold text-white">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
                      ${Number(vehicle.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Delivery Address Confirmation */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" /> Delivery Address
                    </h4>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p className="font-semibold text-white">{form.fullName}</p>
                    <p className="text-muted-foreground">{form.phone}</p>
                    <p>{form.addressLine}</p>
                    <p>{form.city}, {form.state} — {form.postalCode}</p>
                  </div>
                </div>

                {/* Map at Step 2 */}
                {mapReady && (
                  <div className="rounded-xl overflow-hidden border border-white/10 h-40">
                    <MapContainer
                      center={coords}
                      zoom={14}
                      style={{ height: '160px', width: '100%' }}
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                      <Marker position={coords} />
                    </MapContainer>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Vehicle Price</span>
                    <span className="text-white font-semibold">${Number(vehicle.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-500/20 text-base font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">${Number(vehicle.price).toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex gap-3">
                  {['Secure Payment', 'Certified Vehicle', 'Enclosed Delivery'].map(badge => (
                    <div key={badge} className="flex-1 flex items-center gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{badge}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-white/10 bg-transparent hover:bg-white/5"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => onConfirm(form)}
                    isLoading={isLoading}
                    className="flex-2 flex-grow py-5 text-base bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Place Order
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
