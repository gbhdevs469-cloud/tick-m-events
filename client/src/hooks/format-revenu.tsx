export function formatRevenue(amount: number | undefined | null): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '0 XAF';
  
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B XAF`;
  }
  
  if (absAmount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M XAF`;
  }
  
  if (absAmount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K XAF`;
  }
  
  return `${amount.toLocaleString('en-CM')} XAF`;
}