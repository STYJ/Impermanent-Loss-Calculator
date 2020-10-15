export function calcImpermanentLoss(pricePercentage: number, tokenWeights: number[], flipped: boolean) {
  // https://medium.com/balancer-protocol/calculating-value-impermanent-loss-and-slippage-for-balancer-pools-4371a21f1a86
  const defaultValue: number = 100
  let numerator: number = (Math.pow(pricePercentage, tokenWeights[+flipped] / 100)) * (Math.pow(defaultValue, tokenWeights[+!flipped] / 100));
  let denominator: number = (pricePercentage * tokenWeights[+flipped] / 100) + (defaultValue * tokenWeights[+!flipped] / 100);
  return numerator / denominator - 1
}

export function calcRemainingInventory(updatedPrice: number, tokenBalances: number[], tokenWeights: number[], flipped: boolean) {
  let constantProduct: number = 1
  // Calculating constant product
  for (let i: number = 0; i < tokenBalances.length; i++) {
    constantProduct *= Math.pow(tokenBalances[i], tokenWeights[i] / 100)
  }
  
  let numerator: number = 0
  let denominator: number = 0
  let balanceA: number = 0
  let balanceB: number = 0
  if (flipped) {
    numerator = constantProduct * Math.pow(tokenWeights[+flipped] / 100, tokenWeights[+!flipped] / 100)
    denominator = Math.pow(tokenWeights[+!flipped] / 100, tokenWeights[+!flipped] / 100) * Math.pow(updatedPrice, tokenWeights[+!flipped] / 100)
    balanceA = numerator / denominator
    balanceB = updatedPrice * tokenWeights[+!flipped] * balanceA / tokenWeights[+flipped]
  } else {
    numerator = constantProduct * Math.pow(tokenWeights[+!flipped] / 100, tokenWeights[+flipped] / 100) * Math.pow(updatedPrice, tokenWeights[+flipped] / 100)
    denominator = Math.pow(tokenWeights[+flipped] / 100, tokenWeights[+flipped] / 100)
    balanceA = numerator / denominator
    balanceB = balanceA * tokenWeights[+flipped] / (tokenWeights[+!flipped] * updatedPrice)
  }
  return [balanceB, balanceA]
}

export function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}