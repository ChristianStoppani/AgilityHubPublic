import Image from "next/image";
import { useRouter } from "next/router";
import Header from '../layout/header';
import Headersep from '../layout/header_sep';
import Footer from '../layout/footer'

import home_btn from "../../public/images/Home_button_75.svg";
import { useSession } from "next-auth/react";

export default function SignupIII({signupEmail}) {

    const { data: session } = useSession();

    const router = useRouter()

    return (
        <div id="signupIII-page">
            <Header session={session} />

            <div id='signupIII-container'>
                <Headersep />

                <div id="reg-conf-msg">
                    <span style={{fontFamily:'Rubikmed', marginBottom:'8px'}}>
                        Confirmation email sent to: <br/>
                        {signupEmail} <br />
                    </span>
                    If you don’t see this email in your inbox within 15 minutes, look for it in your junk mail folder. 
                    If you find it there, please mark it as “Not Junk”.
                </div>
            </div>
            <Footer />
        </div>
    )
}