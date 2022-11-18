import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { user_id, team_id } = req.body

    const addMember = await prisma.members.create({
        data: {
            group_id: team_id,
            user_id: user_id,
            isadmin: false
        }
    })
    

    res.json({status:'ok'})
}