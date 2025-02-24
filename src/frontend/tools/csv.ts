export function getDelimiter(text: string): string {
  text = text.trim();
  const symbols = text
    .replace(/[A-Za-z0-9=\-#\(\)\[\]\/:@ \s]/g, '')
    .replace('\n', '')
    .split('');

  const symbolsCount: Record<string, number> = {};
  for (const symbol of symbols) {
    if (symbolsCount[symbol]) symbolsCount[symbol] += 1;
    else symbolsCount[symbol] = 1;
  }

  let mostFrequestSimbol = '';
  let frequentSymbolCount = 0;
  for (const symbol of Object.keys(symbolsCount)) {
    if (symbolsCount[symbol] >= frequentSymbolCount) {
      mostFrequestSimbol = symbol;
      frequentSymbolCount = symbolsCount[symbol];
    }
  }

  return mostFrequestSimbol;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const strings: string[] = [];
  let insideQuotes = false;

  let buffer = '';
  for (const c of line) {
    if (c === "'" || c === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (c === delimiter && !insideQuotes) {
      strings.push(buffer);
      buffer = '';
      continue;
    }

    buffer = buffer + c;
  }

  return strings;
}

export function parseCSV(text: string, delimiter: string): string[][] {
  const lines = text.split('\n');
  const columns: string[][] = [];
  for (const line of lines)
    if (line) columns.push(splitCsvLine(line, delimiter));

  return columns;
}

export function getCSVColumn(csvData: string[][], name: string): string[] {
  const index = csvData[0].indexOf(name);
  if (index === -1) return [];

  return csvData
    .map((row) => row[index])
    .filter((cell) => {
      if (cell === name) return null;
      return cell;
    });
}
