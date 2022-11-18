import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Headersep from "../components/layout/header_sep";
import Link from "next/link";
import Head from 'next/head';

export default function access(props) {
    const path = props.p
    return (
        <div className= 'page-404'>
            <Head>
                <title>Access required | Agility Hub</title>
            </Head>
            <Header callbackUrl={path}/>

            <div id='accessrequired-content'>
                <Headersep />
                <div id = 'title-accessreq'>
                    This page is user only
                </div>

                <div id = 'text-accessreq'>
                    <Link href = {'/login?callbackUrl='+path}><a>Log in</a></Link> or <Link href = '/signup'><a>sign up</a></Link> to access its content
                </div>
            </div>
            
            <Footer/>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { query } = context
    var { p } = query


    return {
        props: {p}
    }
}