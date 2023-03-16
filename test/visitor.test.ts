import {
  ASTAggregationAvg,
  ASTAggregationExpression,
  ASTAggregationMax,
  ASTAggregationMin,
} from "./../src/ast-types";
import { expect, test } from "vitest";
import {
  ASTAggregationSum,
  ASTStageList,
  ASTStageGroup,
  ASTProperty,
  ASTField,
} from "../src/ast-types.js";

import { BaseASTVisitor } from "../src/ast-visitor.js";

test("Simple counter visitor on group and field", async () => {
  const ast = new ASTStageList([
    new ASTStageGroup(new ASTField("id"), [
      new ASTProperty(
        new ASTField("mySummedScore"),
        new ASTAggregationSum(new ASTField("score"))
      ),
      new ASTProperty(
        new ASTField("myAveragedScore"),
        new ASTAggregationAvg(new ASTField("score"))
      ),

      new ASTProperty(
        new ASTField("myMaxScore"),
        new ASTAggregationMax(new ASTField("score"))
      ),

      new ASTProperty(
        new ASTField("myMinScore"),
        new ASTAggregationMin(new ASTField("score"))
      ),

      new ASTProperty(
        new ASTField("myMinScore2"),
        new ASTAggregationMin(new ASTField("score"))
      ),
    ]),
  ]);

  const stageCounter = new StageCounter();
  ast.accept(stageCounter);
  expect(stageCounter.getCount()).toBe(1);

  const fieldCounter = new FieldCounter();
  ast.accept(fieldCounter);
  expect(fieldCounter.getCount()).toBe(11);

  const propertyCounter = new PropertyCounter();
  ast.accept(propertyCounter);
  expect(propertyCounter.getCount()).toBe(5);

  const aggregationCounter = new AggregationCounter();
  ast.accept(aggregationCounter);
  expect(aggregationCounter.getCount()).toBe(5);
});

export abstract class CounterVisitor extends BaseASTVisitor {
  protected counter = 0;

  getCount(): number {
    return this.counter;
  }
}

export class StageCounter extends CounterVisitor {
  visitStageList(stageList: ASTStageList): void {
    this.counter += stageList.stages.length;
  }
}

export class FieldCounter extends CounterVisitor {
  visitField(): void {
    ++this.counter;
  }
}

export class PropertyCounter extends CounterVisitor {
  visitProperty(): void {
    ++this.counter;
  }
}

export class AggregationCounter extends CounterVisitor {
  visitAggregationExpression(): void {
    ++this.counter;
  }
}
