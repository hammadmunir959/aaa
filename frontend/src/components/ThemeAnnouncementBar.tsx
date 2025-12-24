import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeAnnouncementBar: React.FC = () => {
    const { theme, loading } = useTheme();

    if (loading || !theme) return null;

    // Only render if a scrolling message is configured
    const message = theme.theme.scrolling_message;
    if (!message) return null;

    const backgroundColor = theme.theme.scrolling_background_color || '#000000';

    return (
        <div className="theme-announcement-bar w-full relative overflow-hidden h-[40px] md:h-[50px] z-50" style={{ backgroundColor }}>
            {/* Scrolling Text Overlay */}
            <div className="relative z-10 w-full h-full flex items-center overflow-hidden">
                <div className="scrolling-message-container flex items-center">
                    <div className="scrolling-message-content flex items-center gap-4 whitespace-nowrap">
                        {/* Message repeated for seamless loop */}
                        {[...Array(5)].map((_, idx) => (
                            <React.Fragment key={idx}>
                                <span className="inline-flex items-center gap-2 text-white font-bold text-sm md:text-base px-6 drop-shadow-md">
                                    {message}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                    {/* Duplicate for seamless infinite scroll */}
                    <div className="scrolling-message-content flex items-center gap-4 whitespace-nowrap" aria-hidden="true">
                        {[...Array(5)].map((_, idx) => (
                            <React.Fragment key={idx}>
                                <span className="inline-flex items-center gap-2 text-white font-bold text-sm md:text-base px-6 drop-shadow-md">
                                    {message}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .scrolling-message-container {
          display: flex;
          width: fit-content;
        }
        
        .scrolling-message-content {
          display: inline-flex;
          animation: scroll-horizontal 30s linear infinite;
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
      `}</style>
        </div>
    );
};

export default ThemeAnnouncementBar;
