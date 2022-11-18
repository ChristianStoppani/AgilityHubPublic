import { getSession } from "next-auth/react"
import Accessmodals from "../components/access/accessmodals"
import AlreadySignedIn from "../components/access/alreadysignedin"
import { prisma } from '../components/db'

export default function login({ data, tokens }) {


    const session = data

    if (session) {
        return <AlreadySignedIn session = {session} />
    } else {
        return (
            <div className = 'signup-page'>
                <Accessmodals tokens = {tokens} />
            </div>
        )
    }
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const tokens = await prisma.users_unconfirmed.findMany({
        select: {
            token:true
        }
    })
  
    return {
      props: {  data: session,
                tokens:tokens }
    }
  }