import { ASTVisitor } from "./ast-visitor.js";

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

export abstract class ASTAggregationExpression implements ASTNode {
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

export class ASTAggregationSum extends ASTAggregationExpression {
  constructor(field: ASTField) {
    super("$sum", field);
  }
}

export class ASTAggregationAvg extends ASTAggregationExpression {
  constructor(field: ASTField) {
    super("$avg", field);
  }
}

export class ASTAggregationMin extends ASTAggregationExpression {
  constructor(field: ASTField) {
    super("$min", field);
  }
}

export class ASTAggregationMax extends ASTAggregationExpression {
  constructor(field: ASTField) {
    super("$max", field);
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
