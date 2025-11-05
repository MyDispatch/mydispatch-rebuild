import { useState, useEffect, useCallback } from 'react'
import { nexifyAPI } from '../lib/api/nexify'
import type { AgentStatus, Project } from '../types'

export function useNeXifyAI() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    online: false,
    activity: 'idle',
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial context
  useEffect(() => {
    const loadContext = async () => {
      try {
        setLoading(true)
        const [status, projectsData] = await Promise.all([
          nexifyAPI.getAgentStatus(),
          nexifyAPI.getProjects(),
        ])
        // Context wird automatisch via Forget-Proof System geladen
        setAgentStatus(status)
        setProjects(projectsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load context')
      } finally {
        setLoading(false)
      }
    }

    loadContext()

    // Poll agent status every 5 seconds
    const interval = setInterval(async () => {
      try {
        const status = await nexifyAPI.getAgentStatus()
        setAgentStatus(status)
      } catch (err) {
        console.error('Error polling agent status:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const executeCommand = useCallback(async (command: string, projectCode?: string) => {
    try {
      setAgentStatus((prev) => ({ ...prev, activity: 'processing' }))
      const result = await nexifyAPI.executeCommand(command, projectCode)
      setAgentStatus((prev) => ({ ...prev, activity: 'active' }))
      return result
    } catch (err) {
      setAgentStatus((prev) => ({ ...prev, activity: 'idle' }))
      throw err
    }
  }, [])

  return {
    agentStatus,
    projects,
    loading,
    error,
    executeCommand,
    refresh: async () => {
      setLoading(true)
      try {
        const [status, projectsData] = await Promise.all([
          nexifyAPI.getAgentStatus(),
          nexifyAPI.getProjects(),
        ])
        setAgentStatus(status)
        setProjects(projectsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh')
      } finally {
        setLoading(false)
      }
    },
  }
}
