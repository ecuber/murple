import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'

function ClassTile (props) {
  return (
    <Col className="class-tile">
      <h3>{props.name}</h3>
      <p>{props.code}</p>
    </Col>
  )
}

ClassTile.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string,
  archived: PropTypes.bool,
  pinned: PropTypes.bool
}

export default ClassTile
