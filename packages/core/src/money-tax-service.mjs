export function normalizeCurrency(currency){
  if(typeof currency!=="string"||!/^[A-Z]{3}$/.test(currency)) throw new TypeError("INVALID_CURRENCY");
  return currency;
}

export function assertMinorUnits(value){
  if(!Number.isSafeInteger(value)||value<0) throw new TypeError("INVALID_MONEY_MINOR");
  return value;
}

export function calculateTax({netMinor,taxRateBps}){
  assertMinorUnits(netMinor);
  if(!Number.isInteger(taxRateBps)||taxRateBps<0||taxRateBps>10000) throw new TypeError("INVALID_TAX_RATE");
  const taxMinor=Math.round((netMinor*taxRateBps)/10000);
  return {netMinor,taxRateBps,taxMinor,grossMinor:netMinor+taxMinor};
}

export function assertSameCurrency(...currencies){
  const normalized=currencies.map(normalizeCurrency);
  if(new Set(normalized).size>1) throw new Error("CURRENCY_MISMATCH");
  return normalized[0];
}
