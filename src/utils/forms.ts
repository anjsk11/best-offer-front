export function defaultEndTime() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  date.setMinutes(0, 0, 0)
  return date.toISOString().slice(0, 16)
}
