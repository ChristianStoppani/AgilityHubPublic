import Head from 'next/head';

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep"

export default function AccountDeleted() {

    return(
        <div id = 'page-404'>
            
            <Head>
                <title>Account Deleted | Agility Hub</title>
            </Head>
  
            <Header/>

            <div id='content-404' style={{justifyContent:'center'}}>
                <Headersep />

                <div id = 'title-404'>
                    Account deleted successfully
                </div>

                <div id = 'text-404'>
                    Thanks for using the Agility Hub! We hope to see you again in the future.
                </div>
            </div>

            <Footer/>
        </div>
    )
  }