import React, { Component } from 'react';
import {Button, Container, FormGroup, Col, Table, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';

import { studentData, idealBandRatio } from '../../static/data/symanData';

class App extends Component {
  constructor(props) {
    super(props);

    this.choiceWeights = [3, 2, 1];

    this.state = {
      initialStudents: [],
      students: [],
      //students: this.getInitialStudents(studentData),
      idealRatio: [],
      band: idealBandRatio.reduce((acc, inst) => {acc[inst.name] = []; return acc}, {}),
      demand: idealBandRatio.reduce((acc, inst) => {acc[inst.name] = 0; return acc}, {}),
      idealDiff: [],
      activeTab: 'all',
      choiceTotals: [0, 0, 0],
    }

    this.moveStudent = this.moveStudent.bind(this);
  }

  componentDidMount() {
    const initialStudents = studentData;
    const idealRatio = idealBandRatio;
    this.setState({ initialStudents, idealRatio })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.initialStudents !== this.state.initialStudents) {
      this.updateBand();
    }
    if ( prevState.idealRatio !== this.state.idealRatio || prevState.band !== this.state.band) {
      this.updateIdealDiff();
      this.updateChoiceTotals();
    }
    if(prevState.idealDiff !== this.state.idealDiff) {
      this.updateStudentUtility();
    }
  }

  getInitialStudents(data) {
    return data.reduce((acc, student) => {
      const entry = {};
      entry.name = student.name;
      if (student.firstChoice) {
        entry.firstChoice = { instrument: student.firstChoice, utility: 0 }
      }
      // skip student if no first choice
      else {
        return acc;
      }
      if (student.secondChoice) {
        entry.secondChoice = { instrument: student.secondChoice, utility: 0 }
      }
      if (student.thirdChoice) {
        entry.thirdChoice = { instrument: student.thirdChoice, utility: 0 }
      }
      entry.currentInstrument = entry.firstChoice;
      acc.push(entry);
      return acc;
    }, [])
  }

  updateBand() {
    const band = this.state.band;
    const demand = this.state.demand;
    const students = this.getInitialStudents(this.state.initialStudents);
    students.forEach(student => {
      // Assign each student to their first choice
      band[student.firstChoice.instrument].push(student)
      // Assign the (weighted) demand for each instrument
      if (student.firstChoice) {
        demand[student.firstChoice.instrument] += this.choiceWeights[0];
      }
      if (student.secondChoice) {
        demand[student.secondChoice.instrument] += this.choiceWeights[1];
      }
      if (student.thirdChoice) {
        demand[student.thirdChoice.instrument] += this.choiceWeights[2];
      }
    })
    this.setState({ students, band, demand });
  }

  updateIdealDiff() {
    const idealDiff = idealBandRatio.reduce((acc, instrument) => {
      const inst = {};
      inst.name = instrument.name;
      inst.count = this.state.band[instrument.name].length - Math.round(instrument.ratio * studentData.length);
      acc.push(inst);
      return acc;
    }, []);
    this.setState({ idealDiff })
  }

  updateStudentUtility(inStudents = this.state.students, inidealDiff = this.state.idealDiff, inDemand = this.state.demand) {
    var maxDeltaUtility = 0;
    var nextStudent;
    var nextInstrument = ""
    const students = inStudents.map(student => {
      ['firstChoice', 'secondChoice', 'thirdChoice'].forEach((choice, choiceIndex) => {
        const studentChoice = student[choice];
        if (studentChoice) {
          const {instrument} = studentChoice;
          const idChange = inidealDiff.find(change => {return change.name === instrument})
          /*const utility = idChange.count < 0 
            ? Math.round((idChange.count / inDemand[instrument]) * -100 * this.choiceWeights[choiceIndex])
            : 0*/
            const utility = Math.round((idChange.count / inDemand[instrument]) * -100 * this.choiceWeights[choiceIndex])
          studentChoice.utility = utility;
          if (student.currentInstrument.instrument === instrument) {
            student.currentInstrument.utility = utility;
          }
        }
      });
      ['firstChoice', 'secondChoice', 'thirdChoice'].forEach((choice, choiceIndex) => {
        const studentChoice = student[choice];
        if (studentChoice && student.currentInstrument.instrument !== studentChoice.instrument) {
          const deltaUtility = studentChoice.utility - student.currentInstrument.utility;
          if (deltaUtility > maxDeltaUtility) {
            maxDeltaUtility = deltaUtility;
            nextStudent = student;
            nextInstrument = studentChoice.instrument;
          }
        }
      })
      return student;
    })
    this.setState({students, nextStudent, nextInstrument, maxDeltaUtility});
  }

  updateChoiceTotals() {
    const choiceTotals = [0, 0, 0];
    Object.keys(this.state.band).forEach(instrument => {
      const students = this.state.band[instrument];
      students.forEach(student => {
        instrument === student.firstChoice.instrument && choiceTotals[0]++;
        student.secondChoice && instrument === student.secondChoice.instrument && choiceTotals[1]++;
        student.thirdChoice && instrument === student.thirdChoice.instrument && choiceTotals[2]++;
      })
    })
    this.setState({ choiceTotals });
  }

  moveStudent() {
    const {nextStudent, nextInstrument, band, students} = this.state;
    if (nextStudent) {
      const prevInstrument = nextStudent.currentInstrument.instrument;
      const prevBandIndex = this.state.band[prevInstrument].findIndex(student => { 
        return Object.keys(student).every(key => {
          return student[key] === nextStudent[key]
        })
      });
      const nStudent = { ...nextStudent };
      nStudent.currentInstrument = {instrument: nextInstrument, utility: 0}
      const nBand = { ...band };
      nBand[prevInstrument] = [...band[prevInstrument].slice(0, prevBandIndex), ...band[prevInstrument].slice(prevBandIndex + 1)];
      nBand[nextInstrument].push(nStudent);
      const studentIndex = students.findIndex(student => Object.keys(student).every(key => student[key] === nextStudent[key]));
      const nStudents = [...students.slice(0, studentIndex), nStudent, ...students.slice(studentIndex + 1)];
      this.setState({band: nBand, students: nStudents, nextStudent: undefined, nextInstrument: undefined});
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center">Instrument sorter</h1>
          <hr />
          <FormGroup row className="text-center justify-content-center no-gutters bg-light">
            <Col xs="8" sm="6" md="3">
              <div className="bg-light p-2">
                <h5>Current</h5>
                {Object.keys(this.state.band).map(instrument => {
                  return (
                    <div>
                      {instrument}: {this.state.band[instrument].length}
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="8" sm="6" md="3" >
              <div className="bg-light p-2">
                <h5>Ideal</h5>
                {idealBandRatio.map(instrument => {
                  return (
                    <div>
                      {instrument.name}: {Math.round(instrument.ratio * studentData.length)}
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="8" sm="6" md="3" >
              <div className="bg-light p-2">
                <h5>Diff</h5>
                {this.state.idealDiff.map(instrument => {
                  return (
                    <div>
                      {instrument.name}: <span className={`font-weight-bold ${instrument.count > 0 ? "text-success" : "text-danger"}`}>{instrument.count}</span>
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="8" sm="6" md="3" >
              <div className="bg-light p-2">
                <h5>Choice Pref</h5>
                {this.state.choiceTotals.map((weight, weightIndex) => {
                  return (
                    <div>
                      Choice {weightIndex + 1}: {weight} ({(weight * 100 / (this.state.choiceTotals.reduce((a,b) => a + b, 0) || 1)).toFixed(1)}%)
                    </div>
                  )
                })}
              </div>
            </Col>
          </FormGroup>
          <FormGroup row className="text-center justify-content-center no-gutters bg-light">
            <Col xs="8" sm="6" md="3">
              <div className="bg-light p-2">
                <h5>Ideal ratio</h5>
                {idealBandRatio.map(instrument => {
                  return (
                    <div>
                      {instrument.name}: {(instrument.ratio * 100).toFixed(2)}%
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="8" sm="6" md="3">
              <div className="bg-light p-2">
                <h5>Choice weight</h5>
                {this.choiceWeights.map((weight, weightIndex) => {
                  return (
                    <div>
                      Choice {weightIndex + 1}: {weight}
                    </div>
                  )
                })}
              </div>
            </Col>
            <Col xs="8" sm="6" md="3">
              <div className="bg-light p-2">
                <h5>Demand</h5>
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
          <hr />
          {this.state.nextStudent && 
            <div>
              <FormGroup row className="text-center justify-content-center no-gutters">
                <Col xs="8" sm="6" md="3">
                  <Button
                    block
                    onClick={this.moveStudent}
                  >
                    Move student
                  </Button>
                </Col>
              </FormGroup>
              <hr />
              <h4>Next student ({this.state.nextInstrument}, {this.state.maxDeltaUtility})</h4>
              <Table responsive size='sm'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Current Inst.</th>
                    <th>Utility (Cur)</th>
                    <th>First Choice</th>
                    <th>Utility (1st)</th>
                    <th>Second Choice</th>
                    <th>Utility (2nd)</th>
                    <th>Third Choice</th>
                    <th>Utility (3rd)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.nextStudent.name}</td>
                    <td>{this.state.nextStudent.currentInstrument.instrument}</td>
                    <td>{this.state.nextStudent.currentInstrument.utility}</td>
                    <td>{this.state.nextStudent.firstChoice ? this.state.nextStudent.firstChoice.instrument : ""}</td>
                    <td>{this.state.nextStudent.firstChoice ? this.state.nextStudent.firstChoice.utility : ""}</td>
                    <td>{this.state.nextStudent.secondChoice ? this.state.nextStudent.secondChoice.instrument : ""}</td>
                    <td>{this.state.nextStudent.secondChoice ? this.state.nextStudent.secondChoice.utility : ""}</td>
                    <td>{this.state.nextStudent.thirdChoice ? this.state.nextStudent.thirdChoice.instrument : ""}</td>
                    <td>{this.state.nextStudent.thirdChoice ? this.state.nextStudent.thirdChoice.utility : ""}</td>
                  </tr>
                </tbody>
              </Table>
              <hr />
            </div>
          }
          <h4 className="text-center">Students</h4>
          <Nav tabs justified className="mb-2">
            <NavItem>
              <NavLink
                className={this.state.activeTab === 'all' && "active"}
                onClick={() => { this.setState({activeTab: 'all'}); }}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={this.state.activeTab === 'byInst' && "active"}
                onClick={() => { this.setState({activeTab: 'byInst'}); }}
              >
                By Instrument
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="all">
              <Table responsive striped size='sm'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Current Inst.</th>
                    <th>Utility (Cur)</th>
                    <th>First Choice</th>
                    <th>Utility (1st)</th>
                    <th>Second Choice</th>
                    <th>Utility (2nd)</th>
                    <th>Third Choice</th>
                    <th>Utility (3rd)</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.students.map((student, studentIndex) => {
                    return (
                      <tr key={`tr-student-${studentIndex}`}>
                        <td>{student.name}</td>
                        <td>{student.currentInstrument.instrument}</td>
                        <td>{student.currentInstrument.utility}</td>
                        <td>{student.firstChoice ? student.firstChoice.instrument : ""}</td>
                        <td>{student.firstChoice ? student.firstChoice.utility : ""}</td>
                        <td>{student.secondChoice ? student.secondChoice.instrument : ""}</td>
                        <td>{student.secondChoice ? student.secondChoice.utility : ""}</td>
                        <td>{student.thirdChoice ? student.thirdChoice.instrument : ""}</td>
                        <td>{student.thirdChoice ? student.thirdChoice.utility : ""}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </TabPane>
            <TabPane tabId="byInst">
              {Object.keys(this.state.band).map(instrument => {
                return (
                  <div className="mb-5">
                    <h5>{instrument}</h5>
                    <Table responsive striped size='sm'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Current Inst.</th>
                          <th>Utility (Cur)</th>
                          <th>First Choice</th>
                          <th>Utility (1st)</th>
                          <th>Second Choice</th>
                          <th>Utility (2nd)</th>
                          <th>Third Choice</th>
                          <th>Utility (3rd)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.band[instrument].map((student, studentIndex) => {
                          return (
                            <tr key={`tr-student-${studentIndex}`}>
                              <td>{student.name}</td>
                              <td>{student.currentInstrument.instrument}</td>
                              <td>{student.currentInstrument.utility}</td>
                              <td>{student.firstChoice ? student.firstChoice.instrument : ""}</td>
                              <td>{student.firstChoice ? student.firstChoice.utility : ""}</td>
                              <td>{student.secondChoice ? student.secondChoice.instrument : ""}</td>
                              <td>{student.secondChoice ? student.secondChoice.utility : ""}</td>
                              <td>{student.thirdChoice ? student.thirdChoice.instrument : ""}</td>
                              <td>{student.thirdChoice ? student.thirdChoice.utility : ""}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                )
              })}
            </TabPane>
          </TabContent>
        </Container>
      </div>
    )
  }
}

export default App;