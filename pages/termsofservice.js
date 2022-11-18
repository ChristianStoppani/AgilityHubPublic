import Head from "next/head";
import { getSession } from "next-auth/react";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep";
import Footer from "../components/layout/footer";

export default function termsofservice(props) {
    return (
        <div>
            <Head>
                <title>Terms of Service | Agility Hub</title>
            </Head>

            <Header session={props.data} />

            <div style={{
                fontFamily:'Rubik',
                color:'#283747', 
                margin:'30px', 
                textAlign:'justify',
                maxWidth: '1000px'}}>

                <Headersep />

                <h1>Terms of Service</h1>

                <p>Welcome to the Agility Hub!</p>

                <p>These terms of service outline the rules and regulations for the use of Agility Hub's Website, located at <a href={'/'} target={'_blank'}>www.agilityhub.ch</a>.</p>

                <p>By accessing this website we assume you accept these terms of service. Do not continue to use Agility Hub if you do not agree to take all of the terms of service stated on this page.</p>

                <p>The following terminology applies to these terms of service, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms of service. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

                <h2>Cookies</h2>

                <p>We employ the use of cookies. By registering a user account on this website, you agree to use cookies in agreement with the Agility Hub's Cookie Policy. </p>

                <p>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.</ p>

                <h2>License</h2>

                <p>Unless otherwise stated, Agility Hub and/or its licensors own the intellectual property rights for all material on Agility Hub. All intellectual property rights are reserved. You may access this from Agility Hub for your own personal use subjected to restrictions set in these terms of service.</p>

                <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

                <h2>Disclaimer</h2>

                <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

                <ul>
                    <li>limit or exclude our or your liability for death or personal injury;</li>
                    <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                    <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                    <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                </ul>

                <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

                <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
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