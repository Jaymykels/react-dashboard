import  { useEffect, useState } from 'react'
import {Card, Row, Col} from "react-bootstrap"
import useAccount, { Account } from '../../hooks/account';
import Query, { GetAllQueryFilter } from './Query';
import Chart from 'react-apexcharts'


export interface AccountFrameProps {
    title: string;
    propsQuery: GetAllQueryFilter,
    type: 'chart' | 'count',
    filter?: (value: Account) => boolean
}
 
function AccountFrame({title, propsQuery, type, filter}: AccountFrameProps){
    const [query, setQuery] = useState<GetAllQueryFilter>({...propsQuery})
    const {loading, error, data, options, series} = useAccount(query)

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
                        <h5 className="float-right">{title}</h5>
                    </Col>
                </Row>
                <div style={{height: '350px'}} className="d-flex align-items-center justify-content-center">
                    { type === 'count' && data ? 
                        <h1>{data.allAccounts.filter((filter as (value: Account) => boolean)).length}</h1> : 
                        <Chart options={options} series={series} type="bar" width={500} height={320} />
                    }
                </div>
            </Card.Body>
        </Card>
    );
}
 
export default AccountFrame;