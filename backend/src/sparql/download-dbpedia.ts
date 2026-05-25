import { downloadDbpediaCache } from "./dbpedia.js";

const result = await downloadDbpediaCache();
console.log(`\nDescarga completada:`);
console.log(`  Total:     ${result.total}`);
console.log(`  Éxito:     ${result.success}`);
console.log(`  Fallos:    ${result.failed.length}`);
if (result.failed.length > 0) {
  console.log(`  IDs fallidos: ${result.failed.join(", ")}`);
}
