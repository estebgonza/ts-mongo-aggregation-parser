start
  = "[" ws pipeline:stage (ws "," ws stage)* ws "]" { return {pipeline}; }

stage
  = ws  "{" ws  "$" stageName:("group"i / "match"i / "limit"i) ws  ":" ws  value:(groupStage / matchStage / limitStage) ws  "}" { return {stageName, value}; }

groupStage
  = "{" ws  "_id" ws  ":" ws  groupId:expressionValue ws accumulators:groupAccumulator* "}" { return {_id: groupId, accumulators: accumulators}; }

groupAccumulator
  = "," ws  fieldName:identifier ws  ":" ws "{" ws expression:groupExpression ws "}" ws  { return { outputField: fieldName, ...expression }; }

groupExpression
  = "$" operator:groupOperator ws ":" ws values:(expressionValueArray / expressionValue) { return { operator, values }; }

expressionValueArray
  = "[" ws value:expressionValue ws values:expressionValueSeparated+ ws "]" { return [value, ...values]; }

expressionValueSeparated
  = ws "," ws value:expressionValue ws { return value; }

groupOperator
  = "addToSet"i / "avg"i / "first"i / "last"i / "max"i / "min"i / "push"i / "sum"i

matchStage
  = "{" matchFields:matchField+ "}" { return matchFields; }

matchField
  = ws  fieldName:field ws  ":" ws  expression:expression ws  ","? { return { field: fieldName, ...expression }; }

limitStage
  = number { return parseInt(number, 10); }

expressionValue
  =
  field
  / '"' chars:[^"]* '"' { return chars.join(''); }
  / "'" chars:[^']* "'" { return chars.join(''); }
  / "true"i { return true; }
  / "false"i { return false; }
  / "null"i { return null; }
  / number
  / identifier

expression
  = "$" operator:expressionOperator ws  ":" ws  value:expressionValue { return { operator, value }; }

expressionOperator
  = "add"i / "subtract"i / "multiply"i / "divide"i / "toUpper"i / "toLower"i { return operator.toLowerCase(); }

field
  = "$" identifier { return { field: identifier }}

identifier
  = firstLetter:[a-zA-Z_] restLetters:[a-zA-Z0-9_]* { return firstLetter + restLetters.join(''); }

number
  = "-"? [0-9]+ ("." [0-9]+)? (("e"i / "E") ("+" / "-")? [0-9]+)?

ws "whitespace"
  = [ \t\n\r]*
