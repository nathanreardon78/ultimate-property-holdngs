import { Property } from './types';

export const properties: Property[] = [
  {
    id: 'howland-6-main',
    name: '6 Main St',
    address: '6 Main St, Howland, ME 04448',
    city: 'Howland', state: 'ME', zip: '04448',
    status: 'For Rent', type: 'Apartment Complex',
    description: 'Eight-unit residential complex in the heart of Howland. Walkable to local shops and river access. Professionally managed.',
    bedroomsSummary: 'Mix of 1–2 BR', bathsSummary: '1 bath per unit', sqftApprox: 'Varies by unit',
    heroImg: '/images/properties/howland/howland-front.jpeg',
    gallery: [
      '/images/properties/howland/howland-1.jpeg', '/images/properties/howland/howland-2.jpeg', 
      '/images/properties/howland/howland-3.jpeg', '/images/properties/howland/howland-4.jpeg', 
      '/images/properties/howland/howland-5.jpeg', '/images/properties/howland/howland-6.jpeg', 
      '/images/properties/howland/howland-7.jpeg'
    ],
    amenities: ['On-site parking', 'Laundry hookups', 'Pet-friendly (w/ approval)', '24/7 maintenance'],
    rentFrom: 950, rentTo: 1250,
    units: Array.from({ length: 8 }).map((_, i) => ({
      id: `howland-u${i + 1}`, label: `Unit ${i + 1}`, bedrooms: i % 2 === 0 ? 1 : 2, bathrooms: 1, sqft: i % 2 === 0 ? 600 : 780, rent: i % 2 === 0 ? 950 : 1150, available: i === 1 || i === 4,
      image: ['/images/properties/howland/howland-1.jpeg', '/images/properties/howland/howland-2.jpeg', '/images/properties/howland/howland-3.jpeg', '/images/properties/howland/howland-4.jpeg'][i % 4]
    })),
    coordinates: { lat: 45.2386, lng: -68.6642 },
  },
  {
    id: 'dexter-49-mill',
    name: '49 Mill St',
    address: '49 Mill St, Dexter, ME 04930',
    city: 'Dexter', state: 'ME', zip: '04930',
    status: 'For Rent', type: 'Apartment Complex',
    description: 'Quiet complex near Dexter’s town center. Updated interiors and efficient heating.',
    bedroomsSummary: '2 BR mix', bathsSummary: '1 bath per unit', sqftApprox: '~850 sqft per unit',
    heroImg: '/images/properties/dexter/hero.svg',
    gallery: ['/images/properties/dexter/1.svg', '/images/properties/dexter/2.svg', '/images/properties/dexter/3.svg'],
    amenities: ['Driveway parking', 'Backyard', 'Updated kitchens', 'Snow removal included'],
    rentFrom: 1100, rentTo: 1250,
    units: Array.from({ length: 8 }).map((_, i) => ({
      id: `dexter-u${i + 1}`, label: `Unit ${i + 1}`, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 1150, available: i % 3 !== 0,
      image: ['/images/properties/dexter/1.svg', '/images/properties/dexter/2.svg', '/images/properties/dexter/3.svg'][i % 3]
    })),
    coordinates: { lat: 45.0234, lng: -69.2916 },
  },
  {
    id: 'pittsfield-115-somerset',
    name: '115 Somerset Ave',
    address: '115 Somerset Ave, Pittsfield, ME 04967',
    city: 'Pittsfield', state: 'ME', zip: '04967',
    status: 'For Rent', type: 'Single-family',
    description: 'Single unit, three-bedroom home on Somerset Ave. Bright interior, private yard, and close to schools.',
    bedroomsSummary: '3 BR', bathsSummary: '1 bath', sqftApprox: '~1,150 sqft',
    heroImg: '/images/properties/pittsfield/hero.svg',
    gallery: ['/images/properties/pittsfield/hero.svg'],
    amenities: ['Yard', 'Washer/Dryer', 'Basement storage', 'Pets considered'],
    rentFrom: 1550, rentTo: 1550,
    units: [{ id: 'pittsfield-main', label: 'Whole Home', bedrooms: 3, bathrooms: 1, sqft: 1150, rent: 1550, available: true, image: '/images/properties/pittsfield/hero.svg' }],
    coordinates: { lat: 44.7826, lng: -69.3839 },
  },
];

export const company = {
  name: 'Ultimate Property Holdings',
  email: 'nathan@membershipauto.com',
  phone: '207-947-1999',
  mailing: 'PO Box 52, Detroit, ME 04929',
  hours: 'Mon–Fri, 9am–5pm',
};
