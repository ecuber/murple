import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BlockPicker } from 'react-color'

class Picker extends Component {
  constructor () {
    super()
    this.setState({ background: '#fff' })
  }

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  }

  render () {
    return <BlockPicker/>
  }
}

Picker.propTypes = {
  initial: PropTypes.string
}

export default Picker
