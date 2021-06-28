import {
  isBetterTable,
  isStoryTable,
  rollBetterTable,
  rollStoryTable,
} from "./better-table-util.js";

export function isWorldTable(str) {
  return str.startsWith("@RollTable[");
}

export function isCompendiumTable(str) {
  return str.startsWith("@Compendium[");
}

export async function rollTable(table) {
  if (isBetterTable(table)) {
    return joinResults(await rollBetterTable(table));
  } else if (isStoryTable(table)) {
    return await rollStoryTable(table);
  } else {
    let results = await table.roll();
    let result = joinResults(results['results'], ' ');
    let table_desc = table.data.description

    if(table_desc?.includes('concatenate')) {
      result = joinResults(results['results'], '');
    }

    if(table_desc?.includes('capitalize')) {
      result = result[0].toUpperCase() + result.substr(1)
    }

    return result
  }
}

/**
 * Joins the results of a table roll together with spaces
 * @param {Array.<object>} results
 */
function joinResults(results, delimiter) {
  return results.map((r) => r.data.text).join(delimiter);
}
