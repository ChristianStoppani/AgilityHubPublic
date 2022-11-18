import { prisma } from '../../../../components/db';

export default async function handle(req, res) {
    const { data } = req.body

    const result = await prisma.users.update({
        where: {
            user_id: data.user_id
        },
        data: {
            password: data.password
        }
    })

    const delEntry = await prisma.changes_pw.delete({
        where: {
            change_id: data.change_id
        }
    })

    res.json({status:'ok'})
}