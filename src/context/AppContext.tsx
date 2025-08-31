import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Station = {
  id: string;
  name: string;
}

type Booking = {
  id: string;
  customerName: string;
  pickupReturnStationId: string;
  startDate: string;
  endDate: string;
}

type AppState = {
  selectedStation: Station | null;
  selectedBooking: Booking | null;
  currentView: 'calendar' | 'booking-detail';
  bookings: Booking[];
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_SELECTED_STATION'; payload: Station | null }
  | { type: 'SET_SELECTED_BOOKING'; payload: Booking | null }
  | { type: 'SET_CURRENT_VIEW'; payload: 'calendar' | 'booking-detail' }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_BOOKING'; payload: Booking };

const initialState: AppState = {
  selectedStation: null,
  selectedBooking: null,
  currentView: 'calendar',
  bookings: [],
  isLoading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SELECTED_STATION':
      return { ...state, selectedStation: action.payload };
    case 'SET_SELECTED_BOOKING':
      return { ...state, selectedBooking: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(b => 
          b.id === action.payload.id ? action.payload : b
        )
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};