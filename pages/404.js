import { useSession } from 'next-auth/react';
import Head from 'next/head';

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep"

export default function Custom404() {

    const {data: session} = useSession()

    return(
        <div id = 'page-404'>
            
            <Head>
                <title>404 | Agility Hub</title>
            </Head>
  
            <Header session={session}/>

            <div id='content-404' style={{justifyContent:'center'}}>
                <Headersep />

                <div id = 'title-404'>
                    Error 404
                </div>

                <div id = 'text-404'>
                    Page not found or unauthorized user
                </div>
            </div>

            <Footer/>
        </div>
    )
  }