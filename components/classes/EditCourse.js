/* eslint-disable react/prop-types */
import React, { useState, Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Col } from 'reactstrap'
import { isEqual } from 'lodash'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import { Circle } from 'react-shapes'
import '@fortawesome/fontawesome-free/js/all'

import Database from '../../globals/db'
import ColorPicker from './ColorPicker'

class EditCourse extends Component {
  constructor (props) {
    super()
    const { buttonLabel, className, color, style, classInfo } = props
    const { name, archived, pinned } = classInfo
    this.state = { obj: { name, archived, pinned, color }, classInfo, modal: false }
    this.original = { ...this.state.obj }
    this.toggle = () => {
      this.setState(state => {
        return { modal: !state.modal }
      })
    }
  }

  async save () {
    if (this.state.obj.name && this.state.obj.name.length === 0) {
      await this.setState({ obj: { ...this.state.obj, name: this.props.classInfo.original } })
    }
    if (!isEqual(this.original, this.state.obj)) {
      await this.props.tile.setState(this.state.obj)
      await fetch('/api/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'course',
          _id: this.props._id,
          id: this.props.classInfo.id,
          obj: this.state.obj
        })
      })
    }
    this.toggle()
  }

  async setColor (color) {
    await this.setState({ obj: { ...this.state.obj, color: color } })
  }

  render () {
    const { className, color, style, classInfo } = this.props
    return (
      <div>
        <button style={{ border: 'none', background: 'rgba(0, 0, 0, 0)', float: 'right' }} onClick={this.toggle}>
          <i style={{
            color: 'white',
            fontSize: '1.2em'
          }} className='fas fa-ellipsis-v'/>
        </button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-dialog-centered'>
          <ModalHeader toggle={this.toggle}>Modify Course</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label sm={2} for='name'>Name</Label>
                <Col sm={10}>
                  <Input name='name' id='name' placeholder={this.props.classInfo.original} defaultValue={this.state.obj.name} onChange={async event => {
                    await this.setState({ obj: { ...this.state.obj, name: event.target.value } })
                  }}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2} for='color'>Color</Label>
                <Col sm={10}>
                  <ColorPicker initial={this.state.obj.color} update={this.setColor.bind(this)}></ColorPicker>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.save.bind(this)}>Save Changes</Button>{' '}
            <Button color='secondary' onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default EditCourse
