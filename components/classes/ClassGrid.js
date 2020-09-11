import React, { Component } from 'react'
import { chunk } from 'lodash'
import { Container, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import { sortableContainer, SortableElement } from 'react-sortable-hoc'
import { isMobile } from 'react-device-detect'
import arrayMove from 'array-move'
import fetch from 'isomorphic-unfetch'

const SortableItem = SortableElement(({ value }) => <li className="col-lg-4 col-md-6 col-sm-6 mt-3 pr-0 pl-3">{value}</li>)

const SortableContainer = sortableContainer(({ children }) => {
  return <ul className="course">{children}</ul>
})

class ClassGrid extends Component {
  constructor (props) {
    super()
    this.state = { items: React.Children.toArray(props.children) }
    this.onSortEnd = ({ oldIndex, newIndex }) => {
      this.setState(({ items }) => {
        return ({
          items: arrayMove(items, oldIndex, newIndex)
        })
      })
      const res = fetch('/api/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'reorder',
          _id: props._id,
          old: oldIndex,
          new: newIndex
        })
      })
      console.log(res)
    }
  }

  render () {
    const cards = this.state.items
    return (
      <SortableContainer helperClass="helper" axis="xy" distance={isMobile ? null : 8} pressDelay={isMobile ? 200 : null} onSortEnd={this.onSortEnd}>
        <Row>
          {cards.map((card, index) => <SortableItem key={`item-${index}`} index={index} value={card} />)}
        </Row>
      </SortableContainer>
    )
  }
}

ClassGrid.propTypes = {
  _id: PropTypes.string
}

export default ClassGrid
