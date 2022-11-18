import { getSession } from "next-auth/react"
import { prisma } from '../components/db'
import { useState } from "react";


import Head from "next/head";
import Header from '../components/layout/header'
import Headersep from '../components/layout/header_sep'
import Footer from '../components/layout/footer'
import Teammember from "../components/team/teammember";
import Buttonwait from "../components/buttonwait";

export default function joingroup(props) {
    const team = props.team
    const isMember = props.isMember

    if (team) {
        var leaders = props.team.leader
        var totMembers = leaders.length + props.team.members.length
    }
    
    const [showMembers, setShowMembers] = useState(false)

    function toggleMembers(e) {
        setShowMembers(!showMembers)
        if(showMembers) {
            e.target.parentNode.lastChild.className = 'w3-hide-small w3-hide-medium'
        } else {
            e.target.parentNode.lastChild.className = ''
        }
    }

    const [ joined, setJoined ] =useState(false)

    async function handleJoin(e) {
        e.preventDefault()
        e.target.children[0].classList.remove('w3-hide')

        const body = {
            team_id: props.teamId,
            user_id: props.userId
        }
        try {
            let response = await fetch('/api/user/jointeam', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            const res = await response.json()
            setJoined(true)
            e.target.children[0].classList.add('w3-hide')            
        } catch (error) {
            console.error(error)
            e.target.children[0].classList.add('w3-hide')
        }
    }
    return (
        <div id="confirm-page">
            <Head>
                <title>Join team | Agility Hub</title>
            </Head>
            <Header session={props.data} />
            <div id='confirmreg-content'>
            <Headersep />
                {team
                ?<>{joined
                    ? <div id = 'conf-msg' className='normal-text'>
                    Team joined successfully! 
                    </div>
                    :<div className = 'team-container w3-card' style={{width:'80%', marginBottom:'16px'}}>
                    <div id='team-name-m' className='normal-text'>Invite for</div>
                    <div id='team-name-m' className="w3-bar w3-padding-16">
                        <div className = 'team-name normal-text padding-16'>
                            {props.team.name}
                        </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'center', paddingBottom:'16px'}}>
                        {isMember
                        ?<button className='normal-btn' style={{padding: '16px', paddingLeft:'16px', paddingRight:'16px', opacity:'0.5', cursor:'not-allowed'}} disabled>Already Joined</button> 
                        :<button onClick={(e)=>{handleJoin(e)}} className='normal-btn' style={{padding: '16px', paddingLeft:'16px', paddingRight:'16px'}}>Join <Buttonwait color={'#ffffff'} /></button> 
                        }
                    </div>    
                    <button id='toggle-members-btn' onClick={(e)=>{toggleMembers(e)}} className="w3-hide-large normal-text">
                        {showMembers
                        ?<>&#9650; hide {totMembers} members</>
                        :<>&#9660; show {totMembers} members</>}
                    </button>  
                    <div className='w3-hide-small w3-hide-medium' style={{display:'flex', justifyContent:'center', paddingBottom:'16px'}}>
                        <div className="normal-text" >Members</div>    
                    </div>    
                    <div id='all-members-container' className = 'w3-hide-medium w3-hide-small'>
                        <div className="leaders-container" style={{marginRight:'0%'}}>
                        {leaders.map((member) => (
                            <div key = {member.user_id} className = 'leader-container'>
                                <Teammember
                                    name = {member.first_name}
                                    surname = {member.last_name}
                                    picture = {member.profile_img}
                                    userId = {props.userId}
                                    memberId = {member.user_id}
                                    leader = {true}
                                    />
                            </div>
                        ))}
                        </div>
                        {props.team.members.length!=0
                        ?<div style={{marginLeft:'5% !important'}}>{props.team.members.map((member) => (
                            <div key = {member.user_id} className = 'member-container'>
                                <Teammember
                                    name = {member.first_name}
                                    surname = {member.last_name}
                                    picture = {member.profile_img}
                                    userId = {props.userId}
                                    memberId = {member.user_id}
                                    leader = {false}
                                    />
    
                            </div>
                        ))}</div>
                        :null}
                    </div>
                </div>
                }</>
                : <div id = 'no-conf-msg' className='normal-text'>
                    No team found, the link is invalid. 
                </div>

                }
            </div>
            
            < Footer /> 
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const { query } = context
    var { tok } = query

    if (!session) {
        return {
            redirect: {
                destination: '/accessrequired?p='+context.resolvedUrl,
                permanent: false,
            }
        }
    }

    if (!tok) {
        tok = ''
    }

    const team = await prisma.groups.findUnique({
        select: {
            group_id: true,
            name: true,
        },
        where: {
            invite_token: tok
        }
    })

    let teamId
    const userId = session.user.id
    let leaders
    let members
    let isUserMember = false

    if (team) {
        teamId = team.group_id
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
        if (leaders_id.includes(userId) || members_id.includes(userId)) {
            isUserMember = true
        }
        leaders = await prisma.users.findMany({
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
        members = await prisma.users.findMany({
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

    }
    

    return {
        props: {
            data: session,
            team: team_info,
            teamId: teamId,
            userId: userId,
            isMember: isUserMember
        }
    }
}