import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from 'next/head';

import 'w3-css/w3.css';

import close_btn from '../../public/images/close_btn_50.svg'
import {  useEffect, useState } from "react";
import Buttonwait from "../../components/buttonwait";

export default function newteam(props) {

    const router = useRouter()

    const [emails, setEmails] = useState([])

    // the presence of trigger causes the email list to update immediately upon deletion of a member
    // idk why but it works
    const [trigger, setTrigger] = useState(false)

    function looksLikeMail(str) {
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    function addMember(e) {
        e.preventDefault()
        const mail = document.getElementById('add-email').value.replace(/\s/g, "").toLowerCase()
        if (!looksLikeMail(mail)) {
            alert('Invalid email')
        } else if (emails.includes(mail) || mail === props.data.user.email) {
            e.target.reset()
            document.getElementById('duplicate-member').style.display = 'flex'
            setTimeout(() => {
                // After 2.5 seconds set the show value to false
                document.getElementById('duplicate-member').style.display = 'none'
              }, 2500)
        } else if (mail == '') {

        } else {
            setEmails(emails => [...emails, mail])
            e.target.reset()
        }
    }

    function removeMember(e) {
        e.preventDefault()
        const emailtodelete = e.target.parentElement.querySelector('.email-value').textContent
        emails.splice(emails.indexOf(emailtodelete), 1)
        setEmails(emails)
        setTrigger(true)
    }

    async function createTeam(e) {
        e.target.children[0].classList.remove('w3-hide');
        const teamname = document.getElementById('team-name').value
        if (teamname == '' || teamname.replace(/\s/g, "") == '') {
            alert('The name of your team is missing.')
        } else {
            const team = {
                name: teamname,
                leader: props.data.user.id,
                members: emails
            }

            try {
                const body = { team }
                const response = await fetch('/api/team/create', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                const res = await response.json()
                const emailbody = { team, multiple:true }
                fetch('/api/sendgrid/teaminvitation', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(emailbody),
                })
                
                router.push('/teams')
            } catch (error) {
                console.error(error)
                alert ('Uh oh something went wrong, please try again later')
                e.target.children[0].classList.add('w3-hide');
            }
        }
    }

    useEffect(() => {
        if (trigger){
        setTrigger(false)
    }})

    return (
        <div className = 'new-page'>
            <div id='page-bg'/>
            
            <Head>
                <title>New Team | Agility Hub</title>
            </Head>
            <div className="page-cont">

            <div id='newteam-bar' className="w3-bar">
                <div id = 'new-team-title' className="w3-bar-item">
                    New team
                </div>

                <Link href = '/teams'>
                    <a id = 'new-close-btn' className="w3-bar-item w3-right">
                    <Image
                        src = {close_btn}
                        layout = 'responsive' />
                    </a>
                </Link>
            </div>

            <div id='new-team-container'>

            <input type = 'text'
                name = 'team-name' 
                id = 'team-name'
                className = 'new-team-entry'
                placeholder = 'Team Name*'
                autoComplete = 'off'
                maxLength = '30'/>

            <div id = 'add-member' className = 'normal-text'>
                Add member
            </div>
            <div style={{marginBottom:'20px'}} className = 'normal-text'>
                (Once you create the team, you can generate an invitation link under "manage")
            </div>

            <form id='add-form' onSubmit = {(e) => {addMember(e)}}>
                <input type = 'email'
                    name = 'add-email' 
                    id = 'add-email'
                    className = 'new-team-entry'
                    placeholder = 'Member email'
                    autoComplete = 'off'/>

                <button type = 'submit' id= 'add-btn' className = ' w3-hide-small new-team-btn'>Add</button>
                <button type = 'submit' id= 'add-btn-s' className = 'w3-hide-large w3-hide-medium new-team-btn-s'>Add</button>
            </form>

            <div id = 'new-leader' className = 'normal-text'>
                Leader
            </div>
            <div key={props.data.user.email} id = 'new-leader-text' className = 'normal-text'><span>&nbsp;</span>{props.data.user.email}{' (you)'}</div>

            <div id = 'members' className = 'normal-text'>
                Members
            </div>
            <div id = 'members-lst'>
                {emails.map((member) =>(
                    <div key={member} className = 'normal-text member-email'>
                        <button onClick = {(e) => removeMember(e)} className = 'remove-member-btn' title = 'remove member'>
                            &#10006;
                        </button>
                        <span>&nbsp;&nbsp;</span>
                        <div className = 'email-value'>{member}</div>
                    </div>
                ))}
            </div>

            <div id='dup-btn-container'>
                <div id = 'duplicate-member' className = 'normal-text'>
                    Email already added.
                </div>

                <button onClick = {(e)=>{createTeam(e)}} id = 'create-team' className = 'new-team-btn w3-hide-small'>
                    Create <Buttonwait color={'#ffffff'} />
                </button>
                <button onClick = {(e)=>{createTeam(e)}} id = 'create-team-s' className = 'new-team-btn-s w3-hide-large w3-hide-medium'>
                    Create <Buttonwait color={'#ffffff'} />
                </button>
            </div>

            <div id='new-pg-end' />

            </div>
            </div>
        </div>
    )

}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
          redirect: {
            destination: '/accessrequired?p='+context.resolvedUrl,
            permanent: false,
          },
        }
      }
  
    return {
      props: { data: session }
    }
  }