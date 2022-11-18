import Link from "next/link";
import Image from "next/image";
import Head from 'next/head';
import { getSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { prisma } from '../components/db';

var util = require('util')
import 'w3-css/w3.css';

import home_btn from '../public/images/Home_button_75.svg';
import pencil from '../public/images/pencil.svg';
import Sectorsel from "../components/sectorsel";
import Countrysel from '../components/countrysel';
import { useRouter } from "next/router";
import Buttonwait from "../components/buttonwait";

export default function account(props) {

  const linkedin = props.linkedin

  const router = useRouter()

  const pic = props.data.user.image

  const [proPicURL, setProPicURL] = useState(pic)

  const [changedEmail, setChangedEmail] = useState(props.newEmail)

  useEffect(() => {
    if (changedEmail) {
      document.getElementById('acc-change-email-btn').style.display = 'none'
  }},[])

  function formatDate(date) {
    const dobSplit = date.split('-')
    const dob = dobSplit[2]+'.'+dobSplit[1]+'.'+dobSplit[0]
    return dob
  }

  async function handlePropic(e) {
    e.preventDefault()
    const tempPic = e.target.files[0]

    if (tempPic){
      const tempName = String(tempPic.name)
      var extension = tempName.substring(tempName.lastIndexOf(".")).toLowerCase();
      if (extension != '.jpg' && extension != '.jpeg' && extension != '.png') {
        alert('Supported formats: .jpg, .jpeg, and .png')
      } else if (tempPic.size > 1024 * 1024 * 4) {
        alert('Maximum image size: 4MB')
      } else {
        document.getElementById('pic-opt').style.display = 'none'
        document.getElementById('img-change-wait').classList.remove('w3-hide')
        document.getElementById('img-change-conf').className = 'w3-hide'
        try {
          var user_id = props.data.user.id
          var ext = tempPic.name.substr(tempPic.name.lastIndexOf("."));
          var name = 'user_' + user_id
          var type = tempPic.type

          const body = { name }
          const response = await fetch('/api/s3/upload', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })

          const res = await response.json();

          var url = res.url


          const upload = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': type,
              'Access-Control-Allow-Origin': '*'
            },
            body: tempPic
          })

          url = 'https://d3fvvuitj8zqyl.cloudfront.net/'+name
          //url = 'https://agilityhubpp.s3.eu-west-3.amazonaws.com/'+name

          const newimage_body = { user_id, url  }
          const newimage_response = await fetch('api/user/change/newimage', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newimage_body),
          })
          const newimage_res = await newimage_response.json()
          setProPicURL(URL.createObjectURL(tempPic))
          document.getElementById('img-change-wait').classList.add('w3-hide')
          document.getElementById('img-change-conf').classList.remove('w3-hide')
      } catch (error) {
        console.error(error)
      }
      }
    }
  }
  
  function handleClick(e) {
    var mod = document.getElementById('pic-opt').style.display

    if (mod == 'flex'){
      document.getElementById('pic-opt').style.display = 'none'
    } else {
      document.getElementById('pic-opt').style.display = 'flex'
    }
  }

  async function removePic(e) {
    e.preventDefault()
    document.getElementById('pic-opt').style.display = 'none'
    document.getElementById('img-change-wait').classList.remove('w3-hide')
    document.getElementById('img-change-conf').className = 'w3-hide'
    try {
      const user_id = props.data.user.id
      const body = { user_id }
      const response = await fetch('api/user/change/removeimage', {
        method:'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }) 
      setProPicURL(null)   
      document.getElementById('img-change-wait').classList.add('w3-hide')
      document.getElementById('img-change-conf').classList.remove('w3-hide')
    } catch (error) {
      console.error(error)
    }



    document.getElementById('pic-opt').style.display = 'none'
  }

  function cancelUpdate(e) {
    e.preventDefault()

    document.getElementById('acc-work-data').style.display='block'; 
    document.getElementById('acc-work-data-change').style.display='none'

    document.getElementById('acc-work-data-change').reset()
  }

  async function updateChanges(e) {
    e.preventDefault()
    e.target.children[0].classList.remove('w3-hide')
    const form = document.getElementById('acc-work-data-change')
    const division = form.elements[3].value.replace(/\s+/g, '')==''?'none':form.elements[3].value
    const data = {
      country: form.elements[0].value,
      education: form.elements[1].value,
      field: form.elements[2].value,
      division: division,
      position: form.elements[4].value
    }
    const old_data = {
      country: props.uinfo.country,
      education: props.uinfo.education,
      field: props.uinfo.field,
      division: props.uinfo.division,
      position: props.uinfo.position
    }
    if (JSON.stringify(data)==JSON.stringify(old_data)) {
      cancelUpdate(e)
      e.target.children[0].classList.add('w3-hide')
    } else {
      try {
        const user_id = props.data.user.id
        const body = { data, user_id }
        const response = await fetch('api/user/change/profile', {
          method:'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(body),
        })
        router.reload()
      } catch (error) {
        console.error(error)
      }
    }
  }

  function changeEmail(e) {
    document.getElementById('acc-change-email').style.display = 'flex'
    document.getElementById('acc-change-email-btn').style.display = 'none'
  }

  function closeEmail(e) {
    document.getElementById('acc-change-email').style.display = 'none'
    document.getElementById('acc-change-email-btn').style.display = 'flex'
  }

  function looksLikeMail(str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
  }

  async function findEmail(e, wait, email){
    e.preventDefault()
    try {
        const returnUser = false
        const body = { email, returnUser }
        let response = await fetch('api/user/findemail', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const result = await response.json()
        if (!result) {
          newEmail2(e, wait, email)
        } else {
          wait.classList.add('w3-hide')
          alert('This email address is already associated with an existing user account.')
        }
        
    } catch (error) {
        console.error(error)
    }
  }

  const submitEmail = async (e, wait, entry) => {
    e.preventDefault()
        const body = { entry }
        await fetch('api/user/change/email', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const confirmation_link = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/confirmemail?tok='+entry.token
        const emailbody = {
          email: entry.new_email, 
          user_id: entry.user_id, 
          confirmation_link
        }
        fetch('api/sendgrid/changeemail', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(emailbody),
        })
    wait.classList.add('w3-hide');
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

  function newEmail(e) {    
    const wait = e.target.children[0]
    var email = document.getElementById('acc-new-email').value.toLowerCase()

    if (looksLikeMail(email)) {
      if (email == props.uinfo.email) {
        alert('New email is the same as the old one')
      } else {
        wait.classList.remove('w3-hide');
        findEmail(e, wait, email)
      }
    } else {
      alert('Invalid email')
    }
  }

  function newEmail2(e, wait, email) { 
    setChangedEmail(email)
    const token = generateString(e, props.emailTokens)

    const entry = {
      user_id: props.data.user.id,
      token: token,
      new_email: email
    }
    submitEmail(e, wait, entry)
    document.getElementById('acc-change-email-confirm').style.display = 'flex'
    document.getElementById('acc-change-email').style.display = 'none'
  }

  async function handleChangePW(e) {
    e.target.children[0].classList.remove('w3-hide');
    const token = generateString(e, props.pwTokens)

    const entry = {
      user_id: props.data.user.id,
      token: token
    }
        const body = { entry }
        await fetch('api/user/change/changepassworddb', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const confirmation_link = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/changepassword?tok='+entry.token
        const emailbody = {
          user_id: entry.user_id, 
          confirmation_link
        }
        fetch('api/sendgrid/resetpw', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(emailbody),
        })

      document.getElementById('acc-change-pw-confirm').style.display = 'flex'
      e.target.children[0].classList.add('w3-hide');
  }

  async function deleteAccount(e) {
    var conf = confirm("Oh no, we are sorry to see you go! Please confirm below to irreversibly delete your account.")
    if (conf) {
      e.target.children[0].classList.remove('w3-hide')
      try {
        const user_id = props.data.user.id
        const body = { user_id }
        const response = await fetch('api/user/delete', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const res = await response.json()
        const emailbody = { email: props.data.user.email, first_name: props.data.user.name }
        fetch('api/sendgrid/deleteuser', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(emailbody),
        })
        signOut({callbackUrl:'/accountdeleted'})
      } catch (error) {
        console.error(error)
        e.target.children[0].classList.add('w3-hide')
        alert('Oh no, something went wrong.')
      }
    }
  }

  function updateLogin(e) {
    e.preventDefault(e)
    if (linkedin) {
      signOut({redirect:false})
      signIn('linkedin', {callbackUrl:'/account'})
    } else {
      signIn('credentials', { update: true, user_id: props.data.user.id, callbackUrl:'/account' })
    }
  }

  return (
    <div id = 'account-page'>
      <Head>
        <title>Account | Agility Hub</title>
      </Head>

      <div id='account-bar' className="w3-bar">
        <div id = 'account-title' className="w3-bar-item">
          Account
        </div>

        <Link href = '/'>
          <a id = 'acc-home-btn' className="w3-bar-item w3-right">
            <Image
              src = {home_btn}
              layout = 'responsive' />
          </a>
        </Link>  
      </div>

      <div id = 'propic-container'>
        <div id = 'propic-frame'>
          {proPicURL == null
          ? <>{props.data.user.initials}</>
          : <div id='propic-img'>
              <Image 
              width='100%'
              height='100%'
              layout="responsive"
              objectFit="cover"
              src={proPicURL} />
            </div>}
        </div>
      </div>

      <form id='pic-form'>
        <input name = 'propic' 
          onClick={(e)=>{e.target.value = null}} 
          onChange={(e)=>{handlePropic(e)}} 
          id ='propic' 
          type = 'file' 
          accept=".png,.jpg,.jpeg"
          />
        <div id = 'propic-label-bg' />
        <div title='modify profile picture'
          id = 'propic-btn'
          onClick={(e)=>{handleClick(e)}}>
          <Image
            src = {pencil}
            layout = 'responsive' />  
        </div>
        <div id ='pic-opt'>
          <label htmlFor="propic">
            <div className="propic-opt" id = 'propic-label'>New</div>
          </label>
          {proPicURL == null
          ? null
          : <button onClick = {(e)=>{removePic(e)}}className="propic-opt">
            Remove
          </button>}
        </div>
        <div id='img-change-wait' className="w3-hide wait"/>
        <div id='img-change-conf' className="w3-hide">
          The image was updated successfully, to see the changes log in again by clicking <button id="update-login" onClick={(e)=>{updateLogin(e)}}>here</button> and wait a few minutes
        </div>
      </form>
        
      <div id = 'account-data-container'>
        <div id = 'account-data'>
        <div id = 'acc-name'> 
          <div className="acc-lab">Name:</div>
          <div className='acc-data'>{props.uinfo.first_name + ' ' + props.uinfo.last_name}</div>
        </div>
        <div id = 'acc-dob'> 
          <div className="acc-lab">Date of birth:</div>
          <div className='acc-data'>{formatDate(props.uinfo.dob)}</div>
        </div>
        <div id = 'acc-dob'> 
          <div className="acc-lab">Gender:</div>
          <div className='acc-data'>{props.uinfo.sex}</div>
        </div>

        <div id = 'acc-work-data'>
          <div id = 'acc-country'> 
            <div className="acc-lab">Work country:</div>
            <div className='acc-data'>{props.uinfo.country}</div>
          </div>
          <div id = 'acc-edu'> 
            <div className="acc-lab">Education:</div>
            <div className='acc-data'>{props.uinfo.education}</div>
          </div>
          <div id = 'acc-field'> 
            <div className="acc-lab">Field:</div>
            <div className='acc-data'>{props.uinfo.field}</div>
          </div>
          <div id = 'acc-div'> 
            <div className="acc-lab">Division:</div>
            <div className='acc-data'>{props.uinfo.division=='none' ?null :props.uinfo.division}</div>
          </div>
          <div id = 'acc-position'> 
            <div className="acc-lab">Current position:</div>
            <div className='acc-data'>{props.uinfo.position}</div>
          </div>
          <button onClick = {
            (e) => {
              document.getElementById('acc-work-data').style.display='none'; 
              document.getElementById('acc-work-data-change').style.display='block'
            }}
            className='acc-btn normal-btn'>
              Update account information
          </button>
        </div>

        <form id = 'acc-work-data-change'>
          <label id = 'country-lab' className = 'acc-label-field' htmlFor = 'country'>Work country:</label>
            <select defaultValue={props.uinfo.country} name="country" id="country" className = 'acc-entry-field'>
                <Countrysel />
            </select>
            <label id = 'education-lab' className = 'acc-label-field' htmlFor = 'education'>Education:</label>
            <select defaultValue = {props.uinfo.education} name="education" id="education" className = 'acc-entry-field'>
                <option value= 'default' hidden = {true} disabled >select</option>
                <option value = 'Apprenticeship'>Apprenticeship</option>
                <option value = 'High school'>High school</option>
                <option value = 'Bachelor'>Bachelor Degree</option>
                <option value = 'Master'>Master's Degree</option>
                <option value = 'PhD'>Doctor of Philosophy (PhD)</option>
            </select>
            <label id = 'sector-lab' className = 'acc-label-field' htmlFor = 'sector'>Professional field:</label>
            <select defaultValue = {props.uinfo.field} name = 'sector' id = 'sector' className = 'acc-entry-field' autoComplete = 'false'>
                <Sectorsel />
            </select>
            <label id = 'division-lab' className = 'acc-label-field' htmlFor = 'division'>Division:</label>
            <input type = 'text'
                name = 'division'
                id = 'division'
                className = 'acc-entry-field'
                defaultValue = {props.uinfo.division=='none' ? null :props.uinfo.division}/>
            <label id = 'position-lab' className = 'acc-label-field' htmlFor = 'position'>Current position:</label>
            <input type = 'text'
                name = 'position'
                id = 'position'
                defaultValue = {props.uinfo.position}
                className = 'acc-entry-field'
                required/>
            <div id = 'acc-update-btns'>
            <button className="normal-btn acc-email-btn" type="submit" onClick={(e)=>{updateChanges(e)}}>
              Save changes <Buttonwait color={'#ffffff'} /> 
            </button>
            <button className="normal-btn acc-email-btn" onClick={(e) => {cancelUpdate(e)}} style = {{backgroundColor:'#e9e9e9', color:'#283747', border:'1px solid #283747'}}>Cancel</button>
            </div>
        </form>
        
        {linkedin
        ? <div id = 'acc-email'> 
        <div className="acc-lab">Linkedin email:</div>
        <div className='acc-data' style={{color:'grey'}}>{props.uinfo.email}</div>
        </div> 
        :<><div id = 'acc-email'> 
        <div className="acc-lab">Email:</div>
        <div className='acc-data' >{props.uinfo.email}</div>
        </div> 
        {changedEmail
          ? <div id='await-email' className="normal-text">(Awaiting confirmation for {changedEmail})</div>
          : null}
        <button 
          className= 'normal-btn acc-btn' 
          id = 'acc-change-email-btn'
          onClick={(e)=>{changeEmail(e)}}>Change email</button>
        <div id="acc-change-email">
          <input 
            type='email'
            id="acc-new-email"
            placeholder="New email"/>
          <button 
            className="normal-btn acc-email-btn"
            style = {{backgroundColor:'#e9e9e9', color:'#283747', border:'1px solid #283747'}}
            onClick={(e)=>{closeEmail(e)}}>Cancel</button>
          <button 
            className="normal-btn acc-email-btn"
            onClick={(e)=>{newEmail(e)}}>
              Modify <Buttonwait color={'#ffffff'} />
            </button>
        </div>
        <div id="acc-change-email-confirm">
          A confirmation email has been sent to {changedEmail}. Your new email address will only be saved once you confirm it.
          <button 
            onClick={(e)=>{document.getElementById('acc-change-email-confirm').style.display = 'none'}}
            id = 'acc-confirm-close'>
              &#10006;
          </button>
        </div></>}

        {linkedin
        ? null
        : <><button 
          id = 'acc-change-pw'
          className="acc-btn normal-btn"
          onClick={(e)=>{handleChangePW(e)}}>
            Change password <Buttonwait color={'#ffffff'} />
        </button>
        <div id="acc-change-pw-confirm">
          A password reset link has been sent to your email address.
          <button 
            onClick={(e)=>{document.getElementById('acc-change-pw-confirm').style.display = 'none'}}
            id = 'acc-confirm-close'>
              &#10006;
          </button>
        </div></>}

        <div style={{display:'flex', flexDirection:'column', marginBottom:'10vh', alignItems:'center'}}>
        <button
          className='acc-btn normal-btn'
          id="acc-del-btn"
          onClick={(e)=>{deleteAccount(e)}}>
            Delete account <Buttonwait color={'#ffffff'} />
        </button>
        </div>
        
      </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    
    var uinfo = null 
    var linkedin = null
  
    if (!session) {
        return {
          redirect: {
            destination: '/accessrequired?p='+context.resolvedUrl,
            permanent: false,
          },
        }
      } else {
        //user info queries
        const user = await prisma.users.findUnique({
          select: {
            first_name: true,
            last_name: true,
            email: true,
            linkedin_id: true
          },
          where: { 
            user_id: session.user.id
          }
        })
        if (user.linkedin_id) {
          linkedin = true
        } else {
          linkedin = false
        }
        const profile = await prisma.profiles.findUnique({
          where: {
            user_id: session.user.id
          }
        })    
        uinfo = {
          ...user,
          ...profile
        }
        
        //email change queries
        const delOldEmail = await prisma.changes_email.deleteMany({
          where: {
            expires_at: {
              lt: new Date()
            }}
          })
        var emailChanges = await prisma.changes_email.findFirst({
          select: {
            new_email: true
          },
          where: {
            user_id: session.user.id
          }
        })
        var emailTokens = await prisma.changes_email.findMany({
          select: {
            token: true
          }
        })
        var newEmail = null
        if (emailChanges) {
          newEmail = emailChanges.new_email
        }

        //pw change queries
        const delOldPw = await prisma.changes_pw.deleteMany({
          where: {
            expires_at: {
              lt: new Date()
            }}
          })
        var pwTokens = await prisma.changes_pw.findMany({
          select: {
            token: true
          }
        })
      }
  
    return {
      props: { 
          data: session, 
          uinfo: uinfo,
          newEmail: newEmail,
          emailTokens: emailTokens,
          pwTokens: pwTokens,
          linkedin: linkedin,
          }
    }
  }