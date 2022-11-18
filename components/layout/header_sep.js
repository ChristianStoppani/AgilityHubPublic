import Image from 'next/image'
import { useSession } from 'next-auth/react'
import menu from '../../public/images/menu.svg'

export default function Headersep() {
    const { data: session } = useSession()
    return (
        <div className="w3-bar" style={{visibility:'hidden'}}>
            <div className = 'w3-bar-item' id = 'header-title'>
                AH           
            </div>
            <div className="w3-bar-item w3-hide-medium w3-hide-large" id='menu-btn'>
                <Image 
                    src = {menu}
                    layout="responsive" 
                    priority={true}/>
            </div>
            {session
            ?<button className="w3-bar-item" id = 'user-options-button'>
                {session.user.initials}
            </button>
            :<button className ='w3-bar-item' id = 'log-in-button'>
                LI
            </button>}
        </div>
    )
}