import Head from 'next/head';
import { useRouter } from "next/router";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { prisma } from '../../../../components/db';

import Question from "../../../../components/questionnaire/question";
import Buttonwait from '../../../../components/buttonwait';
import test_list from '../../../../components/questionnaire/test_list.json';
import final_list from '../../../../components/questionnaire/final_list.json'

import close_btn from '../../../../public/images/close_btn_50.svg';
import info_btn from '../../../../public/images/info_btn_50.svg';
import { useEffect, useState } from 'react';

//const qst_list = test_list
const qst_list = final_list

function convertDate(date) {
    var datePart = date.match(/\d+/g),
    year = datePart[0],
    month = datePart[1],
    day = datePart[2]
    return day+'.'+month+'.'+year
  }

export default function ta_questionnaire(props) {

    const router = useRouter()

    const { teamId } = router.query
    const { assessmentId } = router.query

    const assessment = props.assessment

// extract number of questions for each category
    const tcu_qst = qst_list['tcu']
    const tcu_len = tcu_qst.length

    const vis_qst = qst_list['vis']
    const vis_len = vis_qst.length

    const tco_qst = qst_list['tco']
    const tco_len = tco_qst.length

    const pro_qst = qst_list['pro']
    const pro_len = pro_qst.length

    const tpe_qst = qst_list['tpe']
    const tpe_len = tpe_qst.length

    const lea_qst = qst_list['lea']
    const lea_len = lea_qst.length

    const [trigger, setTrigger] = useState(false)

// adds class 'active' to clicked button and removes it from the others
    const handleClick = (e) => {

        const id = e.currentTarget.id

        setTrigger(true)

        var els = document.getElementsByClassName('btn active')
        
        els[0].classList.remove('active')
        els[0].classList.remove('active')

        const btn_s = document.getElementById('categories-s').getElementsByClassName('btn').namedItem(id)
        btn_s.classList.add('active')
        const btn_ml = document.getElementById('categories').getElementsByClassName('btn').namedItem(id)
        btn_ml.classList.add('active')

        var qid = 'questions-'+ id

        var qs = document.getElementsByClassName('questions current')
        qs[0].classList.remove('current')

        document.getElementById(qid).classList.add('current')
    }

// scrolls the first unanswered question into view
    const handleScroll = () => {

        const unanswered_qsts = document.querySelector('.question-container:not(.answered)')

        unanswered_qsts.scrollIntoView({behavior:'smooth'})
    }

    const [prevDis, setPrevDis] = useState(true)
    const [nextDis, setNextDis] = useState(false)

    const [ansArr, setAnsArr] = useState([0,0,0,0,0,0])

    function updateCounter() {
        
        var tcu_answered = document.getElementById('questions-1').getElementsByClassName('selected').length/2
        var vis_answered = document.getElementById('questions-2').getElementsByClassName('selected').length/2
        var tco_answered = document.getElementById('questions-3').getElementsByClassName('selected').length/2
        var pro_answered = document.getElementById('questions-4').getElementsByClassName('selected').length/2
        var tpe_answered = document.getElementById('questions-5').getElementsByClassName('selected').length/2
        var lea_answered = document.getElementById('questions-6').getElementsByClassName('selected').length/2

        setAnsArr([tcu_answered, vis_answered, tco_answered, pro_answered, tpe_answered, lea_answered])

      }

    useEffect( () => {
        if (trigger) {
            var pg_no = document.getElementsByClassName('current')[0].id
        
            if (pg_no == 'questions-1') {
                setPrevDis(true)
                setNextDis(false)
            } else if (pg_no == 'questions-7') {
                setPrevDis(false)
                setNextDis(true)
            } else {
                setPrevDis(false)
                setNextDis(false)
            }
            setTrigger(false)
        }
        var modal = document.getElementById('info-frame');
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none'
            }
            }
    })

    function changeCurrent(pg, new_pg_no, new_pg) {
        var els = document.getElementsByClassName('btn active')
        
        els[0].classList.remove('active')
        els[0].classList.remove('active')

        document.getElementById(new_pg_no).classList.add('active')
        document.getElementsByClassName('catl')[new_pg_no - 1].children[0].classList.add('active')

        var qs = document.getElementById(pg)
        qs.classList.remove('current')

        document.getElementById(new_pg).classList.add('current')
        setTrigger(true)
    }

    function handlePrevious() {
        const pg = document.getElementsByClassName('current')[0].id
        const pg_no = Number(pg.replace(/[^0-9]/g,''))

        const new_pg_no = pg_no - 1

        const new_pg = 'questions-'+ new_pg_no

        changeCurrent(pg, new_pg_no, new_pg)

    }

    function handleNext() {
        const pg = document.getElementsByClassName('current')[0].id
        const pg_no = Number(pg.replace(/[^0-9]/g,''))

        const new_pg_no = pg_no + 1

        const new_pg = 'questions-'+new_pg_no

        changeCurrent(pg, new_pg_no, new_pg)

    }

// counts score for the defined category
    const getScore = (class_str) => {

        const el = document.getElementById(class_str)

        const opt1_count = el.querySelectorAll('.option-1.selected').length
        const opt2_count = el.querySelectorAll('.option-2.selected').length
        const opt3_count = el.querySelectorAll('.option-3.selected').length
        const opt4_count = el.querySelectorAll('.option-4.selected').length
        const opt5_count = el.querySelectorAll('.option-5.selected').length

        const score = - opt1_count*2 - opt2_count + opt3_count*0 + opt4_count + opt5_count*2
        
        const max_score = (opt1_count + opt2_count + opt3_count + opt4_count + opt5_count)*2

        const pts = Math.round((score + max_score)/(2*max_score)*100)

        return pts
    }

// checks whether all questions have been answered and if that's the case leads to the evaluation page

    async function handleEvaluate(e) {

        if (ansArr[0] != tcu_len) {
            document.getElementById('1').click()
            handleScroll()            
        } else if (ansArr[1] != vis_len) {
            document.getElementById('2').click()
            handleScroll()
        } else if (ansArr[2] != tco_len) {
            document.getElementById('3').click()
            handleScroll()
        } else if (ansArr[3] != pro_len){
            document.getElementById('4').click() 
            handleScroll()           
        } else if (ansArr[4] != tpe_len) {
            document.getElementById('5').click()
            handleScroll()
        } else if (ansArr[5] != lea_len) {
            document.getElementById('6').click()
            handleScroll()

        } else {
            e.target.children[0].classList.remove('w3-hide')
            const scores = {
                tcu: getScore('questions-1'),
                vis: getScore('questions-2'),
                tco: getScore('questions-3'),
                pro: getScore('questions-4'),
                tpe: getScore('questions-5'),
                lea: getScore('questions-6'),
            }

            var comment = document.getElementById('q-comm-box').value

            if (comment.replace(/ /g,'') == '') {
                comment = null
            }

            const sel_count = document.getElementsByClassName(' option selected')

            var complete_answers = {}
            for (const i of Array(sel_count.length).keys()) {
                const qname = 'q'+(i+1)
                complete_answers[qname] = sel_count[i].innerHTML
            }
            if (teamId == 'noteam') {
                const date_obj = new Date()
                const month = date_obj.getMonth() + 1
                const date = date_obj.getFullYear()+'-'+month+'-'+date_obj.getDate()
                
                const data = {
                    user_id: props.data.user.id,
                    opened_on: date,
                    ...complete_answers,
                    ...scores,
                    comment: comment
                }
                try {
                    const body = { data }
                    let response = await fetch('/api/assessment/submitindividual', {
                        method:'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(body),
                    })
                    const res = await response.json()
                    const evaluationURL = '/team_assessment/noteam/' + res.id + '/evaluation'
                    router.push(evaluationURL)
                } catch (error) {
                    console.error(error)
                    alert('Uh oh, something went wrong')
                    e.target.children[0].classList.add('w3-hide')
                }
            } else {
                const data = {
                    ...props.assessment_info,
                    ...complete_answers,
                    ...scores,
                    comment: comment
                }
                try {
                    const body = { data }
                    let response = await fetch('/api/assessment/submit', {
                        method:'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(body),
                    })
                    const res = await response.json()
                    const evaluationURL = '/team_assessment/' + teamId + '/' + assessmentId + '/evaluation'
                    router.push(evaluationURL)
                } catch (error) {
                    console.error(error)
                    alert('Uh oh, something went wrong')
                    e.target.children[0].classList.add('w3-hide')
                }
            }
        }
    }

    const handleExit = () => {

        var conf = confirm('If you leave this page, your answers will not be saved.')

        if (conf == true) {
            router.push('/team_assessment/open')
        }

    }

    function closeModal() {
        document.getElementById('info-frame').style.display = 'none'
      }
    
    function handleInfo() {
        document.getElementById('info-frame').style.display = 'flex'
    }


    return (
        <div id = 'quest-page'>
            <div id='quest-page-bg' />
            <div id = 'info-frame' className="w3-modal" style = {{width:'100%', height:'100%'}}>
                <div id = 'info-content' className="w3-modal-content">
                    <div id = 'info-bar' className="w3-bar">
                    <button className="w3-bar-item" id = 'info-close-btn' onClick = {closeModal}>
                    <Image
                        src = {close_btn}
                        layout = 'responsive'/>
                    </button>
                    </div>
                    <p align='justify'>
                        Answer all questions in the different dimensions. On average, answering a single question 
                        shouldn't take more than 15 seconds, trust the first answer that comes to your mind and do not
                        overthink it. Your individual score is private, each team member only sees their own score, 
                        the aggregate one, and all anonymised comments.
                    </p>                
                </div>
            </div>
            
            <Head>
                <title>Questionnaire | Agility Hub</title>
            </Head>

            <div id='quest-page-cont'>

            <div id='quest-bar' className='w3-bar'>
                <div id = 'quest-title' className='w3-bar-item'> 
                    Assessment &nbsp;
                    <button onClick = {handleInfo} className = 'info-btn'>
                        <Image
                            src = {info_btn}
                            layout = 'responsive' />
                    </button>
                </div>

                {teamId != 'noteam'
                    ?<div className='normal-text w3-bar-item w3-hide-small' id='assessment-details'>
                    Team: {assessment.teamName} <br />
                    Opened on: {convertDate(assessment.openedOn)}
                    </div>
                    :<div className='normal-text w3-bar-item w3-hide-small' id='assessment-details'
                    style={{padding:'0'}}>
                        Individual assessment                        
                    </div>
                        }

                <button id='hist-close-btn' onClick = {handleExit} className = 'w3-bar-item'>
                    <Image
                        src = {close_btn}
                        layout = 'responsive' />
                </button>
            </div>
            <div className='w3-bar w3-hide-large w3-hide-medium' style={{display:'flex', justifyContent:'center'}}>
                {teamId != 'noteam'
                    ?<div className='normal-text w3-bar-item' id='assessment-details'
                    style={{padding:'0'}}>
                    Team: {assessment.teamName} <br />
                    opened on: {convertDate(assessment.openedOn)}
                    </div>
                    : <div className='normal-text w3-bar-item' id='assessment-details'
                    style={{padding:'0'}}>
                        Individual assessment                        
                        </div>}

            </div>
            <div id = 'categories-s' className=' w3-hide-medium w3-hide-large'>
                <div className = 'cat' id = 'team-culture'>
                    <button onClick = {handleClick} id = '1' className = 'btn active'>
                        <div className = 'cat-name'>
                            Team culture&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[0]}/{tcu_len}</div>
                    </button>
                </div>

                <div className = 'cat' id = 'vision'>
                    <button onClick = {handleClick} id = '2' className = 'btn'>
                        <div className = 'cat-name'>
                            Vision and planning&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[1]}/{vis_len}</div>
                    </button>
                </div>

                <div className = 'cat' id = 'team-collaboration'>
                    <button onClick = {handleClick} id = '3' className = 'btn'>
                        <div className = 'cat-name'>
                            Team collaboration&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[2]}/{tco_len}</div>
                    </button>
                </div>

                <div className = 'cat' id = 'product'>
                    <button onClick = {handleClick} id = '4' className = 'btn'>   
                        <div className = 'cat-name'>
                            Product&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[3]}/{pro_len}</div>
                    </button>
                </div>

                <div className = 'cat' id = 'team-performance'>
                    <button onClick = {handleClick} id = '5' className = 'btn'>
                    <div className = 'cat-name'>
                        Team performance&nbsp;
                    </div>
                    <div className = 'cat-no'>{ansArr[4]}/{tpe_len}</div>
                    </button>
                </div>

                <div className = 'cat' id = 'leadership'>
                    <button onClick = {handleClick} id = '6' className = 'btn'>
                        <div className = 'cat-name'>
                            Leadership&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[5]}/{lea_len}</div>
                    </button>
                </div>
                <div className = 'cat' id = 'q-comment'>
                    <button onClick = {handleClick} id = '7' className = 'btn'>
                        <div className = 'cat-name'>
                            Comments&nbsp;
                        </div>
                    </button>
                </div>
            </div>

            <div id='quest-content' className='w3-row'>

            <div id = 'categories' className=' w3-hide-small w3-col s12 m4 l3'>
                <div className = 'cat catl' id = 'team-culture'>
                    <button onClick = {handleClick} id = '1' className = 'btn active'>
                        <div className = 'cat-name'>
                            Team culture&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[0]}/{tcu_len}</div>
                    </button>
                </div>

                <div className = 'cat catl' id = 'vision'>
                    <button onClick = {handleClick} id = '2' className = 'btn'>
                        <div className = 'cat-name'>
                            Vision and planning&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[1]}/{vis_len}</div>
                    </button>
                </div>

                <div className = 'cat catl' id = 'team-collaboration'>
                    <button onClick = {handleClick} id = '3' className = 'btn'>
                        <div className = 'cat-name'>
                            Team collaboration&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[2]}/{tco_len}</div>
                    </button>
                </div>

                <div className = 'cat catl' id = 'product'>
                    <button onClick = {handleClick} id = '4' className = 'btn'>   
                        <div className = 'cat-name'>
                            Product&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[3]}/{pro_len}</div>
                    </button>
                </div>

                <div className = 'cat catl' id = 'team-performance'>
                    <button onClick = {handleClick} id = '5' className = 'btn'>
                    <div className = 'cat-name'>
                        Team performance&nbsp;
                    </div>
                    <div className = 'cat-no'>{ansArr[4]}/{tpe_len}</div>
                    </button>
                </div>

                <div className = 'cat catl' id = 'leadership'>
                    <button onClick = {handleClick} id = '6' className = 'btn'>
                        <div className = 'cat-name'>
                            Leadership&nbsp;
                        </div>
                        <div className = 'cat-no'>{ansArr[5]}/{lea_len}</div>
                    </button>
                </div>
                <div className = 'cat catl' id = 'q-comment'>
                    <button onClick = {handleClick} id = '7' className = 'btn'>
                        <div className = 'cat-name'>
                            Comments&nbsp;
                        </div>
                    </button>
                </div>
            </div>

            <div id = 'questions-frame' className='w3-col s11 m7 l8'>
                <div id = 'questions-bg' />

                <div className = 'questions current' id = 'questions-1'>

                    {tcu_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>

                <div className = 'questions' id = 'questions-2'>
                    {vis_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>

                <div className = 'questions' id = 'questions-3'>
                    {tco_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>

                <div className = 'questions' id = 'questions-4'>
                    {pro_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>

                <div className = 'questions' id = 'questions-5'>
                    {tpe_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>

                <div className = 'questions' id = 'questions-6'>
                    {lea_qst.map((qst) => (
                        <Question
                            id = {qst.id}
                            key = {qst.id}
                            text = {qst.text}
                            opt1 = {qst.opt1}
                            opt2 = {qst.opt2}
                            opt3 = {qst.opt3}
                            opt4 = {qst.opt4}
                            opt5 = {qst.opt5}
                            updateCounter = {updateCounter}
                        />
                    ))}
                </div>
                <div className = 'questions' id = 'questions-7'>
                    <textarea id='q-comm-box' className='answered' placeholder='Enter any additional comments here' />
                </div>

            </div>
            </div>
            <div id= 'quest-btn-row' className='w3-row'>
                <div className='w3-col m4 l3 w3-hide-small' style={{height:'15px'}} />
                <div id = 'quest-btn-col' className='w3-col s11 m7 l8'>
                    <button onClick = {handlePrevious} id = 'evaluate-btn' disabled={prevDis}>
                        &#9664; Previous
                    </button>
                    <button onClick = {handleNext} id = 'evaluate-btn' disabled={nextDis}>
                        Next &#9654;
                    </button>
                    <button onClick = {(e)=>{handleEvaluate(e)}} id = 'evaluate-btn'>
                        Evaluate <Buttonwait color={'#ffffff'} />
                    </button>
                </div>
            </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const { query } = context
    const team_id = parseInt(query.teamId)
    const assessment_id = parseInt(query.assessmentId)

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
      } else if (session){
        if (query.teamId == 'noteam' && query.assessmentId == 'new') {
            return {
                props: {
                    data: session
                }
            }
        } else {
            const user_id = session.user.id
            const isAssessment = await prisma.assessments_open.findUnique({
                where: {
                    group_id_teamassessment_id_user_id: {
                        group_id: team_id,
                        teamassessment_id: assessment_id,
                        user_id: user_id
                    }
                }
            })
            if (isAssessment == null) {
                return {
                    redirect: {
                        destination: '/404',
                        permanent: false,
                    }
                }
            }

            const openedOn = await prisma.teamassessments_open.findUnique({
                where: {
                    teamassessment_id: assessment_id
                },
                select: {
                    opened_on: true
                }
            })
            const teamName = await prisma.groups.findUnique({
                where: {
                    group_id: team_id
                },
                select: {
                    name: true
                }
            })

            const assessment = {
                openedOn: openedOn.opened_on, 
                teamName: teamName.name
            }

            const assessment_info = {
                teamassessment_id_open: assessment_id,
                group_id: team_id,
                user_id: user_id
            }

            return {
                props: {
                    data: session,
                    assessment: assessment,
                    assessment_info: assessment_info
                }
            }
        }
    }
  }