import { useState } from 'react'
import {Row, Col} from "react-bootstrap"
import { Transaction as TransactionInterface } from "../../hooks/transaction";
import TransactionBranchFrame from './TransactionBranchFrame';
import TransactionCountFrame from "./TransactionCountFrame";
import TransactionPeriodFrame from "./TransactionPeriodFrame";
import Query, { GetAllQueryFilter } from '../../components/Query';

const today = new Date();
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

function Transaction(){
    const [query, setQuery] = useState<GetAllQueryFilter>({filter: { created_at_lte: "", created_at_gte: sevenDaysAgo.toDateString()}})

    return (
        <div>
            <div className="w-25 my-4">
                <Query value={query} setValue={setQuery}/>
            </div>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <TransactionCountFrame propsQuery={query} title="Total Number of Transactions" filter={() => true}/>
                </Col>
                <Col md={6}>
                    <TransactionCountFrame propsQuery={query} title="Total Number of Debit" filter={(e:TransactionInterface) => e.type === 'debit'}/>
                </Col>
                <Col md={6}>
                    <TransactionPeriodFrame propsQuery={query}/>
                </Col>
                <Col md={6}>
                    <TransactionBranchFrame propsQuery={query}/>
                </Col>
            </Row>
        </div>
    );
}
 
export default Transaction;