import { getSession } from "next-auth/react"
import AlreadySignedIn from "../components/access/alreadysignedin";

import Login_page from "../components/access/Login_page";

export default function login({ data }) {

    const session = data

    if (session) {
        return <AlreadySignedIn />
    } else {
        return <Login_page />
    }
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
  
    return {
      props: { data: session }
    }
  }