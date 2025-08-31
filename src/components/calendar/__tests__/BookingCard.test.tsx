import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingCard from '../BookingCard';

const mockBooking = {
  id: '1',
  customerName: 'John Doe',
  pickupReturnStationId: 'station-1',
  startDate: '2025-08-07T10:00:00Z',
  endDate: '2025-08-09T15:00:00Z',
};

describe('BookingCard', () => {
  it('renders booking information correctly', () => {
    const mockOnClick = vi.fn();
    
    render(
      <BookingCard
        booking={mockBooking}
        onClick={mockOnClick}
        type="pickup"
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Pickup')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    
    render(
      <BookingCard
        booking={mockBooking}
        onClick={mockOnClick}
        type="pickup"
      />
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnClick).toHaveBeenCalledWith(mockBooking);
  });

  it('shows correct type and styling for pickup', () => {
    const mockOnClick = vi.fn();
    
    const { container } = render(
      <BookingCard
        booking={mockBooking}
        onClick={mockOnClick}
        type="pickup"
      />
    );

    const card = container.querySelector('[draggable="true"]');
    expect(card).toHaveClass('bg-green-100');
    expect(screen.getByText('Pickup')).toBeInTheDocument();
  });

  it('shows correct type and styling for return', () => {
    const mockOnClick = vi.fn();
    
    const { container } = render(
      <BookingCard
        booking={mockBooking}
        onClick={mockOnClick}
        type="return"
      />
    );

    const card = container.querySelector('[draggable="true"]');
    expect(card).toHaveClass('bg-blue-100');
    expect(screen.getByText('Return')).toBeInTheDocument();
  });

  it('handles drag start event', () => {
    const mockOnClick = vi.fn();
    const mockOnDragStart = vi.fn();
    
    const { container } = render(
      <BookingCard
        booking={mockBooking}
        onClick={mockOnClick}
        type="pickup"
        onDragStart={mockOnDragStart}
      />
    );

    const card = container.querySelector('[draggable="true"]');
    expect(card).toBeInTheDocument();
    
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: ''
    };
    
    fireEvent.dragStart(card!, {
      dataTransfer: mockDataTransfer
    });
    
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify({ booking: mockBooking, type: 'pickup' })
    );
    expect(mockOnDragStart).toHaveBeenCalledWith(mockBooking, 'pickup');
  });
});