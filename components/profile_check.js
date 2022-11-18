import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function profilecheck() {  
    const router = useRouter()
    const session = useSession()
    
    if (session.status == 'authenticated') {
        const profile = session.data.user.profile
        const correct = router.pathname == '/linkedinregistration' || router.pathname == '/login' || router.pathname == '/linkedinregistration/success' || router.pathname == '/404' || router.pathname == '/500'

        if (!profile && !correct) {
            router.push('/linkedinregistration')
        }
    }
    
    return null
}