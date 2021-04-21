import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Button from 'react-bootstrap/Button';
import { Col, Row, Form, Table } from 'react-bootstrap';
import axios from "axios";

// add name to this page rather than numbering
function PriceOptionsPage() {
    const [options, setOptions] = React.useState([])

    function parseAndSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target),
            formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj)

        let call = 0
        let put = 0
        
        if(formDataObj["type"] === "Call"){
            call = 1
            put = 0
        } else {
            call = 0
            put = 1
        }

        let body = {
            "options": [{
                "option_name": formDataObj["name"],
                "steps": parseInt(formDataObj["steps"]),
                "call": call,
                "put": put,
                "strike_price": parseInt(formDataObj["strike"]),
                "start_price": parseInt(formDataObj["start_price"]),
                "perc_movement": parseFloat(formDataObj["movement"]),
                "deltaT": parseFloat(formDataObj["delta_t"]),
                "r": parseFloat(formDataObj["r"]),
            }]
        }

        axios
            .post("http://127.0.0.1:5000/price_options", body)
            .then(function(response) {
                formDataObj["premium"] = response.data[0]["Value"]
                options.push(formDataObj)
                let newOptions = [...options]
                console.log(newOptions)
                setOptions(null)
                setOptions(newOptions)
            })
            .catch(function(error) {
                console.log(error)
            })
        
    }

    return (
        <div className="App">
            <div className="Page-header">
                <h1>Pricing Options</h1>
                <h4 className="Page-subheader">Fill out the form below to price out as many options as you'd like with risk-neutral pricing</h4>
                <h6 className="grey-text">Afterwards, scroll down and read the explanation!</h6>
            </div>
            <header className="App-header">
            <Form onSubmit={parseAndSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="formSteps">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Name" name="name"/>
                        </Form.Group>
                    </Col>
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
                    Add Option
                </Button>


            </Form>
            <Row className="padding-top-30px padding-bottom-80px">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Steps</th>
                        <th>Type</th>
                        <th>Strike Price</th>
                        <th>Start Price</th>
                        <th>Movement</th>
                        <th>deltaT</th>
                        <th>r</th>
                        <th>Premium</th>
                    </tr>
                </thead>
                <tbody>
                {
                  options && 
                  options.map(function (element, index) {
                     return <tr key={index}>
                                <td>{element["name"]}</td>
                                <td>{element["steps"]}</td>
                                <td>{element["type"]}</td>
                                <td>{element["strike"]}</td>
                                <td>{element["start_price"]}</td>
                                <td>{element["movement"]}</td>
                                <td>{element["delta_t"]}</td>
                                <td>{element["r"]}</td>
                                <td>{element["premium"]}</td>
                            </tr>;
                  })
                }
                </tbody>
            </Table>
            </Row>
            <Row className="padding-top-10px padding-bottom-80px">
                <p className="grey-text padding-top-10px">
                This function takes any number of options with a dynamic number of steps and uses the binomial pricing model <br/>
                with risk-neutral valuation to determine each option’s premium. As inputs, it takes steps, <br/>
                time between each step, interest rate (continuously compounded), percent movement up/down for each step,<br/>
                starting price, strike price, and whether the option is a call or put.<br/>
                It takes this information and gives the user a table with each option and its price.
                </p>
            </Row>
            </header>
        </div>

    );
}

export default PriceOptionsPage;
