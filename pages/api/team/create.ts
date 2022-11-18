import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team } = req.body
    const leader = team.leader
    const members_arr = team.members

    const newTeam = await prisma.groups.create({
        data: {
            name: team.name
        },
    })
    delete newTeam.invite_token
    const newGroups_all = await prisma.groups_all.create({
        data: newTeam
    })

    const group_id = newTeam.group_id
    const leaderEntry = await prisma.members.create({
        data: {
            group_id: group_id,
            user_id: leader,
            isadmin: true
        }
    })

    for (const i in members_arr) {
        const email = members_arr[i]
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
                    group_id: group_id,
                    user_id: user.user_id,
                    invited_by: leader
                }
            })         
        } else {
            const unregEntry = await prisma.invitations_unregistered.create({
                data: {
                    group_id: group_id,
                    email: email,
                    invited_by: leader
                }
            })
        }
    }
    res.json({status:'ok'})
}