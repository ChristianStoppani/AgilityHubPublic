import sendgrid from '@sendgrid/mail'
import { prisma } from '../../../components/db'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { email, user_id, confirmation_link } = req.body

    const user = await prisma.users.findUnique({
        where: {
            user_id: user_id
        },
        select: {
            first_name: true
        }
    })

    const msg = {
        to: email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-fe0fe1f6a854427b8d3a3d6dac8299a8', 
        dynamicTemplateData: {
            first_name: user.first_name,
            confirmation_link: confirmation_link,
            email_address: email
        }
    }
    
   sendgrid.send(msg)

}