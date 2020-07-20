import React from 'react'
import { chunk } from 'lodash'
import { Container, Row, Col } from 'reactstrap'

function ClassGrid (props) {
  const rows = chunk(React.Children.toArray(props.children), 4)
  return (
    <Container className="class-grid">
      {rows.map(row => (
        <Row key={rows.indexOf(row)}>
          {row.map(col => (col))}
        </Row>
      ))}
    </Container>
  )
}

ClassGrid.propTypes = {

}

export default ClassGrid
