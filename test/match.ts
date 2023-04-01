import { expect, test } from "vitest";
import { parse } from "../generated/mongo-aggregation-parser.js";

// test("Match stage with simple condition", () => {
//   const pipeline = `[ { $match: { $and: "oui" } } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });

// test("Match stage with multiple conditions", () => {
//   const pipeline = `[ { $match: { $and: [ { $add: "oui",$add: "es"} ] } } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });

// test("Mixed stages in pipeline", () => {
//   const pipeline = `[ { $match: { age: { $gte: 18 } } }, { $group: { _id: "$country", averageAge: { $avg: "$age" } } }, { $limit: 5 } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });
