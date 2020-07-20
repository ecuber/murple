import React from 'react'
import Navbar from './Navbar'
import Head from 'next/head'
import PropTypes from 'prop-types'
import Content from './Content'
import Loading from '../components/Loading'
import { useSession } from 'next-auth/client'

function LockedLayout (props) {
  const [session, loading] = useSession()
  return (
    <div>
      <Head>
        <title>Murple</title>
        <link rel="stylesheet" href="https://bootswatch.com/4/pulse/bootstrap.min.css"/>
      </Head>
      <Navbar page={props.page}/>
      <div className="container">
        <Content>
          {!session && <>
            <h3>Not signed in </h3><br/>
            <a href="/api/auth/signin">Sign in</a>
          </>}
          {loading && <>
            <Loading/>
          </>}
          {session && <>
            <h1>OASHFO:IAJFAD YOU ARE LOGGED ININININININININININ</h1>
            <h1>{session.toString()}</h1>
            { props.children }
          </>}
        </Content>
      </div>
    </div>
  )
}

LockedLayout.propTypes = {
  page: PropTypes.string
}

export default LockedLayout
