import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from 'next-auth/react'

import close_btn from '../../public/images/close_btn_50.svg';
import li_logo from '../../public/images/linkedin_logo.png';
import Buttonwait from "../buttonwait";

export default function SignupI({setSignupEmail}) {

    const router = useRouter();

    function closeSignupI() {
        document.getElementById('email-signup-form').reset();

        router.back()
    }

    function switchToLogin(e) {
        e.preventDefault()        
        e.target.children[0].classList.remove('w3-hide')
        document.getElementById('email-signup-form').reset();
        
        router.replace('/login')
    }

    function handleSignupII(e) {
        e.preventDefault()
        document.getElementById('signupI-page').style.display = 'none';
        document.getElementById('signupII-page').style.display = 'flex';
      }
    
    function looksLikeMail(str) {
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    async function findEmail(e, email){
        e.preventDefault()
        try {
            const returnUser = false
            const body = { email, returnUser }
            let response = await fetch('api/user/findemail', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            const result = await response.json()
            if (!result) {
              handleContinue2(e, email)
            } else {
              alert('This email address is already associated with an existing user account.')
            }
            
        } catch (error) {
            console.error(error)
        }
      }

    async function handleContinue(e) {
        e.preventDefault()        
        e.target.children[0].classList.remove('w3-hide')

        const email = document.getElementById('signup-email-entry').value.toLowerCase();

        if (looksLikeMail(email) == false) {
            alert('Invalid email.')
        } else {
            try {
                //check that email does not yet exist in DB
                const returnUser = false
                const body = { email, returnUser }
                let response = await fetch('api/user/findemail', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                const result = await response.json()
                if (!result) {
                    findEmail(e, email)
                } else {
                    alert('This email address is already associated with an existing user account.')
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    function handleContinue2(e, email) {
        setSignupEmail(email)
        document.getElementById('email-signup-form').reset();
        handleSignupII(e)
    }
    function handleLinkedin(e) {
        document.getElementById('linkedin-login').children[2].classList.remove('w3-hide')
        signIn('linkedin', {callbackUrl:'/'})
    }

    return (
        <div id='signupI-page'>
            <div id = 'signupI-frame'>
                <div id='signup-bar' className="w3-bar">
                    <div id = 'signup-title' className="w3-bar-item">
                        Sign Up
                    </div>

                    <button id='signup-close-btn' onClick = {closeSignupI} className = 'w3-bar-item'>
                        <Image
                            src = {close_btn}
                            layout = 'responsive' />
                    </button>
                </div>

                <div id = 'linkedin-login-link'>
                    <button 
                        id = 'linkedin-login' 
                        className="w3-round-xxlarge"
                        onClick = {(e) => {handleLinkedin(e)}}>
                        <div>
                            Continue with&nbsp;
                        </div>
                        <div id = 'linkedin-login-logo'>
                            <Image
                                src = {li_logo}
                                layout = 'responsive'
                                priority={true} />
                        </div>
                        <Buttonwait color ={'#283747'} />
                    </button>
                </div>

                <div id = 'login-separation' className="normal-text">
                    <hr id= 'sep-line' />
                    <div id='sep-text'>or</div>
                </div>

                <div id = 'email-signup'>
                    <p id = 'email-signup-title'>
                        Register with your email:
                    </p>

                    <form id = 'email-signup-form'>
                        <input type = 'email'
                            name = 'email' 
                            id = 'signup-email-entry'
                            className = 'signup-entry'
                            placeholder = 'Email'/>

                        <div id='signup-btn-opt'>
                        <button onClick = {(e) => {handleContinue(e)}} id = 'email-signup-btn'>
                            Continue
                            <Buttonwait color={'#ffffff'} />
                        </button>

                        <table id = 'email-signup-options'>
                            <tbody>
                                <tr>
                                    <td>Already registered?</td>
                                    <td><button onClick = {switchToLogin} className='email-login-btn'>Log In <Buttonwait color={'purple'} /></button></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};