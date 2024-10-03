import "@/styles/globals.scss";
import { SessionProvider } from "next-auth/react";

import { useEffect } from "react";
import { appWithTranslation } from 'next-i18next'

import '@smastrom/react-rating/style.css'

function App({ Component, pageProps }) {
  useEffect(() => {
    console.log("App mounted");
  });
  return (
    <>
      <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default appWithTranslation(App);