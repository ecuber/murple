/* eslint-disable react/prop-types */
import React, { useState, Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Col } from 'reactstrap'
import { isEqual } from 'lodash'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

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
    this.save = this.save.bind(this)
  }

  async save () {
    if (!isEqual(this.original, this.state.obj)) {
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
    Router.reload(window.location.pathname)
  }

  render () {
    const { buttonLabel, className, color, style, classInfo } = this.props
    return (
      <div>
        <Button style={style} className={className} onClick={this.toggle}>{buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-dialog-centered">
          <ModalHeader toggle={this.toggle}>Modify Course</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label sm={2} for="name">Name</Label>
                <Col sm={10}>
                  <Input name="name" id="name" placeholder={this.props.classInfo.original} defaultValue={this.state.obj.name} onChange={event => {
                    this.setState({ obj: { name: event.target.value } })
                  }}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2} for="color">Color</Label>
                <Col sm={10}>
                  <ColorPicker></ColorPicker>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.save}>Save Changes</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default EditCourse
