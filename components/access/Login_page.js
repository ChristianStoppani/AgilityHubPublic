import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from 'next-auth/react';
import { SHA512 } from "crypto-js";

import close_btn from '../../public/images/close_btn_50.svg';
import li_logo from '../../public/images/linkedin_logo.png';
import open_eye from '../../public/images/open_eye_icon.svg';
import closed_eye from '../../public/images/close_eye_icon.svg';
import Buttonwait from "../buttonwait";

export default function Login_page() {

    const router = useRouter();

    var { callbackUrl } = router.query

    if (!callbackUrl) {
        var callbackUrl = '/'
    }

    const error = router.query.error;

    const [logindisabled, setLoginDisabled] = useState(true)

    function checkButton() {
        //enable login button only with email and pw
        if (document.getElementById('login-pw-entry').value != '' && document.getElementById('login-email-entry').value != '') {
            setLoginDisabled(false)
        } else {
            setLoginDisabled(true)
        }
    }

    useEffect(() => {
        if (error == 'CredentialsSignin') {
            //show error box
            document.getElementById('login-error-msg').style.display = 'flex';
        }
      }, [])

    const [vis, setVis] = useState(false);
    const [eye_icon, setEyeIcon] = useState(open_eye);

    function resetLogin() {
        document.getElementById('email-login-form').reset();

        if (vis == true) {
            setEyeIcon(open_eye);
            setVis(!vis);
            document.getElementById('login-pw-entry').setAttribute('type', 'password');
        }
    }

    function closeLogin() {
        resetLogin()
        if (error != '') {
            router.push('/')
        } else {
            router.back()
        }
    }
    
    function switchToSignUp(e) {
        e.preventDefault()
        resetLogin()
        e.target.children[0].classList.remove('w3-hide')

        router.push('/signup')
    }

    function handlePwVis(e) {
        e.preventDefault()
        setVis(!vis);

        if (vis == false) {
            setEyeIcon(closed_eye);
            document.getElementById('login-pw-entry').setAttribute('type', 'text');
        } else {
            setEyeIcon(open_eye);
            document.getElementById('login-pw-entry').setAttribute('type', 'password');
        }
    }

    function handleLogin(e) {
        //get password, add salt and encrypt
        e.preventDefault()
        document.getElementById('email-login-btn').children[0].classList.remove('w3-hide')
        var username = document.getElementById('login-email-entry').value.toLowerCase();
        var password_clean = document.getElementById('login-pw-entry').value; 
        const salt = process.env.SALT
        const password_salted = password_clean+salt
        const password = SHA512(password_salted).toString()

        signIn("credentials", { username, password, callbackUrl: callbackUrl, update: false })
    }

    function handleLinkedin(e) {
        document.getElementById('linkedin-login').children[2].classList.remove('w3-hide')
        signIn('linkedin', {callbackUrl:callbackUrl})
    }

    function handlePwForgotten(e){
        e.preventDefault()
        e.target.children[0].classList.remove('w3-hide')
        router.push('/passwordforgotten')
    }

    return (
        <div id = 'login-page'>
            <Head>
                <title>Login | Agility Hub</title>
            </Head>

            <div id = 'login-bg' />

            <div id = 'login-frame'>

                <div id='login-bar' className="w3-bar">
                    <div id = 'login-title' className="w3-bar-item">
                        Log In
                    </div>

                    <button id='login-close-btn' onClick = {closeLogin} className = 'w3-bar-item'>
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

                <div id = 'email-login'>
                    <p id = 'email-login-title'>
                        Enter your credentials:
                    </p>

                    <form onSubmit = {(e) => {handleLogin(e)}} id = 'email-login-form'>

                        <input type = 'email'
                            name = 'email' 
                            id = 'login-email-entry'
                            className = 'login-entry'
                            placeholder = 'Email'
                            autoComplete = 'username'
                            onChange = {checkButton}/>
                        
                        <div id='login-pw-eye'>
                            <input type = 'password'
                                name = 'password'
                                id = 'login-pw-entry'
                                className = 'login-entry'
                                placeholder = 'Password'
                                autoComplete = 'current-password'
                                onChange = {checkButton}/> 
                            <button onClick = {(e) => {handlePwVis(e)}} type = 'button' className = 'pw-eye'>
                                <Image
                                    src = {eye_icon}
                                    className = 'pw-eye-img'
                                    layout = 'responsive' />
                            </button>
                        </div>

                        <div id = 'login-error-msg'>
                            Invalid credentials, please try again.
                        </div>

                        <div id='login-btn-opt'>
                            <button type = 'submit' id = 'email-login-btn' disabled = {logindisabled}>
                                Log In <Buttonwait color = {'#ffffff'} /> 
                            </button>

                            <table id = 'email-login-options'>
                                <tbody>
                                    <tr>
                                    <td>No account yet?</td>
                                    <td><button onClick = {(e) => {switchToSignUp(e)}} className='email-login-btn'>Sign Up <Buttonwait color={'purple'}/></button></td> 
                                    </tr>
                                    <tr>
                                    <td>Password forgotten?</td>
                                    <td><button onClick={(e)=>handlePwForgotten(e)} className='email-login-btn'>Retrieve <Buttonwait color={'purple'}/></button></td>
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