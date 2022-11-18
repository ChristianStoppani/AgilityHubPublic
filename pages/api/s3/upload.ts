import aws from 'aws-sdk';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    // s3 instance
    aws.config.update({
        region: 'eu-west-3',
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        signatureVersion: 'v4',
    })

    const s3 = new aws.S3()

    try {
        let { name } = req.body
        const fileParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: name,
            Expires: 600,
        }

        const url = await s3.getSignedUrlPromise('putObject', fileParams);

        res.status(200).json({ url })
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err })
    }
}