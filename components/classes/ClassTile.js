import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardSubtitle, Button, CardHeader, Col, Row } from 'reactstrap'

import EditCourse from './EditCourse'

class ClassTile extends Component {
  constructor (props) {
    super()
    const { name, color } = props
    this.state = { name, color }
  }

  render () {
    return (
      <Card className='class-tile m-0 p-0 rounded'>
        <CardHeader style={{ background: this.state.color, color: 'white' }} className='pt-3 pb-0 rounded'>
          <Row>
            <Col>
              <h5 style={{ fontSize: '1.4em' }}>{this.state.name}</h5>
            </Col>
            <Col>
              <EditCourse className='btn btn-info m-0' color={this.state.color} classInfo={this.props} _id={this.props._id} tile={this}/>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          some text gonna go here
        </CardBody>
      </Card>
    )
  }
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
