import Head from 'next/head';
import { getSession, signOut } from 'next-auth/react';
import { prisma } from '../components/db';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import Custom404 from './404';
import Headersep from '../components/layout/header_sep';

export default function confirmEmail(props) {
    
    const router = useRouter()
    const { s } = router.query

    useEffect( () => {
        if ((props.data != undefined) && props.isToken) {
            signOut({callbackUrl:'/confirmemail?s=y'})
        } else if (s == 'y') {
            document.getElementById('conf-msg').style.display = 'flex'
            document.getElementById('no-conf-msg').style.display = 'none'
        }
    },[])

    return (    
        <div id="confirm-page">
            <Head>
                <title>Confirm email | Agility Hub</title>
            </Head>
            <Header session={props.data} />
            <div id='confirmreg-content'>
                <Headersep />
                {props.isToken
                ?<div id = 'conf-msg' className='normal-text'>
                    Email confirmed successfully! Please login with your updated credentials.
                </div>
                :<>
                <div id = 'no-conf-msg' className='normal-text'>
                    The link is invalid or expired, please request a new one and try again.
                </div>
                <div id = 'conf-msg' className='normal-text' style={{display:'none'}}>
                    Email confirmed successfully! Please login with your updated credentials.
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

    const delOld = await prisma.changes_email.deleteMany({
        where: {
          expires_at: {
            lt: new Date()
          }}
        })

    const change = await prisma.changes_email.findFirst({
        select: {
            change_id: true,
            user_id: true,
            new_email: true
        },
        where: {
            token: tok
        }
    })

    if (change) {
        var isToken = true
        const updateEmail = await prisma.users.update({
            where: {
                user_id: change.user_id
            },
            data: {
                email: change.new_email
            }
        })
        const deleteEntry = await prisma.changes_email.delete({
            where: {
                change_id: change.change_id
            }
        })
    } else {
        var isToken = false
    }

    return {
        props: {
            data: session,
            isToken: isToken,
            change_id: change,
            tok: tok
        }
    }
}