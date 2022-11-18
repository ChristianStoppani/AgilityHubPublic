import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import Headersep from '../components/layout/header_sep';

import Head from 'next/head';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { prisma } from '../components/db'
import Buttonwait from '../components/buttonwait';

export default function Pwforgotten(props) {

    const [email, setEmail] = useState('')

    function looksLikeMail(str) {
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(e, tokens) {
        e.preventDefault()
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 30; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        var tokens_arr = []

        for (var id in tokens){
            tokens_arr.push(tokens[id].token)
        }

        var isOld = tokens_arr.includes(result)
        if (!isOld) {
            return result
        } else {
            generateString(e, tokens)
        }
    }

    async function handleRecovery(e) {

        e.preventDefault()
        const email = document.getElementById('forgotten-email').value.toLowerCase()

        if (looksLikeMail(email)) {
            document.getElementById('forgotten-form').reset()

            const token = generateString(e, props.pwTokens)
            const confirmation_link = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/changepassword?tok='+token
            const data = {
                email: email,
                token: token
            }
            try {
                document.getElementById('forgotten-btn').children[0].classList.remove('w3-hide')
                const body = { data }
                const response = await fetch('api/user/change/pwforgotten', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                
                const res = await response.json()
                
                if (res.status == 'ok') {
                    setEmail(email)
                    const emailbody = {
                        email,
                        confirmation_link
                    }
                    fetch('api/sendgrid/resetpw', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(emailbody),
                    })
                    document.getElementById('forgotten-frame').style.display = 'none'
                    document.getElementById('forgotten-notsent-frame').style.display = 'none'
                    document.getElementById('forgotten-sent-frame').style.display = 'block'
                } else {
                    document.getElementById('forgotten-notsent-frame').style.display = 'block'
                }
                document.getElementById('forgotten-btn').children[0].classList.add('w3-hide')
            } catch (error) {
                console.error(error)
                document.getElementById('forgotten-btn').children[0].classList.add('w3-hide')
                alert('Uh oh, something went wrong')
            }
        } else {
            alert('Invalid email')
        }
    }
    return (
        <div className="confirm-page">
            <Head>
                <title>Password forgotten | Agility Hub</title>
            </Head>
   
            <Header session={props.data} />

            <div id='forgotten-content'>
                <Headersep />

                <div id = 'forgotten-frame'>
                    <div className='title' id ='forgotten-title'>
                        Password forgotten?
                    </div>
                    <div className='normal-text' id ='forgotten-text'>
                        Enter your email address, if we find it in our system we’ll send you a recovery link.
                    </div>
                    <form onSubmit = {(e) => {handleRecovery(e)}} id = 'forgotten-form'>
                        <input type = 'email'
                            name = 'email' 
                            id = 'forgotten-email'
                            placeholder = 'Email'
                            className='normal-text'/>
                        <button id = 'forgotten-btn' className='normal-btn'>Send recovery email <Buttonwait color={'#ffffff'} /></button>
                    </form>
                </div>
                <div id = 'forgotten-notsent-frame'>
                    No user account associated with this email address.
                </div>
                <div id = 'forgotten-sent-frame' className='normal-text'>
                    <span style={{textAlign:'left',fontFamily:'Rubikmed'}}>Reset link sent to {email}</span><br/>
                    If you don’t see this email in your inbox within 15 minutes, look for it in your junk mail folder. If you find it there, please mark it as “Not Junk”.
                </div>
            </div>
            
            <Footer />

        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    var pwTokens = await prisma.changes_pw.findMany({
        select: {
          token: true
        }
      })
    const delOldPw = await prisma.changes_pw.deleteMany({
    where: {
        expires_at: {
        lt: new Date()
        }}
    })

    return {
        props: { data: session,
        pwTokens: pwTokens}
      }
}