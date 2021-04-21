import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Button from 'react-bootstrap/Button';
import { Col, Row, Form, Table } from 'react-bootstrap';
import axios from "axios";

function BondYTMPage() {
    const [bonds, setBonds] = React.useState([])
    const [bestBond, setBestBond] = React.useState(null)

    function parseAndSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target),
            formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj)

        let body = {
            "bonds": [
                [
                    formDataObj["name"],
                    parseFloat(formDataObj["price"]),
                    parseInt(formDataObj["periods"]),
                    parseFloat(formDataObj["coupon"])
                ]
            ]
        }

        console.log(body)

        axios
            .post("https://stark-meadow-05108.herokuapp.com/find_ytm", body)
            .then(function(response) {
                formDataObj["YTM"] = response.data[0]["YTM"]
                bonds.push(formDataObj)
                let newBonds = [...bonds]
                console.log(newBonds)
                let maxYtm = 0
                let bestBondName = ""
                for(let bond of newBonds) {
                    if(bond["YTM"] > maxYtm) {
                        maxYtm = bond["YTM"]
                        bestBondName = bond["name"]
                    }
                }
                setBonds(null)
                setBonds(newBonds)
                setBestBond(null)
                setBestBond(bestBondName)
            })
            .catch(function(error) {
                console.log(error)
            })
        
    }

    return (
        <div className="App">
            <div className="Page-header">
                <h1>Find Bond YTM</h1>
                <h4 className="Page-subheader">Fill out the form below to find the YTM for as many bonds as you'd like</h4>
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
                        <Form.Group controlId="formStrike">
                            <Form.Label>Bond Price</Form.Label>
                            <Form.Control required type="number" placeholder="59.3125" step="0.000000001" name="price"/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="formStartPrice">
                            <Form.Label># of Periods</Form.Label>
                            <Form.Control required type="number" placeholder="60" name="periods"/>
                            <Form.Text className="text-muted">
                            Semi-annual
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group controlId="formMovement">
                            <Form.Label>Coupon</Form.Label>
                            <Form.Control required type="number" placeholder="3.75" step="0.000000001" name="coupon"/>
                            <Form.Text className="text-muted">
                            Enter as a percentage
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" className="btn btn-primary btn-lg text-nowrap" size="lg">
                    Add Bond
                </Button>
            </Form>
            <Row className="padding-top-30px padding-bottom-30px">
                <h4 className="Page-subheader">{bestBond ? "The best value investement is: " + bestBond : ""}</h4>
            </Row>

            <Row className="padding-top-30px padding-bottom-80px">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Bond Price</th>
                        <th>Periods</th>
                        <th>Coupon</th>
                        <th>YTM</th>
                    </tr>
                </thead>
                <tbody>
                {
                  bonds && 
                  bonds.map(function (element, index) {
                     return <tr key={index}>
                                <td>{element["name"]}</td>
                                <td>{element["price"]}</td>
                                <td>{element["periods"]}</td>
                                <td>{element["coupon"]}</td>
                                <td>{element["YTM"]}</td>
                            </tr>;
                  })
                }
                </tbody>
            </Table>
            </Row>
            <Row className="padding-top-10px padding-bottom-80px">
                <p className="grey-text padding-top-10px">
                This function takes any number of bonds and calculates the yield to maturity based on the bond price, <br/>
                number of periods to maturity, and coupon (given as a percent).<br/> 
                It gives the user the “best buy”(i.e. the bond with the highest YTM) and a table comparing the different bonds. 
                </p>
            </Row>
            </header>
        </div>

    );
}

export default BondYTMPage;
