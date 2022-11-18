import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { user_id } = req.body

    const abs_url = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/api/user/change/removeimage'

    const removeImage = await fetch(abs_url, {
        method:'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id }),
      })

    const groupsAdmin = await prisma.members.findMany({
        where: {
            user_id: user_id,
            isadmin: true
        }, 
        select: {
            group_id: true
        }
    })
    var groupsAdmin_arr = []
    for (const i in groupsAdmin) {
        groupsAdmin_arr.push(groupsAdmin[i].group_id)
    }
    const adminsNumber = await prisma.members.groupBy({
        by: ['group_id'],
        where: {
            group_id: {
                in: groupsAdmin_arr
            },
        isadmin: true
        },
        _count: {
            isadmin: true,
        }   
    })
    const membersNumber = await prisma.members.groupBy({
        by: ['group_id'],
        where: {
            group_id: {
                in: groupsAdmin_arr
            },
        isadmin: false
        },
        _count: {
            isadmin: true,
        }   
      })
      for (const i in adminsNumber) {
        const group_id = adminsNumber[i].group_id
        const admins = adminsNumber[i]._count.isadmin
        const members_obj = membersNumber.find(x=>x.group_id == group_id)
        let members
        if (members_obj) {
            members = members_obj._count.isadmin
        } else {
            members = 0
        }
        if (admins == 1 && members == 0) {
          //delete
            const delGroup = await prisma.groups.delete({
                where: {
                    group_id: group_id
                }
            })
        } else if (admins == 1 && members != 0) {
          //promote
            const findMember = await prisma.members.findFirst({
                where: {
                    group_id: group_id,
                    isadmin: false
                },
                select: {
                    user_id: true
                }
            })
            const promoteMember = await prisma.members.update({
                where: {
                    group_id_user_id: {
                        user_id: findMember.user_id,
                        group_id: group_id
                    }
                },
                data: {
                    isadmin: true
                }
            })
        }
    }

    const deletedUser = await prisma.users.delete({
        where: {
            user_id: user_id
        }
    })

    delete deletedUser['ask_feedback']
    delete deletedUser['linkedin_id']

    const addToUsersDeleted = await prisma.users_deleted.create({
        data: deletedUser
    })

    res.json({status:'ok'})
}