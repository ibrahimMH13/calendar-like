import React from 'react';
import BookingCard from './BookingCard';

type Station ={
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

type WeekGridProps = {
  weekDays: Date[];
  getBookingsForDay: (day: Date) => Booking[];
  isLoading: boolean;
  selectedStation: Station | null;
  onBookingClick: (booking: Booking) => void;
  onRescheduleBooking: (booking: Booking, newDate: Date, type: 'pickup' | 'return') => void;
}

const WeekGrid: React.FC<WeekGridProps> = ({ weekDays, getBookingsForDay, isLoading, selectedStation, onBookingClick, onRescheduleBooking }) => {
  const [draggedOver, setDraggedOver] = React.useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(dayIndex);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDraggedOver(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { booking, type } = dragData;
      onRescheduleBooking(booking, targetDate, type);
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  return (
    <div data-testid="week-grid" className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((day: Date, index: number) => {
        const dayBookings = getBookingsForDay(day);
        const isToday = day.toDateString() === new Date().toDateString();
        
        const isDraggedOver = draggedOver === index;
        
        return (
          <div
            key={index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, day)}
            className={`bg-white rounded-lg shadow-sm border-2 min-h-[200px] transition-all ${
              isToday ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'
            } ${
              isDraggedOver ? 'border-green-400 bg-green-50 ring-2 ring-green-200' : ''
            }`}
          >
            <div className={`p-4 border-b ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-600">
                {day.toLocaleDateString('en-DE', { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
            
            <div className="p-3 space-y-2">
              {isLoading && selectedStation && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              
              {!isLoading && dayBookings.map((booking: Booking) => {
                const isPickupDay = new Date(booking.startDate).toDateString() === day.toDateString();
                const isReturnDay = new Date(booking.endDate).toDateString() === day.toDateString();
                
                return (
                  <div key={booking.id} className="space-y-1">
                    {isPickupDay && (
                      <BookingCard
                        booking={booking}
                        onClick={onBookingClick}
                        type="pickup"
                        onDragStart={(booking, type) => console.log('Dragging:', booking.id, type)}
                      />
                    )}
                    {isReturnDay && (
                      <BookingCard
                        booking={booking}
                        onClick={onBookingClick}
                        type="return"
                        onDragStart={(booking, type) => console.log('Dragging:', booking.id, type)}
                      />
                    )}
                  </div>
                );
              })}
              
              {!isLoading && dayBookings.length === 0 && selectedStation && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No bookings
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekGrid;