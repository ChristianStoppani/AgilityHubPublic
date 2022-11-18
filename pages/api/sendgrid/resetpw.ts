import sendgrid from '@sendgrid/mail'
import { prisma } from '../../../components/db'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { user_id, confirmation_link, email } = req.body

    let user

    if (email) {
        user = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                first_name: true,
                email: true
            }
        })
    } else {
        user = await prisma.users.findUnique({
            where: {
                user_id: user_id
            },
            select: {
                first_name: true,
                email: true
            }
        })
    }

    const msg = {
        to: user.email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-997c0780390d4aa187792c8116ff3a6f', 
        dynamicTemplateData: {
            first_name: user.first_name,
            confirmation_link: confirmation_link,
        }
    }
    
        sendgrid.send(msg)
}