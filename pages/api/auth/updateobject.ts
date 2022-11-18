import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })

    const { user_id } = req.body

    var user_db = await prisma.users.findUnique({
        select: {
            user_id: true,
            email: true,
            first_name: true,
            last_name: true,
            profile_img: true,
        },
        where:{
            user_id: user_id
        }
    })

    let user

    if (user_db) {
        user = user_db

        user['id'] = user['user_id'] 
        delete user.user_id

        user['image'] = user['profile_img'] 
        delete user.profile_img
  
        const surArray = user['last_name'].match(/\b(\w)/g)
        surArray.splice(2)
        const initials = user['first_name'][0] + surArray.join('')
        user['initials'] = initials

        user['name'] = user['first_name']+' '+user['last_name'] 
        delete user.first_name
        delete user.last_name
    } else {
        user = null
    }

    res.json(user)
}