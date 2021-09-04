import  { useEffect, useState } from 'react'
import {Card, Row , Col} from "react-bootstrap"
import Chart from 'react-apexcharts'
import { useTransactionPeriod } from '../../hooks/transaction';
import Query, { GetAllQueryFilter } from '../../components/Query';

interface TransactionPeriodFrameProps {
    propsQuery: GetAllQueryFilter,
}

function TransactionPeriodFrame({ propsQuery }: TransactionPeriodFrameProps){
    const [query, setQuery] = useState<GetAllQueryFilter>({...propsQuery})
    const { loading, error, options, series } = useTransactionPeriod(query)
    
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
                        <h5 className="float-right">Credit Amount against Days/Months</h5>
                    </Col>
                </Row>
                <div style={{height: '350px'}} className="d-flex align-items-center justify-content-center">
                    <Chart options={options} series={series} type="bar" width={500} height={320} />
                </div>
            </Card.Body>
        </Card>
    );
}
 
export default TransactionPeriodFrame;