import Head from 'next/head';
import { getSession } from 'next-auth/react';

import Contact_form from "../components/contact_form";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep";

export default function contact(props) {

    return (

        <div className = 'page'>
            
            <Head>
                <title>Contact | Agility Hub</title>
            </Head>

            <Header session={props.data} />

            <div id = 'contact'>
                <Headersep />
                
                <Contact_form />

            </div>

            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: { data: session}
      }
}