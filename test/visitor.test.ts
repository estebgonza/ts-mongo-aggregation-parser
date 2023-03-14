import { expect, test } from "vitest";
import {
  ASTAggregationExpression,
  ASTStageList,
  ASTStageGroup,
  BaseASTVisitor,
  ASTProperty,
  ASTField,
} from "../src/ast-types.js";

test("Group test", async () => {
  let count = 0;
  const callbackCount = () => count++;

  const print = new CountStageVisitor(callbackCount);

  const ast = new ASTStageList([
    new ASTStageGroup(new ASTField("id"), [
      new ASTProperty(
        new ASTField("name"),
        new ASTAggregationExpression("$sum", new ASTField("score"))
      ),
    ]),
  ]);

  ast.accept(print);
  expect(count).toBe(1);
  count = 0;

  const print2 = new CountFieldVisitor(callbackCount);

  ast.accept(print2);
  expect(count).toBe(3);

  count = 0;
});

export class CountStageVisitor extends BaseASTVisitor {
  constructor(private callback: () => void) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitStageGroup(_stageGroup: ASTStageGroup): void {
    this.callback();
  }
}

export class CountFieldVisitor extends BaseASTVisitor {
  constructor(private callback: () => void) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitField(_field: ASTField): void {
    this.callback();
  }
}
