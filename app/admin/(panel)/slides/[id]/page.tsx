import Link from "next/link";
import { notFound } from "next/navigation";
import { saveSlide } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ActionForm, Field, SubmitButton } from "@/components/admin/ui";
import { getContent } from "@/lib/store";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { slides } = await getContent();
  const isNew = id === "new";
  const slide = isNew ? undefined : slides.find((s) => s.id === id);
  if (!isNew && !slide) notFound();

  return (
    <>
      <Link href="/admin/slides" className="text-sm text-white/50 hover:text-white">← Back to slides</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{isNew ? "New slide" : "Edit slide"}</h1>

      <ActionForm action={saveSlide} className="mt-8 space-y-6 rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
        <input type="hidden" name="id" value={slide?.id ?? ""} />
        <ImageField name="image" label="Background image" current={slide?.image} wide />
        <Field label="Small label above the title" hint="e.g. “New release” — optional">
          <input name="eyebrow" defaultValue={slide?.eyebrow} className="admin-input" />
        </Field>
        <Field label="Title">
          <input name="title" required defaultValue={slide?.title} className="admin-input" />
        </Field>
        <Field label="Subtitle">
          <textarea name="subtitle" rows={2} defaultValue={slide?.subtitle} className="admin-input" />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Button text" hint="Leave empty to hide the buttons">
            <input name="ctaLabel" defaultValue={slide?.ctaLabel} className="admin-input" />
          </Field>
          <Field label="Button link" hint="e.g. /products/orbit, /#contact or https://…">
            <input name="ctaHref" defaultValue={slide?.ctaHref} className="admin-input" />
          </Field>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="active" defaultChecked={slide?.active ?? true} className="h-4 w-4 accent-violet-500" />
          Show this slide on the homepage
        </label>
        <div className="flex gap-3 border-t border-line pt-6">
          <SubmitButton>{isNew ? "Create slide" : "Save changes"}</SubmitButton>
          <Link href="/admin/slides" className="rounded-xl px-5 py-2.5 text-sm text-white/60 hover:text-white">Cancel</Link>
        </div>
      </ActionForm>
    </>
  );
}
