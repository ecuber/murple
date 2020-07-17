import React from 'react'
import Navbar from './Navbar'
import Head from 'next/head'

function Layout (props) {
  return (
    <div>
      <Head>
        <title>Murple</title>
        <link rel="stylesheet" href="https://bootswatch.com/4/pulse/bootstrap.min.css"/>
      </Head>
      <Navbar/>
      <div className="container">
        { props.children }
      </div>
    </div>
  )
}

export default Layout
