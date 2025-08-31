import { useState } from 'react';
import './App.css'
import Header from './components/ui/Header';
import BookingDetailView from './components/calendar/BookingDetailView';
import WeekView from './components/calendar/WeekView';
import { MapPin } from 'lucide-react';
import { AppProvider } from './context/AppContext';

const App = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentView, setCurrentView] = useState('calendar');

  const selectHandler = (station) => {
    setSelectedStation(station);
    setSelectedBooking(null);
    setCurrentView('calendar');
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setCurrentView('booking-detail');
  };

  const handleBackToCalendar = () => {
    setSelectedBooking(null);
    setCurrentView('calendar');
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header currentViewName={currentView} handleStationSelect={selectHandler} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'calendar' && (
          <>
            {!selectedStation ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a Station
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Please select a station from the search field above to view bookings and manage your fleet.
                    </p>
                    <div className="text-sm text-gray-500">
                      Use the autocomplete field to search for stations by name
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedStation.name}
                    </h2>
                  </div>
                  <p className="text-gray-600">Station ID: {selectedStation.id}</p>
                </div>
                
                <WeekView
                  selectedStation={selectedStation}
                  onBookingClick={handleBookingClick}
                />
              </div>
            )}
          </>
        )}

        {currentView === 'booking-detail' && selectedBooking && selectedStation && (
          <BookingDetailView
            booking={selectedBooking}
            station={selectedStation}
            onBack={handleBackToCalendar}
          />
        )}
      </main>
      </div>
    </AppProvider>
  );
};

export default App
