import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import {Link} from "react-router-dom";
import axios from "axios";

function HomePage() {
    axios
    .get("http://127.0.0.1:5000/")
    .then(function(response) {
        console.log(response.data)
    })
    .catch(function(error) {
        console.log(error)
    })


  return (
    <div className="App">
        <div className="Page-header">
            <h1>DTM Pricing Tool</h1>
        </div>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Row className="home-btn-container">
                <Col>
                    <Link to="/protected_option">
                        <Button type="button" className="btn btn-primary btn-lg text-nowrap" size="lg">Evaluating Protected Options</Button>
                    </Link>
                </Col>
                <Col>
                    <Link to="/price_options">
                        <Button type="button" className="btn btn-primary btn-lg text-nowrap" size="lg">Price Options</Button>
                    </Link>
                </Col>
                <Col>
                    <Link to="/bond_ytm">
                        <Button type="button" className="btn btn-primary btn-lg text-nowrap" size="lg">Find Bond YTM</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="padding-top-10px">
                <p className="grey-text padding-top-10px">Web page made using React and React-Bootstrap. <br/>
                Server made with Flask. <br/>
                Check out the source code here: <a href="https://github.com/arihirsch/OMFinal">Github</a></p>
            </Row>
        </header>
    </div>

  );
}

export default HomePage;
