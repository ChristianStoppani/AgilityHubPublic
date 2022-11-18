import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { user_id } = req.body

    const nofeedback = await prisma.users.update({
        where: {
            user_id: user_id
        },
        data: {
            ask_feedback: false
        }
    })

    res.json({status: 'ok'})
}