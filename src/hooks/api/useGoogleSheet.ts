import { useQuery } from '@tanstack/react-query'
import { fetchSheetValues } from '../../integrations/google/sheets'

export function useGoogleSheet(spreadsheetId: string | undefined, range: string | undefined) {
  const enabled = !!spreadsheetId && !!range
  const query = useQuery({
    queryKey: ['google-sheet', spreadsheetId, range],
    enabled,
    queryFn: async () => {
      if (!enabled) return []
      return await fetchSheetValues(spreadsheetId!, range!)
    },
    staleTime: 60_000,
  })
  return {
    rows: query.data ?? [],
    ...query,
  }
}
