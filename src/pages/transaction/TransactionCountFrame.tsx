import {Card} from "react-bootstrap"
import { Transaction, useTransactionBranch } from '../../hooks/transaction';

export interface TransactionCountFrameProps {
    filter: (e: Transaction) => boolean;
    title: string;
}
 
function TransactionCountFrame({filter, title }: TransactionCountFrameProps){
    const { loading, error, data } = useTransactionBranch({ filter: {}})
    
    if(loading)
        return(<div>Loading...</div>)

    if(error)
        return(<div>{error.message}</div>)

    return (
        <Card className="mb-4">
                <Card.Body>
                    <h5 className="float-right">{ title }</h5>
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