import React from 'react';

import '../styles/globals.css';


// App component
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp
