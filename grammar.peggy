{{
  import { ASTStageGroup, ASTStage, ASTStageList, ASTAggregationSum, ASTAggregationMax, ASTAggregationMin, ASTAggregationAvg, ASTProperty, ASTReferenceField, ASTOutputFieldName } from '../src/ast-types.js';
}}

StageList
  = WS "[" WS stage:Stage stages:StageSeparated* WS "]" WS {
    return new ASTStageList([stage, ...stages]) ;
  }

Stage
  = Group

StageSeparated
  = WS "," WS stage:Stage WS { return stage ;}

Group
  = WS "{" WS "$group:" WS "{" WS "_id:" WS id:ReferenceField WS "," WS properties:PropertyList WS "}" WS "}" WS { return new ASTStageGroup(id, properties) ;
  }

Operation
  = ArithmeticOperation

AccumulatorOperation
  = SumOperation
  / AvgOperation
  / MultiplyOperation

SumOperation
  = "$sum" WS ":" WS value:expr { return { op: "sum", value: value }; }

AvgOperation
  = "$avg" WS ":" WS value:expr { return { op: "avg", value: value }; }

MultiplyOperation
  = "$multiply" WS ":" WS "[" WS values:ExprList WS "]" { return { op: "multiply", values: values }; }

ExprList
  = head:expr tail:(WS "," WS expr)* { return [head].concat(tail.map(e => e[3])); }


expr
  = integer
  / variable
  / "{" WS operation:expr_operation WS "}"

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

variable
  = "$" field:[a-zA-Z_][a-zA-Z0-9_]* { return { op: "var", field: field.join("") }; }

string
  = "\"" chars:[^"]* "\"" { return chars.join(""); }

expr_operation
  = date_to_string_operation
  / AccumulatorOperation
  
  id_expression
  = "{" WS operation:date_to_string_operation WS "}" { return operation; }

date_to_string_operation
  = "$dateToString" WS ":" WS "{" WS "format" WS ":" WS format:string WS "," WS "date" WS ":" WS date:variable WS "}" { return { op: "dateToString", format: format, date: date }; }

accumulators
  = head:accumulator_expression tail:(WS "," WS accumulator_expression)* { return [head].concat(tail.map(e => e[3])); }

accumulator_expression
  = name:[a-zA-Z_][a-zA-Z0-9_]* WS ":" WS "{" WS operation:AccumulatorOperation WS "}" { return { name: name.join(""), operation: operation }; }

ArithmeticOperation
  = "$sum" WS ":" WS field:ReferenceField WS { return new ASTAggregationSum(field) ;}
  / "$avg" WS ":" WS field:ReferenceField WS { return new ASTAggregationAvg(field) ;}
  / "$min" WS ":" WS field:ReferenceField WS { return new ASTAggregationMin(field) ;}
  / "$max" WS ":" WS field:ReferenceField WS { return new ASTAggregationMax(field) ;}
  

WS "whitespace"
 = [ \t\n\r]*

Comment
  = "/*" ( [^*] / "*" [^/] )* "*/"
  / "//" [^\n]*

Ignored
  = WS / Comment

ReferenceField
  = f:Identifier { return new ASTReferenceField(f.replace("$", "")) ;}

Field
  = i:Identifier { return new ASTOutputFieldName(i) ;}

Identifier
  = l:(Letter / "_") ls:(Letter / Digit / "_")* { return [l, ...ls].join('') ;}
  / String

Letter
  = [a-zA-Z]
  
String
  = "'" k:[^']* "'" { return k.join('') ;}
  / '"' k:[^"]* '"' { return k.join('') ;}

Digit
  = [0-9]

Property
  = WS field:Field WS ":" WS "{" WS operation:Operation WS "}" WS { return new ASTProperty(field, operation) ;}

PropertyList
  = property:Property properties:PropertySeparated* { return [property, ...properties] ;}

PropertySeparated
  = WS "," WS property:Property WS { return property ;}