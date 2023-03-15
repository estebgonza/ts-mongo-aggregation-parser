import { expect, test } from "vitest";
import {
  ASTAggregationExpression,
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
        new ASTField("name"),
        new ASTAggregationExpression("$sum", new ASTField("score"))
      ),
    ]),
  ]);

  const stageVisitorCounter = new CountStageVisitor();
  ast.accept(stageVisitorCounter);
  expect(stageVisitorCounter.getCount()).toBe(1);

  const fieldVisitorCounter = new CountFieldVisitor();
  ast.accept(fieldVisitorCounter);
  expect(fieldVisitorCounter.getCount()).toBe(3);
});

export abstract class CounterVisitor extends BaseASTVisitor {
  protected counter = 0;

  getCount(): number {
    return this.counter;
  }
}

export class CountStageVisitor extends CounterVisitor {
  visitStageList(stageList: ASTStageList): number {
    return (this.counter += stageList.stages.length);
  }
}

export class CountFieldVisitor extends CounterVisitor {
  visitField(_field: ASTField): number {
    _field; // unused
    return (this.counter += 1);
  }
}
