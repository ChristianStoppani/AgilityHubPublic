import { prisma } from '../../../../components/db';
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const { user_id } = req.body

    const newimage = await prisma.users.update({
        where: {
            user_id: user_id
        },
        data: {
            profile_img: null
        }
    })

    const name = 'user_' + user_id
    const body = { name }

    const abs_url = process.env.NEXT_PUBLIC_ABSOLUTE_URL+'/api/s3/upload'

    const response = await fetch(abs_url, {
    method:'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
    })

    const upload_res = await response.json();

    var url = upload_res.url

    var del_body = null

    const upload = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': null,
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(del_body)
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

    res.json({status:data})
}