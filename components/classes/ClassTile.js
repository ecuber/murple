import React from 'react'
import PropTypes from 'prop-types'
import EditCourse from './EditCourse'
import { Card, CardBody, CardTitle, CardSubtitle, Button, CardHeader } from 'reactstrap'

function ClassTile (props) {
  return (
    <Card className="class-tile m-0 p-0 rounded">
      <CardHeader className="pt-3 pb-0">
        <CardTitle>
          <h5>{props.name}</h5>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <EditCourse className="btn btn-info mt-2 align-baseline" style={{ background: props.color, color: 'white' }} buttonLabel="Edit" color={props.color} classInfo={props} _id={props._id}/>
      </CardBody>
    </Card>
  )
}

ClassTile.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string,
  archived: PropTypes.bool,
  pinned: PropTypes.bool,
  color: PropTypes.string,
  _id: PropTypes.string
}

export default ClassTile
