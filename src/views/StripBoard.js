import React, { useContext, useState, useEffect } from 'react';
import {
    Col,
    Row,
    Container
} from 'react-bootstrap'
import axios from 'axios'

import { RootContext } from '../RootContext'
import Strip from '../components/Strip'

export default function StripBoard() {
    const { ip } = useContext(RootContext)

    const [visibleCallsigns, setVisibleCallsigns] = useState([])
    const [notifiedCallsigns, setNotifiedCallsigns] = useState([])
    const [assumedCallsigns, setAssumedCallsigns] = useState([])
    const [runs, setRuns] = useState(0)
    //const [tokenSource] = useState(axios.CancelToken.source())

    const loadCallsigns = (token) => {
        axios.post("http://"+ ip +":8484/api", {
            jsonrpc: '2.0',
            id: 1,
            method: 'getVisibleCallsigns'
        })
        .then(response =>{
            setAssumedCallsigns(response.data.result[5]);
            setNotifiedCallsigns(response.data.result[1])
        })
        .catch(err =>
            console.error(err)
        )
    }

    useEffect(() => {
        if(runs > 10) return;
        loadCallsigns()
        setRuns(runs + 1)
    }, [loadCallsigns, runs, setRuns])
   
    return (
        <Container>
            <Row xs={3}>
                <Col>
                    <div className="p-0 strip-container">
                    {notifiedCallsigns && notifiedCallsigns.map((nc, i) => 
                        <Strip key={i} callsign={nc} ></Strip>
                    )}
                    </div>
                </Col>
                <Col>
                    <div className="p-0 strip-container">
                    {assumedCallsigns && assumedCallsigns.map((ac, i) => 
                        <Strip key={i} callsign={ac} assigned ></Strip>
                    )}
                    </div>
                </Col>
                <Col>
                    <div className="p-0 strip-container">
                        Dies wird eine Dritte column
                    </div>
                </Col>
            </Row>
            <Row className="button-row">
                Hier kommen Buttons rein
            </Row>
        </Container>
    )
}