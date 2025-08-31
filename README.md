# Calendar-Like Booking Management System

A React-based calendar application for managing vehicle bookings with pickup and return scheduling.

## Features

- Weekly calendar view for booking management
- Drag and drop functionality for booking cards
- Station-based filtering with autocomplete search
- Pickup and return booking types with color coding
- Responsive design with Tailwind CSS

## Technology Stack

- React 19.1.1
- TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Vitest for testing
- React Testing Library
- Lucide React for icons

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests once:
```bash
npm run test:run
```

## Building

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── calendar/           # Calendar-related components
│   │   ├── BookingCard.tsx # Individual booking display
│   │   ├── WeekGrid.tsx    # Weekly grid layout
│   │   └── WeekView.tsx    # Main calendar view
│   └── ui/                 # Reusable UI components
│       ├── AutoCompleteInput.tsx
│       └── Header.tsx
├── context/
│   └── AppContext.tsx      # Application state management
└── test/
    └── setup.ts           # Test configuration
```

## Component Overview

### BookingCard
Displays individual booking information with drag and drop support. Shows customer name, booking ID, and pickup/return type with appropriate styling.

### WeekView
Main calendar component that displays a weekly view of bookings. Includes station filtering and week navigation.

### AutoCompleteInput
Search component with autocomplete functionality for station selection.

## Development Notes

- Uses Vitest with jsdom for testing React components
- Tailwind CSS for utility-first styling
- TypeScript for type safety
- ESLint for code quality
