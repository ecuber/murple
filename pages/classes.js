import { getSession, signin } from 'next-auth/client'
import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { google } from 'googleapis'
import { Row, Col, Button } from 'reactstrap'

import LockedLayout from '../components/LockedLayout'
import ClassGrid from '../components/classes/ClassGrid'
import ClassTile from '../components/classes/ClassTile'
import createAuthClient from '../globals/oauth'

export default function classes (props) {
  const content = JSON.parse(props.content)
  const courses = content ? content.data.courses : null
  const keys = courses ? Object.keys(courses) : null

  return (
    <LockedLayout page='classes'>
      <Head>
        <script src='https://kit.fontawesome.com/e11820449f.js' crossOrigin='anonymous'></script>
      </Head>
      <Row>
        <div className='ml-4 class-head'><h4>My Classes</h4></div>
        {/* <div className='col-md-4 col-sm-3 ml-4 d-none d-sm-none d-md-block'><h4>Widgets</h4></div> */}
      </Row>
      <Row>
        <Row className='ml-4 mr-4 pr-4 class-list height-full'>
          {keys
            ? <ClassGrid _id={props._id}>
              {keys.map((course, index) => {
                const { name, archived, pinned, id, color, original } = courses[course]
                return (
                  <span key={index} role='button'><ClassTile name={name} archived={archived} pinned={pinned} id={id} color={color || '#673ab7'} _id={props._id} original={original}/></span>
                )
              })}
            </ClassGrid>
            : <div>
              <h2>Couldn&apos;t find any classes. (try reloading?)</h2>
            </div>
          }
        </Row>
        {/* Widgets area coming soon ? */}
        {/* <Row className='widgets col-md-4 ml-4 d-none d-sm-none d-md-block height-full'></Row> */}
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
    // First make sure that a session exists (user logged in)
    const session = await getSession(context)
    if (!session) {
      return Promise.resolve(null)
    }
    // Then create a Google OAuth Client with the session get a db reference.
    const { oauth2Client, db, _id } = await createAuthClient(session)
    id = _id

    const classroom = google.classroom({ version: 'v1', auth: oauth2Client })
    async function updateCourses () {
      classroom.courses.list({ courseStates: ['ACTIVE'] }, (err, res) => {
        if (err) {
          console.error('request error: ', err)
          return Promise.resolve(db.findObject(_id, 'user', 'data'))
        }
        const courses = res.data.courses
        console.log(courses[1])
        if (courses && courses.length) {
          classroom.courses.announcements.list({ courseId: courses[9].id }, (err, res) => {
            if (err) {
              console.error('request error: ', err)
              return Promise.resolve(db.findObject(_id, 'user', 'data'))
            }
            const announcements = res.data.announcements
            // console.log(announcements)
          })
          db.updateArray(_id, 'user', 'courses', courses.map(course => {
            return {
              id: course.id,
              name: course.name,
              original: course.name,
              url: course.alternateLink,
              room: course.room,
              archived: false,
              pinned: false,
              nickname: null
            }
          }))
        } else {
          console.log('No courses found.')
        }
      })
    }
    await updateCourses()
    const content = await db.findObject(_id, 'user', 'data')
    return Promise.resolve(content)
  }
  return { props: { content: JSON.stringify(data), _id: id.toString() } }
}
