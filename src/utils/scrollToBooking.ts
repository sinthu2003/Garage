// Simple utility to scroll to booking widget or navigate to homepage
// Usage: scrollToBooking(navigate, isHomePage)

// Simple utility to scroll to booking widget or navigate to homepage
// Usage: scrollToBooking(navigate, isHomePage)
import type { NavigateFunction } from 'react-router-dom';

export const scrollToBooking = (navigate: NavigateFunction, isHomePage: boolean) => {
  if (isHomePage) {
    // Already on homepage - just scroll to booking widget
    const bookingWidget = document.getElementById('booking-widget');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else {
    // On another page - navigate to homepage with state to trigger scroll
    navigate('/', { state: { scrollToBooking: true } });
  }
};