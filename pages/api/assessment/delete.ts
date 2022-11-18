import { prisma } from '../../../components/db';import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }

    const { team_id, assessment_id, open } = req.body

    if (team_id == 'noteam') {
        const delIndividual = await prisma.assessments_expanded.delete({
            where: {
                assessment_id: assessment_id
            }
        })
    } else {
        if (!open) {
            const delTeam = await prisma.teamassessments_closed.delete({
                where: {
                    teamassessment_id: assessment_id
                }
            })
        } else {
            const delOpen = await prisma.teamassessments_open.delete({
                where: {
                    teamassessment_id: assessment_id
                }
            })
            const delOpenCompleted = await prisma.assessments_expanded.deleteMany({
                where: {
                    teamassessment_id_open: assessment_id
                }
            })
        }
    }

    res.json({id: assessment_id})
}