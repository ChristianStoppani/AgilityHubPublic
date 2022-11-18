import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { user_id, team_id, promote } = req.body

    const changeRole = await prisma.members.update({
        data: {
            isadmin: promote
        },
        where: {
            group_id_user_id: {
                group_id: team_id,
                user_id: parseInt(user_id)
            }
        }
    })
    
    res.json({status:'ok'})
}