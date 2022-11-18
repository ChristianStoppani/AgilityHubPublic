import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id, email, invited_by } = req.body

    const user = await prisma.users.findUnique({
        select: {
            user_id: true
        },
        where: {
            email: email
        }
    })
    if (user) {
        const regEntry = await prisma.invitations_user.create({
            data: {
                group_id: team_id,
                user_id: user.user_id,
                invited_by: invited_by
            }
        })  
        //send out email         
    } else {
        const unregEntry = await prisma.invitations_unregistered.create({
            data: {
                group_id: team_id,
                email: email,
                invited_by: invited_by
            }
        })
        //send out email
    }
    
    res.json({status:'ok'})
}