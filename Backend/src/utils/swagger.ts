import Joi from "joi";
export function generateExampleFromJoi(schema: Joi.Schema): Record<string, any> {
    const desc = schema.describe();
  
    const parse = (d: any): any => {
      if (d.type === "object" && d.keys) {
        const result: Record<string, any> = {};
        for (const key in d.keys) {
          result[key] = parse(d.keys[key]);
        }
        return result;
      }
  
      if (d.type === "array") {
        return [parse(d.items?.[0])];
      }
  
      if (d.examples && d.examples.length > 0) {
        return d.examples[0];
      }
  
      if (d.flags && "default" in d.flags) {
        return d.flags.default;
      }
  
      // Dummy fallback values
      switch (d.type) {
        case "string":
          if (d.rules?.some((r: any) => r.name === "email")) return "user@example.com";
          if (d.rules?.some((r: any) => r.name === "min" && r.args?.limit >= 8)) return "Test@123";
          return "string";
        case "number":
          return 123;
        case "boolean":
          return true;
        case "date":
          return new Date().toISOString();
        default:
          return null;
      }
    };
  
    return parse(desc);
  }
  