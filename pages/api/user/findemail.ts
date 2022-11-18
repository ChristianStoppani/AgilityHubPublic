import { prisma } from '../../../components/db';

export default async function handle(req, res) {
    const { email, returnUser } = req.body

    var emailData = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    let result

    if (returnUser) {
        result = emailData
    } else {
        if (emailData == null) {
            result = false
        } else {
            result = true
        }
    }

    res.json(result)
}