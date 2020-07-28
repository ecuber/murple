import React from 'react'
import PropTypes from 'prop-types'
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
        <CardSubtitle>Code: {props.code}</CardSubtitle>
        <Button color="info" className="mt-2 align-baseline">More Info</Button>
      </CardBody>
    </Card>
  )
}

ClassTile.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string,
  archived: PropTypes.bool,
  pinned: PropTypes.bool
}

export default ClassTile
