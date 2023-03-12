export interface ASTStageList {
  type: "StageList";
  stages: ASTStage[];
}

export type ASTStage = ASTStageGroup;

export interface ASTStageGroup {
  type: "StageGroup";
  id: ASTField;
  properties: ASTProperty[];
}

export interface ASTArithmeticOperation {
  type: "ArithmeticOperation";
  operator: string;
  field: ASTField;
}
export type ASTOperation = ASTArithmeticOperation;

export interface ASTField {
  type: "Field";
  name: string;
}

export interface ASTProperty {
  type: "Property";
  field: ASTField;
  operation: ASTOperation;
}

export interface ASTIdentifier {
  type: "Identifier";
  name: string;
}

export interface ASTString {
  type: "String";
  value: string;
}
