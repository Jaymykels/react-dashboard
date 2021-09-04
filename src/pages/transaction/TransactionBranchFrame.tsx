import {Card, Row, Col} from "react-bootstrap"
import Chart from 'react-apexcharts'
import  { useEffect, useState } from 'react'
import { useTransactionBranch } from '../../hooks/transaction';
import Query, { GetAllQueryFilter } from '../../components/Query';

interface TransactionBranchFrameProps {
    propsQuery: GetAllQueryFilter,
}

function TransactionBranchFrame({propsQuery}: TransactionBranchFrameProps){
    const [query, setQuery] = useState<GetAllQueryFilter>({...propsQuery})
    const { loading, error, options, series } = useTransactionBranch(query)
    
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
                            <h5 className="float-right">Number of Transactions against Branch Name</h5>
                        </Col>
                    </Row>
                    <div style={{height: '350px'}} className="d-flex align-items-center justify-content-center">
                        <Chart options={options} series={series} type="bar" width={500} height={320} />
                    </div>
                </Card.Body>
            </Card>
        );
}
 
export default TransactionBranchFrame;