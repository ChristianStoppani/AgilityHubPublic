import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { email, team_id } = req.body

    const user = await prisma.users.findUnique({
        select: {
            user_id: true
        },
        where: {
            email: email
        }
    })

    if (user) {
        const user_id = user.user_id
        const removeUInvite = await prisma.invitations_user.delete({
            where: {
                group_id_user_id:{
                    group_id: team_id,
                    user_id: user_id
                }
            }
        })
    } else {
        const removeUnreg = await prisma.invitations_unregistered.delete({
            where:{
                group_id_email:{
                    group_id: team_id,
                    email: email
                }
            }
        })
    }
    
    res.json({status:'ok'})
}