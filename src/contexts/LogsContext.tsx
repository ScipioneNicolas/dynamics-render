import React, { createContext, useContext, useState, useCallback } from "react";

export type LogEntry = {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "error" | "warning";
  message: string;
};

type LogsContextType = {
  logs: LogEntry[];
  addLog: (level: LogEntry["level"], message: string) => void;
  clearLogs: () => void;
};

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const LogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((level: LogEntry["level"], message: string) => {
    setLogs((prev) => [
      { id: crypto.randomUUID(), timestamp: new Date(), level, message },
      ...prev,
    ].slice(0, 200));
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  const ctx = useContext(LogsContext);
  if (!ctx) throw new Error("useLogs must be used within LogsProvider");
  return ctx;
};
