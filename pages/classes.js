import { getSession, signin } from 'next-auth/client'
import LockedLayout from '../components/LockedLayout'
import React from 'react'
import PropTypes from 'prop-types'
import Database from '../globals/db'
import { google } from 'googleapis'
import ClassGrid from '../components/classes/ClassGrid'
import ClassTile from '../components/classes/ClassTile'

export default function classes (props) {
  const content = JSON.parse(props.content)
  const courses = content ? content.data : null
  const keys = courses ? Object.keys(courses) : null

  return (
    <LockedLayout page='classes'>
      <div className="container">
        {keys
          ? <ClassGrid>
            {keys.map(course => {
              console.log('course', course)
              const obj = courses[course]
              const key = keys.indexOf(course)
              const name = obj.name
              const code = obj.enrollmentCode
              const archived = obj.archived
              const pinned = obj.pinned
              return (
                <ClassTile key={key} name={name} code={code} archived={archived} pinned={pinned}/>
              )
            })}
          </ClassGrid>
          : null
        }
        {JSON.stringify(courses)}
      </div>
    </LockedLayout>
  )
}

classes.propTypes = {
  content: PropTypes.string
}

export async function getServerSideProps (context) {
  const data = await refresh(context)
  async function refresh (context) {
    const session = await getSession(context)
    if (!session) {
      return Promise.resolve(null)
    }
    const db = Database()
    const sessionId = await db.idFromSession(session)
    const _id = await sessionId.get('userId')
    const accessDoc = await db.findObjectByUserId(_id, 'account', 'accessToken refreshToken')
    const accessObject = accessDoc.toObject()
    const { accessToken, refreshToken } = accessObject

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ID,
      process.env.GOOGLE_SECRET,
      process.env.GRANT_REDIRECT
    )
    oauth2Client.setCredentials({ refresh_token: refreshToken, access_token: accessToken })

    const scopes = [
      'classroom.courses.readonly',
      'classroom.coursework.me.readonly',
      'classroom.announcements.readonly'].map(scope => `https://www.googleapis.com/auth/${scope}`)

    const classroom = google.classroom({ version: 'v1', auth: oauth2Client })
    classroom.courses.list({ courseStates: ['ACTIVE'] }, (err, res) => {
      if (err) {
        console.error('request error: ', err)
        // console.error('oopsies, something didnt work. just gonna use latest db data. \ngaxios error:', err.response.data)
        return Promise.resolve(db.findObject(_id, 'user', 'data'))
      }
      const courses = res.data.courses

      if (courses && courses.length) {
        courses.forEach(course => {
          course.archived = false
          course.pinned = false
          course.nickname = null
        })
        db.updateArray(_id, 'user', 'courses', courses)
      } else {
        console.log('No courses found.')
      }
    })
    return Promise.resolve(db.findObject(_id, 'user', 'data'))
  }

  return { props: { content: JSON.stringify(data) } }
}
