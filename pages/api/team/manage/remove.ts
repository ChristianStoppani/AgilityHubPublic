import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id, memberId } = req.body

    const removeMember = await prisma.members.delete({
        where: {
            group_id_user_id: {
                group_id: team_id,
                user_id: parseInt(memberId)
            }
        }
    })
    
    res.json({status:'ok'})
}