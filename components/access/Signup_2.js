import Image from "next/image";
import Link from 'next/link';
import React, { useEffect, useState, setState } from "react";
import { useRouter } from 'next/router';
import { SHA512 } from "crypto-js";


import Countrysel from "../countrysel";
import Sectorsel from "../sectorsel";

import close_btn from '../../public/images/close_btn_50.svg';
import open_eye from '../../public/images/open_eye_icon.svg';
import closed_eye from '../../public/images/close_eye_icon.svg';
import Buttonwait from "../buttonwait";

export default function Signup2({signupEmail, tokens}) {

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

    //handle password visibility
    const [vis, setVis] = useState(false);
    const [eye_icon, setEyeIcon] = useState(open_eye); 

    function handlePwVis(e) {
        e.preventDefault()
        setVis(!vis);

        if (vis == false) {
            setEyeIcon(closed_eye);
            document.getElementById('passwordI').setAttribute('type', 'text');
        } else {
            setEyeIcon(open_eye);
            document.getElementById('passwordI').setAttribute('type', 'password');
        }

    }

    //check if pws are the same and respect the requirements, handle privacy checkbox, handle activation of signup button
    const [pwIok, setPwIok] = useState(false)
    const [samepws, setSamepws] = useState(false)
    const [checked, setChecked] = useState(false)

    const [signupdisabled, setSignupdisabled] = useState(true)

    function checkPW() {
        const pwI = document.getElementById('passwordI').value;

        if (pwI != '') {
            document.getElementById('count-req').classList.add('req-fail')
            document.getElementById('nr-req').classList.add('req-fail')
            document.getElementById('case-req').classList.add('req-fail')
            document.getElementById('char-req').classList.add('req-fail')
        } else {
            document.getElementById('count-req').classList.remove('req-fail')
            document.getElementById('nr-req').classList.remove('req-fail')
            document.getElementById('case-req').classList.remove('req-fail')
            document.getElementById('char-req').classList.remove('req-fail')
        }
        
        if (pwI.length >= 8) {
            document.getElementById('count-req').classList.add('req-ok')
        } else {
            document.getElementById('count-req').classList.remove('req-ok')
        }

        if (/\d/.test(pwI)) {
            document.getElementById('nr-req').classList.add('req-ok')
        } else {
            document.getElementById('nr-req').classList.remove('req-ok')
        }

        if (/[a-z]/.test(pwI) && /[A-Z]/.test(pwI)) {
            document.getElementById('case-req').classList.add('req-ok')
        } else {
            document.getElementById('case-req').classList.remove('req-ok')
        }

        if (/[\~\!\@\#\$\%\^\*\-\_\=\+\[\{\]\}\/\;\:\,\.\?]/.test(pwI)) {
            document.getElementById('char-req').classList.add('req-ok')
        } else {
            document.getElementById('char-req').classList.remove('req-ok')
        }

        const requirements = document.getElementById('pw-requirements').getElementsByClassName('req-ok').length
        if (requirements == 4){
            document.getElementById('passwordII').disabled = false;
            setPwIok(true)
            checkSamePW()
        } else {
            document.getElementById('passwordII').disabled = true;
            document.getElementById('password-no-match').classList.remove('show-msg')
            document.getElementById('password-match').classList.remove('show-msg')
            setPwIok(false)
        }
    }

    function checkSamePW() {
        const pwI = document.getElementById('passwordI').value;
        const pwII = document.getElementById('passwordII').value;

        if (pwII == '') {
            document.getElementById('password-no-match').classList.remove('show-msg')
            document.getElementById('password-match').classList.remove('show-msg')
            setSamepws(false)
        } else {
            if (pwI == pwII) {
                document.getElementById('password-match').classList.add('show-msg');
                document.getElementById('password-no-match').classList.remove('show-msg');
                setSamepws(true)
            } else {
                document.getElementById('password-no-match').classList.add('show-msg');
                document.getElementById('password-match').classList.remove('show-msg');
                setSamepws(false);
            }
        }
    }

    function handleCheckbox() {
        const checkbox = document.getElementById('privacy-btn')

        if (checkbox.checked) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }

    useEffect(() => {
        if (pwIok && samepws && checked) {
            setSignupdisabled(false)
        } else {
            setSignupdisabled(true)
        }
    })


    function closeSignupII(e) {
        
        var conf = confirm('If you leave this page, you will have to start the registration process again.')

        if (conf == true) {
            e.preventDefault()

            //hide modal, reset form, password messages and visibility
            document.getElementById('signup-form').reset();
            
            setChecked(false);

            setSignupdisabled(true)

            checkPW();

            document.getElementById('password-no-match').classList.remove('show-msg')
            document.getElementById('password-match').classList.remove('show-msg')

            router.back()

            if (vis == true) {
                setEyeIcon(open_eye);
                setVis(!vis);
                document.getElementById('passwordI').setAttribute('type', 'password');
            }
        } else {}
    }

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(e) {
        //generate 30 char token for sign up link
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
    
        var isOld = tokens.includes(result)
        if (!isOld) {
            return result
        } else {
            generateString(e)
        }
    }

    function handleSignupIII(e) {
        e.preventDefault()
        document.getElementById('signupII-page').style.display = 'none';
        document.getElementById('signupIII-page').style.display = 'block';
        document.getElementById('signupIII-page').scrollIntoView()
      }

    const submitUser = async (e, newUser, newProfile) => {
        e.preventDefault()
        try {
            const body = { newUser, newProfile }
            const response = await fetch('api/user/create', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            const res = await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSignupII(e) {
        //check that all fields have been compiled, create user and trigger sign up flow if so
        e.preventDefault()
        document.getElementById('signupII-btn').children[0].classList.remove('w3-hide')
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

            const token = generateString(e)

            const password_clean = form.passwordI.value
            const salt = process.env.SALT
            const password_salted = password_clean+salt
            const password = SHA512(password_salted).toString()

            const newUser = {
                email: signupEmail,
                password: password,
                first_name: form.fname.value,
                last_name: form.lname.value,
                token: token,
                profiles_unconfirmed: {
                    create: {
                        dob: form.dob.value,
                        sex: form.sex.value,
                        country: form.country.value,
                        education: form.education.value,
                        field: form.sector.value,
                        division: div,
                        position: form.position.value,
                        experience: parseInt(form.yoe.value)
                    }
                }
            }
            
            const newProfile = {
                dob: form.dob.value,
                sex: form.sex.value,
                country: form.country.value,
                education: form.education.value,
                field: form.sector.value,
                division: div,
                position: form.position.value,
                experience: form.yoe.value
            }

            try {
                submitUser(e, newUser, newProfile)

                const confirmation_link = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/confirmregistration?tok='+token

                const body = { 
                    email: signupEmail, 
                    first_name: form.fname.value,
                    confirmation_link: confirmation_link
                }

                fetch('/api/sendgrid/confirmregistration', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })

                handleSignupIII(e)
            } catch (error) {
                document.getElementById('signupII-btn').children[0].classList.add('w3-hide')
                alert('Uh oh, omething went wrong')
                console.error(error)
            }

        }
    }

    return (
        <div id='signupII-page'>
            <div id = 'signupII-frame'>   
                <div id='signup-bar' className="w3-bar">
                    <div id = 'signup-title' className="w3-bar-item">
                        Sign Up
                    </div>

                    <button id='signup-close-btn' onClick = {closeSignupII} className = 'w3-bar-item'>
                        <Image
                            src = {close_btn}
                            layout = 'responsive' />
                    </button>
                </div>

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
                            required/>
                        <label id = 'lname-lab' className = 'signupII-label' htmlFor = 'lname'>Last name*</label>
                        <input type = 'text'
                            name = 'lname'
                            id = 'lname'
                            className = 'signupII-entry'
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
                        <select defaultValue = {'DEFAULT'} name = 'sector' id = 'sector' className = 'signupII-entry' autoComplete = 'false'>
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

                        <label id = 'passwordI-lab' className = 'signupII-label' htmlFor = 'passwordI'>Password*</label>
                        <div id='signupII-pw-eye'>
                            <input type = 'password'
                                name = 'passwordI'
                                id = 'passwordI'
                                className = 'signupII-entry'
                                onChange = {checkPW}
                                maxLength = {32}
                                autoComplete= "new-password" />
                            <button onClick = {(e) => {handlePwVis(e)}} className = 'pw-eye'>
                                <Image
                                    src = {eye_icon}
                                    layout = 'responsive' />
                            </button>
                        </div>
                        <div id = 'pw-requirements'>
                            <div id = 'count-req' className = 'signup-pw-req'>&bull; At least 8 characters</div>
                            <div id = 'case-req' className = 'signup-pw-req'>&bull; Mixture of upper- and lowercase letters</div>
                            <div id = 'char-req' className = 'signup-pw-req'>&bull; At least one special character</div>
                            <div id = 'nr-req' className = 'signup-pw-req'>&bull; At least one number</div>
                        </div>
                        <label id = 'passwordII-lab' className = 'signupII-label' htmlFor = 'passwordII'>Repeat password*</label>
                        <input type = 'password'
                            name = 'passwordII'
                            id = 'passwordII'
                            className = 'signupII-entry'
                            onChange = {checkSamePW}
                            maxLength = {32}
                            autoComplete="new-password"
                            disabled = {true}/>
                        <div id = 'password-status'>
                            <div id = 'password-no-match' className = 'signupII-label'> &#10006; The passwords don't match</div>
                            <div id = 'password-match' className = 'signupII-label'> &#10003; The passwords match</div>
                        </div>

                        <div id = 'privacy-info-container'>
                            <input type="checkbox" id= 'privacy-btn' name= 'remember-btn' value = 'doshow' onClick = {handleCheckbox} />
                            <label htmlFor = "privacy-btn"> By checking this box you indicate that you have read and accept our <Link href = {termsURL}><a target="_blank" className = 'privacy-link'>Terms of service</a></Link>, <Link href = {privacyPolicyURL}><a target="_blank" className = 'privacy-link'>Privacy policy</a></Link> and <Link href = {cookieURL}><a target="_blank" className = 'privacy-link'>Cookie policy</a></Link>. </label>
                        </div>
                        
                        <button id = 'signupII-btn' type = 'submit' disabled = {signupdisabled}>
                            Sign Up
                            <Buttonwait color={'#ffffff'} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

