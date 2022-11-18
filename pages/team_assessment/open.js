import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from 'next/head';
import { prisma } from '../../components/db';


import home_btn from '../../public/images/Home_button_75.svg'
import Buttonwait from "../../components/buttonwait";

export default function openAssessments(props) {

  var assessments_lst = props.assessments_lst

  const router = useRouter()

  function handleAssessment(e) {
    e.target.children[0].classList.remove('w3-hide')
    const url = e.target.getAttribute('data-url')
    router.push('/team_assessment/'+url+'/questionnaire')
  }

  function convertDate(date) {
    var datePart = date.match(/\d+/g),
    year = datePart[0],
    month = datePart[1],
    day = datePart[2]
    return day+'.'+month+'.'+year
  }

  return(
      <div id = 'open-page'>
        <div id='open-page-bg' />
        
        <Head>
            <title>Open Assessments | Agility Hub</title>
        </Head>

        <div id='open-page-cont'>

        <div className="w3-bar" id="open-bar">

        <div id = 'assessments-title' className='w3-bar-item'>
          Open assessments ({assessments_lst.length})
        </div>

        <Link href = '/'>
              <a id = 'assessments-home-button' className="w3-bar-item w3-right">
                  <Image
                  src = {home_btn}
                  layout = 'responsive' />
              </a>
        </Link>
        </div>

        <div id='no-team-assessment-bar' className="w3-bar">
        <button 
        onClick = {(e) => {e.target.children[0].remove('w3-hide'); router.push('/team_assessment/noteam/new/questionnaire')}} 
        className = 'w3-bar-item normal-btn' 
        id = 'no-team-assessment'>
          Start individual assessment
          <Buttonwait color={'#ffffff'} />
        </button>
        </div>

        <div id = 'assessments-list' className="w3-row">
          {assessments_lst.length == 0
          ?<div id = 'no-open-assessments' className="w3-col s12">
            <p align='justify'>You don't have any outstanding assessments at the moment. </p>
            <p align='justify'>If you're a team leader you can open a new one <Link href= '/teams'><a id = 'assessments-link'>here</a></Link>. </p>
          </div>
          : <>
            {assessments_lst.map((assessment) => (
              <div id = 'assessment-container' key = {assessment.teamid+','+assessment.assessmentid} className="w3-card w3-col l10 m12 s12">
                <div id = 'assessment-text-l' className = 'normal-text w3-hide-medium w3-hide-small'>
                Team: <span style = {{fontFamily:'Rubikmed'}}>&nbsp; {assessment.teamname}</span>, opened on: 
                <span style = {{fontFamily:'Rubikmed'}}>&nbsp; 
                {convertDate(assessment.openedon)}
                &nbsp; 
                &nbsp; 
                </span>
                <button onClick = {(e) => {handleAssessment(e)}} className = 'normal-btn' id = 'start-assessment-l' data-url = {assessment.teamid+'/'+assessment.assessmentid}>
                  Start
                  <Buttonwait color={'#ffffff'} />
                </button>
                </div>

                <div id = 'assessment-text-m' className = 'normal-text w3-hide-large w3-hide-small'>
                  <div>
                    Team: <span style = {{fontFamily:'Rubikmed'}}> {assessment.teamname}</span>,
                  </div>
                  <div>
                    opened on: 
                  <span style = {{fontFamily:'Rubikmed'}}>&nbsp; 
                  {convertDate(assessment.openedon)}
                  </span>
                  </div>
                  <button onClick = {(e) => {handleAssessment(e)}} className = 'normal-btn' id = 'start-assessment-m' data-url = {assessment.teamid+'/'+assessment.assessmentid}>
                    Start
                    <Buttonwait color={'#ffffff'} />
                  </button>
                </div>

                <div id = 'assessment-text-m' className = 'normal-text w3-hide-large w3-hide-medium'>
                  <div style={{textAlign: 'center'}}>
                    Team: <span style = {{fontFamily:'Rubikmed'}}> {assessment.teamname}</span>,
                  </div>
                  <div>
                    opened on: 
                    <span style = {{fontFamily:'Rubikmed'}}>&nbsp; 
                      {convertDate(assessment.openedon)}
                    </span>
                  </div>
                  <button onClick = {(e) => {handleAssessment(e)}} className = 'normal-btn' id = 'start-assessment-m' data-url = {assessment.teamid+'/'+assessment.assessmentid}>
                    Start
                    <Buttonwait color={'#ffffff'} />
                  </button>
                </div>
              </div>

            ))}
            {/* transform new into an id before moving to evaluate!! */}
            </>
          }

        </div>
        </div>

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
    } else if (!session.user.profile) {
      return {
        redirect: {
          destination: '/linkedin',
          permanent: false,
        },
      }
    } 

    const user_id = session.user.id

    const open_assessments = await prisma.assessments_open.findMany({
      where: {
        user_id: user_id
      },
      select: {
        group_id: true,
        teamassessment_id: true
      }
    })

    let assessments_arr = []

    for (const i in open_assessments) {
      const team_id = open_assessments[i].group_id
      const team = await prisma.groups.findUnique({
        where: {
          group_id: team_id
        },
        select: {
          name: true
        }
      })
      const assessment_id = open_assessments[i].teamassessment_id
      const assessment = await prisma.teamassessments_open.findUnique({
        where: {
          teamassessment_id: assessment_id
        },
        select: {
          opened_on: true
        }
      })
      assessments_arr.push({
        teamid: team_id,
        teamname: team.name,
        assessmentid: assessment_id,
        openedon: assessment.opened_on
      })
    }
  
    return {
      props: {
        data: session,
        userId: user_id,
        assessments_lst: assessments_arr
      }
    }
  }