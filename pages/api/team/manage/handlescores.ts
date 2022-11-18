import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id, include } = req.body

    const handleScores = await prisma.groups.update({
        data: {
            leaders_scores: include
        },
        where: {
            group_id: team_id
        }
    })

    const handleScoresAll = await prisma.groups_all.update({
        data: {
            leaders_scores: include
        },
        where: {
            group_id: team_id
        }
    })
    
    res.json({status:'ok'})
}