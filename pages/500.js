import Head from 'next/head';
import { useSession } from 'next-auth/react';

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from '../components/layout/header_sep';

export default function Custom500() {

    const {data: session} = useSession()
    
    return(
        <div id = 'page-404'>
            
            <Head>
                <title>500 | Agility Hub</title>
            </Head>
            <Header session= {session}/>

            <div id = 'content-404'>
                <Headersep />

                <div id = 'title-404'>
                    Uh oh...
                </div>

                <div id = 'text-404'>
                    The server encountered an internal error or misconfiguration and was unable to complete your request. <br/><br/>
                    If the error persists, please contact <a href='mailto:christian@agilityhub.ch'>christian@agilityhub.ch</a> describing the action you are trying to perform.
                </div>
            </div>
            
            <Footer/>
        </div>
    )
  }