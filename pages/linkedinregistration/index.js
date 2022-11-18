import { getSession, signOut } from "next-auth/react";
import Link from 'next/link';
import React, { useEffect, useState, setState } from "react";
import { useRouter } from 'next/router';
import { prisma } from '../../components/db'


import Countrysel from "../../components/countrysel";
import Sectorsel from "../../components/sectorsel";
import AlreadySignedIn from "../../components/access/alreadysignedin";
import Head from "next/head";

export default function linkedin(props) {
  
    const router = useRouter();

    const privacyPolicyURL = '/privacypolicy'
    const termsURL = '/termsofservice'
    const cookieURL = '/cookiepolicy'

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    //set max date of birth
    var date = new Date();
    var yearmax = date.getFullYear() - 14;
    var yearmin = date.getFullYear() - 75;
    var month = date.getMonth()+1;
    var day = date.getDay();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    const maxdate = yearmax + '-' + month + '-' + day;
    const mindate = yearmin + '-' + month + '-' + day;

    const [checked, setChecked] = useState(false)

    const [signupdisabled, setSignupdisabled] = useState(true)
  
    function handleCheckbox() {
        const checkbox = document.getElementById('privacy-btn')

        if (checkbox.checked) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }

    useEffect(() => {
        if (checked) {
            setSignupdisabled(false)
        } else {
            setSignupdisabled(true)
        }
    })

    const submitUser = async (e, newProfile) => {
        e.preventDefault()
        try {
            const body = { newProfile }
            await fetch('api/user/createprofile', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSignupII(e) {
        e.preventDefault()
        const form = e.target;
        if (form.country.value == 'DEFAULT') {
            document.getElementById('country-lab').scrollIntoView()
            document.getElementById('country-lab').click()
        } else if (form.education.value == 'default') {
            document.getElementById('education-lab').scrollIntoView()
            document.getElementById('education-lab').click()
        } else if (form.sector.value == 'default') {
            document.getElementById('sector-lab').scrollIntoView()
            document.getElementById('sector-lab').click()
        } else if (form.sex.value == '') {
            document.getElementById('sex-lab').scrollIntoView()
            document.getElementById('sex-lab').click()
        } else {

            var div = form.division.value

            if(div == ''){
                div = 'none'
            }
            
            const newProfile = {
                user_id: props.data.user.id,
                dob: form.dob.value,
                sex: form.sex.value,
                country: form.country.value,
                education: form.education.value,
                field: form.sector.value,
                division: div,
                position: form.position.value,
                experience: parseInt(form.yoe.value)
            }
            try {
                await submitUser(e, newProfile)
                
                const body = {
                    user_id: props.data.user.id, 
                    first_name: form.fname.value
                }

                const response = await fetch('/api/sendgrid/linkedinuser', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })

                const res = await response.json()
                signOut({redirect:false})
                router.push('/linkedinregistration/success')
            } catch {
                alert('Something went wrong')
            }
        }
    }

    if (props.data.user.profile) {
      return <AlreadySignedIn session = {props.data} />
    } else {
      return (
        <div style ={{
          position:'absolute',
          display: 'flex',
          width: '100%',
          minHeight: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f3f3'
        }}>
            <div id = 'signupII-frame'>  
                <Head>
                    <title>Linkedin registration | Agility Hub</title>
                </Head>
                <div id='signup-bar' className="w3-bar">
                    <div id = 'signup-title' className="w3-bar-item">
                        Welcome! 
                    </div>                   
                </div>
                <div className="normal-text">
                      Please complete your profile to proceed.
                </div> <br />

                <div className="normal-text" id= 'data-disclaimer' 
                    onClick={handleMouseOver}>
                    Why do we ask for your data?
                </div>

                {isHovering
                ?<div id = 'data-disclaimer-frame'>
                    <button onClick = {handleMouseOut} id = 'disclaimer-close-btn' className="normal-text">
                    &times;
                    </button>
                    <div id='data-disclaimer-text'>
                        <span style = {{fontFamily:'Rubikmed'}}>We do not resell your data to third parties. </span> However, we will use it in anonymised form
                        in the context of our research on the topic of organizational agility and in the "data" section of this website (see our <Link href={privacyPolicyURL}><a target="_blank">Privacy Policy</a></Link>).
                    </div>
                    
                </div>
                :null
                }

                <div id = 'signup-form-container'>
                    <form id = 'signup-form' onSubmit = {handleSignupII}>
                        <label id = 'fname-lab' className = 'signupII-label' htmlFor = 'fname'>First name*</label>
                        <input type = 'text'
                            name = 'fname'
                            id = 'fname'
                            className = 'signupII-entry'
                            defaultValue={props.userdata.first_name}
                            required/>
                        <label id = 'lname-lab' className = 'signupII-label' htmlFor = 'lname'>Last name*</label>
                        <input type = 'text'
                            name = 'lname'
                            id = 'lname'
                            className = 'signupII-entry'
                            defaultValue={props.userdata.last_name}
                            required/>
                        <label id = 'sex-lab' className = 'signupII-label' htmlFor = 'sex'>Gender*</label>
                        <input type = 'text' list = 'sex-options' name="sex" id="sex" className = 'signupII-entry'/>
                            <datalist id = 'sex-options'>
                                <option value = 'Male'></option>
                                <option value = 'Female'></option>
                                <option value = 'Prefer not to say'></option>
                            </datalist>
                        <label id = 'dob-lab' className = 'signupII-label' htmlFor = 'dob'>Date of birth*</label>
                        <input type = 'date'
                            name = 'dob'
                            id = 'dob'
                            className = 'signupII-entry'
                            max = {maxdate}
                            min = {mindate}
                            required/>
                        <label id = 'country-lab' className = 'signupII-label' htmlFor = 'country'>Work country*</label>
                        <select defaultValue={'DEFAULT'} name="country" id="country" className = 'signupII-entry'>
                            <Countrysel />
                        </select>
                        <label id = 'education-lab' className = 'signupII-label' htmlFor = 'education'>Highest level of education attained*</label>
                        <select defaultValue = {'default'} name="education" id="education" className = 'signupII-entry'>
                            <option value= 'default' hidden = {true} disabled >select</option>
                            <option value = 'Apprenticeship'>Apprenticeship</option>
                            <option value = 'High school'>High school</option>
                            <option value = 'Bachelor'>Bachelor Degree</option>
                            <option value = 'Master'>Master's Degree</option>
                            <option value = 'PhD'>Doctor of Philosophy (PhD)</option>
                        </select>
                        <label id = 'sector-lab' className = 'signupII-label' htmlFor = 'sector'>Professional field*</label>
                        <select defaultValue = {'default'} name = 'sector' id = 'sector' className = 'signupII-entry' autoComplete = 'false'>
                            <Sectorsel />
                        </select>
                        <label id = 'yoe-lab' className = 'signupII-label' htmlFor = 'yoe'>Years of experience*</label>
                        <input type = 'number'
                            min = {0}
                            name = 'yoe'
                            id = 'yoe'
                            className = 'signupII-entry'
                            required/>
                        <label id = 'division-lab' className = 'signupII-label' htmlFor = 'division'>Division (if available)</label>
                        <input type = 'text'
                            name = 'division'
                            id = 'division'
                            className = 'signupII-entry'/>
                        <label id = 'position-lab' className = 'signupII-label' htmlFor = 'position'>Current position*</label>
                        <input type = 'text'
                            name = 'position'
                            id = 'position'
                            className = 'signupII-entry'
                            required/>                      
                        <div id = 'privacy-info-container'>
                            <input type="checkbox" id= 'privacy-btn' name= 'remember-btn' value = 'doshow' onClick = {handleCheckbox} />
                            <label htmlFor = "privacy-btn"> By checking this box you indicate that you have read and accept our <Link href = {termsURL}><a target="_blank" className = 'privacy-link'>Terms of service</a></Link>, <Link href = {privacyPolicyURL}><a target="_blank" className = 'privacy-link'>Privacy policy</a></Link> and <Link href = {cookieURL}><a target="_blank" className = 'privacy-link'>Cookie policy</a></Link>. </label>
                        </div>
                        
                        <button id = 'signupII-btn' type = 'submit' disabled = {signupdisabled} style={{width: '100%'}}>
                            Complete registration
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
  }
};
    
    


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          destination: '/accessrequired',
          permanent: false,
        },
      }
    }

    let userdata

    if (!session.user.profile) {
      userdata = await prisma.users.findUnique({
        select: {
          first_name: true,
          last_name: true
        },
        where: {
          user_id: session.user.id
        }
      })
    }
    
    return {
      props: { 
        data: session,
        userdata: userdata
      }
    }
  }