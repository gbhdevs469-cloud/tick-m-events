import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import App from './app';
import { store } from './redux/store';
import { TranslateWidget } from '../TranslateWidget';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense>
            <App />
            <TranslateWidget />
          </Suspense>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);