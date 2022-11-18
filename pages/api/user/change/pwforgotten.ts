import { prisma } from '../../../../components/db';

export default async function handle(req, res) {
    const { data } = req.body

    const user = await prisma.users.findUnique({
        where: {
            email: data.email
        }
    })

    let ans

    if (user) {
        const pwChangeEntry = await prisma.changes_pw.create({
            data: {
                user_id: user.user_id,
                token: data.token
            }
        })  
        ans = {status:'ok'}
        //logic to send recovery email
    } else {
        ans = {status:'noemail'}
    }
    res.json(ans)
}