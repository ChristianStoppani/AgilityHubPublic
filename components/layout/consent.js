import React, { useEffect, useState } from 'react';
import Link from 'next/link'

import { setCookie, hasCookie } from 'cookies-next';

export default function Consent() {
  const [consent, setConsent] = useState(true);
  useEffect(() => {
    //retrieve consent Cookie
    setConsent(hasCookie('localConsent'));
  }, []);

  const acceptCookie = () => {
    //set google analytics cookie as consented
    setConsent(true);
    setCookie('localConsent', 'true', { maxAge: 60 * 60 * 24 * 365 });
    gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
  };
  const closeP = () => {
    setConsent(true);
  };
  const denyCookie = () => {
    //set google analytics cookie as denied
    setConsent(true);
    setCookie('localConsent', 'false', { maxAge: 60 * 60 * 24 * 365 });
  };
  if (consent === true) {
    return null;
  }
  return (
    <>
    {consent
    ? null
    :<div
      className='consent-container w3-round w3-col l4 m6'>
      We use cookies to enhance your browsing experience, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <Link href='/cookiepolicy'><a style={{textDecoration:'underline', color:'purple'}}>Read more</a></Link>
      <div className ='cons-btns'>
        <button
            onClick={() => {
                acceptCookie();
            }}
            className="normal-btn cons-btn">
            Accept All
        </button>
        <button
            className="normal-btn cons-btn"
            onClick={(e) => denyCookie()}>
            Deny All
        </button>
        <button 
            className="normal-btn cons-btn"
            onClick={(e) => { closeP()}}>
            Close
        </button>
      </div>
    </div>}
    </>
  );
}