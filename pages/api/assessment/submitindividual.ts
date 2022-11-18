import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { data } = req.body

    //add to assessments_expanded
    const assessment = await prisma.assessments_expanded.create({
        data: data
    })

    const assessment_id = assessment.assessment_id
    delete data.group_id
    delete data.opened_on

    const profile = await prisma.profiles.findUnique({
        where: {
            user_id: data.user_id
        },
        select: {
            version: true
        }
    })

    var data_all = {
        assessment_id: assessment_id,
        ...data,
        profile_version: profile.version
    }

    //add to assessments_expanded_all
    const assessment_all = await prisma.assessments_expanded_all.create({
        data: data_all
    })

    
    res.json({id:assessment_id})
}