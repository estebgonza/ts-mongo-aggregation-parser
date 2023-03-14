export interface ASTVisitor {
  visitStageList(stageList: ASTStageList): void;
  visitStageGroup(stageGroup: ASTStageGroup): void;
  visitAggregationExpression(agg: ASTAggregationExpression): void;
  visitField(field: ASTField): void;
  visitProperty(property: ASTProperty): void;
}

export interface ASTNode {
  type: string;
  accept(visitor: ASTVisitor): void;
}

export class ASTStageList implements ASTNode {
  type = "StageList";
  stages: ASTStage[] = [];

  constructor(stages: ASTStage[]) {
    this.stages = stages;
  }

  accept(visitor: ASTVisitor): void {
    return visitor.visitStageList(this);
  }
}

export type ASTStage = ASTStageGroup;

export class ASTStageGroup implements ASTNode {
  type = "StageGroup";
  id: ASTField;
  properties: ASTProperty[];

  constructor(id: ASTField, properties: ASTProperty[]) {
    this.id = id;
    this.properties = properties;
  }

  accept(visitor: ASTVisitor): void {
    return visitor.visitStageGroup(this);
  }
}

type AggregationOperator = "$sum" | "$avg" | "$min" | "$max";

export class ASTAggregationExpression implements ASTNode {
  type = "AggregationExpression";
  operator: AggregationOperator;
  field: ASTField;

  constructor(operator: AggregationOperator, field: ASTField) {
    this.operator = operator;
    this.field = field;
  }

  accept(visitor: ASTVisitor): void {
    return visitor.visitAggregationExpression(this);
  }
}

export type ASTOperation = ASTAggregationExpression;

export class ASTField implements ASTNode {
  type = "Field";
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  accept(visitor: ASTVisitor): void {
    return visitor.visitField(this);
  }
}

export class ASTProperty implements ASTNode {
  type = "Property";
  field: ASTField;
  operation: ASTOperation;

  constructor(field: ASTField, operation: ASTOperation) {
    this.field = field;
    this.operation = operation;
  }

  accept(visitor: ASTVisitor): void {
    return visitor.visitProperty(this);
  }
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
    return;
  }

  visitProperty(property: ASTProperty): void {
    property.field.accept(this);
    property.operation.accept(this);
  }
}
