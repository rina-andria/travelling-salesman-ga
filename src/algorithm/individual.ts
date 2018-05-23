import * as _ from 'lodash';

export class Individual<T> {
  fitness: number = 0;
  genes: Array<T> = [];

  constructor(
    public size: number,
    public validInputs: Array<T>,
    public fitnessFunction: (individual: Individual<T>) => number,
    public initializeGenes: boolean = true
  ) {
    if (initializeGenes) {
      const shuffledIndexes = _.shuffle(
        Array.apply(null, { length: size }).map(Number.call, Number)
      );
      for (let index = 0; index < size; index++) {
        this.genes.push(validInputs[shuffledIndexes[index]]);
      }

      this.fitness = this.calculateFitness();
    }
  }

  calculateFitness(): number {
    this.fitness = this.fitnessFunction(this);
    return this.fitness;
  }

  crossover(parent2: Individual<T>): Individual<T> {
    const child = _.clone(this);
    child.genes = [];

    const startPos = Math.floor(Math.random() * this.size);
    const endPos = Math.floor(Math.random() * this.size);

    for (let i = 0; i < this.size; i++) {
      if (startPos < endPos && i > startPos && i < endPos) {
        child.genes[i] = this.genes[i];
      } else if (startPos > endPos) {
        if (!(i < startPos && i > endPos)) {
          child.genes[i] = this.genes[i];
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      if (
        _.findIndex(child.genes, gene => _.isEqual(gene, parent2.genes[i])) ===
        -1
      ) {
        for (let j = 0; j < this.size; j++) {
          if (child.genes[j] == null) {
            child.genes[j] = parent2.genes[i];
            break;
          }
        }
      }
    }
    return child;
  }

  mutate(mutationRate: number): void {
    for (let index = 0; index < this.size; index++) {
      if (Math.random() < mutationRate) {
        const genePosition = Math.floor(this.size * Math.random());

        const point1 = this.genes[index];
        const point2 = this.genes[genePosition];

        // Swap them around
        this.genes[genePosition] = point1;
        this.genes[index] = point2;
      }
    }
  }
}
