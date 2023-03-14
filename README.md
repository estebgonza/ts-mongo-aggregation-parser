# ts-mongo-aggregation-parser [WIP]

[![Tests Status](https://github.com/estebgonza/ts-mongo-aggregation-parser/actions/workflows/tests.yaml/badge.svg)](https://github.com/estebgonza/ts-mongo-aggregation-parser/actions/workflows/tests.yaml/badge.svg)

This parser is generated using [pegjs](https://pegjs.org/). It parses a string containing a MongoDB aggregation pipeline and returns an AST.
The AST Types are defined in [src/ast-types.ts](src/ast-types.ts).
This package is compatible with CommonJS and ESM.

## Installation

```bash
npm install ts-mongo-aggregation-parser
yarn add ts-mongo-aggregation-parser
pnpm add ts-mongo-aggregation-parser
```

## Parser usage

```typescript
import { astTypes, parse } from 'ts-mongo-aggregation-parser'

const pipeline = `[
{
  $group: {
    _id: '$name',
    count: {
      $sum: 1,
    },
  },
},
]`

const ast = parse(pipeline)
```

## Using the AST Visitor

The Visitor AST provides a good way to traverse and manipulate our custom Abstract Syntax Trees (ASTs). To use the AST visitor, simply extend the `BaseASTVisitor` class and override the methods for the specific AST node types you're interested in. Below is a brief example:

```typescript
import {
	ASTAggregationExpression,
	ASTField,
	ASTProperty,
	ASTStageGroup,
	ASTStageList,
	ASTVisitor,
	BaseASTVisitor,
} from './ts-mongo-aggregation-parser'

class CustomASTVisitor extends BaseASTVisitor {
	visitStageGroup(stageGroup: ASTStageGroup): void {
		console.log(`StageGroup ID: ${stageGroup.id.name}`)
	}

	visitAggregationExpression(agg: ASTAggregationExpression): void {
		console.log(`Aggregation Operator: ${agg.operator}`)
	}
}

// Assuming you have created an AST
const ast = new ASTStageList() /* your stages here */

// Use your custom visitor
const visitor = new CustomASTVisitor()
ast.accept(visitor)
```

## Supported aggregation operators

- [x] $sum
- [x] $avg
- [x] $max
- [x] $min
- [ ] $push
- [ ] $addToSet
- [ ] $first
- [ ] $last
- [ ] $addToSet

## Supported stages

- [x] $group
- [ ] $project
- [ ] $match
- [ ] $limit
- [ ] $skip
- [ ] $unwind
- [ ] $sort

## Roadmap

- [x] Implement a visitor pattern
- [ ] Support all aggregation operators
- [ ] Support all stages
