import {
  ASTStageList,
  ASTStageGroup,
  ASTAggregationExpression,
  ASTField,
  ASTProperty,
  ASTNode,
} from "./ast-types.js";

export interface ASTVisitor {
  visitStageList(stageList: ASTStageList): void;
  visitStageGroup(stageGroup: ASTStageGroup): void;
  visitAggregationExpression(agg: ASTAggregationExpression): void;
  visitField(field: ASTField): void;
  visitProperty(property: ASTProperty): void;
}

export abstract class BaseASTVisitor implements ASTVisitor {
  visit(node: ASTNode): void {
    switch (node.type) {
      case "StageList": {
        return this.visitStageList(node as ASTStageList);
      }
      case "StageGroup": {
        return this.visitStageGroup(node as ASTStageGroup);
      }
      case "AggregationExpression": {
        return this.visitAggregationExpression(
          node as ASTAggregationExpression
        );
      }
      case "Field": {
        return this.visitField(node as ASTField);
      }
      case "Property": {
        return this.visitProperty(node as ASTProperty);
      }
      default: {
        throw new Error(`Unknown AST node type: ${node.type}`);
      }
    }
  }

  visitStageList(stageList: ASTStageList): void {
    for (const stage of stageList.stages) stage.accept(this);
  }

  visitStageGroup(stageGroup: ASTStageGroup): void {
    stageGroup.id.accept(this);
    for (const property of stageGroup.properties) property.accept(this);
  }

  visitAggregationExpression(
    aggregationExpression: ASTAggregationExpression
  ): void {
    aggregationExpression.field.accept(this);
  }

  visitField(_field: ASTField): void {
    _field; // unused
  }

  visitProperty(property: ASTProperty): void {
    property.field.accept(this);
    property.operation.accept(this);
  }
}
