import { prisma } from '../../../components/db';

export default async function handle(req, res) {
    const { email, linkedin_id, first_name, last_name } = req.body

    let user_db 
    user_db = await prisma.users.findUnique({
        select: {
            user_id: true,
            email: true,
            first_name: true,
            last_name: true,
            profile_img: true,
            password: true
        },
        where: {
            linkedin_id: linkedin_id,
        }
    })

    if (user_db && email != user_db.email) {
        const updateEmail = await prisma.users.update({
            data: {
                email: email
            },
            where: {
                linkedin_id: linkedin_id
            }
        })
    }

    if (!user_db) {
        var isCredentialsUser = await prisma.users.findFirst({
            where: {
                email: email                
            }
        })
    
        if (isCredentialsUser) {
            throw new Error('User already exists')
        }

        const unconf = await prisma.users_unconfirmed.create({
            data: {
                email: email,
                first_name: first_name,
                last_name: last_name,
                token: String(Date.now())
            }
        })

        var newuser = unconf
        delete newuser.token
        delete newuser.expires_at
        newuser['profile_img'] = null
        newuser['linkedin_id'] = linkedin_id

        const conf = await prisma.users.create({
            data: newuser
        })

        const delunconf = await prisma.users_unconfirmed.delete({
            where: {
                user_id: unconf.user_id
            }
        })

        user_db = await prisma.users.findUnique({
            select: {
                user_id: true,
                email: true,
                first_name: true,
                last_name: true,
                profile_img: true,
            },
            where: {
                linkedin_id: linkedin_id
            }
        })
    }

    let user

    if (user_db) {

        user = user_db

        const hasprofile = await prisma.profiles.findUnique({
            where: {
                user_id: user.user_id
            }
        })

        if (hasprofile) {
            user['profile'] = true
        } else {
            user['profile'] = false
        }

        user['id'] = user['user_id'] 
        delete user.user_id

        user['image'] = user['profile_img'] 
        delete user.profile_img
  
        const surArray = user['last_name'].match(/\b(\w)/g)
        surArray.splice(2)
        const initials = user['first_name'][0] + surArray.join('')
        user['initials'] = initials

        user['name'] = user['first_name']+' '+user['last_name'] 
        delete user.first_name
        delete user.last_name
    } else {
        user = null
    }

    res.json(user)
}