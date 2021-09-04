import { useEffect, useState } from 'react'
import {Form, Row, Col} from "react-bootstrap"

export interface GetAllQueryFilter {
    filter: {
        created_at_gte?: string;
        created_at_lte?: string;
    }
}

export interface QueryProps {
    value: GetAllQueryFilter,
    setValue: Function
}

const today = new Date();
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

function Query({value, setValue}: QueryProps){
    const [select, setSelect] = useState("lastSevenDays")
    const [date, setDate] = useState({ startDate: "" as string, endDate: "" as string})

    useEffect(() => {
        if(!value.filter.created_at_lte)
            setSelect("lastSevenDays")
        else{
            setSelect("custom")
            setDate({
                startDate: value.filter.created_at_gte || "",
                endDate: value.filter.created_at_lte
            })
        }
    }, [])

    useEffect(() => {
        if(select === "lastSevenDays")
            setValue({
                filter: { created_at_gte: sevenDaysAgo.toDateString() }
            })
        else {
            setValue({
                filter: {
                    created_at_gte: "",
                    created_at_lte: ""
                }
            })
        }
    }, [select])

    useEffect(() => {
        if(!(date.startDate || date.endDate)) return
        setValue({
            filter: {
                created_at_gte: date.startDate,
                created_at_lte: date.endDate
            }
        })
    }, [date])

    const custom = (
        <Row className="mt-2">
            <Col>
                <label>Start date</label>
                <Form.Control type="date" value={date.startDate} onChange={(e) => setDate((d) => ({
                    ...d,
                    startDate: (e.target as HTMLInputElement).value
                }))}/>
            </Col>
            <Col>
                <label>End date</label>
                <Form.Control type="date" value={date.endDate} onChange={(e) => setDate((d) => ({
                    ...d,
                    endDate: (e.target as HTMLInputElement).value
                }))}/>
            </Col>
        </Row>
    )

    return (
       <div>    
           <Form.Select aria-label="select query" value={select} onChange={(e) => setSelect((e.target as HTMLSelectElement).value)}>
                <option value="lastSevenDays">Last 7 days</option>
                <option value="custom">Custom</option>
            </Form.Select>
            { select === "custom" ? custom : null}
       </div>
    );
}
 
export default Query;