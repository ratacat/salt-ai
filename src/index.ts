export * from "./salt.js";

// Optional tiny demo if executed directly
export function hello(name: string = "world"): string {
  return `hello, ${name}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line no-console
  console.log(hello());
}
