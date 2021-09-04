import  { useEffect, useState } from 'react'
import {Card, Row, Col} from "react-bootstrap"
import Chart from 'react-apexcharts'
import { useTransactionBranch } from '../../hooks/transaction';

export interface TransactionBranchFrameProps {
    
}
 
function TransactionBranchFrame({}: TransactionBranchFrameProps){
    const { loading, error, data, options, series } = useTransactionBranch({ filter: {}})
    
    if(loading)
        return(<div>Loading...</div>)

    if(error)
        return(<div>{error.message}</div>)

    return (
        <Card className="mb-4">
                <Card.Body>
                    <h5 className="float-right">Number of Transactions against Branch Name</h5>
                    <div style={{height: '350px'}} className="d-flex align-items-center justify-content-center">
                        <Chart options={options} series={series} type="bar" width={500} height={320} />
                    </div>
                </Card.Body>
            </Card>
        );
}
 
export default TransactionBranchFrame;