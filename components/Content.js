import { useSession } from 'next-auth/client'
import React from 'react'

function Content (props) {
  const [session, loading] = useSession()
  return (
    <div>
      <div className=''>
        { !loading && !session && <>
          <h3>You can&apos;t view this page because you&apos;re not signed in. </h3><br/>
          <a href='/api/auth/signin'>Sign in here.</a>
        </>}
        {session && <>
          { props.children }
        </>}
      </div>
    </div>
  )
}

export default Content
