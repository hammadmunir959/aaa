import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-G5NE2K8Z3N';
const STORAGE_KEY = 'cookie-consent';

export const AnalyticsManager = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    // Check if we are in a production/live environment
    const isLiveEnvironment = () => {
        if (typeof window === 'undefined') return false;
        const hostname = window.location.hostname;

        // Explicitly exclude localhost and private IPs
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.')
        ) {
            return false;
        }
        return true;
    };

    const loadAnalytics = () => {
        if (initialized) return;
        if (!isLiveEnvironment()) {
            console.log('Analytics skipped: Non-production environment');
            return;
        }

        // Initialize GA4
        ReactGA.initialize(GA_TRACKING_ID);

        setInitialized(true);
        console.log('Analytics initialized (GA4)');
    };

    useEffect(() => {
        // Check initial consent
        const consent = localStorage.getItem(STORAGE_KEY);
        if (consent === 'accepted') {
            loadAnalytics();
        }

        // Listen for consent updates (custom event from CookieConsent)
        const handleConsentUpdate = (e: CustomEvent) => {
            if (e.detail === 'accepted') {
                loadAnalytics();
            }
        };

        window.addEventListener('cookie-consent-update', handleConsentUpdate as EventListener);

        return () => {
            window.removeEventListener('cookie-consent-update', handleConsentUpdate as EventListener);
        };
    }, []);

    // Track page views
    useEffect(() => {
        if (initialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: document.title });
        }
    }, [location, initialized]);

    return null;
};

export default AnalyticsManager;
