import sendgrid from '@sendgrid/mail'
import { prisma } from '../../../components/db'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { email, first_name } = req.body

    const msg = {
        to: email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-672c0b25129a40e6a67aa37f9b03ccc9', 
        dynamicTemplateData: {
            first_name: first_name
        }
    }
    
    sendgrid.send(msg)

}