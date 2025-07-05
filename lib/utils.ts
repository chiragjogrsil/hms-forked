export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function cn(...inputs: (string | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ")
}
