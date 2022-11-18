import sendgrid from '@sendgrid/mail'
import { prisma } from '../../../components/db'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { email, invited_by, team_id, team, multiple } = req.body

    let msg

    if (!multiple) {
        const inviter = await prisma.users.findUnique({
            where: {
                user_id: invited_by
            },
            select: {
                first_name: true,
                last_name: true
            }
        })
        const inviter_name = inviter.first_name + ' ' + inviter.last_name
        const team = await prisma.groups.findUnique({
            where: {
                group_id: team_id
            },
            select: {
                name: true
            }
        })
        const team_name = team.name
        msg = {
            to: email,
            from: 'contact@agilityhub.ch',
            templateId: 'd-1eaab18afaa14a769c49847a6bcf3cc9', 
            dynamicTemplateData: {
                inviter: inviter_name,
                team_name: team_name
            }
        }
            sendgrid.send(msg)
    } else {
        const inviter = await prisma.users.findUnique({
            where: {
                user_id: team.leader
            },
            select: {
                first_name: true,
                last_name: true
            }
        })
        const inviter_name = inviter.first_name + ' ' + inviter.last_name
        msg = {
            to: team.members,
            from: 'contact@agilityhub.ch',
            templateId: 'd-1eaab18afaa14a769c49847a6bcf3cc9', 
            dynamicTemplateData: {
                inviter: inviter_name,
                team_name: team.name
            }
        }
            sendgrid.sendMultiple(msg)     
    }
}