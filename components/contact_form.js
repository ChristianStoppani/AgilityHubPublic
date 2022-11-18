import {useState} from "react";
import Buttonwait from "./buttonwait";

export default function Contact() {

    function looksLikeMail(str) {
      //check email validity
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    const [counter, setCounter] = useState(0)

    function handleChange(e) {
      //update char counter
        setMessage(e.target.value);
        var len = e.target.value.length
        setCounter(len);
      }

    async function handleSubmit(e) { 
      //check validity of submission and send
        e.preventDefault()
        e.target.children[0].classList.remove('w3-hide')

        if (!message.replace(/\s/g, '').length || !name.replace(/\s/g, '').length || !email.replace(/\s/g, '').length ) {
            alert('In order to submit the message, all fields must be compiled.')
        }

        else if (looksLikeMail(email) == false) {
            alert('Invalid email.')
        }

        else {
            let data = {
                name,
                email,
                message
            }
            try {
              fetch('/api/sendgrid/contactform', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
              })

              document.getElementById("contact-form").reset()
              setName('')
              setEmail('')
              setMessage('')
              document.getElementById('contact-form').classList.add('w3-hide')
              document.getElementById('conf-msg').classList.remove('w3-hide')
              window.scrollTo(0,0)
            } catch (error) {
              e.target.children[0].classList.add('w3-hide')
              document.getElementById('no-conf-msg').classList.remove('w3-hide')
              console.error(error)
            }
        }
    }


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    return (
      <>
        <div id='conf-msg' className="w3-hide"> Contact request submitted successfully!</div>
        <form id = 'contact-form'>
          <div id = 'form-title'> Send us a message: </div>
          <br />
          <div id='no-conf-msg' className="w3-hide" style={{display:'block'}}> 
            Something went wrong, your request could not be submitted. If the error persists send an email directly to <a href='mailto:contact@agilityhub.ch'>contact@agilityhub.ch</a>
          </div>
          <br />
              <div className = 'contact-name'>
                <label htmlFor = 'name' className = 'label'>
                  Name<div style = {{color:'red'}}>*</div>: 
                </label>
                <div className = 'field-container'>
                  <input type = 'text' 
                    onChange = {(e) => {setName(e.target.value)}} 
                    name = 'name' 
                    className = 'field' 
                    placeholder = 'Name'/>
                </div>
              </ div>

              <div className = 'contact-email'>
                <label htmlFor = 'email' className = 'label'>
                  Email<div style = {{color:'red'}}>*</div>: 
                </label>
                <div className = 'field-container'>
                  <input type = 'email' 
                    onChange = {(e) => {setEmail(e.target.value.toLowerCase())}} 
                    name = 'email' 
                    className = 'field' 
                    placeholder = 'Email'/>
                </div>
              </ div>

              <div className = 'contact-msg'>
                <label htmlFor = 'message' className = 'msg-label'>
                  Message<div style = {{color:'red'}}>*</div>: 
                </label>
                <div id = 'msg-field-container'>
                  <textarea name = 'message' 
                    id = 'msg-field' 
                    rows = '10' 
                    maxLength = '500' 
                    placeholder = 'Message'
                    onChange= {handleChange} />
                </div> 
              </ div>

              <div id="count">
                <span id="current_count">
                  {counter}
                </span>
                <span id="maximum_count">
                  /500
                </span>
              </div>

              <button type = 'submit' 
                onClick={(e)=>{handleSubmit(e)}} 
                className = 'contact-submit'>
                  Send <Buttonwait color={'#f3f3f3'} />
                </button>
            </form>
      </>
    )
}