import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Button from 'react-bootstrap/Button';
import { Col, Row, Form, Table } from 'react-bootstrap';
import axios from "axios";


function ProtectedOptionPage() {
    const [optionResults, setOptionResults] = React.useState(null);
    const [type, setType] = React.useState(null);

    function parseAndSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target),
            formDataObj = Object.fromEntries(formData.entries())
        let call = 0
        let put = 0
        
        if(formDataObj["type"] === "Call"){
            setType("Call")
            call = 1
            put = 0
        } else {
            setType("Put")
            call = 0
            put = 1
        }
    
        let body = {
            "option": {
                "option_name": "A",
                "steps": parseInt(formDataObj["steps"]),
                "call": call,
                "put": put,
                "strike_price": parseInt(formDataObj["strike"]),
                "start_price": parseInt(formDataObj["start_price"]),
                "perc_movement": parseFloat(formDataObj["movement"]),
                "deltaT": parseFloat(formDataObj["delta_t"]),
                "r": parseFloat(formDataObj["r"]),
            }
        }
        
        axios
            .post("https://stark-meadow-05108.herokuapp.com/price_protected_option", body)
            .then(function(response) {
                console.log(response.data)
                setOptionResults(response.data)
            })
            .catch(function(error) {
                console.log(error)
            })
    }

    return (
        <div className="App">
            <div className="Page-header">
                <h1>Evaluating a Protected Options Position</h1>
                <h4 className="Page-subheader">Fill out the form below to see how a protected option performs compared to a naked option</h4>
                <h6 className="grey-text">Afterwards, scroll down and read the explanation!</h6>
            </div>
            <header className="App-header">
            <Form onSubmit={parseAndSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="formType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control required as="select" name="type">
                                <option>Put</option>
                                <option>Call</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSteps">
                            <Form.Label>Steps</Form.Label>
                            <Form.Control required type="number" placeholder="# of steps" name="steps"/>
                            <Form.Text className="text-muted">
                            Enter a whole number
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group controlId="formStrike">
                            <Form.Label>Strike Price</Form.Label>
                            <Form.Control required type="number" placeholder="100" name="strike"/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="formStartPrice">
                            <Form.Label>Start Price</Form.Label>
                            <Form.Control required type="number" placeholder="100" name="start_price"/>
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group controlId="formMovement">
                            <Form.Label>Movement</Form.Label>
                            <Form.Control required type="number" placeholder="0.05" step="0.000000001" name="movement"/>
                            <Form.Text className="text-muted">
                            Enter as a decimal
                            </Form.Text>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formDeltaT">
                            <Form.Label>Delta T</Form.Label>
                            <Form.Control required type="number" placeholder="0.083333" step="0.000000001" name="delta_t"/>
                            <Form.Text className="text-muted">
                            Enter as a decimal
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formR">
                            <Form.Label>r</Form.Label>
                            <Form.Control required type="number" placeholder="0.1" step="0.000000001" name="r"/>
                            <Form.Text className="text-muted">
                            Enter as a decimal
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" className="btn btn-primary btn-lg text-nowrap" size="lg">
                    Submit
                </Button>
            </Form>
            <Row className="padding-top-30px padding-bottom-80px">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Outcome</th>
                        <th>Stock Payoff</th>
                        <th>Option Payoff</th>
                        <th>Standard Profit</th>
                        <th>{type === "Call" ? "Covered Call Payoff" : "Protective Put Payoff"}</th>
                        <th>{type === "Call" ? "Covered Call Profit" : "Protective Put Profit"}</th>
                    </tr>
                </thead>
                <tbody>
                {
                  optionResults && 
                  optionResults.map(function (element, index) {
                     return <tr key={index}>
                                <td>{index}</td>
                                <td>{element["Stock Payoff"]}</td>
                                <td>{element["Option Payoff"]}</td>
                                <td>{element["Standard Profit"]}</td>
                                <td>{type === "Call" ? element["Covered Call Payoff"] : element["Protective Put Payoff"]}</td>
                                <td>{type === "Call" ? element["Covered Call Profit"] : element["Protective Put Profit"]}</td>
                            </tr>;
                  })
                }
                </tbody>
            </Table>
            </Row>
            <Row className="padding-top-10px padding-bottom-80px">
                <p className="grey-text padding-top-10px">
                This function uses the same process as above to find a single option’s premium, but also uses the same information <br/>
                to compare results if the user were to enter the options position naked versus covered. Based on the user’s designation,<br/>
                it compares the payoffs and profits from each final stock price scenario between a written call/bought put position<br/>
                and a covered call/protective put position, allowing the user to better contextualize investment decisions.
                </p>
            </Row>
            </header>
        </div>

    );
}

export default ProtectedOptionPage;
