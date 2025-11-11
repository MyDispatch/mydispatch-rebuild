export async function fetchSheetValues(spreadsheetId: string, range: string) {
  const res = await fetch('/api/google/sheets/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spreadsheetId, range })
  })
  if (!res.ok) throw new Error('Failed to read Google Sheet')
  const json = await res.json()
  return (json.values ?? []) as string[][]
}

export async function appendSheetRows(spreadsheetId: string, range: string, values: (string | number | boolean | null)[][]) {
  const res = await fetch('/api/google/sheets/append', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spreadsheetId, range, values })
  })
  if (!res.ok) throw new Error('Failed to append Google Sheet rows')
  return await res.json()
}
