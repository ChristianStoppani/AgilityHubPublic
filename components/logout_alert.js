import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIdleTimer} from 'react-idle-timer';

export default function logoutAlert() {
    const { data: session } = useSession();

    const router = useRouter()
    
    const [trigger, setTrigger] = useState(false)

    useIdleTimer({
        timeout: 1000*60*60,
        onIdle: function(){setTrigger(true)},
        crossTab: true,
        stopOnIdle: true
    })

    function handleClick() {
        setTrigger(false)
        router.reload()
    }

    return (
        <>
        {(trigger && session && !session.user.remember)
        ?<div id='logout-alert-container' onClick={handleClick}>
            <div id='logout-alert' className="normal-text"> 
                You have been logged out due to extended inactivity (1 hour)
                <button className='normal-btn' id='logout-exit' onClick={handleClick}>
                    OK
                </button>
            </div>
        </div>
        :null}
        </>
    )
}