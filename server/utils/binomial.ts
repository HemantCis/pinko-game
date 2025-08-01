export const binomialDistribution = (n = 10, probability = 0.5) => {
  let y = 0,
    p = 0,
    probabilitySum = 0,
    distribution: any = [],
    binomialCoefficient = 1;

  while (y <= n) {
    p =
      binomialCoefficient *
      Math.pow(probability, y) *
      Math.pow(1 - probability, n - y);
    distribution.push(p);
    probabilitySum += p;
    y++;
    binomialCoefficient = (binomialCoefficient * (n + 1 - y)) / y;
  }

  return distribution;
};
