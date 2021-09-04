import {Container, Row, Col, Dropdown} from "react-bootstrap"
import { useState } from 'react';
import Page from './components/Page';

function App() {
  const pages: string[] = ["Account", "Transactions", "Sessions"]
  const [page, setPage] = useState(pages[0])

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-md-center">
        <Col md={5}>
          <h1>{page}</h1>
        </Col>
        <Col>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Dropdown
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {
              pages.map(page => (
                <Dropdown.Item key={page} onClick={() => setPage(page)}>{page}</Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
        </Col>
      </Row>
      <Page name={page}/>
    </Container>
  );
}

export default App;
