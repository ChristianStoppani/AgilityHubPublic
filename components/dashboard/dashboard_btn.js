import Buttonwait from "../buttonwait";
import router from 'next/router'
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Dashboardbtn(props) {
    const { text, link, cols, signout, icon, support, noFeedback, open, invites } = props

    function handleClick(e) {
        //redirect to page or trigger action of button
        e.preventDefault()
        e.currentTarget.children[1].classList.remove('w3-hide')
        if (signout) {
            signOut()
        } else if (support) {
            var email = document.createElement("a")
            email.href = "mailto:support@agilityhub.ch"
            email.click()
            e.currentTarget.children[1].classList.add('w3-hide')
        } else {
            router.push(link)
        }
    }

    return (
        <>
            <div className = {'w3-hide-small db-btn-cont w3-col'+' '+cols}>                  
                <button onClick = {(e)=>{handleClick(e)}} className = 'db-btn'>
                    <div className="db-icon-txt">
                    <FontAwesomeIcon icon={icon} size='xl'/>&nbsp;&nbsp;
                    <div>
                        {text} &nbsp;
                        {open
                        ?<span className="w3-badge w3-red">{open}</span>
                        :null}
                        {invites
                        ?<span className="w3-badge w3-red">{invites}</span>
                        :null}
                    </div>
                    {noFeedback
                    ?<span className="w3-badge w3-red">&#9873;</span>
                    :null}
                    </div>
                    <Buttonwait color={'#283747'} />
                </button>
            </div> 
            <div className = {'w3-hide-large w3-hide-medium db-btn-cont-s w3-col'+' '+cols}>                  
                <button onClick = {(e)=>{handleClick(e)}} className = 'db-btn-s'>
                    <div>
                    <FontAwesomeIcon icon={icon} size='xl'/>&nbsp;&nbsp;
                    {text} &nbsp;
                    {open
                    ?<span className="w3-badge w3-red">{open}</span>
                    :null}
                    {invites
                    ?<span className="w3-badge w3-red">{invites}</span>
                    :null}
                    {noFeedback
                    ?<span className="w3-badge w3-red">&#9873;</span>
                    :null}
                    </div>
                    <Buttonwait color={'#283747'} />
                </button>
            </div> 
        </>
    )
}