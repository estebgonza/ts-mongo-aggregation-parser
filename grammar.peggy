start
  = "[" ws stage:stage (ws "," ws stage)* ws "]" { return [stage]; }

stage
  = ws  "{" ws  "$" type:("group"i / "match"i / "limit"i) ws  ":" ws  stage:(groupStage / matchStage / limitStage) ws  "}" { return {type, ...stage}; }

groupStage
  = "{" ws  "_id" ws  ":" ws  groupId:expressionValue ws accumulators:groupAccumulator* "}" { return {_id: groupId, accumulators: accumulators}; }

groupAccumulator
  = "," ws  outputFieldName:outputField ws  ":" ws "{" ws expression:groupExpression ws "}" ws  { return { outputField: outputFieldName, ...expression }; }

groupExpression
  = "$" operator:groupOperator ws ":" ws values:(expressionValueArray / expressionValue) { return { operator, values }; }

expressionValueArray
  = "[" ws value:expressionValue ws values:expressionValueSeparated* ws "]" { return [value, ...values]; }

expressionValueSeparated
  = ws "," ws value:expressionValue ws { return value; }

groupOperator
  = "addToSet"i / "avg"i / "first"i / "last"i / "max"i / "min"i / "push"i / "sum"i

matchCondition
  = "{" ws condition:fieldCondition ws conditions:(ws "," ws fieldCondition)* ws "}" { return [condition, ...conditions]; }

fieldCondition
  = outputFieldName:outputField ws  ":" ws  "{" ws  expression:expression ws  "}" ws  { return { outputField: outputFieldName, ...expression }; }

matchStage
  = "{" ws "$and" ws ":" ws conditions:matchCondition ws "}" { return { type: "match", conditions }; }

limitStage
  = limit:number { return { limit }; }

expressionValue
  = 
  fieldReference
  / expression
  / '"' chars:[^"]* '"' { return chars.join(''); }
  / "'" chars:[^']* "'" { return chars.join(''); }
  / "true"i { return true; }
  / "false"i { return false; }
  / "null"i { return null; }
  / number
  / expressionValueArray

expression
  = "{" ws "$" operator:expressionOperator ws  ":" ws  value:expressionValue ws "}" { return { operator, value }; }

expressionOperator
  = "add"i / "subtract"i / "multiply"i / "divide"i / "toUpper"i / "toLower"i / "cond"i / "gte"i

fieldReference
  = '"$' chars:[^"]* '"' { return { field: chars.join('') } }
  / identifier

outputField
  = identifier

identifier
  = firstLetter:[a-zA-Z_] restLetters:[a-zA-Z0-9_]* { return firstLetter + restLetters.join(''); }

number
  = "-"? [0-9]+ ("." [0-9]+)? (("e"i / "E") ("+" / "-")? [0-9]+)? { return parseInt(text()); }

ws "whitespace"
  = [ \t\n\r]*
