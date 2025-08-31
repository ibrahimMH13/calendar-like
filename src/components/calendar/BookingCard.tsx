import React from 'react';


type Booking = {
  id: string;
  customerName: string;
  pickupReturnStationId: string;
  startDate: string;
  endDate: string;
}

type BookingCardProps = {
  booking: Booking;
  onClick: (booking: Booking) => void;
  type: 'pickup' | 'return';
  onDragStart?: (booking: Booking, type: 'pickup' | 'return') => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick, type, onDragStart }) => {
    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };
  
    const typeColors = {
      pickup: 'bg-green-100 text-green-800 border-green-200',
      return: 'bg-blue-100 text-blue-800 border-blue-200'
    };
  
    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ booking, type }));
      e.dataTransfer.effectAllowed = 'move';
      if (onDragStart) {
        onDragStart(booking, type);
      }
    };

    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={() => onClick(booking)}
        className={`p-3 rounded-lg border-2 cursor-move hover:shadow-md transition-all ${typeColors[type]} hover:scale-105`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-medium uppercase tracking-wide">
            {type === 'pickup' ? 'Pickup' : 'Return'}
          </div>
          <div className="text-xs opacity-75">
            {formatDate(type === 'pickup' ? booking.startDate : booking.endDate)}
          </div>
        </div>
        <div className="font-medium text-sm mb-1">{booking.customerName}</div>
        <div className="text-xs opacity-75">ID: {booking.id}</div>
      </div>
    );
  };

export default BookingCard;
  