import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {

    const { name, email, message } = req.body

    //send msg to agilityhub and also user

    const usermsg = {
        to: email,
        bcc: 'contact@agilityhub.ch',
        from: 'contact@agilityhub.ch',
        templateId: 'd-2fda1ef7c4b24ad6beb999ac715e3667', 
        dynamicTemplateData: {
            name: name,
            email: email,
            message: message,
        }
    }

   sendgrid.send(usermsg)

    

}