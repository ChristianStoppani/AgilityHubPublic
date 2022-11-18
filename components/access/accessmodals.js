import Head from "next/head";
import { useState } from "react";
import SignupI from "../access/Signup_1";
import Signup2 from "../access/Signup_2";
import SignupIII from '../access/Signup_3'

export default function Accessmodals({ tokens }) {
    
    const[signupEmail, setSignupEmail] = useState('');

    return (
        <>
            <Head>
                <title>Sign Up | Agility Hub</title>
            </Head>
            <SignupI setSignupEmail = {setSignupEmail} />
            <Signup2 signupEmail = {signupEmail}  tokens = {tokens}/>
            <SignupIII signupEmail = {signupEmail}/>
        </>
    )
}