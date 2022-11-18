
import Teammember from "./teammember";
import Link from 'next/link';

import 'w3-css/w3.css';
import { useState } from "react";
import { useRouter } from "next/router";
import Buttonwait from "../buttonwait";

export default function Teamoverview(props) {

    const router = useRouter()

    var leaders = props.team.leader;

    var teamId = props.teamId;

    var totMembers = leaders.length + props.team.members.length

    const [showMembers, setShowMembers] = useState(false)

    var historyURL = '/history?team=' + teamId
    var modifyURL = '/teams/' + teamId + '/manage'
    var isLeader = false

    for (const leader in leaders) {
        if (leaders[leader].user_id == props.userId) {
            var isLeader = true
        }
    }

    function toggleMembers(e) {
        setShowMembers(!showMembers)
        if(showMembers) {
            e.target.parentNode.lastChild.className = 'w3-hide-small w3-hide-medium'
        } else {
            e.target.parentNode.lastChild.className = ''
        }
    }

    async function handleLeave(e) {
        var conf = confirm('Are you sure you want to leave the team?')

        if (conf) {
            e.target.children[0].classList.remove('w3-hide')
            try {
                const userId = props.userId
                const body = { teamId, userId }
                const response = await fetch('api/team/leave', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                router.reload()
            } catch (error) {
                console.error(error)
                alert('Uh oh, something went wrong')
            }
        }
    }

    async function newAssessment(e, small) {
        e.target.children[0].classList.remove('w3-hide')
        const team_id = props.teamId
        const body = { team_id }
        try {
            let response = await fetch('api/team/newassessment', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })  
            const res = await response.json()
            e.target.children[0].classList.add('w3-hide')
            e.target.children[1].classList.remove('w3-hide')
            e.target.style.backgroundColor = 'green'
            if (!small){
                e.target.parentNode.parentNode.parentNode.children[0].style.display = 'flex'
            }
        } catch (error) {
            console.error(error)
            alert('Uh oh, something went wrong')
        }
    }

    return(

        <>
            <div className = 'team-container w3-card'>
                <div id = 'assessment-opened' className="normal-text w3-col l4 m7 w3-hide-small">
                    <Link href='/team_assessment/open'><a style={{textDecoration: 'underline'}}>
                        Go to open assessments
                    </a></Link>
                    <button id='ass-open-close' onClick={(e)=>(e.target.parentNode.style.display = 'none')}>
                        &#10006;
                    </button>
                </div>
                <div className="w3-hide-large w3-hide-medium"> 
                        <br/>
                    </div>
                <div id = 'team-header' className="w3-bar w3-padding-16 w3-hide-medium w3-hide-small">
                    <div className = 'team-name normal-text w3-bar-item'>
                        {props.team.name}
                    </div>
                    { isLeader
                    ?   <>
                    <div className="w3-bar-item">
                            <button className = 'create-new-team' onClick={(e)=>{newAssessment(e, false)}}>
                                Open new assessment <Buttonwait color={'#ffffff'}/> <div className="w3-hide">&nbsp; &#10004;</div>
                            </button>
                        </div>
                        </>
                    : null
                    }
                    <div className="w3-bar-item">
                        <button 
                        onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(historyURL)}} 
                        className = 'create-new-team'>
                            History <Buttonwait color={'#ffffff'}/>
                        </button>
                    </div>
                    { !isLeader
                        ?   <><div className="w3-bar-item">
                                <button 
                                onClick = {(e)=>{handleLeave(e)}} 
                                className = 'create-new-team'>
                                    Leave team <Buttonwait color={'#ffffff'}/>
                                </button>
                            </div>
                            </>
                        : <>
                        <div className="w3-bar-item">
                            <button 
                            onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(modifyURL)}} 
                            className = 'create-new-team'>
                                Manage <Buttonwait color={'#ffffff'}/>
                            </button>
                        </div>
                        </>
                    }
                </div>

                <div id = 'team-name-m' className="w3-bar w3-hide-large w3-hide-small">
                    <div className = 'team-name normal-text w3-bar-item'>
                        {props.team.name}
                    </div>
                </div>
                <div id='team-btns-m' className="w3-bar w3-padding-16 w3-hide-large w3-hide-small">
                    { isLeader
                    ?   <>
                    <div className="w3-bar-item">
                            <button className = 'create-new-team' onClick = {(e)=>{newAssessment(e, false)}}>
                                Open new assessment <Buttonwait color={'#ffffff'}/> <div className="w3-hide">&nbsp; &#10004;</div>
                            </button>
                        </div>
                        </>
                    : null
                    }
                    <div className="w3-bar-item">
                        <button 
                        onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(historyURL)}} 
                        className = 'create-new-team'>
                            History <Buttonwait color={'#ffffff'}/>
                        </button>
                    </div>
                    { !isLeader
                        ?   <><div className="w3-bar-item">
                                <button 
                                onClick = {(e)=>{handleLeave(e)}} 
                                className = 'create-new-team'>
                                    Leave team <Buttonwait color={'#ffffff'}/>
                                </button>
                            </div>
                            </>
                        : <>
                        <div className="w3-bar-item">
                            <button 
                            onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(modifyURL)}} 
                            className = 'create-new-team'>
                                Manage <Buttonwait color={'#ffffff'}/>
                            </button>
                        </div>
                        </>
                    }  
                </div>

                <div id = 'team-header-s' className="w3-block-bar w3-padding-16 w3-hide-medium w3-hide-large">
                    <div className = 'team-name normal-text w3-block-bar-item'>
                        {props.team.name}
                    </div>
                    { isLeader
                    ?   <>
                    <div className="w3-block-bar-item w3-padding">
                            <button className = 'create-new-team' onClick = {(e)=>{newAssessment(e, true)}}>
                                Open new assessment <Buttonwait color={'#ffffff'}/> <div className="w3-hide">&nbsp; &#10004;</div>
                            </button>
                        </div>
                        </>
                    : null
                    }
                    <div id = 'history-s' className="w3-bar-item w3-padding">
                        <button 
                        onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(historyURL)}} 
                        className = 'create-new-team'
                        style={{marginBottom: '15px'}}>
                            History <Buttonwait color={'#ffffff'}/>
                        </button>
                    
                    { !isLeader
                        ?   <>
                                <button 
                                onClick = {(e)=>{handleLeave(e)}} 
                                className = 'create-new-team'>
                                    Leave team <Buttonwait color={'#ffffff'}/>
                                </button>
                            </>
                        : <>
                            <button 
                            onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push(modifyURL)}} 
                            className = 'create-new-team'>
                                Manage <Buttonwait color={'#ffffff'}/>
                            </button>
                        </>
                    }
                    </div>
                </div>

                <button id='toggle-members-btn' onClick={(e)=>{toggleMembers(e)}} className="w3-hide-large normal-text">
                    {showMembers
                    ?<>&#9650; hide {totMembers} members</>
                    :<>&#9660; show {totMembers} members</>}
                </button>

                <div id='all-members-container' className = 'w3-hide-medium w3-hide-small'>
                    <div className="leaders-container">
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
                    {props.team.members.map((member) => (
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
                    ))}
                </div>
            </div>
        </>
    )
}