import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id } = req.body

    const deleteTeam = await prisma.groups.delete({
        where: {
            group_id: team_id
        }
    })

    res.json({status:'ok'})
}