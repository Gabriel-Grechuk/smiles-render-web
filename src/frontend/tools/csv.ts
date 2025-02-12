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

export function parseCSV(text: string, delimiter: string): string[][] {
  const lines = text.split('\n');
  const columns: string[][] = [];
  for (const line of lines) if (line) columns.push(line.split(delimiter));

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
