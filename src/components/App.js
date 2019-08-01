import React, { Component } from 'react';
import {Container, FormGroup, Col} from 'reactstrap';

import { studentData, idealBandRatio } from '../../static/data/symanData';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAutorun: false,
      band: idealBandRatio.reduce((acc, inst) => {acc[inst.name] = []; return acc}, {}),
      demand: {}
    }
  }

  componentDidMount() {
    const band = this.state.band;
    const demand = idealBandRatio.reduce((acc, inst) => {acc[inst.name] = 0; return acc}, {})
    studentData.forEach(student => {
      band[student.firstChoice].push(student)
      student.firstChoice && demand[student.firstChoice]++ && demand[student.firstChoice]++ && demand[student.firstChoice]++;
      student.secondChoice && demand[student.secondChoice]++ && demand[student.secondChoice]++;
      student.thirdChoice && demand[student.thirdChoice]++;
    })
    this.setState({ band, demand });
  }

  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center">Instrument sorter</h1>
          <hr />
          <FormGroup row className="text-center justify-content-center">
            <Col xs="3">
              <div className="bg-light p-2">
                <h4>Current count</h4>
                {Object.keys(this.state.band).map(instrument => {
                  return (
                    <div>
                      {instrument}: {this.state.band[instrument].length}
                    </div>
                  )
                })}
              </div>
            </Col>
          </FormGroup>
          <FormGroup row className="text-center justify-content-center">
            <Col xs="3">
              <div className="bg-light p-2">
                <h4>Ideal ratio</h4>
                {idealBandRatio.map(instrument => {
                  return (
                    <div>
                      {instrument.name}: {(instrument.ratio * 100).toFixed(2)}%
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="3">
              <div className="bg-light p-2">
                <h4>Ideal count</h4>
                {idealBandRatio.map(instrument => {
                  return (
                    <div>
                      {instrument.name}: {Math.round(instrument.ratio * studentData.length)}
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="3">
              <div className="bg-light p-2">
                <h4>Ideal change</h4>
                {idealBandRatio.map(instrument => {
                  const diff = Math.round(instrument.ratio * studentData.length) - this.state.band[instrument.name].length;
                  return (
                    <div>
                      {instrument.name}: <span className={`font-weight-bold ${diff > 0 ? "text-success" : "text-danger"}`}>{diff}</span>
                    </div>
                  )
                })}
              </div>
            </Col>
          </FormGroup>
          <FormGroup row className="text-center justify-content-center">
            <Col xs="3">
              <div className="bg-light p-2">
                <h4>Total demand</h4>
                {Object.keys(this.state.demand).map(instrument => {
                  return (
                    <div>
                      {instrument}: {this.state.demand[instrument]}
                    </div>
                  )
                })}
              </div>
            </Col>
          </FormGroup>
        </Container>
      </div>
    )
  }
}

export default App;