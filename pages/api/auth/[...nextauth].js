import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import db from '../../../globals/db'

const scopes = [
  'classroom.courses.readonly',
  'classroom.coursework.me.readonly',
  'classroom.announcements.readonly'].map(scope => `https://www.googleapis.com/auth/${scope}`)
scopes.push('profile')

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      scope: scopes.join(' '),
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code'
    }),
    Providers.GitHub({
      clientId: '27513df9d61344322a92',
      clientSecret: '17c0bee61b1296186e171a7eafc3e711a7fb5e4d'
    })
  ],
  database: process.env.DATABASE_URL
  // TODO: Add custom sign-in/out pages
}

export default (req, res) => NextAuth(req, res, options)
