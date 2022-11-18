import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Headersep from "../components/layout/header_sep";

export default function Home(props) {

    const router = useRouter();
    const session = props.data

    return (

        <div className = 'page'>
            <Head>
                <title>How to | Agility Hub</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>

            <Header session={session}/>

            <div id = 'app-page'>

                <Headersep />
                <div id= 'app-page-content'>

                <div className="title w3-hide-small" id = 'app-title'>
                    How to
                </div>

                <div className="title w3-hide-large w3-hide-medium" id = 'app-title-small'>
                    How to
                </div>

                </div>

            </div>

            <div id='home-footer'>
            <Footer/>
            </div>
            

        </div>
    )
}


export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: { data: session,}
      }
}