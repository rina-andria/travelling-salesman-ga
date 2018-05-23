import * as React from 'react';
import { Point } from '../algorithm/point';

interface ResultProps {
  possiblePoints: Array<Point>;
  bestGenes: Array<Point>;
  maxCoordinate: number;
}

const Result = (props: ResultProps) => {
  const spacing = 400 / (props.maxCoordinate - 1);
  return (
    <svg width="400" height="400" viewBox="-20 -20 440 440">
      <g>
        <title>Grid</title>
        {Array.apply(null, { length: props.maxCoordinate })
          .map(Number.call, Number)
          .map((coordinate: number) => (
            <line
              id={`svg_x_${coordinate}`}
              key={`svg_x_${coordinate}`}
              y2={coordinate * spacing}
              x2={400}
              y1={coordinate * spacing}
              x1={0}
              strokeWidth="1"
              stroke="#b2b2b2"
              fill="none"
            />
          ))}

        {Array.apply(null, { length: props.maxCoordinate })
          .map(Number.call, Number)
          .map((coordinate: number) => (
            <line
              id={`svg_y_${coordinate}`}
              key={`svg_y_${coordinate}`}
              y2={400}
              x2={coordinate * spacing}
              y1={0}
              x1={coordinate * spacing}
              strokeWidth="1"
              stroke="#b2b2b2"
              fill="none"
            />
          ))}

        {props.possiblePoints.map((point, index) => (
          <ellipse
            key={index}
            ry={1 / props.maxCoordinate * 100}
            rx={1 / props.maxCoordinate * 100}
            id="svg_5"
            cy={point.y * spacing}
            cx={point.x * spacing}
            stroke="#666666"
            fill="#666666"
          />
        ))}

        {props.possiblePoints.map((point, index) => (
          <ellipse
            key={index}
            ry={1 / props.maxCoordinate * 100 / 2}
            rx={1 / props.maxCoordinate * 100 / 2}
            id="svg_5"
            cy={point.y * spacing}
            cx={point.x * spacing}
            stroke="#f5222d"
            fill="#f5222d"
          />
        ))}

        {props.bestGenes.map((point1: Point, index) => {
          const point2 =
            index === props.bestGenes.length - 1
              ? props.bestGenes[0]
              : props.bestGenes[index + 1];
          return (
            <line
              key={index}
              id={`${index}`}
              y2={`${point2.y * spacing}`}
              x2={`${point2.x * spacing}`}
              y1={`${point1.y * spacing}`}
              x1={`${point1.x * spacing}`}
              strokeWidth="2"
              stroke="#f5222d"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default Result;
