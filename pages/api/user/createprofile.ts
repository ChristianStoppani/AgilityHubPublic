import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { newProfile } = req.body

    const createProfile = await prisma.profiles.create({
        data: newProfile
    })

     newProfile['id'] = newProfile.user_id
     delete newProfile.user_id

    const createProfileAll = await prisma.profiles_all.create({
        data: newProfile
    })
    

    res.json({status:'ok'})
}