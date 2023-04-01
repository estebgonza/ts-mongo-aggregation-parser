import { expect, test } from "vitest";
import { parse } from "../generated/mongo-aggregation-parser.js";
import { ASTStageList } from "../src/ast-types.js";

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

// test("Match stage with simple condition", () => {
//   const pipeline = `[ { $match: { $age: { $gte: 18 } } } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });

// test("Match stage with multiple conditions", () => {
//   const pipeline = `[ { $match: { $and: [ { age: { $gte: 18 } }, { country: "USA" } ] } } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });

// test("Mixed stages in pipeline", () => {
//   const pipeline = `[ { $match: { age: { $gte: 18 } } }, { $group: { _id: "$country", averageAge: { $avg: "$age" } } }, { $limit: 5 } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });

test("Group test with one accumulator 2", () => {
  const pipeline = `[ { $group: { _id: "$name", mySum: { $sum: ["$age","$yes"] } } } ]`;
  console.log(JSON.stringify(parse(pipeline)));
  console.log(JSON.stringify(parse(pipeline)));
  console.log(JSON.stringify(parse(pipeline)));
  console.log(JSON.stringify(parse(pipeline)));
  console.log(JSON.stringify(parse(pipeline)));
  console.log(JSON.stringify(parse(pipeline)));
  expect(parse(pipeline)).toBeDefined();
});

// test("Multiple stages separated", () => {
//   const pipeline = `[{$group:{_id:"$name", total: { $sum: "$score"}}},{$group:{_id:"$name", total: { $sum: "$score"}}}, {$group:{_id:"$name", total: { $sum: "$score"}}}]`;
//   const stageList = parse(pipeline) as ASTStageList;
//   expect(stageList.stages.length).toEqual(3);
//   // If the parser is working correctly, the accept method should be defined
//   // It means stages are instances of ASTStage and not strings or random objects
//   expect(stageList.stages[0].accept).toBeDefined();
//   expect(stageList.stages[1].accept).toBeDefined();
//   expect(stageList.stages[2].accept).toBeDefined();
// });

// test("Multiple properties", () => {
//   const pipeline = `[{$group:{_id:"$name", total: { $sum: "$score"}, avg: { $avg: "$score" }}}]`;
//   const stageList = parse(pipeline) as ASTStageList;
//   expect(stageList.stages.length).toEqual(1);
//   const group = stageList.stages[0];
//   expect(group.properties.length).toEqual(2);
//   expect(group.properties[0].operation.field.name).toEqual("score");
//   expect(group.properties[1].operation.field.name).toEqual("score");
// });
