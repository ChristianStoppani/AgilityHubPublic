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

    const teamassessment_id = data.teamassessment_id_open
    const user_id = data.user_id
    const team_id = data.group_id

    const assessment_id = assessment.assessment_id
    delete data.group_id
    delete data.teamassessment_id_open

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

    // update counter in teamassessments_open
    const teamassessment = await prisma.teamassessments_open.findUnique({
        where: {
            teamassessment_id: teamassessment_id
        },
        select: {
            completed_by: true,
            tot: true,
            opened_on: true
        }
    })

    const completed = (teamassessment.completed_by + 1) == teamassessment.tot

    if (completed) {
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
                    teamassessment_id_open: teamassessment_id                    
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
                    teamassessment_id_open: teamassessment_id,
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
            teamassessment_id: teamassessment_id,
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
                teamassessment_id_closed: teamassessment_id,
            },
            where: {
                teamassessment_id_open: teamassessment_id,
            }
        })

        const deleteopenassessment = await prisma.teamassessments_open.delete({
            where: {
                teamassessment_id: teamassessment_id
            }
        })
    } else {
        const updateCounter = await prisma.teamassessments_open.update({
            where: {
                teamassessment_id: teamassessment_id 
            },
            data: {
                completed_by: teamassessment.completed_by + 1
            }
        })
        const deleteassessment = await prisma.assessments_open.delete({
            where: {
                group_id_teamassessment_id_user_id: {
                    teamassessment_id: teamassessment_id,
                    group_id: team_id,
                    user_id: user_id
                }
            }
        })
    }
    

    res.json({id:teamassessment_id})
}