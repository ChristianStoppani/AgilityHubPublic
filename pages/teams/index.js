import Link from "next/link";
import Image from "next/image";
import Modal from 'react-modal';
import Head from 'next/head';
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { prisma } from '../../components/db';

import 'w3-css/w3.css';

import close_btn from '../../public/images/close_btn_50.svg';
import home_btn from '../../public/images/Home_button_75.svg';
import Teamoverview from "../../components/team/teamoverview";
import Teammember from "../../components/team/teammember";
import Buttonwait from "../../components/buttonwait";


// logic to obtain name and profile pic from database will be necessary


export default function teams(props) {

  useEffect(() => {
    Modal.setAppElement(document.getElementById('teams-page'))
  }, [])

  const router = useRouter()

  const teams_lst = props.teams_lst
  const [pending_lst, setPending_lst] = useState(props.pending_lst)

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    if (JSON.stringify(pending_lst) != JSON.stringify(props.pending_lst)) {
      router.reload()
    } else {
      setIsOpen(false);
    }
  }

  function handleModal() {
    setIsOpen(!modalIsOpen)
  }

  async function handleInvite(e, accept) {
    e.preventDefault()
    e.target.children[0].classList.remove('w3-hide')
    const inviteId = parseInt(e.target.getAttribute('data-teamid'))
    try {
        const userId = props.userId
        const body = { inviteId, accept, userId }
        let response = await fetch('api/team/handleinvite', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        setPending_lst(pending_lst.filter(x => x.group_id != inviteId))     
    } catch (error) {
        console.error(error)
        e.target.children[0].classList.add('w3-hide')   
        alert('Uh oh, something went wrong')     
    }

  }

    return (
        <div id = 'teams-page'>
          
          <Head>
              <title>Teams | Agility Hub</title>
          </Head>

          <div id = 'teams-body'/>
          <div className='page-cont'>
          <div id='teams-bar' className="w3-bar">
            <div id = 'teams-title' className="w3-bar-item">
                Teams
            </div>

            <Link href = '/'>
                <a id = 'teams-home-btn' className="w3-bar-item w3-right">
                    <Image
                        src = {home_btn}
                        layout = 'responsive' />
                </a>
            </Link>
          </div>

          <div id = 'teams-btns-bar'>
            <button onClick = {handleModal} className = 'create-new-team' id = 'invitations-btn'>
              Invitations 
              {pending_lst.length != 0
                ?<>&nbsp;<span className='w3-badge' style={{backgroundColor:'red'}}>{pending_lst.length}</span></>
                : <>&nbsp;(0)</> }
            </button>

            <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/teams/new')}} className = 'create-new-team' id = 'new-team-btn'> 
              New team <Buttonwait color={'#ffffff'} />
            </button>
          </div>

            <Modal
              isOpen = {modalIsOpen}
              onRequestClose = {closeModal}
              contentLabel = 'Invitations'
              className = 'ReactModal__Content'
              portalClassName = "ReactModalPortal"
              overlayClassName = "ReactModal__Overlay"
              bodyOpenClassName = "ReactModal__Body--open">

                <div id = 'invitations-frame'>
                  <div className="w3-bar">
                  <div id = 'invitations-title' className='title w3-bar-item'>
                    Pending invitations ({pending_lst.length})
                  </div>
                  <button id = 'invitations-close-btn' className='w3-bar-item w3-right' onClick = {closeModal}>
                    <Image
                      src = {close_btn}
                      layout = 'responsive'/>
                  </button>
                  </div>
                  <div id = 'invitations-list'>
                    {pending_lst.map((invite) => (
                      <div key = {invite.group_id} id = 'invite-container' className="w3-card w3-row">
                        <div id = 'invite-sender' className="w3-col l2 m4 s12">
                          <Teammember
                            name = {invite.invitedby.first_name}
                            surname = {invite.invitedby.last_name}
                            picture = {invite.invitedby.profile_img}
                            userId = {props.userId}
                            leader = {false}/>
                        </div>
                        <div id = 'invite-text-1' className = 'normal-text w3-col l6 m8 s10'>
                          invited you to join
                        </div>
                        <p align='center' id = 'invite-text-2' className=" w3-col l11 m11 s11">
                          {invite.name}
                        </p>
                        <div id = 'invite-btns' className="w3-col l10 w3-row">
                          <button onClick = {(e) => {handleInvite(e, true)}} id = 'accept-invitation' className = 'create-new-team  w3-col l4 m4 s8' data-teamid = {invite.group_id}> &nbsp;&#10003;&nbsp; accept <Buttonwait color={'#ffffff'}/></button>
                          <button onClick = {(e) => {handleInvite(e, false)}} id = 'decline-invitation' className = 'create-new-team  w3-col l4 m4 s8' data-teamid = {invite.group_id}> &nbsp;&#10006;&nbsp; decline <Buttonwait color={'#ffffff'}/></button>
                        </div>
                      </div>
                    ))}
                    {pending_lst.length != 0
                    ? null
                    : <div id = 'no-invitations' className = 'normal-text'>You have no pending invitations at the moment.</div>}
                  </div>
                </div>
            </Modal>

            {
              teams_lst.length != 0
              ? <>
                  <div id = 'teams-list'>
                    {teams_lst.map((team) => (
                      <Teamoverview 
                        key = {team.id} 
                        teamId = {team.id}
                        team = {team}
                        userId = {props.userId} />
                    ))}
                    <div id = 'teams-end-space' />
                  </ div>
                </>
              : <div id = 'no-teams-found' className = 'normal-text'> 
                  You're not part of any team yet, check your inbox for pending invitations or create a new team.
                </div>
            }
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
    } else if (!session.user.profile) {
      return {
        redirect: {
          destination: '/linkedin',
          permanent: false,
        },
      }
    } 

    const teams_id = await prisma.members.findMany({
      select: {
        group_id: true
      },
      where: {
        user_id: session.user.id
      }
    })

    var teams_info = []

    for (var i in teams_id) {
      var team_id = teams_id[i].group_id
      var team = await prisma.groups.findUnique({
        select: {
          group_id: true,
          name: true,
        },
        where: {
          group_id: team_id
        }
      })
      var members_all = await prisma.members.findMany({
        select: {
          user_id: true,
          isadmin: true
        },
        where: {
          group_id: team.group_id       
        }
      })

      var leaders_id = []
      members_all
      .filter(x => x.isadmin == true)
      .map(
        function(el) {
          leaders_id.push(el.user_id)
        })

      var members_id = []
      members_all
      .filter(x => x.isadmin == false)
      .map(
        function(el) {
          members_id.push(el.user_id)
        })

      var leaders = await prisma.users.findMany({
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          profile_img: true,
        },
        where: {
          user_id: {
            in: leaders_id
          }
        },
        orderBy: {
          last_name: 'asc'
        }
      })
      var members = await prisma.users.findMany({
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          profile_img: true,
        },
        where: {
          user_id: {
            in: members_id
          }
        },
        orderBy: {
          last_name: 'asc'
        }
      })

      var team_info = {
        id: team.group_id,
        name: team.name,
        leader: leaders,
        members: members
      }
      
      teams_info.push(team_info)
    }

    let invitations_info = []

    var invitations_id = await prisma.invitations_user.findMany({
      select: {
        group_id: true,
        invited_by: true
      },
      where: {
        user_id: session.user.id
      }
    })

    for (var i in invitations_id) {
      var team_id = invitations_id[i].group_id
      var team = await prisma.groups.findUnique({
        select: {
          group_id: true,
          name: true,
        },
        where: {
          group_id: team_id
        }
      })

      var inviter_id = invitations_id[i].invited_by
      var inviter = await prisma.users.findUnique({
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          profile_img: true,
        },
        where:{
          user_id: inviter_id
        }
      })
      var invitation_info = {
        ...team,
        invitedby: inviter
      }
      invitations_info.push(invitation_info)
    }
  
    return {
      props: { data: session,
          teams_lst: teams_info,
             userId: session.user.id,
        pending_lst: invitations_info}
    }
  }

  