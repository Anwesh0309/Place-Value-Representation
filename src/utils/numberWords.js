const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(n) {
  if (n === 0) return 'zero';
  if (n === 1000) return 'one thousand';

  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;

  let result = '';

  if (h > 0) {
    result += ones[h] + ' hundred';
  }

  if (remainder > 0) {
    if (h > 0) result += ' and ';
    if (remainder < 20) {
      result += ones[remainder];
    } else {
      result += tens[t];
      if (o > 0) result += '-' + ones[o];
    }
  }

  // Capitalise first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function numberToWordsDisplay(n) {
  return numberToWords(n);
}
