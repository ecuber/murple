import React from 'react'
import Navbar from './Navbar'
import Head from 'next/head'
import PropTypes from 'prop-types'

function Layout (props) {
  return (
    <div>
      <Head>
        <title>Murple</title>
        <link rel='stylesheet' href='https://bootswatch.com/4/pulse/bootstrap.min.css'/>
      </Head>
      <Navbar page={props.page}/>
      <div className='container'>
        { props.children }
      </div>
    </div>
  )
}

Layout.propTypes = {
  page: PropTypes.string
}

export default Layout
