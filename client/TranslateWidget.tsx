import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new(options: TranslateOptions, element: string): void;
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
    googleTranslateInit?: () => void;
  }
}

interface TranslateOptions {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
  autoDisplay: boolean;
  multilanguagePage: boolean;
}

export function TranslateWidget() {
  const translateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGoogleTranslate = () => {
      // Check if already initialized
      if (window.google && window.google.translate) {
        initializeWidget();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      script.async = true;

      // Global callback
      window.googleTranslateInit = () => {
        if (isMounted) {
          initializeWidget();
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Translate');
        if (isMounted && translateRef.current) {
          translateRef.current.innerHTML = 'Translation unavailable';
        }
      };

      document.head.appendChild(script);
    };

    const initializeWidget = () => {
      if (!isMounted || !window.google?.translate) return;

      try {
        // Clear previous instance
        if (translateRef.current) {
          translateRef.current.innerHTML = '';
        }

        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,fr',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');

        // Add styles to hide unwanted elements and position the widget
        addHideStyles();

      } catch (error) {
        console.error('Error initializing translate widget:', error);
      }
    };

    const addHideStyles = () => {
      // Create style element to hide Google Translate elements and position the widget
      const style = document.createElement('style');
      style.textContent = `
        /* Position the widget container at bottom right */
        #google_translate_element {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 9999 !important;
        }

        /* Style the Google Translate dropdown */
        .goog-te-gadget {
          font-family: Arial, sans-serif !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
          padding: 8px 12px !important;
          border: 1px solid #ddd !important;
          border-radius: 20px !important;
          background: white !important;
          color: #333 !important;
          font-size: 14px !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        
        .goog-te-gadget .goog-te-combo:hover {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-1px) !important;
        }

        /* Hide the Google Translate toolbar at the top */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
        }

        /* Hide the text selection popup (goog-gt-vt) */
        #goog-gt-vt {
          display: none !important;
        }
        
        /* Hide the translation hover popup */
        .goog-tooltip {
          display: none !important;
        }
        
        /* Hide the translation suggestion popup */
        .goog-te-balloon-frame {
          display: none !important;
        }
        
        /* Hide the Google attribution */
        .goog-logo-link {
          display: none !important;
        }
        
        /* Hide gadget text */
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
        
        /* Remove any extra spacing or borders */
        .goog-te-gadget span {
          display: none !important;
        }
        
        /* Ensure body doesn't get pushed down by hidden banner */
        body {
          top: 0 !important;
        }

        /* Style for when the dropdown is open */
        .goog-te-menu2 {
          max-width: 200px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #e0e0e0 !important;
        }

        .goog-te-menu2-item {
          padding: 8px 12px !important;
          font-size: 14px !important;
        }

        .goog-te-menu2-item:hover {
          background-color: #f5f5f5 !important;
        }

        .goog-te-menu2-item-selected {
          background-color: #e8f0fe !important;
        }

        /* Remove ALL Google Translate injected hover highlights */
[class^="VIpgJd-"],
[class*=" VIpgJd-"] {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  text-decoration: none !important;
}

      `;
      document.head.appendChild(style);
    };

    // Delay loading to ensure DOM is ready
    const timer = setTimeout(loadGoogleTranslate, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (window.googleTranslateInit) {
        delete window.googleTranslateInit;
      }
      // Remove any added styles
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent?.includes('goog-te-banner-frame') ||
          style.textContent?.includes('goog-gt-vt') ||
          style.textContent?.includes('google_translate_element')) {
          style.remove();
        }
      });
    };
  }, []);

  return (
    <div
      ref={translateRef}
      id="google_translate_element"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}
    ></div>
  );
}