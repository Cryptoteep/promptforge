"use client";

import * as React from "react";
import { Play, Loader2, AlertCircle, Copy, Check, RotateCcw, FlaskConical, Sparkles, Keyboard, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractVariables } from "./lib";
import { toast } from "sonner";

const MODELS = [
  { value: "glm-4.6", label: "GLM-4.6 (recommended)" },
  { value: "glm-4.5", label: "GLM-4.5" },
  { value: "glm-4-plus", label: "GLM-4-Plus" },
];

interface PlaygroundProps {
  /** When set, the textarea is filled with this content (then cleared). */
  prefill: string | null;
  onPrefillConsumed: () => void;
}

interface TestResult {
  output?: string;
  error?: string;
}

export function Playground({ prefill, onPrefillConsumed }: PlaygroundProps) {
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT);
  const [variables, setVariables] = React.useState<Record<string, string>>({});
  const [model, setModel] = React.useState("glm-4.6");
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<TestResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  const detectedVars = React.useMemo(() => extractVariables(prompt), [prompt]);

  // When a prompt is pre-filled (e.g. from the detail dialog), load it.
  React.useEffect(() => {
    if (prefill) {
      setPrompt(prefill);
      setResult(null);
      setVariables({});
      onPrefillConsumed();
      // Scroll the section into view in case it was triggered from a dialog.
      const el = document.getElementById("playground");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [prefill, onPrefillConsumed]);

  // Keep the variables map in sync with detected vars (preserve existing values).
  React.useEffect(() => {
    setVariables((prev) => {
      const next: Record<string, string> = {};
      for (const v of detectedVars) next[v] = prev[v] ?? "";
      return next;
    });
  }, [detectedVars]);

  const handleRun = React.useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    setRunning(true);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          variables,
          model,
        }),
      });
      const data = (await res.json()) as TestResult;
      if (!res.ok || data.error) {
        setResult({
          error: data.error ?? `Request failed (${res.status})`,
        });
      } else {
        setResult({ output: data.output ?? "" });
      }
    } catch (e: unknown) {
      setResult({
        error:
          e instanceof Error
            ? e.message
            : "Network error — please try again.",
      });
    } finally {
      setRunning(false);
    }
  }, [prompt, variables, model]);

  // Keyboard shortcut: Cmd/Ctrl+Enter runs the prompt from anywhere in the section.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        const el = document.getElementById("playground");
        // Only fire if the playground is in the viewport.
        if (el) {
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) {
            e.preventDefault();
            handleRun();
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const handleCopyOutput = async () => {
    if (!result?.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      toast.success("Output copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    setVariables({});
    setResult(null);
    setCopied(false);
  };

  return (
    <section
      id="playground"
      aria-labelledby="playground-heading"
      className="scroll-mt-20 border-t bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FlaskConical className="h-4 w-4" aria-hidden />
            </span>
            <h2
              id="playground-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Playground
            </h2>
          </div>
          <p className="text-sm text-foreground/60">
            Run any prompt against a real model. Variables in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground/80">
              {`{{double braces}}`}
            </code>{" "}
            are detected automatically — fill them in and hit Run.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input panel */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="pg-prompt" className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                  Prompt
                </Label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-foreground/50 transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
              <Textarea
                id="pg-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write a prompt… use {{variables}} for dynamic values."
                className="pf-scroll min-h-[200px] resize-y font-mono text-sm"
                aria-describedby="pg-prompt-help"
              />
              <p id="pg-prompt-help" className="mt-1.5 text-xs text-foreground/50">
                Tip: wrap dynamic values in double braces, e.g.{" "}
                <code className="rounded bg-muted px-1 text-foreground/70">
                  {`{{language}}`}
                </code>
                .
              </p>
            </div>

            {/* Variables */}
            {detectedVars.length > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="mb-2.5 flex items-center justify-between">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Detected variables ({detectedVars.length})
                  </Label>
                  <span className="text-[10px] font-normal text-foreground/50">
                    fill these to run
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {detectedVars.map((v) => (
                    <div key={v}>
                      <Label
                        htmlFor={`var-${v}`}
                        className="mb-1 block font-mono text-[11px] font-semibold text-foreground/80"
                      >
                        {`{{${v}}}`}
                      </Label>
                      <Input
                        id={`var-${v}`}
                        value={variables[v] ?? ""}
                        onChange={(e) =>
                          setVariables((prev) => ({
                            ...prev,
                            [v]: e.target.value,
                          }))
                        }
                        placeholder={`e.g. “${v}”`}
                        className="h-9 bg-background text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model + run */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-foreground/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Cpu className="h-3 w-3" aria-hidden />
                    Model
                  </span>
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-full" aria-label="Select model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
                <Button
                  onClick={handleRun}
                  disabled={running || !prompt.trim()}
                  className="gap-1.5 shadow-sm sm:w-auto"
                  size="lg"
                >
                  {running ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {running ? "Running…" : "Run prompt"}
                </Button>
                <span className="hidden items-center gap-1 text-[10px] text-foreground/40 sm:flex">
                  <Keyboard className="h-3 w-3" aria-hidden />
                  or press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px] font-semibold">⌘/Ctrl + Enter</kbd>
                </span>
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                Output
              </Label>
              {result?.output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOutput}
                  className="h-7 gap-1.5 text-xs"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            <div className="relative flex-1 rounded-lg border bg-background">
              {running ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-foreground/60">
                    Generating response…
                  </p>
                  <p className="text-xs text-foreground/40">
                    This usually takes a few seconds.
                  </p>
                </div>
              ) : result?.error ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-sm font-medium text-destructive">
                    Something went wrong
                  </p>
                  <p className="max-w-md text-xs text-foreground/60">
                    {result.error}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleRun}
                  >
                    Try again
                  </Button>
                </div>
              ) : result?.output ? (
                <div className="pf-scroll max-h-[480px] min-h-[280px] overflow-y-auto p-4">
                  <pre className="pf-prompt-content whitespace-pre-wrap text-sm leading-relaxed">
                    <code>{result.output}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 p-6 text-center text-foreground/50">
                  <Sparkles
                    className="h-8 w-8 text-foreground/30"
                    aria-hidden
                  />
                  <p className="text-sm font-medium">No output yet</p>
                  <p className="max-w-xs text-xs">
                    Fill in your prompt and variables, then press{" "}
                    <span className="font-medium text-foreground/70">Run</span>.
                  </p>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] text-foreground/40">
              Powered by the GLM family of models via{" "}
              <code className="rounded bg-muted px-1">z-ai-web-dev-sdk</code>.
              Responses are generated on the server; no API keys are exposed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_PROMPT = `You are a concise, friendly assistant.

Explain {{concept}} to a {{audience}} in 3 short paragraphs. End with one concrete example.
`;
