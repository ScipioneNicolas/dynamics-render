import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Code2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogs } from "@/contexts/LogsContext";

export default function Formularios() {
  const [snippet, setSnippet] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addLog } = useLogs();

  const loadForm = useCallback(() => {
    if (!snippet.trim() || !containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = "";
    setLoaded(false);

    try {
      // Parse the snippet
      const temp = document.createElement("div");
      temp.innerHTML = snippet;

      // Separate scripts from HTML
      const scripts = temp.querySelectorAll("script");
      const scriptSources: { src?: string; inline?: string }[] = [];

      scripts.forEach((s) => {
        if (s.src) {
          scriptSources.push({ src: s.src });
        } else if (s.textContent) {
          scriptSources.push({ inline: s.textContent });
        }
        s.remove();
      });

      // Insert HTML content
      containerRef.current.innerHTML = temp.innerHTML;
      addLog("info", "HTML del formulario insertado correctamente");

      // Execute scripts sequentially
      const executeScripts = async () => {
        for (const script of scriptSources) {
          try {
            if (script.src) {
              await new Promise<void>((resolve, reject) => {
                const el = document.createElement("script");
                el.src = script.src!;
                el.async = true;
                el.onload = () => {
                  addLog("success", `Script cargado: ${script.src}`);
                  resolve();
                };
                el.onerror = () => {
                  addLog("error", `Error cargando script: ${script.src}`);
                  reject(new Error(`Failed to load: ${script.src}`));
                };
                document.body.appendChild(el);
              });
            } else if (script.inline) {
              const el = document.createElement("script");
              el.textContent = script.inline;
              document.body.appendChild(el);
              addLog("success", "Script inline ejecutado");
            }
          } catch (err: any) {
            addLog("error", err.message);
          }
        }
      };

      executeScripts().then(() => {
        setLoaded(true);
        addLog("success", "Formulario renderizado completamente");
      });

      setShowInput(false);
    } catch (err: any) {
      addLog("error", `Error al procesar snippet: ${err.message}`);
    }
  }, [snippet, addLog]);

  const clearForm = useCallback(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    setSnippet("");
    setLoaded(false);
    addLog("info", "Formulario limpiado");
  }, [addLog]);

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Formularios</h1>
        <p className="text-sm text-muted-foreground">
          Cargá snippets de Dynamics 365 Customer Insights
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card min-h-[400px] p-6"
      >
        {!loaded && !showInput && (
          <div className="flex h-[350px] flex-col items-center justify-center gap-4 text-muted-foreground">
            <Code2 className="h-12 w-12 opacity-40" />
            <p className="text-sm">Ningún formulario cargado</p>
            <p className="text-xs">Usá el botón + para pegar un snippet</p>
          </div>
        )}
        <div ref={containerRef} className="dynamics-form-container" />
      </motion.div>

      {/* Snippet Input Modal */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card mx-4 w-full max-w-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Pegar Snippet</h3>
                <button onClick={() => setShowInput(false)} className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <textarea
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                placeholder={'<div data-form-id="..." ...></div>\n<script src="https://..."></script>'}
                className="h-56 w-full resize-none rounded-lg border border-border bg-muted p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="mt-4 flex gap-3">
                <Button onClick={loadForm} disabled={!snippet.trim()} className="gap-2">
                  <Play className="h-4 w-4" />
                  Cargar Formulario
                </Button>
                <Button onClick={clearForm} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Limpiar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowInput(true)}
        className="fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg glow-primary transition-shadow hover:shadow-xl"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
