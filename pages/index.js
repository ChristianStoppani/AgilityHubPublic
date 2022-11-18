import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import {prisma} from '../components/db'

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Buttonwait from "../components/buttonwait";

import ta_img from "../public/images/team_assessment_page.jpg";
import ta_img2 from "../public/images/ta-image-2.jpg";
import Headersep from "../components/layout/header_sep";
import Dashboardbtn from "../components/dashboard/dashboard_btn";

export default function Home(props) {

    const router = useRouter();
    const session = props.data

    if (session) {
        return (
            <div className = 'page'>
                <Head>
                    <title>Dashboard | Agility Hub</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                </Head>

                <Header session={session}/>

                <div id = 'app-page'>

                    <Headersep />
                    <div id= 'app-page-content'>

                        <div className="title w3-hide-small" id = 'app-title'>
                            Dashboard
                        </div>

                        <div className="title w3-hide-large w3-hide-medium w3-padding-16" id = 'app-title-small'>
                            Dashboard
                        </div> 

                        <div id='dashboard-container' className="w3-row small-title">  

                            <Dashboardbtn text = 'Assessments' link='/team_assessment/open' cols = 'l4 m6' icon='fa-play' open={props.open}/>
                            <Dashboardbtn text = 'Teams' link='/teams' cols = 'l4 m6' icon='fa-people-group' invites={props.invites}/>
                            <Dashboardbtn text = 'History' link='/history' cols = 'l4 m6' icon='fa-history'/>
                            <Dashboardbtn text = 'Feedback' link='/feedback' cols = 'l4 m6' icon='fa-message' noFeedback = {props.nofeedback}/>
                            <Dashboardbtn text = 'Account' link='/account' cols = 'l4 m6' icon='fa-user'/>
                            <Dashboardbtn text = 'Team assessment' link='/team_assessment' cols = 'l4 m6' icon='fa-circle-info'/>
                            <div className="w3-col l2" style={{visibility:'hidden', marginBottom:'3vh'}}>d</div>
                            {/* <Dashboardbtn text = 'How to' link='/howto' cols = 'l4 m6' icon = 'fa-circle-question' /> */}
                            <Dashboardbtn text = 'Support' link='/team_assessment' cols = 'l4 m6' icon='fa-wrench' support={true}/>
                            <Dashboardbtn text = 'Log out' cols = 'l4 m6' signout={true} icon='fa-right-from-bracket'/>
                            <div className="w3-col" style={{visibility:'hidden', marginBottom:'3vh'}}>d</div>

                        </div>             
                    
                    </div>

                </div>

                <div id='home-footer'>
                <Footer/>
                </div>
            </div>
        )
    } else {
        return (

            <div className = 'page'>
                <Head>
                    <title>Team assessment | Agility Hub</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                </Head>

                <Header session={session}/>

                <div id = 'app-page'>

                    <Headersep />
                    <div id= 'app-page-content'>

                    <div className="title w3-hide-small" id = 'app-title'>
                        Team Assessment
                    </div>

                    <div className="title w3-hide-large w3-hide-medium" id = 'app-title-small'>
                        Team Assessment
                    </div>

                    <div className="w3-row w3-hide-large" id = 'home-first-container'>
                        <div id = 'ta-text' className="normal-text w3-container w3-col l6 m12 s12">
                            The implementation of agile methods in an organisation can be tricky, and receiving proper 
                            feedback during and after the transition is key to its success. The Agility Hub’s team assessment 
                            tool answers this need. By completing a 15 minute questionnaire, teams can easily evaluate their 
                            level of organisational agility and identify the areas in which they perform well and those where 
                            more work is needed. <br/><br/>
                            <span className="small-title">
                                Join the project and complete the assessment to find out how your team is doing!
                            </span>                  
                        </div>
                        <div className="w3-hide-large w3-hide-small w3-col m3" style={{padding: '1%'}}></div>

                        <div id = 'ta-image' className="w3-col l6 m6 s12">
                            <Image 
                                src = {ta_img}
                                layout="responsive" 
                                priority={true}/>
                        </div>
                    </div>
                    <div className="w3-row w3-hide-small w3-hide-medium" id = 'home-first-container-l'>
                        <div id = 'ta-text' className="normal-text w3-container w3-col l6 m12 s12" style={{paddingRight:'50px'}}>
                            The implementation of agile methods in an organisation can be tricky, and receiving proper 
                            feedback during and after the transition is key to its success. The Agility Hub team assessment 
                            tool answers this need. By completing a 15 minute questionnaire, teams can easily evaluate their 
                            level of organisational agility and identify the areas in which they perform well and those where 
                            more work is needed. <br/><br/>
                            <span className="small-title">
                                Join the project and complete the assessment to find out how your team is doing!
                            </span>                  
                        </div>
                        <div className="w3-hide-large w3-hide-small w3-col m1" style={{padding: '1%'}}></div>

                        <div id = 'ta-image' className="w3-col l6 m10 s12">
                            <Image 
                                src = {ta_img}
                                layout="responsive" 
                                priority={true}/>
                        </div>
                    </div>

                    <div className="w3-row" id = 'home-second-container'>
                        <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/signup')}} className= 'hp-btn w3-hide-small'>
                            Join the project! <Buttonwait color='#ffffff' />
                        </button>
                        <button onClick = {(e) => {e.target.children[0].classList.remove('w3-hide'); router.push('/signup')}} className= 'hp-btn-s w3-hide-large w3-hide-medium'>
                            Join the project! <Buttonwait color='#ffffff' />
                        </button>
                    </div>

                    <div className="w3-row w3-hide-large" id='home-third-container'>                    
                        <div id = 'ta-text2' className="normal-text w3-container w3-col l6 m12 s12">
                            <ul style={{paddingLeft:'0', width: '100%'}}>
                                <li>
                                    The assessment evaluates 6 different dimensions:
                                    team culture, 
                                    vision and planning, 
                                    team collaboration,
                                    product,
                                    team performance, and 
                                    leadership.
                                </li>
                                <li>
                                    Complete the assessment on your own, or create a team in the webapp, 
                                    add members to it and start a shared one.
                                </li>
                                <li>
                                    Once the assessment is complete, a score is given and visualised for each dimension. 
                                    In case of a shared assessment, the final scores consist of the team members' averages.
                                </li>
                                <li>
                                    The scores and visualisations are stored in the account and can be exported with a click.
                                </li>
                                <li>
                                    Through repeated assessments, it is possible to keep track of the 
                                    team's evolution over time.
                                </li>
                            </ul>
                        </div>
                        <div className="w3-hide-large w3-hide-small w3-col m3" style={{padding: '1%'}}></div>
                        <div id = 'ta-image2' className="w3-col l6 m6 s12">
                            <Image 
                                src = {ta_img2}
                                layout="responsive" 
                                priority={true}/>
                        </div>
                    </div>
                    <div className="w3-row w3-hide-medium w3-hide-small" id='home-third-container-l'>
                        <div className="w3-hide-large w3-hide-small w3-col m1" style={{padding: '1%'}}></div>
                        <div id = 'ta-image2' className="w3-col l6 m10 s12">
                            <Image 
                                src = {ta_img2}
                                layout="responsive" 
                                priority={true}/>
                        </div>
                        <div id = 'ta-text2' className="normal-text w3-container w3-col l6 m12 s12" style={{paddingLeft: '50px'}}>
                            <ul style={{paddingLeft:'0', width: '100%'}}>
                                <li>
                                    The assessment evaluates 6 different dimensions:
                                    team culture, 
                                    vision and planning, 
                                    team collaboration,
                                    product,
                                    team performance, and 
                                    leadership.
                                </li>
                                <li>
                                    Complete the assessment on your own, or create a team in the webapp, 
                                    add members to it and start a shared one.
                                </li>
                                <li>
                                    Once the assessment is complete, a score is given and visualised for each dimension. 
                                    In case of a shared assessment, the final scores consist of the team members' averages.
                                </li>
                                <li>
                                    The scores and visualisations are stored in the account and can be exported with a click.
                                </li>
                                <li>
                                    Through repeated assessments, it is possible to keep track of the 
                                    team's evolution over time.
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>

                </div>

                <div id='home-footer'>
                <Footer/>
                </div>
            </div>
        )
    }
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    let noFeedback = true
    if (session) {
        //retrieve user, whether feedback has been given and number of pending assessments and team invites 
        const user_id = session.user.id
        var feedback = await prisma.feedback.findFirst({
            where: {
                user_id: user_id
            }
        })

        var open = await prisma.assessments_open.findMany({
            where: {
                user_id: user_id
            }
        })
        var open = open.length
        if (open == 0) {
            open = undefined
        }

        var invites = await prisma.invitations_user.findMany({
            where: {
                user_id: user_id
            }
        })
        var invites = invites.length
        if(invites == 0) {
            invites= undefined
        }

        if (feedback) {
            noFeedback = false
        }
    }

    return {
        props: { 
            data: session,
            nofeedback: noFeedback,
            open: open,
            invites: invites
        }
      }
}