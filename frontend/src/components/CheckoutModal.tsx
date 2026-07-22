import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Navigation, ChevronRight, Package, Loader2, CheckCircle2, AlertCircle, User, Phone, Home, Building2, Hash, Search, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getVehicleImage } from '../utils/imageMapper';
import { useRazorpay } from '../hooks/useRazorpay';
import { RazorpaySandboxModal } from './RazorpaySandboxModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Fix broken Leaflet default icon paths in bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface DeliveryForm {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
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
  onConfirm?: (deliveryInfo: DeliveryForm) => void;
  isLoading?: boolean;
}

const FIELD_CONFIG = [
  { key: 'fullName',    label: 'Full Name',      placeholder: 'John Doe',                  icon: User,      type: 'text', colSpan: 2 },
  { key: 'phone',       label: 'Phone Number',   placeholder: '+91 98765 43210',           icon: Phone,     type: 'tel',  colSpan: 2 },
  { key: 'addressLine', label: 'Address Line',   placeholder: '123, Park Street, Apt 4B',  icon: Home,      type: 'text', colSpan: 2 },
  { key: 'city',        label: 'City',           placeholder: 'Mumbai',                    icon: Building2, type: 'text', colSpan: 1 },
  { key: 'state',       label: 'State',          placeholder: 'Maharashtra',               icon: Building2, type: 'text', colSpan: 1 },
  { key: 'postalCode',  label: 'Postal Code',    placeholder: '400001',                    icon: Hash,      type: 'text', colSpan: 1 },
] as const;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ vehicle, onClose }) => {
  const navigate = useNavigate();
  const { isLoaded: isRazorpayLoaded } = useRazorpay();

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<DeliveryForm>({
    fullName: '', phone: '', addressLine: '', city: '', state: '', postalCode: ''
  });
  const [errors,        setErrors]        = useState<Partial<DeliveryForm>>({});
  const [locating,      setLocating]      = useState(false);
  const [locationError, setLocationError] = useState('');
  const [coords,        setCoords]        = useState<[number, number]>([20.5937, 78.9629]);
  const [mapTip,        setMapTip]        = useState(true);
  const [isProcessing,  setIsProcessing]  = useState(false);

  // Razorpay Sandbox state
  const [sandboxData,   setSandboxData]   = useState<{ orderId: string; amount: number; vehicleName: string } | null>(null);

  // Booking Amounts
  const BOOKING_AMOUNT = 25000;
  const totalPrice = Number(vehicle.price);
  const remainingAmount = Math.max(0, totalPrice - BOOKING_AMOUNT);

  // Search states
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching,   setIsSearching]   = useState(false);
  const [showDropdown,  setShowDropdown]  = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef  = useRef<L.Map | null>(null);
  const markerRef       = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<any>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.address || {};
      setForm(prev => ({
        ...prev,
        addressLine: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ')
                     || addr.display_name?.split(',')[0] || prev.addressLine,
        city:       addr.city || addr.town || addr.county || addr.village || prev.city,
        state:      addr.state || prev.state,
        postalCode: addr.postcode || prev.postalCode,
      }));
      setErrors({});
    } catch {
      // Silently catch network errors
    }
  }, []);

  // Helper to fly to coordinates & set marker
  const updateMapPosition = useCallback((newCoords: [number, number], zoom = 15) => {
    setCoords(newCoords);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(newCoords, zoom, { animate: true, duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng(newCoords);
      } else {
        markerRef.current = L.marker(newCoords).addTo(mapInstanceRef.current);
      }
    }
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const newCoords: [number, number] = [lat, lng];
      setCoords(newCoords);
      setMapTip(false);
      setShowDropdown(false);

      if (markerRef.current) {
        markerRef.current.setLatLng(newCoords);
      } else {
        markerRef.current = L.marker(newCoords).addTo(map);
      }

      reverseGeocode(lat, lng);
    });

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-detect current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateMapPosition([lat, lng], 15);
          await reverseGeocode(lat, lng);
        },
        () => {},
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  }, [updateMapPosition, reverseGeocode]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSearchResults(data || []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectSearchResult = async (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const newCoords: [number, number] = [lat, lon];

    updateMapPosition(newCoords, 16);
    setShowDropdown(false);
    setMapTip(false);
    setSearchQuery(result.display_name);

    await reverseGeocode(lat, lon);
  };

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    setMapTip(false);
    setShowDropdown(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        updateMapPosition(newCoords, 16);
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocationError('Location permission denied. Please search or click on the map.');
        } else {
          setLocationError('Unable to detect location. Please search or click on the map.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [updateMapPosition, reverseGeocode]);

  const validate = (): boolean => {
    const e: Partial<DeliveryForm> = {};
    if (!form.fullName.trim())    e.fullName    = 'Full name is required';
    if (!form.phone.trim())       e.phone       = 'Phone number is required';
    if (!form.addressLine.trim()) e.addressLine = 'Address is required';
    if (!form.city.trim())        e.city        = 'City is required';
    if (!form.state.trim())       e.state       = 'State is required';
    if (!form.postalCode.trim())  e.postalCode  = 'Postal code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fieldChange = (key: keyof DeliveryForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleNext = () => {
    if (validate()) setStep(2);
  };

  // Razorpay Checkout Trigger & Verification
  const handlePayBookingAmount = async () => {
    setIsProcessing(true);
    try {
      // 1. Call backend to create Razorpay order
      const orderRes = await api.post('/payments/create-order', {
        vehicleId: vehicle.id,
        bookingAmount: BOOKING_AMOUNT,
      });

      const { razorpayOrderId, amount, currency, key } = orderRes.data;

      // Helper function to complete backend payment verification
      const completeVerification = async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyRes = await api.post('/payments/verify', {
            ...paymentData,
            vehicleId: vehicle.id,
            deliveryInfo: form,
            bookingAmount: BOOKING_AMOUNT,
          });

          toast.success('🎉 Booking payment verified successfully!');
          onClose();
          navigate(`/booking-success/${verifyRes.data.order?.id || verifyRes.data.order?.orderNumber}`, {
            state: {
              order: verifyRes.data.order,
              payment: verifyRes.data.payment,
              vehicle,
            },
          });
        } catch (err: any) {
          toast.error(err.response?.data?.error || 'Payment verification failed');
        } finally {
          setIsProcessing(false);
        }
      };

      // 2. Open official Razorpay Checkout modal if valid live/test API key is provided
      const isRealRazorpayKey = key && key.startsWith('rzp_') && !key.includes('mockkey');

      if (isRealRazorpayKey && window.Razorpay && isRazorpayLoaded) {
        const options = {
          key,
          amount: Math.round(amount * 100),
          currency,
          name: 'Motovra Luxury Motors',
          description: `Booking Deposit for ${vehicle.make} ${vehicle.model}`,
          image: vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category),
          order_id: razorpayOrderId,
          prefill: {
            name: form.fullName,
            contact: form.phone,
          },
          theme: {
            color: '#d97706',
          },
          handler: async (response: any) => {
            await completeVerification({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              toast.error('Payment cancelled');
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        // Open Sandbox Razorpay Payment Modal
        setSandboxData({
          orderId: razorpayOrderId,
          amount: BOOKING_AMOUNT,
          vehicleName: `${vehicle.make} ${vehicle.model}`,
        });
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
    }
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
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0f0f11]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {[1, 2].map(n => (
                  <React.Fragment key={n}>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${step >= n ? 'bg-amber-500 text-black' : 'bg-white/10 text-muted-foreground'}`}>
                      {n}
                    </div>
                    {n < 2 && (
                      <div className={`w-8 h-0.5 rounded transition-all ${step >= 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <span className="text-white font-heading font-bold text-lg">
                {step === 1 ? 'Delivery Address' : 'Booking Summary & Payment'}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Address & Map */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-5"
              >
                {/* Search Bar Overlay */}
                <div className="relative z-[1001]">
                  <div className="relative">
                    <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => handleSearchChange(e.target.value)}
                      placeholder="Search street, area, city or landmark..."
                      className="w-full bg-[#18181b] border border-amber-500/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 transition-colors shadow-lg"
                    />
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                    ) : searchQuery ? (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowDropdown(false);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>

                  {/* Suggestions Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto z-[1002]">
                      {searchResults.map(result => (
                        <button
                          key={result.place_id}
                          onClick={() => handleSelectSearchResult(result)}
                          className="w-full text-left px-4 py-2.5 hover:bg-amber-500/10 border-b border-white/5 last:border-0 transition-colors flex items-start gap-2 text-xs text-gray-200"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{result.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Map Container */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-secondary" style={{ height: 260 }}>
                  <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

                  {mapTip && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg pointer-events-none z-[1000]">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      Click anywhere on the map to pin your location
                    </div>
                  )}
                </div>

                {/* GPS Location Button */}
                <button
                  type="button"
                  onClick={handleUseMyLocation}
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

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#0f0f11] text-xs text-muted-foreground uppercase tracking-widest">
                      or enter details manually
                    </span>
                  </div>
                </div>

                {/* Address Form */}
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
                  Continue to Booking Summary <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Booking Summary & Razorpay Payment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-5"
              >
                {/* Vehicle Card */}
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
                    <p className="text-2xl font-bold font-mono text-white mt-1">
                      ${totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Delivery Address Summary */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" /> Delivery Location
                    </h4>
                    <button onClick={() => setStep(1)} className="text-xs text-amber-400 hover:underline font-semibold">
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p className="font-semibold text-white">{form.fullName} • {form.phone}</p>
                    <p>{form.addressLine}, {form.city}, {form.state} {form.postalCode}</p>
                  </div>
                </div>

                {/* Razorpay Booking Payment Breakdown */}
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-2.5">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Full Vehicle Price</span>
                    <span className="text-white font-semibold">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> Razorpay Booking Deposit
                    </span>
                    <span className="text-base font-mono font-bold">${BOOKING_AMOUNT.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-500/20 text-sm text-muted-foreground">
                    <span>Remaining Due at Delivery / Financing</span>
                    <span className="text-white font-mono font-bold">${remainingAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex gap-3">
                  {[
                    { text: 'Razorpay Verified', icon: ShieldCheck },
                    { text: 'Enclosed Delivery', icon: CheckCircle2 },
                    { text: 'Certified Provenance', icon: CheckCircle2 },
                  ].map(b => (
                    <div key={b.text} className="flex-1 flex items-center gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                      <b.icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{b.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="flex-1 border-white/10 bg-transparent hover:bg-white/5"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayBookingAmount}
                    isLoading={isProcessing}
                    className="flex-[2] py-5 text-base bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg shadow-amber-500/20"
                  >
                    <CreditCard className="w-5 h-5 mr-2" /> Pay ${BOOKING_AMOUNT.toLocaleString()} Booking Deposit
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Razorpay Sandbox Modal */}
      {sandboxData && (
        <RazorpaySandboxModal
          razorpayOrderId={sandboxData.orderId}
          amount={sandboxData.amount}
          vehicleName={sandboxData.vehicleName}
          customerName={form.fullName}
          customerPhone={form.phone}
          onSuccess={async (paymentData) => {
            setSandboxData(null);
            try {
              const verifyRes = await api.post('/payments/verify', {
                ...paymentData,
                vehicleId: vehicle.id,
                deliveryInfo: form,
                bookingAmount: BOOKING_AMOUNT,
              });

              toast.success('🎉 Booking payment verified successfully!');
              onClose();
              navigate(`/booking-success/${verifyRes.data.order?.id || verifyRes.data.order?.orderNumber}`, {
                state: {
                  order: verifyRes.data.order,
                  payment: verifyRes.data.payment,
                  vehicle,
                },
              });
            } catch (err: any) {
              toast.error(err.response?.data?.error || 'Payment verification failed');
            } finally {
              setIsProcessing(false);
            }
          }}
          onCancel={() => {
            setSandboxData(null);
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }}
        />
      )}
    </AnimatePresence>
  );
};
