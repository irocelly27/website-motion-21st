"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

type StateAction = (prev: FormState, fd: FormData) => Promise<FormState>;

/** Form wrapper that shows the action's error / success message. */
export function ActionForm({ action, children, className }: { action: StateAction; children: React.ReactNode; className?: string }) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {state.error && <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{state.error}</p>}
      {state.ok && <p className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{state.ok}</p>}
      {children}
    </form>
  );
}

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white/90 disabled:opacity-60"
    >
      {pending && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />}
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Two-step delete: first click arms it, second click submits. */
export function DeleteButton({ action, id, label = "Delete" }: { action: (fd: FormData) => Promise<void>; id: string; label?: string }) {
  const [armed, setArmed] = useState(false);
  return (
    <form action={action} onMouseLeave={() => setArmed(false)}>
      <input type="hidden" name="id" value={id} />
      {armed ? (
        <button type="submit" className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white">Confirm delete</button>
      ) : (
        <button type="button" onClick={() => setArmed(true)} className="rounded-lg px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
          {label}
        </button>
      )}
    </form>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}
