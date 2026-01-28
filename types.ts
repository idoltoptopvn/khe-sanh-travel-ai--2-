
export interface Message {
  role: 'user' | 'model';
  text: string;
  groundingLinks?: GroundingLink[];
  timestamp: Date;
  suggestions?: string[];
  bookingOptions?: BookingOption[];
}

export interface BookingOption {
  id: string;
  type: 'hotel' | 'transport';
  title: string;
  description: string;
  price: string;
  rating?: number;
  image: string;
  details: string;
}

export interface GroundingLink {
  title: string;
  uri: string;
  type: 'search' | 'map';
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
}
