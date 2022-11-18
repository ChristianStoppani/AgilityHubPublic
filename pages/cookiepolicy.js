import Head from "next/head";
import { getSession } from "next-auth/react";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep";
import Footer from "../components/layout/footer";

export default function cookiepolicy(props) {
    return (
        <div>
            <Head>
                <title>Cookie Policy | Agility Hub</title>
            </Head>

            <Header session={props.data} />

            <div style={{
                fontFamily:'Rubik',
                color:'#283747', 
                margin:'30px', 
                textAlign:'justify',
                maxWidth: '1000px'}}>

                <Headersep />

                <h1>Cookie Policy for Agility Hub</h1>

                <p>This is the Cookie Policy for Agility Hub, accessible from https://agilityhub.ch</p>

                <h2>What Are Cookies</h2>

                <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.</p>

                <h2>How We Use Cookies</h2>

                <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

                <h2>Disabling Cookies</h2>

                <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.</p>
                <h2>The Cookies We Set</h2>

                <ul>

                <li>
                    <p>Account related cookies</p>
                    <p>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
                </li>

                <li>
                    <p>Login related cookies</p>
                    <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
                </li>

                <li>
                    <p>Analytics cookies</p>
                    <p>We use cookies to track website visitors and their user behaviour in an anonymised manner. This data is then used to improve the way the website works and in turn, used to improve user experience.</p>
                </li>

                </ul>

                <h2>Third Party Cookies</h2>

                <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>

                <ul>
                <li>
                    <p>We use social media buttons on this site that allow you to share this website on social networks. For this to work the following social media sites, might set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies: Linkedin, Twitter, Whatsapp, Telegram, Facebook.</p>
                </li>
                </ul>

                <h2>More Information</h2>

                <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>

                <p>For more general information on cookies, please read <a href="https://www.cookiepolicygenerator.com/sample-cookies-policy/">the Cookies Policy article</a>.</p>

                <p>However if you are still looking for more information then you can contact us at <a href='mailto:contact@agilityhub.ch'>contact@agilityhub.ch</a></p> 
                <p>This Cookies Policy was created with the help of the <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/">Cookies Policy Generator</a>.</p>             
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