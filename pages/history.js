import Link from "next/link";
import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/router";
import { Line, Radar} from 'react-chartjs-2';
import { Chart as ChartJS, LineElement } from 'chart.js';
import { RadialLinearScale, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { prisma } from '../components/db'
import Unpublished from "../components/unpublished";

import home_btn from '../public/images/Home_button_75.svg';
import close_btn from '../public/images/close_btn_50.svg';
import del_btn from '../public/images/trashcan.svg';

export default function teamhistory(props) {

  const router = useRouter()
  const { team } = router.query

  const history = props.history_lst

  ChartJS.register(RadialLinearScale, PointElement, LineElement, CategoryScale, LinearScale, Tooltip, Title, Legend)

  const teams = history.teams
  const noteam = history.withoutteam
  var teams_dict = [];
  var teams_ids = [];

  const [closed, setClosed] = useState([])
  const [open, setOpen] = useState([])
  const [teamLeader, setTeamLeader] = useState(false)

  const [trigger, setTrigger] = useState(false)

  const [csvArray, setCsvArray] = useState([])
  const [chartArray, setChartArray] = useState([])
  const [chartCount, setChartCount] = useState(0)
  const [teamName, setTeamName] = useState('')
  const [filename, setFilename] = useState('')
  
  for (const team in teams) {
    teams_dict.push({name: teams[team].name, id: teams[team].id})
    teams_ids.push(String(teams[team].id))
  }

  teams_ids.push('noteam')

// checks whether team in url exists and if so selects it, otherwise redirects to first existing team
  useEffect(() => {
    if (team) {
      let selected = document.getElementById('history-teams');
      if(teams_ids.includes(team)){
        selected.value = team;
        setAssessments(team)
      } else {
        handleSelect(teams_ids[0])
      }
    } else {
      handleSelect(teams_ids[0])
    }
  }, [])

  function closeModal() {
    document.getElementById('unpublished-frame').style.display = 'none'
  }

  function handleModal() {
    document.getElementById('unpublished-frame').style.display = 'flex'
  }

  useEffect(() => {
    if (trigger){
      setTrigger(false)
    }

    var modal = document.getElementById('unpublished-frame');
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none'
      }
    }
  })

  function setAssessments(selId) {

    if (teams) {
    var selTeam = teams.find(x => x.id == selId)
    }

    if (selId == 'noteam') {
      const closed = [...noteam]
      const sortedC = closed.sort(function (a, b){ 
        const openedA = a.opened_on
        const openedB = b.opened_on
        if (openedA < openedB) {
          return 1
        } else {
          return -1
        } })  
      setClosed(sortedC)
      setOpen([])
      setTeamLeader(true)
    } else {
      const closed = [...selTeam.completed]
      const sortedC = closed.sort(function (a, b){ 
        const openedA = a.opened_on
        const openedB = b.opened_on
        if (openedA < openedB) {
          return 1
        } else {
          return -1
        } })  
      setClosed(sortedC)
      const open = [...selTeam.open]
      const sortedO = open.sort(function (a, b){ 
        const openedA = a.opened_on
        const openedB = b.opened_on
        if (openedA >= openedB) {
          return 1
        } else {
          return -1
        } })      
      setOpen(sortedO)
      if (selTeam.leader) {
        setTeamLeader(true)
      } else {
        setTeamLeader(false)
      }
    }

    let name
    var data = []

    if (selId !='noteam') {
      var teamJSON = teams.find(x => x.id == selId)
      name = teamJSON.name
      data = teamJSON.completed
    } else {
      name = 'Individual assessments'
      data = history.withoutteam
    }

    const now_ext = new Date()

    const now = now_ext.getHours()+':'+now_ext.getMinutes()+' ' + now_ext.getDate()+'.'+(now_ext.getMonth()+1)+'.'+now_ext.getFullYear()

    const csvArray_temp = [
      [name + ' exported ' + now,'','','','','',''],
      ['Dates','Team culture', 'Vision and planning','Team collaboration','Product','Team performance','Leadership']
    ]

    data.map(d => {
      csvArray_temp.push([convertDate(d.opened_on), d.tcu, d.vis, d.tco, d.pro, d.tpe, d.lea])
    })

    setCsvArray(csvArray_temp)

    var chartArray = [[],[],[],[],[],[],[]]

    data.map(d => {
      chartArray[0].push(convertDate(d.opened_on))
      chartArray[1].push(d.tcu)
      chartArray[2].push(d.vis)
      chartArray[3].push(d.tco)
      chartArray[4].push(d.pro)
      chartArray[5].push(d.tpe)
      chartArray[6].push(d.lea)
    })

    const filename = name.replace(/[^a-zA-Z0-9]/g,"")+'_history.csv'

    setChartArray(chartArray)
    setChartCount(chartArray[0].length)
    setTeamName(name)
    setFilename(filename)

    setTrigger(true)
  }

  function handleTeamsML() {
    const selected = document.getElementById('history-teams').value
    handleSelect(selected)
  }

  function handleTeamsS() {
    const selected = document.getElementById('history-teams-s').value
    handleSelect(selected)
  }

// updates url when new team is selected
  function handleSelect(selected) {
    router.push('/history?team='+ selected)
    setAssessments(selected)
  }

  function convertDate(date) {
    var datePart = date.match(/\d+/g),
    year = datePart[0],
    month = datePart[1],
    day = datePart[2]
    return day+'.'+month+'.'+year
  }

  function handleChart() {
    const canvas = document.getElementById('history-chart')
    const ctx = canvas.getContext('2d')
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    const imgURL = document.getElementById('history-chart').toDataURL('image/png', 1)
    document.getElementById('chart-download').href=imgURL
    document.getElementById('chart-download').click()
  }

  function handleCSV(csvArray, filename) {
    let csvContent = "data:text/csv;charset=utf-8," 
    + csvArray.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); 
    link.click();
  }

  async function deleteAsm(e) {
    e.preventDefault()
    e.stopPropagation()
    const conf = confirm('Confirm to delete assessment')
    if (conf) {
      const team_id = router.query.team
      const assessment_id = parseInt(e.target.getAttribute('data-id'))
      const body = { team_id, assessment_id, open: false }
      try {
        let response = await fetch('/api/assessment/delete', {
            method:'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const res = await response.json()
        router.reload()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return(
      <div id = 'hist-page'>
        <div className="page-bg"/>

        <Head>
            <title>History | Agility Hub</title>
        </Head>

        <div className="page-cont">

        <div id='history-bar' className="w3-bar">
          <div id = 'history-title' className="w3-bar-item">
            History
          </div>
          
          <Link href = '/'>
            <a id = 'hist-home-btn' className = 'w3-bar-item w3-right'>
                <Image
                    src = {home_btn}
                    layout = 'responsive' />
            </a>
          </Link>
        </div>

        <div id = 'hist-btns-bar-ml' className="w3-hide-small w3-bar">
        <select onChange = {handleTeamsML} id = 'history-teams' name = 'history-teams' className="w3-bar-item">
          {teams_dict.map((team) => (
            <option value = {team.id} key = {team.id}>{team.name}</option>
          ))}
          <option value = 'noteam' key='noteam'>Individual assessments</option>
        </select>

        { team != 'noteam'
          ? <><button onClick = {handleModal} className = 'normal-btn w3-bar-item' id = 'open-assessments-btn'>
              Unpublished ({open.length})
            </button>
            </>
          : null }
        </div>

        <div id = 'hist-btns-bar-s' className="w3-hide-large w3-hide-medium w3-padding">
        <select onChange = {handleTeamsS} id = 'history-teams-s' name = 'history-teams' className="w3-padding">
          {teams_dict.map((team) => (
            <option value = {team.id} key = {team.id} >{team.name}</option>
          ))}
          <option value = 'noteam' key='noteam'>Individual assessments</option>
        </select>

        { team != 'noteam'
          ? <><button onClick = {handleModal} className = 'normal-btn w3-padding' id = 'open-assessments-btn-s'>
              Unpublished ({open.length})
            </button>
            </>
          : null }
        </div>

        { team != 'noteam'
        ? <div id = 'unpublished-frame' className="w3-modal" style = {{width:'100%', height:'100%'}}>
          <div id = 'unpublished-content' className="w3-modal-content">
            <div id = 'unpublished-bar' className="w3-bar">
            <div className = 'title w3-bar-item' id = 'unpublished-title'>
              Unpublished ({open.length})
            </div>
            <button className="w3-bar-item" id = 'unpublished-close-btn' onClick = {closeModal}>
              <Image
                src = {close_btn}
                layout = 'responsive'/>
            </button>
            </div>
            <div id = 'unpublished-list'>
              {open.map((assessment) =>(
                <Unpublished teamLeader={teamLeader} assessment={assessment} key={assessment.teamassessment_id} />
              ))}
              {open.length != 0
              ? null
              : <div id = 'no-unpublished' className = 'normal-text'>There are no unpublished assessments for this team at the moment.</div>}
            </div>
          </div>
          </div>
        : null}

        <div id = 'history-assessments'> 
          {closed.length == 0
          ? <div className="normal-text"> No assessments yet</div>
          :<>
          <div id='history-chart-container' className="w3-hide-small w3-card" style={{backgroundColor:'#ffffff'}}>
            <Line
            id = 'history-chart'
            options = {{
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              stacked: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: teamName+' agile history',
                  font: {
                    family: 'Rubik',
                    size: 20
                  }
                }
              }}}
            data = {{
              labels: chartArray[0],
              datasets: [{
                  label: 'Team culture',
                  data: chartArray[1],
                  borderColor: 'rgb(255, 0, 41)',
                  backgroundColor: 'rgb(255, 0, 41)'
                },
                {
                  label: 'Vision and Planning',
                  data: chartArray[2],
                  borderColor: 'rgb(55, 126, 184)',
                  backgroundColor: 'rgb(55, 126, 184)'
                },
                {
                  label: 'Team collaboration',
                  data: chartArray[3],
                  borderColor: 'rgb(102, 166, 30)',
                  backgroundColor: 'rgb(102, 166, 30)'
                },
                {
                  label: 'Product',
                  data: chartArray[4],
                  borderColor: 'rgb(152, 78, 163)',
                  backgroundColor: 'rgb(152, 78, 163)'
                },
                {
                  label: 'Team performance',
                  data: chartArray[5],
                  borderColor: 'rgb(0, 210, 213)',
                  backgroundColor: 'rgb(0, 210, 213)'
                },
                {
                  label: 'Leadership',
                  data: chartArray[6],
                  borderColor: 'rgb(255, 127, 0)',
                  backgroundColor: 'rgb(255, 127, 0)'
                }]
            }}/>
          </div>
          <div style={{display:'flex', flexDirection:'row', margin:'24px'}}>
            <button onClick={handleChart} id='csv-download-btn' className="normal-btn w3-hide-small">Download chart</button>
            <a id='chart-download' download={filename.slice(0, -4)+'_chart'} style={{display:'none'}}> 
            Download
            </a>
            <button onClick={()=>{handleCSV(csvArray, filename)}} id='csv-download-btn' className="normal-btn w3-hide-small">Export history (CSV format)</button>
          </div>
          {closed.map((assessment) => (
            <div key = {(team != 'noteam') 
              ?assessment.teamassessment_id 
              :assessment.assessment_id}
              className = 'asm-container w3-card'>
              <Link 
              href = {(team != 'noteam')
                ?'/team_assessment/'+team+'/'+assessment.teamassessment_id+'/evaluation'
                :'/team_assessment/noteam/'+assessment.assessment_id+'/evaluation'}>            
                <a>
                  <div className="w3-bar asm-bar">
                    <div className="asm-date normal-text w3-bar-item">{convertDate(assessment.opened_on)}</div>
                    {teamLeader
                      ?<button className= 'delete-asm-btn w3-bar-item' onClick={(e)=>{deleteAsm(e)}} >
                      <Image
                        src = {del_btn}
                        layout='fill' 
                        data-id = {(team != 'noteam')
                        ?assessment.teamassessment_id
                        :assessment.assessment_id}/>
                    </button>
                    : null}
                  </div>
                  <div className=" w3-hide-small asm-scores-chart w3-mobile">
                    {window.innerWidth > 600
                      ?<Radar data = {{
                        labels: ['Culture', 'Vision', 'Collab.', 'Product', 'Perf.', 'Lead.'], 
                        datasets: [{
                          data: [assessment.tcu, assessment.vis, assessment.tco, assessment.pro, assessment.tpe, assessment.lea], 
                          borderColor: 'green',
                          borderWidth: 2,
                        }]
                      }}
                        options = {{plugins: {legend: {display: false}}, scale: {min: 0, max: 100, stepSize: 10}, scales: {r:{ticks: {display:false}}}}} />
                      : null}
                    </div>
                    <table className="scores-table">
                      <tbody>
                        <tr><td>Team culture</td><td>{assessment.tcu}</td></tr>
                        <tr><td>Vision and planning</td><td>{assessment.vis}</td></tr>
                        <tr><td>Team collaboration</td><td>{assessment.tco}</td></tr>
                        <tr><td>Product</td><td>{assessment.pro}</td></tr>
                        <tr><td>Team performance</td><td>{assessment.tpe}</td></tr>
                        <tr><td>Leadership</td><td>{assessment.lea}</td></tr>
                      </tbody>
                    </table>
                </a>
              </Link>    
            </div>        
          ))}
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

    const userTeams = await prisma.members.findMany({
      where: {
        user_id: user_id
      },
      select: {
        group_id: true,
        isadmin: true
      }
    })

    const history_lst = {
      teams: []
    }

    for (const i in userTeams) {
      const id = userTeams[i].group_id
      const leader = userTeams[i].group_id
      const team = await prisma.groups.findUnique({
        where: {
          group_id: id
        },
        select: {
          name: true
        }
      })
      const name = team.name
      const team_assessments_closed = await prisma.teamassessments_closed.findMany({
        where: {
          group_id: id
        },
        select: {
          teamassessment_id: true,
          opened_on: true,
          tcu: true,
          vis: true,
          tco: true,
          pro: true,
          tpe: true,
          lea: true
        }
      })
      
      var team_assessments_open = await prisma.teamassessments_open.findMany({
        where: {
          group_id: id
        },
        select: {
          teamassessment_id: true,
          opened_on: true,
          completed_by: true,
          tot: true
        }
      })

      for (const i in team_assessments_open) {
        var completed_id = await prisma.assessments_expanded.findMany({
          where: {
            teamassessment_id_open: team_assessments_open[i].teamassessment_id
          },
          select: {
            user_id: true
          }
        })
        var completed= []
        for (const i in completed_id) {
          var user = await prisma.users.findUnique({
            where: {
              user_id: completed_id[i].user_id
            },
            select: {
              user_id: true,
              first_name: true,
              last_name: true
            }
          })
          if (user.user_id == session.user.id) {
            user.last_name = user.last_name +' (you)'
          }
          completed.push(user)
        }
        const sortedCompleted = completed.sort((a, b) => {
          (a.first_name < b.first_name)
          ?-1
          :1
        })
        const open_id = await prisma.assessments_open.findMany({
          where: {
            teamassessment_id: team_assessments_open[i].teamassessment_id
          },
          select: {
            user_id: true
          }
        })
        var open=[]
        for (const i in open_id) {
          var user = await prisma.users.findUnique({
            where: {
              user_id: open_id[i].user_id
            },
            select: {
              user_id: true,
              first_name: true,
              last_name: true
            }
          })
          if (user.user_id == session.user.id) {
            user.last_name = user.last_name +' (you)'
          }
          open.push(user)
        }
        const sortedOpen = open.sort((a, b) => {
          (a.first_name < b.first_name)
          ?-1
          :1
        })
        team_assessments_open[i]['members'] = {
          open: sortedOpen,
          completed: sortedCompleted
        }
      }     
      const team_entry = {
        id: id,
        leader: leader,
        name: name,
        completed: team_assessments_closed,
        open: team_assessments_open
      }
      history_lst.teams.push(team_entry)
    }

    const individual = await prisma.assessments_expanded.findMany({
      where: {
        group_id: null,
        user_id: user_id
      },
      select: {
        assessment_id: true,
        opened_on: true,
        tcu: true,
        vis: true,
        tco: true,
        pro: true,
        tpe: true,
        lea: true
      }
    })
    history_lst['withoutteam'] = individual

    return {
      props: { data: session,
        history_lst: history_lst
      }
    }
  }