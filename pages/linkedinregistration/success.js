import { signIn } from "next-auth/react";
import Head from "next/head";
import Header from '../../components/layout/header'
import Footer from '../../components/layout/footer'

export default function regsuccess() {
    
    function handleSignIn(e) {
        e.preventDefault()
        signIn('linkedin', {callbackUrl:'/'})
    }
    
    return (
        <div id="confirm-page">
            <Head>
                <title>Registration successful | Agility Hub</title>
            </Head>
            <Header session={null} />

            <div id='confirmreg-content' style={{margin:'16px'}}>
                <div id = 'conf-msg' className='normal-text'>
                    Registration successful! Click on the button below to log in again and start using the website.
                </div>
                <button onClick={(e)=>handleSignIn(e)} className="normal-btn" style={{fontSize:'16px', fontFamily:'"RubikMed"', padding:'16px', marginTop:'16px'}}>
                    Log In
                </button>
            </div>
            
            < Footer />
            
        </div>
    )
}