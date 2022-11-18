import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SHA512 } from "crypto-js";
import { prisma } from '../components/db'

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

import open_eye from '../public/images/open_eye_icon.svg';
import closed_eye from '../public/images/close_eye_icon.svg';
import Headersep from '../components/layout/header_sep';
import Buttonwait from '../components/buttonwait';

export default function Changepw(props) {

    const [vis, setVis] = useState(false);
    const [eye_icon, setEyeIcon] = useState(open_eye);

    const router = useRouter()
    const { s } = router.query

    useEffect( () => {
        if (s == 'y') {
            document.getElementById('change-sent-frame').style.display = 'block'
            document.getElementById('no-conf-msg').style.display = 'none'
        }
    },[])

    function handlePwVis(e) {
        e.preventDefault()
        setVis(!vis);

        if (vis == false) {
            setEyeIcon(closed_eye);
            document.getElementById('change-passwordI').setAttribute('type', 'text');
        } else {
            setEyeIcon(open_eye);
            document.getElementById('change-passwordI').setAttribute('type', 'password');
        }

    }

    const [pwIok, setPwIok] = useState(false)
    const [samepws, setSamepws] = useState(false)

    function checkPW() {
        const pwI = document.getElementById('change-passwordI').value;

        if (pwI != '') {
            document.getElementById('count-req').classList.add('req-fail')
            document.getElementById('nr-req').classList.add('req-fail')
            document.getElementById('case-req').classList.add('req-fail')
            document.getElementById('char-req').classList.add('req-fail')
        } else {
            document.getElementById('count-req').classList.remove('req-fail')
            document.getElementById('nr-req').classList.remove('req-fail')
            document.getElementById('case-req').classList.remove('req-fail')
            document.getElementById('char-req').classList.remove('req-fail')
        }
        
        if (pwI.length >= 8) {
            document.getElementById('count-req').classList.add('req-ok')
        } else {
            document.getElementById('count-req').classList.remove('req-ok')
        }

        if (/\d/.test(pwI)) {
            document.getElementById('nr-req').classList.add('req-ok')
        } else {
            document.getElementById('nr-req').classList.remove('req-ok')
        }

        if (/[a-z]/.test(pwI) && /[A-Z]/.test(pwI)) {
            document.getElementById('case-req').classList.add('req-ok')
        } else {
            document.getElementById('case-req').classList.remove('req-ok')
        }

        if (/[\~\!\@\#\$\%\^\*\-\_\=\+\[\{\]\}\/\;\:\,\.\?]/.test(pwI)) {
            document.getElementById('char-req').classList.add('req-ok')
        } else {
            document.getElementById('char-req').classList.remove('req-ok')
        }

        const requirements = document.getElementById('change-pw-requirements').getElementsByClassName('req-ok').length
        if (requirements == 4){
            document.getElementById('change-passwordII').disabled = false;
            setPwIok(true)
            checkSamePW()
        } else {
            document.getElementById('change-passwordII').disabled = true;
            document.getElementById('password-no-match').classList.remove('show-msg')
            document.getElementById('password-match').classList.remove('show-msg')
            setPwIok(false)
        }
    }

    function checkSamePW() {
        const pwI = document.getElementById('change-passwordI').value;
        const pwII = document.getElementById('change-passwordII').value;

        if (pwII == '') {
            document.getElementById('password-no-match').classList.remove('show-msg')
            document.getElementById('password-match').classList.remove('show-msg')
            setSamepws(false)
        } else {
            if (pwI == pwII) {
                document.getElementById('password-match').classList.add('show-msg');
                document.getElementById('password-no-match').classList.remove('show-msg');
                setSamepws(true)
            } else {
                document.getElementById('password-no-match').classList.add('show-msg');
                document.getElementById('password-match').classList.remove('show-msg');
                setSamepws(false);
            }
        }
    }

    async function changePW(e) {
        e.preventDefault()
        document.getElementById('change-pw-btn').children[0].classList.remove('w3-hide')
        const password_clean = document.getElementById('change-passwordII').value
        const salt = process.env.SALT
        const password_salted = password_clean+salt
        const password = SHA512(password_salted).toString()
        const data = {
            password: password,
            user_id: props.user_id,
            change_id: props.change_id
        }
        try {
            const body = { data }
            await fetch('api/user/change/password', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            endPwChange()
        } catch (error) {
            console.error(error)
            document.getElementById('change-pw-btn').children[0].classList.add('w3-hide')
            alert('Uh oh, something went wrong')
        }
    }

    async function endPwChange() {
        document.getElementById('change-frame').style.display = 'none'
        document.getElementById('change-sent-frame').style.display = 'block'
        signOut({callbackUrl:'/changepassword?s=y'})
    }

    const [btndisabled, setbtndisabled] = useState(true)

    useEffect(() => {
        if (pwIok && samepws) {
            setbtndisabled(false)
        } else {
            setbtndisabled(true)
        }
    })

    return (
        <div className="confirm-page">
            <Head>
                <title>Change password | Agility Hub</title>
            </Head>
            <Header session={props.data} />

            <div id='change-content'>
                <Headersep />

                {props.isToken
                ?<><div id = 'change-frame'>
                    <div id = 'confirm-title' className='title'>
                        Change password
                    </div>
                    <form onSubmit={(e)=>{changePW(e)}}>
                        <div id='change-pw-eye'>
                            <input type = 'password'
                                name = 'change-passwordI'
                                id = 'change-passwordI'
                                className = 'normal-text'
                                onChange = {checkPW}
                                maxLength = {32}
                                autoComplete= "new-password"
                                placeholder='New password' />
                            <button onClick = {(e) => {handlePwVis(e)}} className = 'pw-eye' id = 'change-eye'>
                                <Image
                                    src = {eye_icon}
                                    layout = 'responsive' />
                            </button>
                        </div>
                        <div id = 'change-pw-requirements'>
                            <div id = 'count-req' className = 'signup-pw-req'>&bull; At least 8 characters</div>
                            <div id = 'case-req' className = 'signup-pw-req'>&bull; Upper- and lowercase letters</div>
                            <div id = 'char-req' className = 'signup-pw-req'>&bull; At least one special character</div>
                            <div id = 'nr-req' className = 'signup-pw-req'>&bull; At least one number</div>
                        </div>
                        <input type = 'password'
                            name = 'change-passwordII'
                            id = 'change-passwordII'
                            className = 'normal-text'
                            onChange = {checkSamePW}
                            maxLength = {32}
                            autoComplete="new-password"
                            disabled = {true}
                            placeholder='Confirm new password'/>
                        <div id = 'change-password-status'>
                            <div id = 'password-no-match' className = 'signupII-label'> &#10006; The passwords don't match</div>
                            <div id = 'password-match' className = 'signupII-label'> &#10003; The passwords match</div>
                        </div>
                        <button disabled={btndisabled} id = 'change-pw-btn' className='normal-btn'>
                            Change password <Buttonwait color={'#ffffff'} />
                        </button>
                    </form>
                </div>
                <div id = 'change-sent-frame'>
                    Your password has been successfully changed!
                </div></>
                :<>
                    <div id = 'no-conf-msg' className='normal-text'>
                        This link is invalid or expired, please request a new one and try again.
                    </div>
                    <div id = 'change-sent-frame'>
                        Your password has been successfully changed!
                    </div>
                </>}
            </div>
            
            < Footer />                
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const { query } = context
    var { tok } = query

    if (tok == undefined) {
        tok = ''
    }

    const delOld = await prisma.changes_pw.deleteMany({
        where: {
          expires_at: {
            lt: new Date()
          }}
        })

    const change = await prisma.changes_pw.findFirst({
        where: {
            token: tok
        }
    })

    let user_id
    let change_id

    if (change) {
        var isToken = true
        user_id = change.user_id
        change_id = change.change_id
    } else {
        var isToken = false
    }

    //logic to check if tok is in the pending users table 
    //if so move user to active table and return isToken true,
    //otherwise return isToken false

    return {
        props: {data: session,
            isToken: isToken,
        user_id: user_id,
        change_id: change_id}
    }
}