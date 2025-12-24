import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeScrollingMessage: React.FC = () => {
  const { theme, loading } = useTheme();

  if (loading || !theme) {
    return null;
  }

  // Get scrolling message with priority: event.name > theme.scrolling_message > default (only for christmas)
  const getMessage = () => {
    // Priority 1: Event name (if event is active)
    if (theme.event?.name) {
      return theme.event.name;
    }
    // Priority 2: Theme scrolling message (if configured)
    if (theme.theme.scrolling_message) {
      return theme.theme.scrolling_message;
    }
    // No message for other themes without configuration
    return null;
  };

  const message = getMessage();

  // Don't show if no message is configured
  if (!message) {
    return null;
  }

  return (

    <div
      className="theme-scrolling-message-wrapper relative w-full overflow-hidden py-2.5 shadow-lg z-50"
      style={{ backgroundColor: theme.theme.scrolling_background_color || '#000000' }}
    >
      <div className="scrolling-message-container flex items-center">
        <div className="scrolling-message-content flex items-center gap-4 whitespace-nowrap">
          {/* Message repeated for seamless loop */}
          {[...Array(5)].map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base px-6">
                {message}
              </span>
            </React.Fragment>
          ))}
        </div>
        {/* Duplicate for seamless infinite scroll */}
        <div className="scrolling-message-content flex items-center gap-4 whitespace-nowrap" aria-hidden="true">
          {[...Array(5)].map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base px-6">
                {message}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .theme-scrolling-message-wrapper {
          position: relative;
        }
        
        .scrolling-message-container {
          display: flex;
          width: fit-content;
        }
        
        .scrolling-message-content {
          display: inline-flex;
          animation: scroll-horizontal 40s linear infinite;
        }
        
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .scrolling-message-content {
            animation: none;
          }
        }
        
        @media (max-width: 640px) {
          .scrolling-message-content {
            animation-duration: 35s;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeScrollingMessage;

