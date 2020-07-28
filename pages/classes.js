import { getSession, signin } from 'next-auth/client'
import LockedLayout from '../components/LockedLayout'
import React from 'react'
import PropTypes from 'prop-types'
import Database from '../globals/db'
import { google } from 'googleapis'
import { Row, Col } from 'reactstrap'
import ClassGrid from '../components/classes/ClassGrid'
import ClassTile from '../components/classes/ClassTile'

export default function classes (props) {
  const content = JSON.parse(props.content)
  const courses = content ? content.data.courses : null
  const keys = courses ? Object.keys(courses) : null

  return (
    <LockedLayout page='classes'>
      <Row>
        <div className="col-md-7 ml-4 class-head"><h4>My Classes</h4></div>
        <div className="col-md-4 ml-4 d-sm-none d-md-block"><h4>Widgets</h4></div>
      </Row>
      <Row>
        <Row className="col-md-7 ml-4 mr-4 pr-4 class-list height-full">
          {keys
            ? <ClassGrid>
              {keys.map((course, index) => {
                const obj = courses[course]
                const name = obj.name
                const code = obj.enrollmentCode
                const archived = obj.archived
                const pinned = obj.pinned
                const id = obj.id
                return (
                  <span key={index} role="button"><ClassTile name={name} code={code} archived={archived} pinned={pinned} id={id}/></span>
                )
              })}
            </ClassGrid>
            : <h2>Couldn&apos;t find any classes. (try reloading?)</h2>
          }
        </Row>
        <Row className="widgets col-md-4 ml-4 d-sm-none d-xs-none d-md-block height-full">
        </Row>
      </Row>
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
    /*
     * Evidently, we need to jump through some hoops here to get to our access and refresh token. This
     * is because these are stored only in the account document, and in the scope of this function we only
     * have access to the session document.
     */
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

    // "log in" to oauth2client with user credentials
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
