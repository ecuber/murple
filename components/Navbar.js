import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import Head from 'next/head'

function LoginButton () {
  const [session, loading] = useSession()
  return (
    <p>
      {!session && <>
      Not signed in <br/>
        <a href="/api/auth/signin">Sign in</a>
      </>}
      {session && <>
      Signed in as {session.user.email} <br/>
        <a href="/api/auth/signout">Sign out</a>
      </>}
    </p>
  )
}

function Navbar () {
  return (
    <div>
      <Head>
        <link href="../css/styles.css" rel="stylesheet"/>
      </Head>
      <nav className="navbar navbar-expand-md navbar-light bg-primary mb-4">
        <Link href="/"><a className="navbar-brand mb-0 text-white brand-title">murple</a></Link>
        <ul className="navbar-nav mr-auto">
          <Link href="/"><a className="nav-item nav-link text-white">Home</a></Link>
          <Link href="/about"><a className="nav-item nav-link text-white">About</a></Link>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
