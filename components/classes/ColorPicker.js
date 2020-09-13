import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CirclePicker } from 'react-color'

class Picker extends Component {
  constructor (props) {
    super()
    this.state = {
      color: props.initial || '#fff'
    }
  }

  render () {
    return <CirclePicker color={this.state.color} onChange={async (color, event) => {
      await this.props.update(color.hex)
      this.setState({ color: color.hex })
    }}/>
  }
}

Picker.propTypes = {
  initial: PropTypes.string,
  update: PropTypes.func
}

export default Picker
