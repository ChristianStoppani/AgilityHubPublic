import Head from 'next/head';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

import { getSession } from 'next-auth/react';
import { prisma } from '../components/db'
import Custom404 from './404';
import Headersep from '../components/layout/header_sep';

export default function confirmRegistration(props) {
    return (    
        <div id="confirm-page">
            <Head>
                <title>Confirm registration | Agility Hub</title>
            </Head>
            <Header />
            <div id='confirmreg-content'>
                <Headersep />
                {props.isToken
                ?<div id = 'conf-msg' className='normal-text'>
                    Registration successful!
                </div>
                :<div id = 'no-conf-msg' className='normal-text'>
                    Registration unsuccessful, the link is invalid or expired. 
                </div>}
            </div>
            
            < Footer />
            
        </div>
        )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const { query } = context
    var { tok } = query

    const delOld = await prisma.users_unconfirmed.deleteMany({
        where: { 
            expires_at: {
                lt: new Date()
            }}
    })

    if (!tok) {
        tok = ''
    }

    var user_id = await prisma.users_unconfirmed.findUnique({
        select: {
            user_id: true
        },
        where: {
            token: tok
        }
    })

    let profile = {}

    if (user_id) {
        var isToken = true

        user_id = user_id.user_id

        const user = await prisma.users_unconfirmed.findUnique({
            select: {
                user_id: true,
                email: true,
                password: true,
                first_name: true,
                last_name: true,
                created_at: true
            },
            where: {
                user_id: user_id
            }
        })

        user['profile_img'] = null

        profile = await prisma.profiles_unconfirmed.findUnique({
            where: {
                user_id: user_id
            }
        })
        
        profile.id = profile.user_id
        delete profile.user_id

        const createProfileAll = await prisma.profiles_all.create({
            data: profile
        })

        delete profile.id

        user['profiles'] = {create: profile} 

        const confirmUser = await prisma.users.create({
            data: user
       })

       const deleteUnconfirmedUser = await prisma.users_unconfirmed.delete({
           where: {
               user_id: user_id
           }
       })
       const email = user.email

       const invitations = await prisma.invitations_unregistered.findMany({
           where: {
               email: email
           },
           select: {
               group_id: true,
               invited_by: true
           }
       })

       const delInvitations = await prisma.invitations_unregistered.deleteMany({
           where: {
               email: email
           }
       })

       if (invitations.length != 0) {
           for (const i in invitations) {
               invitations[i]['user_id'] = user_id
           }
       }

       const addInvitations = await prisma.invitations_user.createMany({
           data: invitations
       })

       const body = {
            email: email,
            first_name: user.first_name
        }

        await fetch(process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/api/sendgrid/newuser', {
           method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })

    } else {
        var isToken = false
    }

    return {
        props: {isToken: isToken}
    }
}