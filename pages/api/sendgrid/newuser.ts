import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { email, first_name } = req.body

    const msg = {
        to: email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-6e87c2bc463b4756a140f5c86c5ec85e', 
        dynamicTemplateData: {
            first_name: first_name
        }
    }
    
    sendgrid.send(msg)

}