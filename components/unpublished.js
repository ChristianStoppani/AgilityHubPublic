import { useState } from "react";
import { useRouter } from "next/router";
import Buttonwait from "./buttonwait";

export default function unpublished(props) {
    const router = useRouter()
    function convertDate(date) {
        var datePart = date.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2]
        return day+'.'+month+'.'+year
      }
    const {teamLeader, assessment } = props
    const [showMembers, setShowMembers] = useState(false)
    function toggleMembers(e) {
        setShowMembers(!showMembers)
        if(showMembers) {
          e.target.parentNode.children[2].className = 'w3-hide normal-text'
        } else {
          e.target.parentNode.children[2].className = 'normal-text'
        }
    }
    async function handlePublish(e) {
      e.target.children[0].classList.remove('w3-hide')
        const team_id = parseInt(router.query.team)
        const assessment_id = parseInt(e.target.getAttribute('data-id'))
    
        const body = { team_id, assessment_id }
        try {
          let response = await fetch('/api/assessment/closeincomplete', {
              method:'PUT',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify(body),
          })
          const res = await response.json()
          router.reload()
        } catch (error) {
          console.error(error)
          e.target.children[0].classList.add('w3-hide')
          alert('Uh oh, something went wrong')
        }
      }
    async function deleteAsm(e) {
    e.target.children[0].classList.remove('w3-hide')
    const conf = confirm('Confirm to delete unpublished assessment')
    if (conf) {      
        e.target.children[0].classList.remove('w3-hide')
        const team_id = router.query.team
        const assessment_id = parseInt(e.target.getAttribute('data-id'))
        const body = { team_id, assessment_id, open: true }
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
        e.target.children[0].classList.add('w3-hide')
        alert('Uh oh, something went wrong')
        }
    }
    }

    return (
        <div className="asm-content w3-card" key={ assessment.teamassessment_id }>
                <div className="asm-content-ml  w3-hide-small">
                  <div style={{display:'flex', alignItems:'center'}}>
                    <div className="unpublished-text normal-text">
                      Opened on:&nbsp;
                    <span style={{fontFamily:'Rubikmed'}}>
                      {convertDate(assessment.opened_on)}
                    </span>
                    , completed by 
                    {' ' + assessment.completed_by}/{assessment.tot}.
                    </div>
                    {teamLeader
                    ?<div style = {{display: 'flex', marginRight: 0, marginLeft: 'auto'}}>
                      <button onClick={(e)=>{handlePublish(e)}} data-id = {assessment.teamassessment_id} className="publish-btn normal-btn">
                        Publish <Buttonwait color={'#ffffff'} />
                      </button>
                      <button onClick={(e)=>{deleteAsm(e)}} data-id = {assessment.teamassessment_id} className="publish-btn normal-btn">
                        Delete <Buttonwait color={'#ffffff'} />
                      </button>
                    </div>
                    :null}
                  </div>
                  <button id='toggle-status' onClick={(e)=>{toggleMembers(e)}} className="normal-text" style={{display: 'flex', justifyContent:'center'}}>
                      {showMembers
                      ?<>&#9650; hide details</>
                      :<>&#9660; show details</>}
                  </button>
                  <div id ='completion-status-ml' className="w3-hide normal-text"> 
                    {assessment.members.completed.map((user) =>(
                      <div key={user.user_id}>&#9745; {user.first_name} {user.last_name}<br /></div>
                      ))}
                    {assessment.members.open.map((user) =>(
                      <div className="status-open" key={user.user_id}>&#9746; {user.first_name} {user.last_name}<br /></div>
                      ))}
                  </div>
                </div>
                <div className="asm-content-s w3-hide-medium w3-hide-large">
                  <div className="unpublished-text-s normal-text">
                    <div>Opened on:</div>
                  <div style={{fontFamily:'Rubikmed'}}>
                    {convertDate(assessment.opened_on)}
                  </div>
                  <div>
                    Completed by{' ' + assessment.completed_by}/{assessment.tot}
                  </div>
                </div>
                <button id='toggle-status' onClick={(e)=>{toggleMembers(e)}} className="w3-hide-large normal-text" style={{paddingBottom:'16px'}}>
                  {showMembers
                  ?<>&#9650; hide details</>
                  :<>&#9660; show details</>}
                </button>
                <div id ='completion-status-s' className=" w3-hide normal-text">
                  {assessment.members.completed.map((user) =>(
                    <div key={user.user_id}>&#9745; {user.first_name} {user.last_name}<br /></div>
                    ))}
                  {assessment.members.open.map((user) =>(
                    <div className="status-open" key={user.user_id}>&#9746; {user.first_name} {user.last_name}<br /></div>
                    ))}
                </div>
                {teamLeader
                ?<div>
                  <button onClick={(e)=>{handlePublish(e)}} data-id = {assessment.teamassessment_id} className="publish-btn-s normal-btn">
                    Publish
                  </button>
                  <button onClick={(e)=>{deleteAsm(e)}} data-id = {assessment.teamassessment_id} className="publish-btn-s normal-btn">
                    Delete
                  </button>
                </ div>
                :null}
                </div>
              </div>
    )

}