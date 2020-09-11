import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import db from '../../../globals/db'

const scopes = [
  'classroom.courses.readonly',
  'classroom.coursework.me.readonly',
  'classroom.announcements.readonly'].map(scope => `https://www.googleapis.com/auth/${scope}`)
scopes.push('profile')

const google = {
  id: 'google',
  name: 'Google',
  type: 'oauth',
  version: '2.0',
  scope: scopes.join(' '),
  params: {
    grant_type: 'authorization_code',
    access_type: 'offline'
  },
  accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
  requestTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/auth?response_type=code&access_type=offline&prompt=consent',
  profileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
  profile: (profile) => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture
    }
  },
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET
}

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    google
  ],
  database: process.env.DATABASE_URL,
  jwt: true,
  callbacks: {
    /*
     * NextAuth handles the majority of our session and account database interactions automatically.
     * All we need to do here is verify that the account object passed to this callback contains
     * a refresh token. If it does, then we successfully signed in!
     */
    signin: async (profile, account, metadata) => Promise.resolve(account.refreshToken !== undefined)
  }
  // TODO: Add custom sign-in/out pages
}

export default (req, res) => NextAuth(req, res, options)
