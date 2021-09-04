import  { useEffect, useState } from 'react'
import {Card, Row, Col} from "react-bootstrap"
import { Transaction, useTransactionBranch } from '../../hooks/transaction';
import Query, { GetAllQueryFilter } from '../../components/Query';

export interface TransactionCountFrameProps {
    filter: (e: Transaction) => boolean;
    title: string;
    propsQuery: GetAllQueryFilter;
}
 
function TransactionCountFrame({filter, title, propsQuery }: TransactionCountFrameProps){
    const [query, setQuery] = useState<GetAllQueryFilter>({...propsQuery})
    const { loading, error, data } = useTransactionBranch(query)
    
    useEffect(() => {
        setQuery({...propsQuery})
    }, [propsQuery])

    if(loading)
        return(<div>Loading...</div>)

    if(error)
        return(<div>{error.message}</div>)

    return (
        <Card className="mb-4">
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Query value={query} setValue={setQuery}/>
                        </Col>
                        <Col md={8}>
                            <h5 className="float-right">{ title }</h5>
                        </Col>
                    </Row>
                    <div style={{height: '350px'}} className="d-flex align-items-center justify-content-center">
                        <h1>
                            { data?.allTransactions.filter(filter).length || 0 }
                        </h1>
                    </div>
                </Card.Body>
            </Card>
        );
}
 
export default TransactionCountFrame;