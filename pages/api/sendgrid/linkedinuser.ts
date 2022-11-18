import sendgrid from '@sendgrid/mail'
import { prisma } from '../../../components/db'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { user_id, first_name } = req.body

    const user = await prisma.users.findUnique({
        where: {
            user_id: user_id
        },
        select: {
            email: true
        }
    })

    const email = user.email

    const msg = {
        to: email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-6e87c2bc463b4756a140f5c86c5ec85e', 
        dynamicTemplateData: {
            first_name: first_name
        }
    }
    
    sendgrid.send(msg)

    res.json({status:'ok', email: email})

}