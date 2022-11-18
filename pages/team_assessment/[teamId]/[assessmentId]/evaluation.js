import Head from 'next/head';
import { useRouter } from 'next/router';
import { Chart, Radar } from 'react-chartjs-2';
import { prisma } from '../../../../components/db';
import { Chart as ChartJS, LineElement  } from 'chart.js';
import { RadialLinearScale, PointElement, Legend, toBase64Image, Title, Tooltip } from 'chart.js';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

import Footer from '../../../../components/layout/footer'
import home_btn from '../../../../public/images/Home_button_75.svg'
import { useEffect, useState } from 'react';
import Buttonwait from '../../../../components/buttonwait';

function convertDate(date) {
    var datePart = date.match(/\d+/g),
    year = datePart[0],
    month = datePart[1],
    day = datePart[2]
    return day+'.'+month+'.'+year
  }

export default function Evaluation(props) {

    const router = useRouter();

    const { teamId } = router.query
    
    const [askFeedback, setAskFeedback] = useState(false)

    var scores = props.scores
    const [comment, setComment] = useState(undefined)
    const team_comments = props.team_comments
    
    const team_scores = props.team_scores
    const assessment = props.assessment

    let scoresValue
    if (scores) {
        scoresValue = Object.values(scores) 
    } else {
        scores = {
            tcu:'-',
            tco: '-',
            lea: '-',
            tpe: '-',
            vis: '-',
            pro: '-'
        }
    }

    const historyURL = '/history?team=' + teamId

    ChartJS.defaults.font.family = 'rubik';
    ChartJS.defaults.color = '#283747';
    ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Title)

    const datasets = (!team_scores) 
        ?[{
            label: 'Your score',
            data: scoresValue,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
        }]
        :(scoresValue)
            ?[{
                label: 'Your score',
                data: scoresValue,
                borderColor: 'blue',
                borderWidth: 2,
            },
            {
                label: 'Team score',
                data: Object.values(team_scores),
                borderColor: 'green',
                borderWidth: 2,
            }]
            :[{
                label: 'Team score',
                data: Object.values(team_scores),
                borderColor: 'green',
                borderWidth: 2,
            }]


    const data = {
        labels: ['T. culture', 'Vision and planning', 'T. collaboration', 'Product', 'T. performance', 'Leadership'],
        datasets: datasets,
    }

    const downloadDataset = (team_scores) 
    ?[{
        label: 'Team score',
        data: Object.values(team_scores),
        borderColor: 'green',
        borderWidth: 2
    }] 
    :[{
        label: 'Your score',
        data: scoresValue,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
    }]
    
    const downloadData = {
        labels: ['T. culture', 'Vision and planning', 'T. collaboration', 'Product', 'T. performance', 'Leadership'],
        datasets: downloadDataset,
    }

    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#f3f3f3';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
    };

    const options = {
        scale: {
            min: 0,
            max: 100,
            stepSize: 10,
            },
        scales: {
            r: {
                ticks: {
                    backdropColor: 'transparent',
                    font: {
                        size: 6
                    }
                }
            }
        },
        layout: {
            autoPadding: true
        }
    };

    const title = (teamId != 'noteam') ?assessment.teamName + ', ' + convertDate(assessment.openedOn)
    : 'Individual assessment, ' + convertDate(assessment.openedOn)

    const downloadOptions = {
        plugins: {
            title: {
                display: true,
                text: title
            }},
        scale: {
            min: 0,
            max: 100,
            stepSize: 10,
            },
        scales: {
            r: {
                ticks: {
                    backdropColor: 'transparent',
                    font: {
                        size: 6
                    }
                }
            }
        },
        layout: {
            autoPadding: true
        }
    }

    useEffect(()=>{
        setComment(scores.comment)
        delete scores.comment
        if (team_scores) {
            var ctx = document.getElementById('canvaschart-download')
            var teamChart = new ChartJS(ctx, {
                type: 'radar',
                data: downloadData,
                plugins: [plugin],
                options: downloadOptions
            })
        } else if (teamId =='noteam') {
            var ctx = document.getElementById('canvaschart-download')
            var individualChart = new ChartJS(ctx, {
                type: 'radar',
                data: downloadData,
                plugins: [plugin],
                options: downloadOptions
            })
        }

        if (props.askFeedback) {
            function setFB() {
                setAskFeedback(true)
            }
            var waitFB = setTimeout(setFB, 5000)
        }
    },[])

    function handleDownload() {
        const imgURL = document.getElementById('canvaschart-download').toDataURL('image/png', 1)
        document.getElementById('chart-download').href=imgURL
        document.getElementById('chart-download').click()
    }

    function handleFeedback(e) {
        e.target.children[0].classList.remove('w3-hide')
        router.push('/feedback')
    }

    function handleNoFeedback(e) {
        e.preventDefault()
        setAskFeedback(false)


        if (document.getElementById('give-fb').checked) {
            handleDontAsk(e)
        }
    }

    async function handleDontAsk(e) {
        e.preventDefault()
        try {
            const user_id = props.data.user.id
            const body = { user_id }
            const response = await fetch('/api/user/change/nofeedback', {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            const res = await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div id='eval-page'>
            <div className='page-bg'/>
            
            <Head>
                <title>Evaluation | Agility Hub</title>
            </Head>


            <div id='eval-page-cont'>

            <div id='eval-bar' className='w3-bar'>

                <div id = 'eval-title' className='w3-bar-item'>
                    Results
                </div>

                {teamId != 'noteam'
                    ?<div className='normal-text w3-bar-item w3-hide-small' id='assessment-details'>
                    Team: {assessment.teamName} <br />
                    Opened on: {convertDate(assessment.openedOn)} <br/>
                    Leader scores: {(props.leaderScores)
                        ?<>included</>
                        :<>not included</>} <br/>
                    {!team_scores
                    ? <>(team scores not published yet)</>
                    :null
                    }
                    </div>
                    :null}

                <button id = 'history-btn'
                    onClick={(e)=>{e.target.children[0].classList.remove('w3-hide'); router.push(historyURL)}}
                    className='w3-bar-item w3-hide-small'>
                        History <Buttonwait color={'#ffffff'}/>    
                </button>

                <Link href = '/'>
                    <a id = 'eval-home-btn'
                    className='w3-bar-item'>
                        <Image
                            src = {home_btn}
                            layout = 'responsive' />
                    </a>
                </Link>
            </div>

            <div id= 'eval-bar-2' className='w3-bar w3-hide-large w3-hide-medium'>
            {teamId != 'noteam'
                    ?<div className='normal-text w3-bar-item' id='assessment-details'>
                    Team: {assessment.teamName} <br />
                    Opened on: {convertDate(assessment.openedOn)} <br/>
                    Leader scores: {(assessment.leaderScores)
                        ?<>included</>
                        :<>not included</>} <br/>
                    {!team_scores
                    ? <>(team scores not published yet)</>
                    :null
                    }
                    </div>
                    : null}

                <Link href = {historyURL}>
                    <a id = 'history-btn'
                    className='w3-bar-item'>
                        History            
                    </a>
                </Link>
            </div>

            <div id='chart-scores' className='w3-row'>
                <div id = 'chart-container' className='w3-twothird'>
                    <Radar data={data} options={options} />
                    
                    {team_scores
                    ?<div>
                        <canvas
                            id='canvaschart-download'
                            width={550}
                            height={500}></canvas>
                        <button onClick={handleDownload} className='normal-btn w3-hide-small' style={{padding:'8px'}}>
                            Download chart (team data only)
                        </button>
                        <a id='chart-download' download={assessment.openedOn.replace(/\D/g,'')+'_'+assessment.teamName.replace(/[^a-zA-Z]/g,"")} style={{display:'none'}}> 
                        Download
                        </a>
                    </div>
                    : null
                    }
                    {teamId=='noteam'
                     ?<div>
                     <canvas
                         id='canvaschart-download'
                         width={550}
                         height={500}></canvas>
                     <button onClick={handleDownload} className='normal-btn w3-hide-small' style={{padding:'8px'}}>
                         Download chart
                     </button>
                     <a id='chart-download' download={assessment.openedOn.replace(/\D/g,'')+'_individual'} style={{display:'none'}}> 
                     Download
                     </a>
                 </div>
                 : null
                    }
                </div>               

                <div id = 'scores-container' className='w3-third'>
                    <table className='scores-table normal-text'>
                        <tbody>
                            {team_scores
                            ?<tr><td>&nbsp;</td><td>&nbsp;&nbsp;You</td><td>&nbsp;&nbsp;Team</td></tr>
                            : null}
                            <tr><td>Team culture</td><td>{scores.tcu}</td><td>{team_scores.tcu}</td></tr>
                            <tr><td>Vision and planning</td><td>{scores.vis}</td><td>{team_scores.vis}</td></tr>
                            <tr><td>Team collaboration</td><td>{scores.tco}</td><td>{team_scores.tco}</td></tr>
                            <tr><td>Product</td><td>{scores.pro}</td><td>{team_scores.pro}</td></tr>
                            <tr><td>Team performance</td><td>{scores.tpe}</td><td>{team_scores.tpe}</td></tr>
                            <tr><td>Leadership</td><td>{scores.lea}</td><td>{team_scores.lea}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id='eval-comments'>
                {teamId == 'noteam' || !team_scores
                ?<>
                    {comment
                    ?<div id='comment-container' className='normal-txt'>
                        <div id ='comment-title' className='small-title'>Comment:</div> <br/>
                        <div id ='eval-comment' className='w3-round-xlarge'>{comment}</div>
                    </div>
                    :<div id='comment-container' className='normal-txt'>
                        <div id ='comment-title' className='small-title'>No comment</div>
                    </div>}
                </>
                :<div>
                    {team_comments
                    ?<div id='comment-container'>
                        <div id ='comment-title' className='small-title'>Comments ({team_comments.length}):</div> <br/>
                        {team_comments.map((c)=>(
                            <div key={c}><div id ='eval-comment' className='w3-round-xlarge'>{c}</div> <br/></div>
                        ))}
                    </div>
                    :<div id='comment-container'>
                        <div id ='comment-title' className='small-title'>Comments (0)</div>
                    </div>}
                </div>
                }
            </div>

            {askFeedback
            ?<div className='w3-col m5 l4' id='feedback-alert-container'>
                <div className='w3-card w3-animate-bottom' id='feedback-alert'> 
                    <p align='justify'>
                    Hi {props.userName}, <br/> 
                    are you happy with the website? Do you have any suggestions to improve it? <br />
                    Please let me know by filling out a short feedback form. <br/>
                    Thank you! <br/>
                    Chris
                    </p>
                    <button onClick={(e)=>{handleFeedback(e)}} className='normal-btn feedback-btn'>
                        Go to feedback <Buttonwait color={'#ffffff'}/>
                    </button>
                    <button onClick={(e) => {handleNoFeedback(e)}} className='normal-btn feedback-btn' id='no-feedback-btn'>
                        Not now
                    </button>
                    <input type='checkbox' id='give-fb' style={{marginTop:'8px'}}></input>
                    <label htmlFor='give-fb' style={{marginLeft:'8px'}}>Do not ask again</label>
                </div>
                <div style = {{height:'5vh'}} />
            </div>
            :null}
            </div>

            <div id='eval-footer'>
                <Footer />
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const { query } = context
    var team_id = query.teamId
    const assessment_id = parseInt(query.assessmentId)
    let isMember = true
    let team_comments = false
    let openedOn

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
      } else if (session) { 
        const user_id = session.user.id    
        const user = await prisma.users.findUnique({
            where: {
                user_id: user_id
            },
            select: {
                first_name: true,
                ask_feedback: true
            }
        })
        if (team_id == 'noteam') {
            var individual = await prisma.assessments_expanded.findFirst({
                where: {
                    assessment_id: assessment_id,
                    group_id: null
                },
                select: {
                    tcu: true,
                    vis: true,
                    tco: true,
                    pro: true,
                    tpe: true,
                    lea: true,
                    comment: true,
                    opened_on: true
                }
            })
            if (individual == null) {
                return {
                    redirect: {
                        destination: '/404',
                        permanent: false,
                    }
                }
            } else {
                const assessment = {
                    openedOn: individual.opened_on
                }
                delete individual.opened_on
        
                return {
                    props: { 
                        data: session,
                        scores: individual,
                        team_scores: false,
                        assessment: assessment,
                        askFeedback: user.ask_feedback,
                        userName: user.first_name
                    }
                }
            }
        } else { 
            var team_id = parseInt(team_id)   
            openedOn = await prisma.teamassessments_open.findUnique({
                where: {
                    teamassessment_id: assessment_id
                },
                select: {
                    opened_on: true
                }
            })
            if (!openedOn) {
                openedOn = await prisma.teamassessments_closed.findUnique({
                    where: {
                        teamassessment_id: assessment_id
                    },
                    select: {
                        opened_on: true
                    }
                })                
            }  
            var isAssessment = await prisma.assessments_expanded.findFirst({
                where: {
                    user_id: user_id,
                    teamassessment_id_closed: assessment_id
                }
            })
            if (isAssessment == null) {
                var isAssessment = await prisma.assessments_expanded.findFirst({
                    where: {
                        user_id: user_id,
                        teamassessment_id_open: assessment_id 
                    }
                })
                if (isAssessment == null ) {
                    isMember = await prisma.members.findUnique({
                        where: {
                            group_id_user_id: {
                                group_id: team_id,
                                user_id: user_id
                            }
                        }
                    })

                    if (!isMember) {
                        return {
                            redirect: {
                                destination: '/404',
                                permanent: false,
                            }
                        }
                    }
                }
            } 

            const teamName = await prisma.groups.findUnique({
                where: {
                    group_id: team_id
                },
                select: {
                    name: true,
                    leaders_scores: true,
                }
            })
            const assessment = {
                openedOn: openedOn.opened_on, 
                teamName: teamName.name
            }

            let scores

            if (isMember) {
                scores = await prisma.assessments_expanded.findFirst({
                    where: {
                        user_id: user_id,
                        teamassessment_id_open: assessment_id
                    },
                    select: {
                        tcu: true,
                        vis: true,
                        tco: true,
                        pro: true,
                        tpe: true,
                        lea: true,
                        comment: true
                    }
                })
                if (!scores) {
                    scores = null
                }
            } 
            let team_scores
            if (team_id == 0) {
                team_scores = false 
            } else {
                team_scores = await prisma.teamassessments_closed.findUnique({
                    where: {
                        teamassessment_id: assessment_id
                    },
                    select: {
                        tcu: true,
                        vis: true,
                        tco: true,
                        pro: true,
                        tpe: true,
                        lea: true,
                    }
                })
                if (team_scores == null) {
                    team_scores = false
                } else {
                    var team_comments_json = await prisma.assessments_expanded.findMany({
                        where: {
                            teamassessment_id_closed: assessment_id
                        },
                        select: {
                            comment: true
                        }
                    })

                    team_comments = []

                    for (var i in team_comments_json) {
                        var c = team_comments_json[i].comment
                        if (c)
                        team_comments.push(c)
                    }

                    if (team_comments.length == 0) {
                        team_comments = false
                    }
                }
            }
            return {
                props: { 
                    data: session,
                    scores: scores,
                    team_scores: team_scores,
                    team_comments: team_comments,
                    assessment: assessment,
                    askFeedback: user.ask_feedback,
                    userName: user.first_name,
                    leaderScores: teamName.leaders_scores,
                }
            }
        }
    }
  }