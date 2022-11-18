// general
import '../styles/general.css'

import 'w3-css/w3.css';

// index
import "../styles/index.css"

// data
import '../styles/data.css'

// articles_index
import '../styles/articles_index.css'

// about
import '../styles/about.css'

// contact
import '../styles/contact.css'

// open assessments
import '../styles/open.css'

// questionnaire
import '../styles/questionnaire.css'

// evaluation
import '../styles/evaluation.css'

//history
import '../styles/history.css'

//teams
import '../styles/teams.css'

//team overview
import '../components/team/teamoverview.css'

//team member
import '../components/team/teammember.css'

//new team
import '../styles/newteam.css'

//manage team
import '../styles/manageteam.css'

//account
import '../styles/account.css'

// contact form
import "../components/contact_form.css"

// header 
import '../components/layout/header.css'

// footer
import '../components/layout/footer.css'

// consent
import '../components/layout/consent.css'

// login
import '../components/access/Login.css'

// password forgotten
import '../styles/passwordforgotten.css'

// change password
import '../styles/changepassword.css'

// signup 1
import '../components/access/Signup_1.css'

// signup 2
import '../components/access/Signup_2.css'

// signup 3
import '../components/access/Signup_3.css'

// confirm registration
import '../styles/confirmregistration.css'

// access required
import '../styles/accessrequired.css'

//404 page
import '../styles/404.css'

// question
import '../components/questionnaire/question.css'

//feedback
import '../styles/feedback.css'

//logout alert
import '../components/logout_alert.css'

//dashboard button
import '../components/dashboard/dashboard_btn.css'

//article
import '../components/articles/article.css'

//########################################

// User sessions
import { SessionProvider } from "next-auth/react"

//########################################

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faHistory, faPeopleGroup, faEnvelopeOpen, faUser, faRightFromBracket, faMessage, faCircleInfo, faWrench, faPlay, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

library.add(faEnvelope, faLinkedin, faHistory, faPeopleGroup, faEnvelopeOpen, faUser, faRightFromBracket, faMessage, faCircleInfo, faWrench, faPlay, faCircleQuestion)

import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

import { getCookie } from 'cookies-next'

import LogoutAlert from '../components/logout_alert'
import ProfileCheck from '../components/profile_check'
import Head from 'next/head';
import Script from 'next/script'
import Consent from '../components/layout/consent';

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
    // Insert any other global styles you want here
`;


//########################################

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, logoutAlert, profileCheck, pageProps: { session, ...pageProps } }) {
  const consent = getCookie('localConsent');
  return (
    <SessionProvider session={session}>
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

      <Script strategy="lazyOnload">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
              });
          `}
      </Script>
      <Script
        id="gtag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });           
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-PSP95GL');`,
        }}
      />
      {consent === true && (
        <Script
          id="consupd"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            gtag('consent', 'update', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted'
            });
          `,
          }}
        />
      )}
      <Head>       
        <link rel='icon' href='/images/wslogo.png'/>
      </Head>
      <GlobalStyles />
      <LogoutAlert />
      <ProfileCheck />
      <Consent />
      <Component {...pageProps} />
    </SessionProvider>

  )
}