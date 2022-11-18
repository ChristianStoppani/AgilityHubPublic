import Footer from "../layout/footer";
import Header from "../layout/header";
import Headersep from '../layout/header_sep'
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function AlreadySignedIn() {
    const session = useSession()
    return(
        <div id = 'confirm-page'>
            <Head>
                <title>Already Signed In | Agility Hub</title>
            </Head>
            <Header session={session.data} />

            <div id='content-404'>
                <Headersep />
                <div id= 'title-404'>
                    Nothing to see here!
                </div>

                <div id = 'text-404' className="normal-text">
                    You already signed in
                </div>
            </div>
            
            <Footer/>

        </div>
    )
  }