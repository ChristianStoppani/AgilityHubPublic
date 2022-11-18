import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { email, first_name, confirmation_link } = req.body

    const msg = {
        to: email,
        from: 'contact@agilityhub.ch',
        templateId: 'd-85e2fb5fd60b40dc9cf90eba7dcf8374', 
        dynamicTemplateData: {
            first_name: first_name,
            confirmation_link: confirmation_link,
        }
    }
    
    sendgrid.send(msg)

}