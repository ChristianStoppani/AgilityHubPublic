import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from 'next-auth/providers/linkedin';

export default async function auth(req, res) {
  const providers = [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      async profile(profile, tokens) {
        var _emailData$elements, _emailData$elements$, _emailData$elements$$, _profile$profilePictu, _profile$profilePictu2, _profile$profilePictu3, _profile$profilePictu4, _profile$profilePictu5, _profile$profilePictu6;
  
        const emailResponse = await fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        });
        const emailData = await emailResponse.json();
        const email = emailData === null || emailData === void 0 ? void 0 : (_emailData$elements = emailData.elements) === null || _emailData$elements === void 0 ? void 0 : (_emailData$elements$ = _emailData$elements[0]) === null || _emailData$elements$ === void 0 ? void 0 : (_emailData$elements$$ = _emailData$elements$["handle~"]) === null || _emailData$elements$$ === void 0 ? void 0 : _emailData$elements$$.emailAddress
        const linkedin_id = profile.id
        
        const body = { 
          email, 
          linkedin_id,
          first_name: `${profile.localizedFirstName}`,
          last_name: `${profile.localizedLastName}`,
         }

        const res = await fetch(process.env.NEXT_PUBLIC_ABSOLUTE_URL+"/api/auth/linkedin", {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })

        const user = await res.json()
        
        return user;
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label:'Email', type:'email', placeholder: 'help' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        //login
        if (req.body.update == 'false') {
          const email = credentials.username
          const password = credentials.password

          const body = { email, password }

          const res = await fetch(process.env.NEXT_PUBLIC_ABSOLUTE_URL+"/api/user/login", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
          })

          const user = await res.json()
          
          if (user && res.ok) {
            user['profile']=true
            return user
          } else {
            return null
          }
          //update
        } else {
          const body = { user_id: parseInt(req.body.user_id)}

          const res = await fetch(process.env.NEXT_PUBLIC_ABSOLUTE_URL+"/api/auth/updateobject", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
          })

          const user = await res.json()

          user['profile'] = true
          
          return user
        }
      },
    })
  ]

  return await NextAuth(req, res, {
      providers,
      secret: process.env.NEXTAUTH_SECRET,
      callbacks: {
          session: async ({ session, token }) => {
            if (session?.user) {
              session.user.id = token.uid;
              session.user.initials = token.uinitials
              session.user.profile = token.uprofile
            }
            return session;
          },
          jwt: async ({ user, token }) => {
            if (user) {
              token.uid = user.id
              token.uinitials = user.initials
              token.uprofile = user.profile
            }
            return token;
          },
        },
        session: {
          strategy: 'jwt',
          maxAge: 60*60          
        },
      jwt: {
          secret: process.env.NEXTAUTH_SECRET
      },
      pages: {
          signIn: '/login',
          //error: '/login'
      }
  })
}

