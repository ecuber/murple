import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import PropTypes from 'prop-types'
import Head from 'next/head'

function Navbar (props) {
  const [session, loading] = useSession()
  return (
    <div>
      <Head>
        <link href='../css/styles.css' rel='stylesheet'/>
      </Head>
      <nav className='navbar navbar-expand-md navbar-light mb-4'>
        <Link href='/'><a className='navbar-brand mb-0 ml-4 text-white brand-title p-0'>
          <img src='/favicon.ico' width='30' height='30' className='d-inline-block align-top mt-2 mr-2' alt=''/>
          murple
        </a></Link>

        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='.navbarToggle' aria-controls='navbarToggle' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse'>
          <ul className='navbar-nav mr-auto p-0'>
            <Link href='/classes'><a className={`nav-item nav-link${props.page === 'classes' ? ' active' : ''}${!session && !loading ? ' disabled' : ''}`}>Your Classes</a></Link>
            {/* <Link href='/'><a className={`nav-item nav-link${props.page === 'home' ? ' active' : ''}`}>Home</a></Link> */}
            <Link href='/about'><a className={`nav-item nav-link${props.page === 'about' ? ' active' : ''}`}>About</a></Link>
          </ul>
        </div>

      </nav>
    </div>
  )
}

Navbar.propTypes = {
  page: PropTypes.string
}

export default Navbar
