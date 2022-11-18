import Head from 'next/head'
import { getSession } from 'next-auth/react';
import Link from 'next/link';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import Headersep from '../components/layout/header_sep'
import Buttonwait from '../components/buttonwait';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function feedback(props) {

    function handleAnsArray(data) {
        var ansArray = {}
        var answered = false
        
        for (var [key, value] of data.entries()) {
            if (value==''){
                ansArray[key] = null
            } else {
                ansArray[key] = value
                answered = true
            }
        }
        return {ansArray, answered}
    }

    async function handleFeedback(e) {
        e.preventDefault()
        document.getElementById('feedback-submit').children[0].classList.remove('w3-hide')
        var form = document.getElementById('feedback-form')
        var data = new FormData(form)

        const {ansArray, answered} = handleAnsArray(data)

        if (ansArray.email_clarifications) {
            ansArray.email_clarifications = true
        } else {
            ansArray.email_clarifications = false
        }
        
        ansArray.user_id = props.data.user.id

        var body = { data: ansArray }

        if (answered) {
            try {
            let response = await fetch('/api/user/submitfeedback', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            const res = await response.json()
            document.getElementById('feedback-form').classList.add('w3-hide')
            document.getElementById('feedback-successful').classList.remove('w3-hide')
            window.scrollTo(0,0)
            } catch (error) {
            console.error(error)
            document.getElementById('feedback-submit').children[0].classList.add('w3-hide')
            alert('Uh oh, something went wrong')
            }
        } else {
            document.getElementById('feedback-submit').children[0].classList.add('w3-hide')
            document.getElementById('no-conf-msg').style.display = 'flex'
        }
    }
    return(
        <div id="feedback-page">
            <Head>
                <title>Feedback | Agility Hub</title>
            </Head>

            <Header session={props.data} />

            <div id='feedback-content'>
                <Headersep />

                <div className='title' style={{marginTop:'5vh'}}>
                    Feedback
                </div>

                <div id='feedback-text'>
                    <p align='justify'>
                        First and foremost, thanks a lot for using the Agility Hub and agreeing to provide feedback! 
                        As you might have read on the <Link href='/about'><a target={'_blank'} style={{color:'purple', textDecoration:'underline'}}>
                            About page</a></Link>,
                        this website is still in the testing phase, your contribution is thus very valuable 
                        as it will be incorporated into future versions. 
                    </p>
                    <p>
                    Thank you for your help,
                    </p>
                    <p style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        Christian Stoppani &nbsp; <a href='https://www.linkedin.com/in/christian-stoppani/' target={'_blank'}><FontAwesomeIcon icon='fa-brands fa-linkedin' size='xl'/></a> &nbsp; &nbsp; <a href='mailto:stoppanichris@gmail.com'><FontAwesomeIcon icon='fa-solid fa-envelope' size='xl'/></a>
                    </p>
                </div>
                
                <form onSubmit={(e) => {handleFeedback(e)}} id='feedback-form' name='feedback-form'> 
                    <div id='feedback-assessment'>
                        <div className='feedback-title'>
                            Assessment
                        </div>

                        <div>
                            <p className='normal-text'>Was the assessment helpful?</p>
                            <table id='helpful-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='1-very' name='asm_helpful' value='4' /></td>
                                        <td><input type='radio' name='asm_helpful' value='3'  /></td>
                                        <td><input type='radio' name='asm_helpful' value='2'  /></td>
                                        <td><input type='radio'name='asm_helpful' value='1'  /></td>
                                        <td><input type='radio' id='1-not' name='asm_helpful' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='1-very'>A lot</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='1-not'>Not at all</label></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'>Did you learn something new about organisational agility?</p>
                            <table id='learn-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='2-very' name='asm_learn' value='4' /></td>
                                        <td><input type='radio' name='asm_learn' value='3'  /></td>
                                        <td><input type='radio' name='asm_learn' value='2'  /></td>
                                        <td><input type='radio'name='asm_learn' value='1'  /></td>
                                        <td><input type='radio' id='2-not' name='asm_learn' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='2-very'>A lot</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='2-not'>Not at all</label></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'> How likely are you to recommend this webapp to other potential users?</p>
                            <table id='recommend-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='3-very' name='asm_recommend' value='4' /></td>
                                        <td><input type='radio' name='asm_recommend' value='3'  /></td>
                                        <td><input type='radio' name='asm_recommend' value='2'  /></td>
                                        <td><input type='radio'name='asm_recommend' value='1'  /></td>
                                        <td><input type='radio' id='3-not' name='asm_recommend' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='3-very'>Very</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='3-not'>Not at all</label></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'> Comments/suggestions:</p>
                            <textarea id='asm-comment' name='asm_comment' />
                        </div>
                    </div>

                    <div id='feedback-website'>
                        <div className='feedback-title'>
                            Website
                        </div> 

                        <div>
                            <p className='normal-text'>What is the main device type you used this web app on?</p>
                            <table id='use-table' className='feedback-table normal-text' >
                                <tbody><tr><td></td>
                                        <td><input type='radio' id='web-mobile' name='web_device' value='mobile' /></td>
                                        <td><input type='radio' id='web-tablet' name='web_device' value='tablet'  /></td>
                                        <td><input type='radio' id='web-pc' name='web_device' value='pc'  /></td>
                                        <td></td></tr>
                                    <tr><td></td>
                                        <td><label htmlFor='web-mobile'>Mobile phone</label></td>
                                        <td><label htmlFor='web-tablet'>Tablet</label></td>
                                        <td><label htmlFor='web-pc'>PC</label></td>
                                        <td></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'>Does the website work as expected? (consider whether the elements you interacted with worked properly)</p>
                            <table id='use-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='4-very' name='web_use' value='4' /></td>
                                        <td><input type='radio' name='web_use' value='3'  /></td>
                                        <td><input type='radio' name='web_use' value='2'  /></td>
                                        <td><input type='radio'name='web_use' value='1'  /></td>
                                        <td><input type='radio' id='4-not' name='web_use' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='4-very'>Very</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='4-not'>Not at all</label></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'>How would you rate the structure of the website? (consider how the pages are organised and connected)</p>
                            <table id='structure-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='5-very' name='web_structure' value='4' /></td>
                                        <td><input type='radio' name='web_structure' value='3'  /></td>
                                        <td><input type='radio' name='web_structure' value='2'  /></td>
                                        <td><input type='radio'name='web_structure' value='1'  /></td>
                                        <td><input type='radio' id='5-not' name='web_structure' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='5-very'>Very good</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='5-not'>Very bad</label></td></tr></tbody>
                            </table>
                        </div>

                        <div>
                            <p className='normal-text'> How would you rate the design and layout of the website?</p>
                            <table id='design-table' className='feedback-table normal-text'>
                                <tbody><tr><td><input type='radio' id='6-very' name='web_design' value='4' /></td>
                                        <td><input type='radio' name='web_design' value='3'  /></td>
                                        <td><input type='radio' name='web_design' value='2'  /></td>
                                        <td><input type='radio'name='web_design' value='1'  /></td>
                                        <td><input type='radio' id='6-not' name='web_design' value='0'  /></td></tr>
                                    <tr><td><label htmlFor='6-very'>Very good</label></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><label htmlFor='6-not'>Very bad</label></td></tr></tbody>
                            </table>
                        </div>

                        <div style={{marginBottom:'5vh'}}>
                            <p className='normal-text'> Comments/suggestions: <br/>
                                If you encountered weird behaviours or errors, please give more details such as what you were trying to do and the device you were using. 
                            </p>
                            <textarea id='web-comment' name='web_comment' />
                        </div>
                    </div>

                    <div id='fedback-cb-container'>
                        <input type='checkbox' id='feedback-cb' name='email_clarifications'/>
                        <label htmlFor='feedback-cb'  style={{marginLeft:'16px'}}>Are you willing to be contacted by email, should further clarifications be necessary?</label>
                    </div>

                    <button type='submit' id='feedback-submit' className='normal-btn'>
                        Submit
                        <Buttonwait color={'#ffffff'} />
                    </button>
                    <div id='no-conf-msg' style={{marginTop:'16px', display:'none'}}>You didn't answer any question.</div>

                    <div style={{display:'none'}}>
                        <input type='radio' name='asm_helpful' defaultChecked value='' />
                        <input type='radio' name='asm_learn' defaultChecked value='' />
                        <input type='radio' name='asm_recommend' defaultChecked value='' />
                        <input type='radio' name='web_use' defaultChecked value='' />
                        <input type='radio' name='web_structure' defaultChecked value='' />
                        <input type='radio' name='web_design' defaultChecked value='' />
                        <input type='radio' name='web_device' defaultChecked value='' />
                    </div>
                </form>
                <div id='feedback-successful' className='w3-hide'>
                    Your feedback was submitted successfully, thank you!
                </div>
            </div>

            <Footer />

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
      props: { 
          data: session,
        }
    }
  }