import React, { useEffect, useState, useCallback } from 'react';
import queryString from 'query-string';
import './App.css';

const App = () => {
  const DEFAULT_IFRAME_HEIGHT = 450;
  const DEFAULT_IFRAME_WIDTH = 750;
  const CHECKOUT_BASE_URL = 'https://ci-checkout.imburse.net';

  enum Events {
    COMPONENT_LOADED = 'imburse_checkout:component_loaded',
    COMPONENT_RESIZE = 'imburse_checkout:component_resize',
    SESSION_TOKEN_EXPIRED = 'imburse_checkout:session_token_expired',
    SESSION_TOKEN_INVALID = 'imburse_checkout:session_token_invalid',
    SESSION_ERROR = 'imburse_checkout:session_error',
    PAYMENT_SUCCESS = 'imburse_checkout:payment_success',
    PAYMENT_FAILURE = 'imburse_checkout:payment_failed',
    UNSUPPORTED_LANGUAGE = 'imburse_checkout:unsupported_language'
  };

  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [events, setEvents] = useState<any[]>([]);
  const [iframeSrc, setIframeSrc] = useState<any>();

  useEffect(() => {
    const receiveMessage = ((event: any) => {

      console.log(event);

      if (
        event.origin !== CHECKOUT_BASE_URL ||
        !event.data ||
        !event.data.message ||
        !Object.values(Events).includes(event.data.message)) {
        return;
      }

      // console.log(event.data);

      setEvents((events => [...events, event.data]));

      if (event.data.message === Events.COMPONENT_RESIZE) {
        const { data: { payload: { height } } } = event;

        const newHeight = height > DEFAULT_IFRAME_HEIGHT ? height : DEFAULT_IFRAME_HEIGHT;
        setIframeHeight(newHeight);
      }
    });
    window.addEventListener('message', receiveMessage, false);
  }, [Events]);

  useEffect((): void => {
    const { token } = queryString.parse(window.location.search);

    if (!token) {
      return;
    }

    const src = `${CHECKOUT_BASE_URL}?token=${token}`;

    setIframeSrc(src);
  }, []);

  return (
    iframeSrc ?
      <div className="App">
        <div className="Item">
          <h1>Iframe</h1>
          <iframe title="checkout" height={iframeHeight} width={DEFAULT_IFRAME_WIDTH} src={iframeSrc} />
        </div>
        <div className="Item">
          <h1>Events</h1>
          {events.map((event, index) => <div key={index} className="Event">{JSON.stringify(event, null, 2)}</div>)}
        </div>
      </div> : null
  );
}

export default App;
