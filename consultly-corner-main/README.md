
# HealthConnect - Medical Specialists Finder

## Project Overview

HealthConnect is a modern web application designed to help users find and connect with medical specialists, including gynecologists, psychiatrists, and therapists. The platform provides detailed information about each doctor, their specialties, availability, and allows users to schedule appointments and communicate with healthcare providers.

## Key Features

- **Specialist Search**: Find doctors by specialty, name, or hospital
- **Filtering System**: Filter specialists by specific categories
- **Doctor Profiles**: View comprehensive doctor information including education, experience, languages, and fees
- **Appointment Scheduling**: Book appointments with available specialists
- **Live Chat**: Communicate with healthcare providers in real-time
- **Symptom Checker**: Assess symptoms before seeking professional help
- **Responsive Design**: Optimized for all device sizes

## Technical Stack

This project is built with:

- **Vite**: Fast development server and build tool
- **React**: UI component library
- **TypeScript**: Static typing for safer code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Pre-built accessible UI components
- **Tanstack Query**: Data fetching and state management
- **React Router**: Client-side routing
- **Lucide Icons**: Modern icon set
- **Recharts**: Composable charting library

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/             # Authentication related components
│   ├── common/           # Shared components used across features
│   ├── layout/           # Layout components (Navbar, Footer, etc.)
│   └── ui/               # UI component library (shadcn)
├── context/              # React Context API states
├── data/                 # Mock data and types
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── pages/                # Page components for each route
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## Core Components

### Components

- **DoctorCard**: Displays doctor information in a card format
- **Navbar**: Navigation component for the application
- **AuthModal**: Authentication modal for user sign-in/sign-up
- **ChatModal**: Live chat interface for doctor communication
- **LiveChatBubble**: Floating button to access chat functionality

### Pages

- **Home**: Landing page with featured doctors and services
- **FindDoctors**: Search and filter interface for finding specialists
- **DoctorProfile**: Detailed view of a doctor's information
- **SymptomChecker**: Interactive tool for symptom assessment
- **NotFound**: 404 page for handling invalid routes

### Context

- **AppContext**: Global state management for the application
  - User authentication state
  - Selected specialty filters
  - Search queries
  - Modal states
  - Chat and notification management

## Features in Detail

### Doctor Search and Filtering

The application provides a robust search and filtering system:
- Search by doctor name, specialty, or hospital
- Filter doctors by specialty category (gynecologist, psychiatrist, therapist)
- Sort results by rating
- Clear filters with a single click

Implementation details:
- Uses React hooks for state management
- URL parameters to maintain filter state
- Responsive design for both mobile and desktop views

### Doctor Profiles

Comprehensive doctor profiles include:
- Professional photo
- Specialty and rating
- Hospital affiliation
- Education and experience
- Languages spoken
- Consultation fees
- Availability schedule
- Location information

### Authentication System

The application includes a complete authentication flow:
- Sign up with email/password
- Sign in for existing users
- Password reset functionality
- Protected routes for authenticated users

### Real-time Chat

The chat system allows users to:
- Initiate conversations with doctors
- Receive real-time responses
- View chat history
- Receive notifications for new messages

### Appointment Scheduling

Users can book appointments with specialists:
- View doctor availability
- Select preferred date and time
- Receive confirmation notifications
- Manage upcoming appointments

## Development Guidelines

### Code Style

- **Component Structure**: Each component should be focused and handle a single responsibility
- **TypeScript**: Use proper typing for all variables and function parameters
- **State Management**: Use React Context for global state, local state for component-specific data
- **CSS Approach**: Use Tailwind utility classes for styling, custom CSS only when necessary

### Adding New Features

1. Create new components in appropriate directories
2. Add types for any new data structures
3. Update contexts if the feature requires global state
4. Add new routes in App.tsx for new pages
5. Document the feature in this README

### Debugging Tips

- Check the browser console for errors
- Verify that context providers are wrapping components that need access to global state
- Ensure proper typing to catch type-related issues early
- Use React DevTools to inspect component hierarchy and state

## Future Enhancements

- Integration with real backend services
- Geolocation-based doctor search
- Video consultation feature
- Health record management
- Insurance information integration
- Mobile application development

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the © License - see the LICENSE file for details.
