import React from 'react'
import PropTypes from 'prop-types'
import { getSession } from 'next-auth/client'
import LockedLayout from '../components/LockedLayout'
import { Card, CardBody, CardTitle, CardSubtitle, Button, CardHeader } from 'reactstrap'

function Class () {
  return (
    <LockedLayout>
      bruh
    </LockedLayout>
  )
}

export async function getServerSideProps (context) {
  const data = await refresh(context)
  async function refresh (context) {
    const session = await getSession(context)
    if (!session) {
      return Promise.resolve(null)
    }

    return {
      props: {
        assignments: [],
        announcements: []
      }
    }
  }
}

export default Class
