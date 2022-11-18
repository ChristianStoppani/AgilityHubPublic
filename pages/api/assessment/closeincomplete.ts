import { prisma } from '../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { team_id, assessment_id } = req.body

    const teamassessment = await prisma.teamassessments_open.findUnique({
        where: {
            teamassessment_id: assessment_id
        },
        select: {
            completed_by: true,
            tot: true,
            opened_on: true
        }
    })
    
    const includeScores = await prisma.groups.findUnique({
        where: {
            group_id: team_id
        },
        select: {
            leaders_scores: true
        }
    })
    const include = includeScores.leaders_scores

    let average_scores

    if (include) {
        average_scores = await prisma.assessments_expanded.aggregate({
            where: {
                teamassessment_id_open: assessment_id                  
            },
            _avg: {
                tcu: true,
                vis: true,
                tco: true,
                pro: true,
                tpe: true,
                lea: true                    
            }
        })
    } else {
        const members_arr = await prisma.members.findMany({
            where: {
                group_id: team_id,
                isadmin: false
            },
            select: {
                user_id: true
            }
        })
        const members_id = []
        for (const i in members_arr) {
            members_id.push(members_arr[i].user_id)
        }
        average_scores = await prisma.assessments_expanded.aggregate({
            where: {
                teamassessment_id_open: assessment_id,
                user_id: {
                    in: members_id
                }                    
            },
            _avg: {
                tcu: true,
                vis: true,
                tco: true,
                pro: true,
                tpe: true,
                lea: true                    
            }
        })
    }

    const completedEntry = {
        teamassessment_id: assessment_id,
        group_id: team_id,
        tcu: Math.round(average_scores._avg.tcu),
        vis: Math.round(average_scores._avg.vis),
        tco: Math.round(average_scores._avg.tco),
        pro: Math.round(average_scores._avg.pro),
        tpe: Math.round(average_scores._avg.tpe),
        lea: Math.round(average_scores._avg.lea),
    }

    const addToAll = await prisma.teamassessment_all.create({
        data: completedEntry
    })

    completedEntry['opened_on'] = teamassessment.opened_on

    const addToClosed = await prisma.teamassessments_closed.create({
        data: completedEntry
    })

    const addFK = await prisma.assessments_expanded.updateMany({
        data: {
            teamassessment_id_closed: assessment_id,
        },
        where: {
            teamassessment_id_open: assessment_id,
        }
    })

    const deleteopenteamassessment = await prisma.teamassessments_open.delete({
        where: {
            teamassessment_id: assessment_id
        }
    })

    const deleteopenassessments = await prisma.assessments_open.deleteMany({
        where: {
            teamassessment_id: assessment_id
        }
    })

    res.json({status: 'ok'})
}