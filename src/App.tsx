import React, { useEffect, useState, useMemo } from 'react';

import './App.css';

const App = () => {
  const DEFAULT_IFRAME_HEIGHT = 450;
  const DEFAULT_IFRAME_WIDTH = 750;
  const CHECKOUT_BASE_URL = 'https://sandbox-checkout.imbursepayments.com';
  const TOKEN = 'YOUR_TOKEN';
  const IFRAME_SRC = `${CHECKOUT_BASE_URL}?token=${TOKEN}`;

  const eventTypes = useMemo(() => Object.freeze({
    COMPONENT_LOADED: 'imburse_checkout:component_loaded',
    COMPONENT_RESIZE: 'imburse_checkout:component_resize',
    SESSION_TOKEN_EXPIRED: 'imburse_checkout:session_token_expired',
    SESSION_TOKEN_INVALID: 'imburse_checkout:session_token_invalid',
    SESSION_ERROR: 'imburse_checkout:session_error',
    PAYMENT_SUCCESS: 'imburse_checkout:payment_success',
    PAYMENT_FAILURE: 'imburse_checkout:payment_failed',
    UNSUPPORTED_LANGUAGE: 'imburse_checkout:unsupported_language'
  }), []);

  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const receiveMessage = ((event: any) => {
      if (
        event.origin !== CHECKOUT_BASE_URL ||
        !event.data ||
        !event.data.message ||
        !Object.values(eventTypes).includes(event.data.message)) {
        return;
      }

      setEvents((events => [...events, event.data]));

      if (event.data.message === eventTypes.COMPONENT_RESIZE) {
        const { data: { payload: { height } } } = event;

        const newHeight = height > DEFAULT_IFRAME_HEIGHT ? height : DEFAULT_IFRAME_HEIGHT;
        setIframeHeight(newHeight);
      }
    });

    window.addEventListener('message', receiveMessage, false);
  }, [eventTypes]);

  return (
    <div className="app">
      <div className="item iframe">
        <h1>Iframe</h1>
        <iframe title="checkout" height={iframeHeight} width={DEFAULT_IFRAME_WIDTH} src={IFRAME_SRC} />
      </div>
      <div className="item events">
        <h1>Events</h1>
        {events.map((event, index) => <div key={index} className="event">{JSON.stringify(event, null, 2)}</div>)}
      </div>
    </div>
  );
}

export default App;
