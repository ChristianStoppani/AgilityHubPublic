import { useRouter } from "next/dist/client/router";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Head from 'next/head';
import Link from "next/link";
import { prisma } from '../../../components/db';

import close_btn from '../../../public/images/close_btn_50.svg'
import { useEffect, useState } from "react";
import Buttonwait from "../../../components/buttonwait";

export default function manageTeam(props) {

  const [token, setToken] = useState(props.team.invite_token)

  const team_id = parseInt(props.query.teamId)

  const [name, setName] = useState(props.team.name)
  const router = useRouter()

  const [trigger, setTrigger] = useState(false)

  const [isDisabled, setIsDisabled] = useState(true)

  const leaders = props.team.leaders

  var leaderUser = leaders.find(el => el.user_id == props.userId)

  const [otherLeaders, setOtherLeaders] = useState(leaders.filter(el => el.user_id != props.userId))

  const [members, setMembers] = useState(props.team.members)

  const [pending, setPending] = useState(props.team.pending)

  const [email_lst, setEmail_lst] = useState(props.email_lst)

  function handleChange() {
    var teamName = document.getElementById('team-name')
    teamName.removeAttribute('disabled')
    teamName.placeholder = ''
    teamName.value = String(name)
    teamName.focus()

    document.getElementById('change-team-name').classList.add('hide')
    document.getElementById('save-team-name').classList.remove('hide')
    document.getElementById('cancel-team-name').classList.remove('hide')
  }

  function activateSave() {
    if (document.getElementById('team-name').value.replace(/\s/g, "") != ''){
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  async function handleSave(e) {
    e.target.children[0].classList.remove('w3-hide')
    var teamName = document.getElementById('team-name')
    setName(teamName.value)
    teamName.disabled = true

    const team_name = teamName.value

    try {
      const body = { team_id, team_name }
      let response = await fetch('/api/team/manage/rename', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
      })
      document.getElementById('change-team-name').classList.remove('hide')
      document.getElementById('save-team-name').classList.add('hide')
      document.getElementById('cancel-team-name').classList.add('hide') 
      e.target.children[0].classList.add('w3-hide')   
    } catch (error) {
      e.target.children[0].classList.add('w3-hide')
      console.error(error)
      alert('Uh oh, something went wrong')
    }  
  }

  function handleCancel() {
    var teamName = document.getElementById('team-name')
    teamName.value = String(name)
    teamName.disabled = true

    document.getElementById('change-team-name').classList.remove('hide')
    document.getElementById('save-team-name').classList.add('hide')
    document.getElementById('cancel-team-name').classList.add('hide')
  }

  async function changeRole(user_id, promote) {
    try {
      const body = { user_id, team_id, promote }
      let response = await fetch('/api/team/manage/changerole', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
      })   
    } catch (error) {
        console.error(error)
    }
  }

  function demoteSelf(e) {
    e.preventDefault(e)

    const leadersNr = otherLeaders.length

    if (leadersNr == 0){
      alert('You need to nominate a new leader before changing your role.')
    } else {
      var conf = confirm('Are you sure you want to set your role to member? You will lose access to this page.')
      if (conf){
        changeRole(props.data.user.id, false)
        router.push('/teams')
      }
    }
  }

  function demoteLeader(e) {
    e.preventDefault(e)
    const memberId = e.target.parentElement.getAttribute('data-id')
    changeRole(memberId, false)
    
    const memberObj = otherLeaders.find(x => x.user_id == memberId)
    setOtherLeaders(otherLeaders.filter(x => x.user_id != memberId))
    setMembers(members => [...members, memberObj])
    setTrigger(true)
  }

  function promoteMember(e) {
    e.preventDefault()
    const memberId = e.target.parentElement.getAttribute('data-id')
    changeRole(memberId, true)

    const memberObj = members.find(x => x.user_id == memberId)
    setMembers(members.filter(x => x.user_id != memberId))
    setOtherLeaders(otherLeaders => [...otherLeaders, memberObj])
    setTrigger(true)
  }

  async function removeMember(e) {
    e.preventDefault()
    const memberId = e.target.parentElement.getAttribute('data-id')
    const memberName = String(e.target.parentElement.querySelector('.manage-member-name').textContent)

    var conf = confirm('Do you want to remove '+memberName+' from the team?')

    if (conf) {
      try {
        const body = { team_id, memberId }
        let response = await fetch('/api/team/manage/remove', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        }) 
        setMembers(members.filter(x => x.user_id != memberId))
        const emailtodelete = members.find(x => x.user_id == memberId).email      
        email_lst.splice(email_lst.indexOf(emailtodelete), 1)
        setTrigger(true) 
      } catch (error) {
          console.error(error)
      }  
    }
  }

  function looksLikeMail(str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
}

  async function handleNewMember(e) {    
    e.preventDefault()
    e.target.children[0].classList.remove('w3-hide')
    const newEmail = document.getElementById('manage-add-email').value.replace(/\s/g, "").toLowerCase()
    if (!looksLikeMail(newEmail)) {
      alert('Invalid email')
    } else if (pending.includes(newEmail) || email_lst.includes(newEmail) ) {     
      document.getElementById('manage-new-member-form').reset()
      document.getElementById('manage-duplicate-alert').style.display = 'flex'
      setTimeout(() => {
          // After 3 seconds set the show value to false
          document.getElementById('manage-duplicate-alert').style.display = 'none'
        }, 2500)
    } else if (newEmail == '') {
    } else {
      try {
        const email = newEmail
        const invited_by = props.userId
        const body = { team_id, email, invited_by }
        let response = await fetch('/api/team/manage/invite', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })           
        const emailbody = { team_id, email, invited_by, multiple:false }
        fetch('/api/sendgrid/teaminvitation', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(emailbody),
        })
        document.getElementById('manage-new-member-form').reset()
        e.target.children[0].classList.add('w3-hide')
        setPending(pending => [newEmail, ...pending])
        setEmail_lst(email_lst => [newEmail, ...email_lst])   
      } catch (error) {
          console.error(error)
          e.target.children[0].classList.add('w3-hide')
          alert('Uh oh, something went wrong')
      }
    }
  }

  async function removePendingUser(e) {
    e.preventDefault()
    const emailtodelete = e.target.parentElement.querySelector('.email-value').textContent

    var conf = confirm('Do you want to withdraw the invitation sent to '+emailtodelete+'?')

    if (conf) {
      try {
        const email = emailtodelete
        const body = { email, team_id }
        let response = await fetch('/api/team/manage/withdrawinvite', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        pending.splice(pending.indexOf(emailtodelete), 1)
        setPending(pending)
        email_lst.splice(email_lst.indexOf(emailtodelete), 1)
        setEmail_lst(email_lst)
        setTrigger(true)
      } catch (error) {
          console.error(error)
      }      
    }
  }

  async function deleteTeam(e) {
    e.preventDefault()
    var conf = confirm('Confirm to delete team permanently')
    if(conf){
      e.target.children[0].classList.remove('w3-hide')
      try {
      const body = { team_id }
      let response = await fetch('/api/team/delete', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
      })
      router.push('/teams') 
    } catch (error) {
        console.error(error)
        e.target.children[0].classList.add('w3-hide')
        alert('Uh oh, something went wrong')
    }}
  }

  async function handleScores(e) {
    const include = e.target.checked
    try {
      const body = { team_id, include }
      let response = await fetch('/api/team/manage/handlescores', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
      })
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    if (trigger){
      setTrigger(false)
    }})

  async function handleToken(e, del) {
    e.preventDefault()
    e.target.children[0].classList.remove('w3-hide')
    try {
      const body = { team_id, del }
      let response = await fetch('/api/team/manage/handletoken', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
      })
      const res = await response.json()      
      e.target.children[0].classList.add('w3-hide')
      setToken(res.token)
    } catch (error) {
      console.error(error)        
      e.target.children[0].classList.add('w3-hide')
      alert('Uh oh, something went wrong')
    }
  }

  return (
    <div className = 'manage-page'>
      
      <Head>
          <title>Manage Team | Agility Hub</title>
      </Head>
      
      <div id = 'teams-body' />

      <div className="page-cont">

      <div id='manage-bar' className="w3-bar">
        <div id = 'manage-title' className='w3-bar-item'>
          Manage team
        </div>

        <Link href = '/teams'>
          <a id = 'manage-close-btn' className="w3-bar-item w3-right">
            <Image
                src = {close_btn}
                layout = 'responsive' />
          </a>
        </Link>
      </div>      

      <div id = 'manage-container'>
          
      <input type = 'text'
        name = 'team-name' 
        id = 'team-name'
        className = 'new-team-entry entry-manage'
        placeholder = {name}
        autoComplete = 'off'
        maxLength = '30'
        disabled
        onChange = {activateSave}/>

      <button onClick = {handleChange} className = 'normal-btn manage-teamname-btn' id = 'change-team-name'>
        Change
      </button>
      <button onClick = {(e)=>{handleSave(e)}} disabled = {isDisabled} className = 'normal-btn manage-teamname-btn hide' id = 'save-team-name'>
        Save <Buttonwait color={'#ffffff'} />
      </button>
      <button onClick = {handleCancel} className = 'normal-btn manage-teamname-btn hide' id = 'cancel-team-name'>
        Cancel
      </button>

        <div id = 'manage-leaders'>
          <div style = {{'fontFamily':'Rubikmed', marginBottom:'8px'}} className = 'normal-text'>Leaders ({otherLeaders.length+1})</div>

            <div className="manage-entry-list">
            <div className = 'normal-text manage-entry' key = {leaderUser.id}>
              <button onClick = {(e) => {demoteSelf(e)}} className = 'manage-team-btn' title = 'give up leader role'>
                &#9660;
              </button>
              <span>&nbsp;&nbsp;</span>
              {leaderUser.first_name}{' '}{leaderUser.last_name + ' (you)'}</div>
            <div>
              {otherLeaders.map((leader) => (
                <div key = {leader.user_id} className = 'normal-text manage-entry' data-id = {leader.user_id} title = {'Email: '+leader.email}>
                  <button onClick = {(e) => {demoteLeader(e)}} className = 'manage-team-btn' title = 'demote to user'>
                    &#9660;
                  </button> 
                  <span>&nbsp;&nbsp;</span> 
                  <div className = 'manage-member-name'>
                    {leader.first_name}{' '}{leader.last_name}
                  </div>
                </div>
              ))}
            </div>
            </div>
        </div>

        <div id = 'manage-members'>
          <div style = {{'fontFamily':'Rubikmed', marginBottom:'8px'}} className = 'normal-text'>Members ({members.length})</div>
          <div className="manage-entry-list">
            {members.map((member) => (
              <div key = {member.user_id} className = 'manage-entry normal-text' data-id = {member.user_id} title={'Email: '+member.email}>
                <button onClick = {(e) => {promoteMember(e)}} className = 'manage-team-btn' title = 'promote to leader'>
                  &#9650;
                </button>
                <button onClick = {(e) => {removeMember(e)}} className = 'manage-team-btn' title = 'remove member'>
                  &#10006;
                </button> 
                <span>&nbsp;</span>
                <div id = 'leader-name' className = 'manage-member-name'>{member.first_name}{' '}{member.last_name}</div>
              </div>
            ))}
          </div>
        </div>

        <div id = 'manage-add-member'>          
          <span style = {{'fontFamily':'Rubikmed'}} className = 'normal-text'>Add members</span>
          {token
          ? <div style={{paddingBottom:'16px'}}>
              <input 
                type = 'text'
                id = 'manage-add-email'
                style={{marginTop:'13px', marginBottom:'13px'}}
                value={process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/jointeam?tok='+token}
                onFocus={(e)=>{e.target.select()}}
                className = 'small-text new-team-entry'
                readOnly/>
              <div className='small-text'>
                Every user with the link will be able to join the group until you invalidate it
              </div>
              <button onClick={(e)=>{handleToken(e, true)}} style={{backgroundColor:'red', width: 'auto', margin:'auto', marginTop:'16px', marginBottom:'16px'}} className = 'normal-btn manage-teamname-btn'>
                Invalidate link <Buttonwait color={'#ffffff'} />
              </button>
            </div>
          :<div style={{paddingBottom:'16px'}}>
            <button onClick={(e)=>{handleToken(e, false)}} style={{marginBottom:'16px'}} className = 'normal-btn manage-teamname-btn'>
              Generate invitation link <Buttonwait color={'#ffffff'} />
            </button>
          </div>
          }
          <form id = 'manage-new-member-form'>
                <input type = 'email'
                    name = 'manage-add-email' 
                    id = 'manage-add-email'
                    className = 'normal-text new-team-entry'
                    placeholder = 'New member email'
                    style={{}}
                    autoComplete = 'off'/>

                <button 
                  onClick = {(e) => {handleNewMember(e)}}
                  type = 'submit'  
                  className = 'normal-btn manage-teamname-btn'>
                  Add
                  <Buttonwait color = {'#ffffff'} />
                </button>
            </form>
            <div id = 'manage-duplicate-alert' className = 'normal-text'>This person is already in the team</div>
        </div>

        <div id = 'manage-pending'>
          <div style = {{'fontFamily':'Rubikmed', 'width': '100%'}} className = 'normal-text'>Pending invitations ({pending.length})</div>
          <div className="manage-entry-list">
            {pending.map((email) => (
              <div key = {email} className = 'normal-text manage-entry'>
                <button onClick = {(e) => {removePendingUser(e)}} className = 'manage-team-btn' title = 'withdraw invitation'>
                  &#10006;
                </button> 
                <span>&nbsp;</span>
                <div className = 'email-value'>{email}</div>
              </div>
            ))}
          </div>
        </div>

        <div id = 'manage-include-scores'>
          <input type="checkbox" onClick = {(e) => {handleScores(e)}} defaultChecked = {props.team.leaders_scores} id= 'include-scores-btn' name= 'include-scores-btn' value = 'doinclude' />
          <label htmlFor = "include-scores-btn" id = 'include-scores-lab' style={{marginLeft:'8px'}}>Include leaders' scores in aggregate assessment results</label>
        </div>

        <div id = 'delete-team'>
          <button onClick = {(e) => {deleteTeam(e)}} className = 'normal-btn manage-teamname-btn' id = 'delete-team-btn'>
            Delete team
            <Buttonwait color={'#ffffff'} />
          </button>
        </div>
      </div>
      </div>
    </div>

      //maybe add option to allow a user to see the history and the single evaluations
      //even if they are not members (e.g. another supervisor) -> possibly a premium feature
  )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const { query } = context
    const team_id = parseInt(query.teamId)

    if (!session) {
      return {
        redirect: {
          destination: '/accessrequired?p='+context.resolvedUrl,
          permanent: false,
        },
      }
    } else {
      
    const user_id = session.user.id

    const isLeader = await prisma.members.findFirst({
      where: {
        group_id: team_id,
        user_id: user_id,
        isadmin: true
      }
    })

    if (!isLeader) {
      return {
          redirect: {
            destination: '/unauthorized',
            permanent: false,
          },
        }        
    }
  }

  const team2 = await prisma.groups.findUnique({
    select: {
      name: true,
      leaders_scores: true,
      invite_token: true
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
      group_id: team_id      
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
      email: true,
    },
    where: {
      user_id: {
        in: leaders_id
      }
    }
  })
  var members = await prisma.users.findMany({
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      email:true
    },
    where: {
      user_id: {
        in: members_id
      }
    }
  })
  var pending = []
  var pending_users = await prisma.invitations_user.findMany({
    select: {
      user_id: true
    },
    where: {
      group_id: team_id
    }
  })

  for (var i in pending_users) {
    const id = pending_users[i].user_id
    const email = await prisma.users.findUnique({
      select: {
        email: true
      },
      where: {
        user_id: id
      }
    })
    pending.push(email.email)
  }

  const pending_unreg = await prisma.invitations_unregistered.findMany({
    select: {
      email: true
    },
    where: {
      group_id: team_id
    }
  })

  pending_unreg.map(
    function(el) {
      pending.push(el.email)
    }
  )

  const team = {
    ...team2,
    leaders: leaders,
    members: members,
    pending: pending
  }

    var email_lst = []
    for (const email in team.pending) {
      email_lst.push(team.pending[email])
    }
    for (const leader in team.leaders) {
      email_lst.push(team.leaders[leader].email)
    }
    for (const member in team.members) {
      email_lst.push(team.members[member].email)
    }
  
    return {
      props: { 
              data: session, 
              team: team,
              userId: session.user.id,
              query: query,
              email_lst: email_lst
              }
    }
  }