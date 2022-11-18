import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect} from "react";

import 'w3-css/w3.css';

import Buttonwait from "../buttonwait";

import menu from '../../public/images/menu.svg'

export default function Header(props){

  const router = useRouter()

  const session = props.session

  //handles possible login URL callbacks passed to the component
  let loginLink

  var callbackUrl = props.callbackUrl
  if(!callbackUrl) {
    loginLink = '/login'
  } else {
    loginLink = '/login?callbackUrl='+callbackUrl
  }

  function handleSmallMenu() {
    //show non-user pages menu on btn click
    document.getElementById('user-menu-mod').style.display = 'none'
    var navBar = document.getElementById('small-header')

    if (!navBar.className.includes('w3-show')) {
      navBar.className += ' w3-show'
    } else {
      navBar.className = navBar.className.replace(' w3-show', '')
    }
  }

  function handleModal() {
      //show user pages menu on btn click      
      var navBar = document.getElementById('small-header')

      if (navBar.className.includes('w3-show')) {
      navBar.className = navBar.className.replace(' w3-show', '')
      }

      var mod = document.getElementById('user-menu-mod').style.display

      if (mod == 'block') {
        document.getElementById('user-menu-mod').style.display = 'none'
      } else {
        document.getElementById('user-menu-mod').style.display='block'
      }
  }

  useEffect(()=>{
    //close modal when click outside of it is detected
    var modal = document.getElementById('user-menu-mod');
    window.onclick = function(event) {
      if (event.target == modal || (modal.style.display=='block' && event.target == document.getElementById('main-header'))) {
        modal.style.display = "none";
      }
    }
  })

  return (
      
    <div id='header' className="w3-mobile">
      <div id = 'main-header'className="w3-bar">

        <Link href = '/'>
          <a className = 'w3-bar-item' id = 'header-title'>
            Agility Hub            
          </a>
        </Link>

        <Link href = '/'>
          <a className = 'link  w3-bar-item w3-hide-small'>
            Home
          </a>
        </Link>

        <Link href = '/data'>
          <a className = 'link  w3-bar-item w3-hide-small'>
            Data
          </a>
        </Link>

        <Link href = '/articles'>
          <a className = 'link  w3-bar-item w3-hide-small'>
            Articles
          </a>
        </Link>

        <Link href = '/about'>
          <a className = 'link  w3-bar-item w3-hide-small'>
            About
          </a>
        </Link>

        <Link href = '/contact'>
          <a className = 'link  w3-bar-item w3-hide-small'>
            Contact
          </a>
        </Link>

        <div className="w3-bar-item w3-hide-medium w3-hide-large"/>

        <div className="w3-bar-item w3-hide-medium w3-hide-large" onClick={()=>{handleSmallMenu()}} id='menu-btn'>
          <Image 
            src = {menu}
            layout="responsive" 
            priority={true}/>
        </div>

        {session
        ?<button onClick = {handleModal} className="w3-bar-item" id = 'user-options-button'>
          {session.user.image
          ?<div id='user-image'>
            <Image
              src={session.user.image} 
              width='100%'
              height='100%'
              layout="responsive"
              objectFit="cover"
              priority={true}
              />
          </div>
          :null
          }
          {session.user.initials}
        </button>
        :<button onClick = {(e)=>{e.target.children[0].classList.remove('w3-hide'); router.push(loginLink)}} className='w3-bar-item' id = 'log-in-button'>
          Log In <Buttonwait color={'#ffffff'} />
        </button>}

      </div>

      <div id = 'small-header' className="w3-bar-block w3-hide-large w3-hide w3-hide-medium w3-top">
        <Link href = '/'>
          <a className = 'link w3-bar-item w3-border' onClick={handleSmallMenu}>
            Home
          </a>
        </Link>

        <Link href = '/data'>
          <a className = 'link w3-bar-item  w3-border-left w3-border-right' onClick={handleSmallMenu}>
            Data
          </a>
        </Link>

        <Link href = '/articles'>
          <a className = 'link w3-bar-item w3-border' onClick={handleSmallMenu}>
            Articles
          </a>
        </Link>

        <Link href = '/about'>
          <a className = 'link w3-bar-item  w3-border-left w3-border-right' onClick={handleSmallMenu} id = 'about_'>
            About us
          </a>
        </Link>

        <Link href = '/contact'>
          <a className = 'link  w3-bar-item w3-border' onClick={handleSmallMenu}>
            Contact
          </a>
        </Link>
      </div>

      <div id = 'user-menu-mod' className="w3-modal">
        <div id = 'user-menu' className="w3-modal-content w3-modal-container w3-animate-right w3-hide-small w3-border">
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/team_assessment/open')}} className = 'user-menu-btn w3-border'>
            Assessments <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/teams')}} className = 'user-menu-btn w3-border-left w3-border-right'>
            Teams <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/history')}} className = 'user-menu-btn  w3-border'>
            History <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/feedback')}} className = 'user-menu-btn w3-border-left w3-border-right'>
            Feedback <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/account') }} className = 'user-menu-btn w3-border'>
            Account <Buttonwait color={'#283747'} />
          </button>
          <button className = 'user-menu-btn w3-border-left w3-border-right w3-border-bottom' onClick = {signOut}>
            Log out
          </button>
        </div>
        <div id = 'user-menu-small' className="w3-modal-content w3-modal-container w3-animate-right w3-hide-large w3-hide-medium w3-bar-block">
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/team_assessment/open')}} className = 'w3-bar-item w3-border'>
            Assessments <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/teams')}} className = 'w3-bar-item w3-border'>
            Teams <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/history')}} className = 'w3-bar-item w3-border'>
            History <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/feedback')}} className = 'w3-bar-item w3-border-left w3-border-right'>
            Feedback <Buttonwait color={'#283747'} />
          </button>
          <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/account')}} className = 'w3-bar-item w3-border'>
            Account <Buttonwait color={'#283747'} />
          </button>
          <button className = 'w3-bar-item w3-border-left w3-border-right w3-border-bottom'  onClick = {signOut}>
            Log out
          </button>
        </div>
      </div>
    </div>
  )
};

export async function getServerSideProps(context) {
  const session = await getSession(context)

  return {
    props: { 
      data: session
    }
  }
}