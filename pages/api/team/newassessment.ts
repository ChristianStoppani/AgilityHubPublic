import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { team_id } = req.body

    const leaderScores = await prisma.groups.findUnique({
        where: {
            group_id: team_id
        },
        select: {
            leaders_scores: true
        }
    })

    const include = leaderScores.leaders_scores

    const members_id_arr = await prisma.members.findMany({
        where: {
            group_id: team_id
        },
        select: {
            user_id: true
        }
    })

    const members_id = []

    for (const i in members_id_arr) {
        members_id.push(members_id_arr[i].user_id)
    }

    const date_obj = new Date()
    const month = date_obj.getMonth() + 1
    const date = date_obj.getFullYear()+'-'+('0' + month).slice(-2)+'-'+('0' + date_obj.getDate()).slice(-2)

    const newassessment = await prisma.teamassessments_open.create({
        data: {
            group_id: team_id,
            completed_by: 0,
            tot: members_id.length,
            opened_on: date
        }
    })

    const assessment_id = newassessment.teamassessment_id

    const entries = []

    for (const i in members_id) {
        entries.push({
            group_id: team_id,
            teamassessment_id: assessment_id,
            user_id: members_id[i]
        })
    }

    const assessments_open = await prisma.assessments_open.createMany({
        data: entries
    })

    res.json({status: entries})
}