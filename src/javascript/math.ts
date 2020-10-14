export function calcImpermanentLoss(tokenWeights: number[], tokenPriceChanges: number[]) {
  // https://medium.com/balancer-protocol/calculating-value-impermanent-loss-and-slippage-for-balancer-pools-4371a21f1a86
  let numerator: number = 1
  let denominator: number = 0
  const ARBITRARY_NUMBER: number = 1
  for (let i: number = 0; i < 2; i++) {
    numerator *= Math.pow(tokenPriceChanges[i], tokenWeights[i] / 100)
    denominator += tokenPriceChanges[i] * tokenWeights[i] / 100
  }
  return numerator / denominator - 1
}

export function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}