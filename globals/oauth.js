import Database from './db'
import { google } from 'googleapis'

export default async function createAuthClient (session) {
  const db = Database()
  const sessionId = await db.idFromSession(session)
  const _id = await sessionId.get('userId')
  const accessDoc = await db.findObjectByUserId(_id, 'account', 'accessToken refreshToken')
  const accessObject = accessDoc.toObject()
  const { accessToken, refreshToken } = accessObject

  // Create an oauth2client object with the application details
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    process.env.GRANT_REDIRECT
  )
  // 'log in' to oauth2client with user credentials
  oauth2Client.setCredentials({ refresh_token: refreshToken, access_token: accessToken })

  return { oauth2Client, db, _id }
}
