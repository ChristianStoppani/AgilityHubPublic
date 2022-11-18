import Link from "next/link"
import { useState } from "react"

export default function Article(props) {

    const {title, website, summary, link} = props

    const [showSummary, setShowSummary] = useState(false)

    function toggleSummary(e) {
        //show/hide summary on small devices
        e.preventDefault()
        setShowSummary(!showSummary)
        if(showSummary) {
            e.target.parentNode.lastChild.className = 'w3-hide-small'
        } else {
            e.target.parentNode.lastChild.className = ''
        }
    }

    return (
        <Link href={link}>
            <a target='_blank'>
                <div id = 'article-cont'>
                    <div id='article-header'>
                        {title} | {website}
                    </div>
                    <button id='toggle-summary-btn' onClick={(e)=>{toggleSummary(e)}} className="w3-hide-large w3-hide-medium normal-text w3-round-xlarge">
                        {showSummary
                        ?<>&#9650; hide summary</>
                        :<>&#9660; show summary</>}
                    </button>
                    <p align='justify' id='article-summary' className='w3-hide-small'>
                        "{summary}"
                    </p>

                </div>
            </a>
        </Link>
    )
}