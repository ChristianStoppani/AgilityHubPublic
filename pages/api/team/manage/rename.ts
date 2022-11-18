import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id, team_name } = req.body

    const updateName = await prisma.groups.update({
        data: {
            name: team_name
        },
        where: {
            group_id: team_id
        }
    })
    const updateName2 = await prisma.groups_all.update({
        data: {
            name: team_name
        },
        where: {
            group_id: team_id
        }
    })
    
    res.json({status:'ok'})
}