import {Row, Col} from "react-bootstrap"
import { useSession } from "../../hooks/session";
import MapChart from "./MapChart";

function Session(){
    const { loading, error, markers } = useSession()
    
    if(loading)
        return(<div>Loading...</div>)

    if(error)
        return(<div>{error.message}</div>)
    
    return (
        <div>
            <Row className="justify-content-md-center mt-4">
                <Col md={12}>
                    <MapChart markers={markers}/>
                </Col>
            </Row>
        </div>
    );
}
 
export default Session;