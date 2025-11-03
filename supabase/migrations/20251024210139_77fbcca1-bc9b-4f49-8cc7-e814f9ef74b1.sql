-- Enable Realtime for agent_tasks (ohne Seed-Daten)
ALTER TABLE agent_tasks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_tasks;