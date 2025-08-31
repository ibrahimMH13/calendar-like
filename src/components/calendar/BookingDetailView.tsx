import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';

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

type BookingDetailViewProps = {
  booking: Booking;
  station: Station;
  onBack: () => void;
}

const BookingDetailView: React.FC<BookingDetailViewProps> = ({ booking, station, onBack }) => {
    const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      fetchBookingDetails();
    }, [booking, station]);
  
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(
          `https://605c94c36d85de00170da8b4.mockapi.io/stations/${station.id}/bookings/${booking.id}`
        );
        const data = await response.json();
        setBookingDetails(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setBookingDetails(booking); 
      }
      setIsLoading(false);
    };
  
    const calculateDuration = (startDate: string, endDate: string): number => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };
  
    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      );
    }
  
    const details = bookingDetails || booking;
  
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center space-x-3 text-white">
              <User className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">{details.customerName}</h2>
                <p className="text-blue-100">Booking ID: {details.id}</p>
              </div>
            </div>
          </div>
  
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Pickup Date</span>
                </div>
                <p className="text-gray-900 text-lg">{formatDate(details.startDate)}</p>
              </div>
  
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Return Date</span>
                </div>
                <p className="text-gray-900 text-lg">{formatDate(details.endDate)}</p>
              </div>
            </div>
  
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-purple-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Booking Duration</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {calculateDuration(details.startDate, details.endDate)} days
              </p>
            </div>
  
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-600">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Pickup & Return Station</span>
              </div>
              <p className="text-gray-900 text-lg">{station.name}</p>
              <p className="text-gray-500">Station ID: {station.id}</p>
            </div>
          </div>
        </div>
  
        <div className="mt-8 flex justify-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  };
  

  export default BookingDetailView;