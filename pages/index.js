import React from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import { useSession } from 'next-auth/client'

export default function Home () {
  const [session, loading] = useSession()
  return (
    <div>
      <Layout>
        <div>
          {!session && <>
            <h3>Not signed in </h3><br/>
            <a href="/api/auth/signin">Sign in</a>
          </>}
          {session && <>
            <h3>Welcome, {session.user.name.split(' ')[0]}!</h3> <br/>
            <a href="/api/auth/signout">Sign out</a>
          </>}
        </div>
      </Layout>
    </div>

  )
}
