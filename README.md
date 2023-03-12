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

## Usage

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

- [ ] Implement a visitor pattern
- [ ] Support all aggregation operators
- [ ] Support all stages
