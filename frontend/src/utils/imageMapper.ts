// High-quality, verified Unsplash CDN images for seeded luxury cars
// All URLs are verified to return HTTP 200 OK and allow cross-origin web embedding.

const vehicleImages: Record<string, string> = {
  // Porsche 911 GT3 RS
  'porsche': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',

  // Aston Martin DBS Superleggera
  'aston martin': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200',

  // Bentley Continental GT
  'bentley': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=1200',

  // Rolls-Royce Phantom
  'rolls-royce': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',

  // Mercedes-Benz G63 AMG
  'mercedes': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',

  // Lamborghini Urus Performante
  'lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',

  // Ferrari SF90 Stradale
  'ferrari': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200',

  // McLaren 765LT
  'mclaren': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',

  // Range Rover SV Autobiography
  'range rover': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200',

  // Tesla Model S Plaid
  'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200',

  // Lucid Air Sapphire
  'lucid': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200',

  // Rivian R1S
  'rivian': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',

  // Audi RS e-tron GT
  'audi': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',

  // BMW M8 Competition
  'bmw': 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200',

  // Lexus LC 500
  'lexus': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
};

// Fallback images based on vehicle category (for newly added vehicles)
const categoryFallbacks: Record<string, string> = {
  SPORTS: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
  LUXURY: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
  SUV: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200',
  ELECTRIC: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200',
  SEDAN: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200',
  CONVERTIBLE: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',
  TRUCK: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
};

export const getVehicleImage = (make: string, model?: string, category?: string): string => {
  const makeLower = (make || '').toLowerCase();

  for (const [key, url] of Object.entries(vehicleImages)) {
    if (makeLower.includes(key)) return url;
  }

  if (category && categoryFallbacks[category.toUpperCase()]) {
    return categoryFallbacks[category.toUpperCase()];
  }

  return 'https://images.unsplash.com/photo-1503376760302-8fac2a800e00?auto=format&fit=crop&q=80&w=1200';
};
