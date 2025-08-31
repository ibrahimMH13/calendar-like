import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AutoCompleteInput from '../AutoCompleteInput';

// Mock fetch
global.fetch = vi.fn();

const mockStations = [
  { id: '1', name: 'Central Station' },
  { id: '2', name: 'North Station' },
  { id: '3', name: 'South Central Hub' },
];

describe('AutoCompleteInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve(mockStations),
    });
  });

  it('renders input field with placeholder', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <AutoCompleteInput
        onSelect={mockOnSelect}
        placeholder="Search stations..."
      />
    );

    expect(screen.getByPlaceholderText('Search stations...')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows loading spinner when typing', async () => {
    const mockOnSelect = vi.fn();
    
    render(
      <AutoCompleteInput
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Central' } });

    // Loading spinner should appear briefly
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    }, { timeout: 100 });
  });

  it('fetches and displays suggestions', async () => {
    const mockOnSelect = vi.fn();
    
    render(
      <AutoCompleteInput
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Central' } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://605c94c36d85de00170da8b4.mockapi.io/stations');
    });

    await waitFor(() => {
      expect(screen.getByText('Central Station')).toBeInTheDocument();
      expect(screen.getByText('South Central Hub')).toBeInTheDocument();
    });
  });

  it('filters suggestions based on query', async () => {
    const mockOnSelect = vi.fn();
    
    render(
      <AutoCompleteInput
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'North' } });

    await waitFor(() => {
      expect(screen.getByText('North Station')).toBeInTheDocument();
      expect(screen.queryByText('Central Station')).not.toBeInTheDocument();
    });
  });

  it('calls onSelect with station when suggestion is clicked', async () => {
    const mockOnSelect = vi.fn();
    
    render(
      <AutoCompleteInput
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Central' } });

    await waitFor(() => {
      expect(screen.getByText('Central Station')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Central Station'));
    
    expect(mockOnSelect).toHaveBeenCalledWith({
      id: '1',
      name: 'Central Station'
    });
  });
});