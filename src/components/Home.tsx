import * as React from 'react';
import { Layout, Card, List, Input, Button, Switch, message } from 'antd';
import * as _ from 'lodash';
import { GeneticAlgorithm } from '../algorithm/algorithm';
import { Point } from '../algorithm/point';
import { Individual } from '../algorithm/individual';
import Result from './Result';

const { Header, Footer, Sider, Content } = Layout;

interface HomeProps {}

interface HomeState {
  maxIteration: number;
  nbPopulation: number;
  result: GeneticAlgorithm<Point> | any;
  launching: boolean;
  executionTime: number;
  bestGenes: Point[];
  initialPoints: Point[];
  isElitist: boolean;
  maxCoordinate: number;
  count: number;
  nbPoints: number;
}

export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props);

    this.state = this.initialState;
  }

  MAX_COORDINATE = 10;
  NB_POINTS = 20;

  counter: any;
  genericAlgo: GeneticAlgorithm<Point> | any;

  generatePoints = (nbPoints: number, maxCoordinate: number) => {
    const result = [];
    while (result.length < nbPoints) {
      const newPoint = new Point(
        Math.floor(Math.random() * maxCoordinate),
        Math.floor(Math.random() * maxCoordinate)
      );

      if (_.findIndex(result, point => _.isEqual(point, newPoint)) > -1) {
        continue;
      }
      result.push(newPoint);
    }

    return result;
  };

  initialState = {
    maxIteration: 50,
    nbPopulation: 250,
    result: null,
    launching: false,
    executionTime: 0,
    bestGenes: [],
    isElitist: true,
    nbPoints: this.NB_POINTS,
    initialPoints: this.generatePoints(this.NB_POINTS, this.MAX_COORDINATE),
    maxCoordinate: this.MAX_COORDINATE,
    count: 0
  };

  handleMaxIterationChange = (event: any) => {
    const { value } = event.target;
    this.setState({ maxIteration: parseInt(value, 10) });
  };

  handleNbPopulationChange = (event: any) => {
    const { value } = event.target;
    this.setState({ nbPopulation: parseInt(value, 10) });
  };

  handleElitismChange = (checked: boolean) => {
    this.setState({ isElitist: checked });
  };

  handleNbPointsChange = (event: any) => {
    const { value } = event.target;
    const nbPoints = parseInt(value, 10);
    this.setState({
      nbPoints,
      initialPoints: this.generatePoints(nbPoints, this.state.maxCoordinate)
    });
  };

  handleMaxCoordinateChange = (event: any) => {
    const { value } = event.target;
    this.setState({
      maxCoordinate: parseInt(value, 10)
    });
  };

  countTimers = () => {
    this.counter = setInterval(() => this.timer(this), 200);
  };

  timer = (counter: any) => {
    const nextCount = this.state.count - 1;
    this.genericAlgo.newGeneration();

    this.setState({ count: nextCount, bestGenes: this.genericAlgo.bestGenes });

    if (nextCount < 0) {
      clearInterval(this.counter);

      message.success('An optimal salesman path found');
      this.setState({ launching: false });
      return;
    }
  };

  handleLaunchSearch = () => {
    this.setState({ launching: true, count: this.state.maxIteration });
    const start = new Date();

    this.genericAlgo = new GeneticAlgorithm<Point>(
      this.state.nbPopulation,
      this.state.initialPoints.length,
      this.state.initialPoints,
      this.fitnessFunction,
      this.state.isElitist
    );

    this.countTimers();

    this.setState({
      executionTime: new Date() - start
    });
  };

  fitnessFunction = (individual: Individual<Point>) => {
    let distance = 0;

    for (let i = 0; i < individual.genes.length; i++) {
      if (i === individual.genes.length - 1) {
        distance += individual.genes[i].distance(individual.genes[0]);
      } else {
        distance += individual.genes[i].distance(individual.genes[i + 1]);
      }
    }

    return 1 / distance;
  };

  handleReset = () => {
    this.setState({ ...this.initialState });
  };

  render() {
    return (
      <React.Fragment>
        <Layout>
          <Header className="Header">Travelling Salesman Problem (GA)</Header>
          <Content className="Content">
            <Card style={{ width: 400 }}>
              <label>Maximum iteration</label>
              <Input
                type="number"
                value={this.state.maxIteration}
                onChange={this.handleMaxIterationChange}
                placeholder="Max iteration..."
                className="Input"
              />

              <label>Number of population</label>
              <Input
                type="number"
                value={this.state.nbPopulation}
                onChange={this.handleNbPopulationChange}
                placeholder="Number of population..."
                className="Input"
              />

              <label>Number of points</label>
              <Input
                type="number"
                value={this.state.nbPoints}
                onChange={this.handleNbPointsChange}
                placeholder="Number of points..."
                className="Input"
              />

              <label>Max axis value</label>
              <Input
                type="number"
                value={this.state.maxCoordinate}
                onChange={this.handleMaxCoordinateChange}
                placeholder="Max axis value..."
                className="Input"
              />

              <label>Is elitist?</label>
              <Switch
                checked={this.state.isElitist}
                onChange={this.handleElitismChange}
                className="Switch Input"
              />

              <Button
                className="Button"
                type="danger"
                onClick={this.handleLaunchSearch}
                disabled={this.state.launching}
              >
                {this.state.launching
                  ? `${this.state.maxIteration -
                      this.state.count} iterations...`
                  : 'Launch search'}
              </Button>

              <Button
                className="Button"
                type="danger"
                onClick={this.handleReset}
                disabled={this.state.launching}
              >
                Reset
              </Button>

              <Button
                className="Button"
                type="danger"
                onClick={() =>
                  this.setState({
                    initialPoints: this.generatePoints(
                      this.state.nbPoints,
                      this.state.maxCoordinate
                    ),
                    bestGenes: []
                  })
                }
                disabled={this.state.launching}
              >
                Generate new numbers
              </Button>
            </Card>

            <Result
              possiblePoints={this.state.initialPoints}
              bestGenes={this.state.bestGenes}
              maxCoordinate={this.state.maxCoordinate}
            />
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}
