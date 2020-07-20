import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { google } from 'googleapis'
// import { oauth2 } from 'googleapis/build/src/apis/oauth2'
import db from '../../../globals/db'

const scopes = [
  'classroom.courses.readonly',
  'classroom.coursework.me.readonly',
  'classroom.announcements.readonly'].map(scope => `https://www.googleapis.com/auth/${scope}`)
scopes.push('profile')

const googleProvider = {
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
  site: 'http://localhost:3000',
  providers: [
    // Use custom Google provider to request additional OAuth2/API scopes from user.
    googleProvider
  ],
  database: process.env.DATABASE_URL,
  jwt: true,
  callbacks: {
    /*
     * Callback function, called once authorized. Uses refresh token to authorize a Google Classroom
     * API request.
     */
    signin: async (profile, account, metadata) => {
      const Database = db()
      const { accessToken, refreshToken, id } = account
      const obj = await Database.idFromProviderId(id)
      const _id = obj.get('userId')

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.GRANT_REDIRECT
      )

      const scopes = [
        'classroom.courses.readonly',
        'classroom.coursework.me.readonly',
        'classroom.announcements.readonly'].map(scope => `https://www.googleapis.com/auth/${scope}`)

      oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })

      const classroom = google.classroom({ version: 'v1', auth: oauth2Client })
      classroom.courses.list({ courseStates: ['ACTIVE'] }, (err, res) => {
        if (err) {
          console.error('request error: ', err)
          return Promise.resolve(false)
        }
        const courses = res.data.courses

        if (courses && courses.length) {
          courses.forEach(course => {
            course.archived = false
            course.pinned = false
            course.nickname = null
          })
          Database.updateArray(_id, 'user', 'courses', courses)
        } else {
          console.log('No courses found.')
        }
      })
      return Promise.resolve(true)
    }
  },
  // TODO: Add custom sign-in/out pages
  events: {
    signin: async (message) => {
      // console.log(message)
    },
    signout: async (message) => {
      // console.log('message', message)
    }
  }
}

export default (req, res) => NextAuth(req, res, options)
