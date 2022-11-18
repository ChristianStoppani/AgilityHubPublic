import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { entry } = req.body

    const result = await prisma.changes_pw.create({
        data: entry
    })

    res.json(result)
}