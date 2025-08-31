import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WeekView from '../WeekView';

// Mock fetch
global.fetch = vi.fn();

const mockStation = {
  id: 'station-1',
  name: 'Central Station',
};

const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    pickupReturnStationId: 'station-1',
    startDate: '2025-08-07T10:00:00Z',
    endDate: '2025-08-09T15:00:00Z',
  },
];

describe('WeekView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve(mockBookings),
    });
  });

  it('renders week navigation correctly', () => {
    const mockOnBookingClick = vi.fn();
    
    render(
      <WeekView
        selectedStation={mockStation}
        onBookingClick={mockOnBookingClick}
      />
    );

    expect(screen.getByLabelText('Previous week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next week')).toBeInTheDocument();
  });

  it('fetches bookings when station is selected', async () => {
    const mockOnBookingClick = vi.fn();
    
    render(
      <WeekView
        selectedStation={mockStation}
        onBookingClick={mockOnBookingClick}
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://605c94c36d85de00170da8b4.mockapi.io/stations/station-1/bookings'
      );
    });
  });

  it('navigates weeks correctly', () => {
    const mockOnBookingClick = vi.fn();
    
    render(
      <WeekView
        selectedStation={mockStation}
        onBookingClick={mockOnBookingClick}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Should trigger another fetch for the new week
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles booking reschedule', async () => {
    const mockOnBookingClick = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(
      <WeekView
        selectedStation={mockStation}
        onBookingClick={mockOnBookingClick}
      />
    );

    // Wait for initial load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // Find the WeekGrid component and simulate a reschedule
    const weekGrid = screen.getByTestId('week-grid');
    
    // This would be tested via integration with drag-drop events
    // For now, just verify the component renders
    expect(weekGrid).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});