import '../css/styles.css'
import React from 'react'
import { Provider } from 'next-auth/client'

// eslint-disable-next-line react/prop-types
export default function Home ({ Component, pageProps }) {
  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0
      }}
      // eslint-disable-next-line react/prop-types
      session={pageProps.session} >
      <Component {...pageProps} />
    </Provider>
  )
}
