import { ASTVisitor, ASTStageList, ASTStageGroup } from "./ast-types.js";

export class ASTStageListVisitor implements ASTVisitor {
  visit(ast: ASTStageList): void {
    this.visitStageList(ast);
  }

  visitStageList(ast: ASTStageList): void {
    for (const stage of ast.stages) {
      switch (stage.type) {
        case "StageGroup": {
          this.visitStageGroup(stage);
          break;
        }
        default: {
          throw new Error(`Unknown stage type: ${stage.type}`);
        }
      }
    }
  }

  visitStageGroup(ast: ASTStageGroup): void {
    ast.id.accept(this);
    for (const property of ast.properties) {
      property.accept(this);
    }
  }
}
