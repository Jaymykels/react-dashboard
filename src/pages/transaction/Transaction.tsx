import {Row, Col} from "react-bootstrap"
import { Transaction as TransactionInterface } from "../../hooks/transaction";
import TransactionBranchFrame from './TransactionBranchFrame';
import TransactionCountFrame from "./TransactionCountFrame";

function Transaction(){
    return (
        <div>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <TransactionCountFrame title="Total Number of Transactions" filter={() => true}/>
                </Col>
                <Col md={6}>
                    <TransactionCountFrame title="Total Number of Debit" filter={(e:TransactionInterface) => e.type === 'debit'}/>
                </Col>
                <Col md={6}>
                    <TransactionBranchFrame />
                </Col>
            </Row>
        </div>
    );
}
 
export default Transaction;