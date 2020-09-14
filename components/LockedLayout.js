import React from 'react'
import Navbar from './Navbar'
import Head from 'next/head'
import PropTypes from 'prop-types'
import Content from './Content'
import Loading from '../components/Loading'
import { useSession } from 'next-auth/client'

const capitalize = word => word[0].toUpperCase() + word.slice(1)

function LockedLayout (props) {
  const [session, loading] = useSession()
  return (
    <div>
      <Head>
        <title>{capitalize(props.page)}</title>
        <link rel='stylesheet' href='https://bootswatch.com/4/pulse/bootstrap.min.css'/>
      </Head>
      <Navbar page={props.page}/>
      <section className='h-100'>
        <Content>
          {!session && <div className='warning'>
            <h3>You must be logged in to view this page. </h3><br/>
            <a href='/api/auth/signin'>Sign in</a>
          </div>}
          {loading && <>
            <Loading/>
          </>}
          {session && <>
            { props.children }
          </>}
        </Content>
      </section>
    </div>
  )
}

LockedLayout.propTypes = {
  page: PropTypes.string
}

export default LockedLayout
