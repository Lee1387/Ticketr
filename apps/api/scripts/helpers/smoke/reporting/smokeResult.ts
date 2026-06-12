export type SmokeResult = {
  detail: string;
  name: string;
  statusCode: number;
};

export function createSmokeResult(name: string, statusCode: number, detail: string): SmokeResult {
  return {
    detail,
    name,
    statusCode,
  };
}

export function writeSmokeResults(results: readonly SmokeResult[]): void {
  for (const result of results) {
    process.stdout.write(`${result.name}\t${String(result.statusCode)}\t${result.detail}\n`);
  }
}
