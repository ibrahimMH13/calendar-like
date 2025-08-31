import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import WeekGrid from './WeekGrid';

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

type WeekViewProps = {
  selectedStation: Station | null;
  onBookingClick: (booking: Booking) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ selectedStation, onBookingClick }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date('2025-08-07'));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const weekDays = useMemo(() => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay()); 
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [currentWeek]);

  useEffect(() => {
    if (selectedStation) {
      fetchBookings();
    }
  }, [selectedStation, currentWeek]);

  const fetchBookings = async () => {
    if (!selectedStation) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://605c94c36d85de00170da8b4.mockapi.io/stations/${selectedStation.id}/bookings`
      );
      const data = await response.json();
      console.log('API Response:', data);
      console.log('First booking:', data[0]);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
    setIsLoading(false);
  };

  const getBookingsForDay = (date: Date): Booking[] => {
    return bookings.filter((booking: Booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      return date >= startDate && date <= endDate;
    });
  };

  const navigateWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const handleRescheduleBooking = (booking: Booking, newDate: Date, type: 'pickup' | 'return') => {
    const updatedBookings = bookings.map(b => {
      if (b.id === booking.id) {
        const updatedBooking = { ...b };
        if (type === 'pickup') {
          updatedBooking.startDate = newDate.toISOString();
        } else {
          updatedBooking.endDate = newDate.toISOString();
        }
        
        console.log('API CALL - Reschedule Booking:');
        console.log(`PUT /stations/${selectedStation?.id}/bookings/${booking.id}`);
        console.log('Payload:', {
          ...updatedBooking,
          rescheduledBy: 'station-employee',
          rescheduledAt: new Date().toISOString()
        });
        
        return updatedBooking;
      }
      return b;
    });
    
    setBookings(updatedBookings);
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-DE', { month: 'long', year: 'numeric' })}`;
    } else {
      return `${start.toLocaleDateString('en-DE', { month: 'short' })} - ${end.toLocaleDateString('en-DE', { month: 'short', year: 'numeric' })}`;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
        <button
          onClick={() => navigateWeek(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">{formatWeekRange()},</h2><p className='text-sm'> Want to reschedule? Simply drag the booking to your desired day and time slot.</p>
        </div>
        
        <button
          onClick={() => navigateWeek(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <WeekGrid
        weekDays={weekDays}
        getBookingsForDay={getBookingsForDay}
        isLoading={isLoading}
        selectedStation={selectedStation}
        onBookingClick={onBookingClick}
        onRescheduleBooking={handleRescheduleBooking}
      />
    </div>
  );
};

export default WeekView;
