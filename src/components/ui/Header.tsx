import React from 'react'
import AutoCompleteInput from './AutoCompleteInput'

type Station = {
  id: string;
  name: string;
}

type HeaderProps = {
  currentViewName: string;
  handleStationSelect: (station: Station) => void;
}

const Header: React.FC<HeaderProps> = ({currentViewName, handleStationSelect}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage fleet bookings and station operations</p>
        </div>
        
        {currentViewName === 'calendar' && (
          <div className="w-full sm:w-auto">
            <AutoCompleteInput
              onSelect={handleStationSelect}
              placeholder="Search for a station..."
            />
          </div>
        )}
      </div>
    </div>
  </header>

  )
}

export default Header
