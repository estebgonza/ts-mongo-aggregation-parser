import { expect, test } from "vitest";
import { parse } from "../generated/mongo-aggregation-parser.js";

test("Group test", () => {
  const pipeline = `[{$group:{_id:"$name", total: { $sum: "$score"}, avg: { $avg: "$score" }}}]`;

  const ast = parse(pipeline);

  const stages = ast.stages;
  expect(stages.length).toEqual(1);

  const group = stages[0];
  expect(group.type).toEqual("StageGroup");
  expect(group.id).toEqual({ type: "Field", name: "$name" });

  const properties = group.properties;
  expect(properties.length).toEqual(1);

  const firstProperty = properties[0];
  expect(firstProperty.length).toEqual(2);

  const totalOperation = firstProperty[0];
  expect(totalOperation.operation.type).toEqual("AggregationExpression");
  expect(totalOperation.operation.operator).toEqual("$sum");
  expect(totalOperation.operation.field).toEqual({
    type: "Field",
    name: "$score",
  });

  const avgOperation = firstProperty[1];
  expect(avgOperation.operation.type).toEqual("AggregationExpression");
  expect(avgOperation.operation.operator).toEqual("$avg");
  expect(avgOperation.operation.field).toEqual({
    type: "Field",
    name: "$score",
  });
});

test("Group test with blank spaces", () => {
  const pipeline = ` [ {    $group: {   _id:    "$name", total: { $sum: "$score"}, avg: { $avg: "$score" }   }   }   ]    `;
  expect(() => parse(pipeline)).not.toThrow();
});
