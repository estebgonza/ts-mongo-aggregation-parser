import { expect, test } from "vitest";
import { parse } from "../generated/mongo-aggregation-parser.js";

// Waiting for limit stage support
// test("Limit stage", () => {
//   const pipeline = `[ { $limit: 10 } ]`;
//   expect(parse(pipeline)).toBeDefined();
// });
