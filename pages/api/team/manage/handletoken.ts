import { prisma } from '../../../../components/db';
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
    const session = await getSession({ req })
    if (!session) {
        res.status(401)
        res.end()
    }
    const { team_id, del } = req.body

    let token

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (del) {
        const deleteToken = await prisma.groups.update({
            data: {
                invite_token: null
            },
            where: {
                group_id: team_id
            }
        })
        token = null
    } else {

        const tokens = await prisma.groups.findMany({
            select: {
                invite_token: true
            },
            where: {
                invite_token: {
                    not: null
                }
            }
        })

        token = generateString(tokens)

        const addToken = await prisma.groups.update({
            where: {
                group_id: team_id
            },
            data: {
                invite_token: token
            }
        })
    }

    function generateString(tokens) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 30; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        var tokens_arr = []

        for (var id in tokens){
            tokens_arr.push(tokens[id].invite_token)
        }
    
        var isOld = tokens_arr.includes(result)
        if (!isOld) {
            return result
        } else {
            generateString(tokens) 
        }
    }
    
    res.json({status:'ok', token: token})
}