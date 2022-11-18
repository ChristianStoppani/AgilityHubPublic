import { prisma } from '../../components/db';

export default async function handle(req, res) {
    const scores = await prisma.dummy_scores.findMany({
        select: {
            user_id: true,
            profile_version: true,
            pro: true,
            vis: true,
            lea: true,
            tpe: true,
            tco: true,
            tcu: true
        }
    }
    )
    const profiles = await prisma.dummy_profiles.findMany()

    const to_from = await prisma.dummy_profiles.aggregate({
        _min: {
            age: true,
            experience: true
        },
        _max: {
            age: true,
            experience: true
        }
    })

    res.json({
        scores:scores,
        profiles: profiles,
        to_from: to_from
    })
}