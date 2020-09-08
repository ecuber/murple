import { getSession, signin } from 'next-auth/client'
import React from 'react'
import PropTypes from 'prop-types'
import { google } from 'googleapis'
import { Row, Col } from 'reactstrap'

import LockedLayout from '../components/LockedLayout'
import ClassGrid from '../components/classes/ClassGrid'
import ClassTile from '../components/classes/ClassTile'
import createAuthClient from '../globals/oauth'
import Database from '../globals/db'

export default function classes (props) {
  const content = JSON.parse(props.content)
  const courses = content ? content.data.courses : null
  const keys = courses ? Object.keys(courses) : null

  async function update (id, value) {
    const db = new Database()
    return await db.updateCourse(props._id, 'data', value, id)
  }

  return (
    <LockedLayout page='classes'>
      <Row>
        <div className="ml-4 class-head"><h4>My Classes</h4></div>
        {/* <div className="col-md-4 col-sm-3 ml-4 d-none d-sm-none d-md-block"><h4>Widgets</h4></div> */}
      </Row>
      <Row>
        <Row className="ml-4 mr-4 pr-4 class-list height-full">
          {keys
            ? <ClassGrid>
              {keys.map((course, index) => {
                const { name, archived, pinned, id, color } = courses[course]
                return (
                  <span key={index} role="button"><ClassTile name={name} archived={archived} pinned={pinned} id={id} color={color || '#38618c'} update={update}/></span>
                )
              })}
            </ClassGrid>
            : <h2>Couldn&apos;t find any classes. (try reloading?)</h2>
          }
        </Row>
        {/* Widgets area coming soon ? */}
        {/* <Row className="widgets col-md-4 ml-4 d-none d-sm-none d-md-block height-full"></Row> */}
      </Row>
    </LockedLayout>
  )
}

classes.propTypes = {
  content: PropTypes.string,
  _id: PropTypes.string
}

export async function getServerSideProps (context) {
  let id = ''
  const data = await refresh(context)
  async function refresh (context) {
    const session = await getSession(context)
    if (!session) {
      return Promise.resolve(null)
    }

    const { oauth2Client, db, _id } = await createAuthClient(session)
    id = _id

    const classroom = google.classroom({ version: 'v1', auth: oauth2Client })
    classroom.courses.list({ courseStates: ['ACTIVE'] }, (err, res) => {
      if (err) {
        console.error('request error: ', err)
        return Promise.resolve(db.findObject(_id, 'user', 'data'))
      }
      const courses = res.data.courses

      if (courses && courses.length) {
        db.updateArray(_id, 'user', 'courses', courses.map(course => {
          return {
            id: course.id,
            name: course.name,
            archived: false,
            pinned: false,
            nickname: null
          }
        }))
      } else {
        console.log('No courses found.')
      }
    })
    return Promise.resolve(db.findObject(_id, 'user', 'data'))
  }
  return { props: { content: JSON.stringify(data), _id: JSON.stringify(id) } }
}
