{{
  import { ASTStageGroup, ASTStage, ASTStageList, ASTAggregationSum, ASTAggregationMax, ASTAggregationMin, ASTAggregationAvg, ASTProperty, ASTField } from '../src/ast-types.js';
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
  = WS "{" WS "$group:" WS "{" WS "_id:" WS id:Field WS "," WS properties:PropertyList WS "}" WS "}" WS { return new ASTStageGroup(id, properties) ;
  }

Operation
  = ArithmeticOperation
  
ArithmeticOperation
  = "$sum" WS ":" WS field:Field WS { return new ASTAggregationSum(field) ;}
  / "$avg" WS ":" WS field:Field WS { return new ASTAggregationAvg(field) ;}
  / "$min" WS ":" WS field:Field WS { return new ASTAggregationMin(field) ;}
  / "$max" WS ":" WS field:Field WS { return new ASTAggregationMax(field) ;}
  

WS "whitespace"
 = [ \t\n\r]*

Comment
  = "/*" ( [^*] / "*" [^/] )* "*/"
  / "//" [^\n]*

Ignored
  = WS / Comment

Field
  = i:("$" Identifier)
  / i:Identifier { return new ASTField(i) ;}

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