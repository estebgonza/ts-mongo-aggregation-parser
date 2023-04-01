import { expect, test } from "vitest";
import { parse } from "../generated/mongo-aggregation-parser.js";

// test("Group test", () => {
//   const pipeline = `[{$group:{_id:"$name", total: { $sum: "$score"}, myAvg: { $avg: "$score" }}}]`;

//   const ast = parse(pipeline);

//   const stages = ast.stages;
//   expect(stages.length).toEqual(1);

//   const group = stages[0];
//   expect(group.type).toEqual("stage-group");
//   expect(group.id).toEqual({ type: "reference-field", name: "name" });

//   const properties = group.properties;
//   expect(properties.length).toEqual(2);

//   const total = properties[0];
//   expect(total.type).toEqual("property");
//   expect(total.field.name).toEqual("total");
//   expect(total.operation.type).toEqual("aggregation-expression");
//   expect(total.operation.field.type).toEqual("reference-field");
//   expect(total.operation.field.name).toEqual("score");

//   const avg = properties[1];
//   expect(avg.type).toEqual("property");
//   expect(avg.field.name).toEqual("myAvg");
//   expect(avg.field.type).toEqual("output-field-name");
//   expect(avg.operation.type).toEqual("aggregation-expression");
//   expect(avg.operation.field.type).toEqual("reference-field");
//   expect(avg.operation.field.name).toEqual("score");
// });

test("Group test with blank spaces", () => {
  const pipeline = `[ { $group: { _id: "$name" } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with simple sum accumulator", () => {
  const pipeline = `[ { $group: { _id: "$name", mySum: { $sum: "$age" } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with multiple accumulators", () => {
  const pipeline = `[ { $group: { _id: "$country", totalPopulation: { $sum: 1 }, averageAge: { $avg: "$age" } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with complex accumulator", () => {
  const pipeline = `[ { $group: { _id: "$gender", totalSalary: { $sum: { $cond: [ { $gte: [ "$salary", 0 ] }, "$salary", 0 ] } } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Limit stage", () => {
  const pipeline = `[ { $limit: 10 } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with different field reference formats", () => {
  const pipeline = `[ { $group: { _id: "$name", total: { $sum: "$age" }, min: { $min: "$nested.field" } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with expression in accumulator", () => {
  const pipeline = `[ { $group: { _id: "$country", salarySum: { $sum: { $multiply: ["$salary", "$exchangeRate"] } } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with multiple accumulators and nested expressions", () => {
  const pipeline = `[ { $group: { _id: "$country", totalAge: { $sum: "$age" }, averageSalary: { $avg: { $add: ["$salary", "$bonus"] } } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with no whitespace", () => {
  const pipeline = `[{ $group: { _id: "$name", mySum: { $sum: "$age" } } }]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with nested expressions in accumulator", () => {
  const pipeline = `[ { $group: { _id: "$category", weightedAverage: { $sum: { $multiply: ["$price", "$quantity"] } } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

test("Group with numeric values as decimals and scientific notation", () => {
  const pipeline = `[ { $group: { _id: "$category", total: { $sum: 1.23e-4 } } } ]`;
  expect(parse(pipeline)).toBeDefined();
});

// Not supported yet
// test("Group with nested fields in _id field", () => {
//   const pipeline = `[ { $group: { _id: { year: "$year", month: "$month" }, total: { $sum: 1 } } } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });
