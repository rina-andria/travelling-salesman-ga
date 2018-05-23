import { Individual } from './individual';
import * as _ from 'lodash';
import { Point } from './point';

export class GeneticAlgorithm<T> {
  population: Array<Individual<T>> = [];
  generation: number = 0;
  bestFitness: number = 0.0;
  bestGenes: Array<T> = [];
  // keep the best from previous population
  isElitist = true;
  newPopulation: Array<Individual<T>> = [];
  fitnessSum: number = 0.0;
  individualSize: number = 0;
  fitnessFunction: (individual: Individual<T>) => number;

  constructor(
    public populationSize: number,
    individualSize: number,
    public validInputs: Array<T>,
    fitnessFunction: (individual: Individual<T>) => number,
    isElitist: boolean,
    public mutationRate = 0.15
  ) {
    this.generation = 0;
    this.mutationRate = mutationRate;
    this.individualSize = individualSize;
    this.fitnessFunction = fitnessFunction;
    this.isElitist = isElitist;

    for (let i = 0; i < populationSize; i++) {
      this.population.push(
        new Individual<T>(individualSize, validInputs, fitnessFunction, true)
      );
    }
  }

  newGeneration(
    numNewIndividual: number = 0,
    crossoverNewIndividual: boolean = false
  ): void {
    const newPopulation = [];

    // Keep our best individual if elitism is enabled
    let elitismOffset = 0;
    if (this.isElitist) {
      newPopulation[0] = this.population[0];
      elitismOffset = 1;
    }

    for (let i = elitismOffset; i < this.populationSize; i++) {
      const parent1 = this.chooseParent();
      const parent2 = this.chooseParent();
      const child = parent1.crossover(parent2);
      newPopulation[i] = child;
    }

    for (let i = elitismOffset; i < this.populationSize; i++) {
      newPopulation[i].mutate(this.mutationRate);
    }

    const orderedPopulation = newPopulation.sort(this.compareIndividual);
    this.newPopulation = _.clone(orderedPopulation);
    this.population = _.clone(orderedPopulation);
    const best = this.newPopulation[0];
    this.bestGenes = best.genes;
    this.bestFitness = best.calculateFitness();
    this.generation++;
  }

  private compareIndividual(a: Individual<T>, b: Individual<T>): number {
    const af = a.calculateFitness();
    const bf = b.calculateFitness();
    if (af > bf) {
      return -1;
    } else if (af < bf) {
      return 1;
    } else {
      return 0;
    }
  }

  private chooseParent(): Individual<T> | any {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      const randomId = Math.floor(Math.random() * this.populationSize);
      population[i] = this.population[randomId];
    }

    const fittest = this.getFittest(population);
    return fittest;
  }

  private getFittest(population: Array<Individual<T>>): Individual<T> {
    let fittest = population[0];
    for (let i = 1; i < this.populationSize; i++) {
      if (fittest.calculateFitness() < population[i].calculateFitness()) {
        fittest = population[i];
      }
    }

    this.bestGenes = fittest.genes;
    this.bestFitness = fittest.calculateFitness();
    return fittest;
  }
}
