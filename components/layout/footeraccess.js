import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import 'w3-css/w3.css';

export default function Footeraccess(props) {
    const { data: session } = useSession();

    const router = useRouter();

    if (session) {        
        return(
            <button onClick = {signOut} className = 'footer-login'>
                Log out
            </button>
        )
    } else {
        return(
            <div className="w3-bar-block">
                <button onClick = {()=>{router.push('/login')}} className = 'w3-bar-item footer-login'>
                Log In
                </button>

                <button onClick = {()=>{router.push('/signup')}} className = 'footer-login w3-bar-item' id = 'footer-signup'>
                Sign Up
                </button> <br />
            </div>
        )
    }
}
