{{
  import { ASTGroup, ASTStage, ASTStageList, ASTArithmeticOperation } from '../src/ast-types.js';
}}

Start
  = StageList

StageList
  = "[" WS stage:Stage stages:("," WS Stage)* WS "]" {
    return {
      type: 'StageList',
      stages: [stage, ...stages] 
    } as ASTStageList ;
  }

Stage
  = g:Group { return { ...g } as ASTStage ;}

Group
  = "{" WS "$group:" WS "{" WS "_id:" WS id:Field WS "," WS properties:PropertyList+ WS "}" WS "}" { return {
    type: 'Group',
    id: id,
    properties,
  } as ASTGroup ;}

Operation
  = ArithmeticOperation
  
ArithmeticOperation
  = "$sum" WS ":" WS field:Field WS { return { type: 'Sum', field } as ASTArithmeticOperation ;}
  / "$avg" WS ":" WS field:Field WS { return { type: 'Avg', field } as ASTArithmeticOperation ;}
  / "$min" WS ":" WS field:Field WS { return { type: 'Min', field } as ASTArithmeticOperation ;}
  / "$max" WS ":" WS field:Field WS { return { type: 'Max', field } as ASTArithmeticOperation ;}
  

WS "whitespace"
 = [ \t\n\r]*

Comment
  = "/*" ( [^*] / "*" [^/] )* "*/"
  / "//" [^\n]*

Ignored
  = WS / Comment

Field
  = "$" Identifier
  / Identifier

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
  = WS field:Field WS ":" WS "{" WS operation:Operation WS "}" WS { return { field, operation } ;}

PropertyList
  = property:Property properties:PropertySeparated* { return [property, ...properties] ;}

PropertySeparated
  = WS "," WS property:Property WS { return property ;}