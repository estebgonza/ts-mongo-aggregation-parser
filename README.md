# ts-mongo-aggregation-parser

This parser is generated using [pegjs](https://pegjs.org/). It parses a string containing a MongoDB aggregation pipeline and returns an AST.
The AST Types are defined in [src/astTypes.ts](src/astTypes.ts).
This package is compatible with CommonJS and ESM.

## Install

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
