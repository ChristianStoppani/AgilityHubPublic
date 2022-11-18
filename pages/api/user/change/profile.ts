import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { data, user_id } = req.body

    const increment = {
        version: {
            increment: 1
        }
    }

    const data_profiles = {
        ...data,
        ...increment
    }

    const updateProfiles = await prisma.profiles.update({
        where: {
            user_id: user_id
        },
        data: data_profiles,
    })

    var lastVersion = await prisma.profiles_all.findFirst({
        select: {
            id: true,
            dob: true,
            sex: true,
            version: true,
            experience: true
        },
        where: {
          id: user_id
        },
        orderBy: {
          version: 'desc'
        }
    })

    var newEntry = {
    ...lastVersion,
    ...data
    }
    
    newEntry['version'] = lastVersion['version'] + 1

    res.json({status:'ok'})

    const newProfiles_all = await prisma.profiles_all.create({
        data: newEntry
    })
}