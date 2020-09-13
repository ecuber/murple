import React from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import { useSession, getSession } from 'next-auth/client'
import Loading from '../components/Loading'

export default function Home () {
  const [session, loading] = useSession()
  return (
    <div>
      <Layout page='home'>
        {!loading && !session && <>
          <h3>Not signed in </h3><br/>
          <a href='/api/auth/signin'>Sign in</a>
        </>}
        {loading && <>
          <Loading/>
        </>}
        {session && <>
          <h3>Welcome, {session.user.name.split(' ')[0]}!</h3> <br/>
          <a href='/api/auth/signout'>Sign out</a>
        </>}

      </Layout>
    </div>

  )
}
