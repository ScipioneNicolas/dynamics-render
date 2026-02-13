import { useState, useEffect, useCallback } from "react";

export interface SavedForm {
  id: string;
  name: string;
  snippet: string;
  createdAt: string;
}

const STORAGE_KEY = "formhub_saved_forms";

function loadFromStorage(): SavedForm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(forms: SavedForm[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function useSavedForms() {
  const [forms, setForms] = useState<SavedForm[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(forms);
  }, [forms]);

  const addForm = useCallback((name: string, snippet: string) => {
    const newForm: SavedForm = {
      id: crypto.randomUUID(),
      name: name.trim() || `Formulario ${forms.length + 1}`,
      snippet,
      createdAt: new Date().toISOString(),
    };
    setForms((prev) => [newForm, ...prev]);
    return newForm;
  }, [forms.length]);

  const removeForm = useCallback((id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { forms, addForm, removeForm };
}
