import { prisma } from '../../../components/db';

export default async function handle(req, res) {
    const { newUser } = req.body

    const result = await prisma.users_unconfirmed.create({
        data: newUser
    })

    res.json(result)
}