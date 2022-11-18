import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { teamId, userId } = req.body

    const leaveTeam = await prisma.members.delete({
        where: {
            group_id_user_id: {
                group_id: teamId,
                user_id: userId
            }
        }
    })

    res.json({status: 'ok'})
}