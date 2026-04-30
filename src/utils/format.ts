const money = new Intl.NumberFormat('ko-KR')

const dateTime = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatMoney(value: number) {
  return `${money.format(value)}원`
}

export function formatCount(value: number) {
  return money.format(value)
}

export function formatDate(value: string) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return dateTime.format(date)
}
