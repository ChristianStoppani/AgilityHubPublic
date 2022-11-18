import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { inviteId, accept, userId } = req.body

    const delInvite = await prisma.invitations_user.delete({
        where: {
            group_id_user_id: {
                group_id: inviteId,
                user_id: userId
            }
        }
    })

    if (accept) {
        const addMember = await prisma.members.create({
            data: {
                group_id: inviteId,
                user_id: userId,
                isadmin: false
            }
        })
    }

    res.json({status:'ok'})
}