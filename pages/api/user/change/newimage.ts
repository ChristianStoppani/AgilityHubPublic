import { prisma } from '../../../../components/db';
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { user_id, url } = req.body

    const newimage = await prisma.users.update({
        where: {
            user_id: user_id
        },
        data: {
            profile_img: url
        }
    })

    //remove from cache
    const client = new CloudFrontClient({ 
        region: "eu-west-3",
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY
        }});

    const command = new CreateInvalidationCommand({
        DistributionId: 'E23FVPDRX2AUX5',
        InvalidationBatch: {
            CallerReference: String(Date.now()),
            Paths: {
                Quantity: 1,
                Items: [
                    '/user_' + user_id
                ] 
            }
        }
    })

    const data = await client.send(command);

    
    res.json({status: data})
}