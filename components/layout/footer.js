import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { 
  LinkedinIcon, LinkedinShareButton, 
  FacebookIcon, FacebookShareButton,
  TwitterIcon, TwitterShareButton,
  WhatsappIcon, WhatsappShareButton, 
  TelegramShareButton, TelegramIcon, } from "next-share";

import 'w3-css/w3.css';

import Footeraccess from "./footeraccess";
import { useSession } from "next-auth/react";

export default function Footer() {

  const {data: session } = useSession()

  const router = useRouter()

  return (

    <div id = 'footer' className="w3-mobile">
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div id = 'footer-first' className="w3-bar w3-hide-small">
        
        <Link href = '/'>
          <a id = 'footer-title' className = 'title w3-bar-item'>
            Agility Hub
          </a>
        </Link>

        <div id = 'footer-apps' className="w3-bar-item">
          <Link href = '/team_assessment' className='footer-titles'> 
            <a>
              <h1 className="footer-titles">Home</h1>
            </a> 
          </Link>

          {session
          ?<>
          <Link href = '/team_assessment/open'>
            <a>
              Start assessment
            </a>
          </Link> <br />
          <Link href = '/teams'>
            <a>
              Teams
            </a>
          </Link> <br />
          <Link href = '/history'>
            <a>
              History
            </a>
          </Link> <br />
          <Link href = '/account'>
            <a>
              Account
            </a>
          </Link> <br />
          </>
        : null}
        </div>

        <div id = 'footer-resources' className="w3-bar-item">
          <h1 className = 'footer-titles'>
            Resources
          </h1>
          <Link href = '/data'>
            <a>
              Data
            </a>
          </Link> <br />
          <Link href = '/articles'>
            <a>
              Articles
            </a> 
          </Link> <br />
          <Link href = '/about'>
            <a>
              About us
            </a> 
          </Link> <br />
          <Link href = '/contact'>
            <a>
              Contact
            </a>
          </Link>
        </div>

        <div id = 'footer-policies' className="w3-bar-item">
          <h1 className="footer-titles">
            Policies
          </h1>
          <Link href = '/termsofservice'>
            <a>
              Terms of Service
            </a> 
          </Link> <br />
          <Link href = '/privacypolicy'>
            <a>
              Privacy Policy
            </a> 
          </Link> <br />
          <Link href = '/cookiepolicy'>
            <a>
              Cookie Policy
            </a> 
          </Link> <br />
        </div>

        <div id = 'footer-access' className="w3-bar-item">    
          <br />
          <Footeraccess />
        </div>

        
      </div>

      <div id = 'footer-first-small' className="w3-bar-block w3-hide-large w3-hide-medium">
        <br />
        
        <Link href = '/'>
          <a id = 'footer-title' className = 'title w3-block-item'>
            Agility Hub
          </a>
        </Link>

        <div id = 'footer-access' className="w3-block-item footer-item">    
          <br />
          <Footeraccess />
          <br />
          <br />
        </div>

        <div id = 'footer-apps' className="w3-block-item footer-item">
          <Link href = '/'> 
            <a className = 'footer-titles'>
              Home
            </a> 
          </Link>
          {session
          ?<>
          <Link href = '/team_assessment/open'>
            <a>
              Start assessment
            </a>
          </Link>
          <Link href = '/teams'>
            <a>
              Teams
            </a>
          </Link>
          <Link href = '/history'>
            <a>
              History
            </a>
          </Link>
          <Link href = '/account'>
            <a>
              Account
            </a>
          </Link>
          </>
        : null}
        </div>

        <div id = 'footer-resources' className="w3-bar-item footer-item">
          <div className = 'footer-titles'>
            Resources
          </div>
          <Link href = '/data'>
            <a>
              Data
            </a>
          </Link>
          <Link href = '/articles'>
            <a>
              Articles
            </a> 
          </Link>
          <Link href = '/about'>
            <a>
              About us
            </a> 
          </Link>
          <Link href = '/contact'>
            <a>
              Contact
            </a>
          </Link>
        </div>

        <div id = 'footer-policies' className="w3-bar-item footer-item">
          <div className="footer-titles">
            Policies
          </div>
          <Link href = '/termsofservice'>
            <a>
              Terms of Service
            </a> 
          </Link>
          <Link href = '/privacypolicy'>
            <a>
              Privacy Policy
            </a> 
          </Link>
          <Link href = '/cookiepolicy'>
            <a>
              Cookie Policy
            </a> 
          </Link>
        </div>
      </div>

      <div id = 'footer-share'>
        <LinkedinShareButton url={process.env.NEXT_PUBLIC_SHARE_URL}>
          <LinkedinIcon size = {32} round />
        </LinkedinShareButton>
        &nbsp;
        <TwitterShareButton url = {process.env.NEXT_PUBLIC_SHARE_URL}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        &nbsp;
        <WhatsappShareButton url = {process.env.NEXT_PUBLIC_SHARE_URL}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        &nbsp;
        <TelegramShareButton url = {process.env.NEXT_PUBLIC_SHARE_URL}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        &nbsp;
        <FacebookShareButton url = {process.env.NEXT_PUBLIC_SHARE_URL}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>

      <div id = 'footer-second'>
          &copy; 2022 &nbsp; <a href = 'https://www.linkedin.com/in/christian-stoppani/' target = '_blank'>Christian Stoppani</a>, &nbsp; <a href = 'https://iwi.unisg.ch/' target = '_blank'> IWI-HSG</a>
      </div>
    </div>
  )
}

