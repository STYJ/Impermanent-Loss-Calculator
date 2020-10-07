export function increment(count: number, maxCount: number): number {
  let retVal: number = count + 1
  if (retVal >= maxCount) {
    return maxCount
  }
  return retVal
}
export function decrement(count: number, minCount: number): number {
  let retVal: number = count - 1
  if (retVal <= minCount) {
    return minCount
  }
  return retVal
}

export function calcImpermanentLoss(tokenWeights: number[], tokenPriceChanges: number[], tokenCount: number) {
  // https://medium.com/balancer-protocol/calculating-value-impermanent-loss-and-slippage-for-balancer-pools-4371a21f1a86
  let numerator: number = 1
  let denominator: number = 0
  const ARBITRARY_NUMBER: number = 1
  for (let i = 0; i < tokenCount; i++) {
    numerator *= Math.pow(ARBITRARY_NUMBER * (1 + tokenPriceChanges[i] / 100), tokenWeights[i] / 100)
    denominator += ARBITRARY_NUMBER * (1 + tokenPriceChanges[i] / 100) * tokenWeights[i] / 100
  }
  return numerator / denominator - 1
}

export function parseIL(IL: number) {
  return Math.round((Math.abs(IL) * 100 + Number.EPSILON) * 100) / 100
}