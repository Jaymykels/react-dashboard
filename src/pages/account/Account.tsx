import { useState } from 'react'
import {Row, Col} from "react-bootstrap"
import Query, { GetAllQueryFilter } from '../../components/Query';
import AccountFrame from './AccountFrame';
import { Account as AccountInterface } from '../../hooks/account';

const today = new Date();
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

function Account(){
    const [query, setQuery] = useState<GetAllQueryFilter>({filter: { created_at_lte: "", created_at_gte: sevenDaysAgo.toDateString()}})
    return (
        <div>
            <div className="w-25 my-4">
                <Query value={query} setValue={setQuery}/>
            </div>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <AccountFrame title="Total Number of Accounts" propsQuery={query} type="count" filter={() => true} />
                </Col>
                <Col md={6}>
                    <AccountFrame title="Total Number of Savings Accounts" propsQuery={query} type="count" filter={(el: AccountInterface) => el.type === 'savings'}/>
                </Col>
                <Col md={6}>
                    <AccountFrame title="Accounts Opened against Day/Month" propsQuery={query} type="chart"/>
                </Col>
            </Row>
        </div>
    );
}
 
export default Account;