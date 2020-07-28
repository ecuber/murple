import React, { Component } from 'react'
import { chunk } from 'lodash'
import { Container, Row } from 'reactstrap'
import { sortableContainer, SortableElement } from 'react-sortable-hoc'
import { isMobile } from 'react-device-detect'
import arrayMove from 'array-move'

const SortableItem = SortableElement(({ value }) => <li className="col-lg-4 col-md-6 col-sm-12 mt-3 pr-0 pl-3">{value}</li>)

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

ClassGrid.propTypes = {}

export default ClassGrid
