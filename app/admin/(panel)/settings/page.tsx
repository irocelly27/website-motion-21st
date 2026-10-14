import { saveSettings } from "@/app/admin/actions";
import { ActionForm, Field, SubmitButton } from "@/components/admin/ui";
import { getContent } from "@/lib/store";

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-white/45">{desc}</p>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export default async function SettingsPage() {
  const { settings: s } = await getContent();
  const stats = [0, 1, 2, 3].map((i) => s.stats[i]);

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Site content</h1>
      <p className="mt-2 text-white/50">Company details and the text used across your website.</p>

      <ActionForm action={saveSettings} className="mt-8 space-y-6">
        <Section title="Brand" desc="Shown in the navigation bar, footer and browser tab.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company name">
              <input name="companyName" required defaultValue={s.companyName} className="admin-input" />
            </Field>
            <Field label="Tagline">
              <input name="tagline" defaultValue={s.tagline} className="admin-input" />
            </Field>
          </div>
          <Field label="Scrolling highlights" hint="The ticker under the hero slider. One per line.">
            <textarea name="marquee" rows={4} defaultValue={s.marquee.join("\n")} className="admin-input" />
          </Field>
        </Section>

        <Section title="About section" desc="The words light up one by one as visitors scroll.">
          <Field label="Heading">
            <input name="aboutTitle" defaultValue={s.aboutTitle} className="admin-input" />
          </Field>
          <Field label="Text">
            <textarea name="aboutText" rows={5} defaultValue={s.aboutText} className="admin-input" />
          </Field>
        </Section>

        <Section title="Stats" desc="Numbers count up when they scroll into view. Leave a row empty to hide it.">
          {stats.map((st, i) => (
            <div key={i} className="grid grid-cols-[1fr_5rem_2fr] gap-3">
              <Field label={i === 0 ? "Number" : ""}>
                <input name={`stat${i}Value`} type="number" step="any" defaultValue={st?.value} className="admin-input" />
              </Field>
              <Field label={i === 0 ? "Suffix" : ""}>
                <input name={`stat${i}Suffix`} defaultValue={st?.suffix} placeholder="+" className="admin-input" />
              </Field>
              <Field label={i === 0 ? "Label" : ""}>
                <input name={`stat${i}Label`} defaultValue={st?.label} className="admin-input" />
              </Field>
            </div>
          ))}
        </Section>

        <Section title="Contact" desc="The call-to-action block at the bottom of the homepage, plus the footer.">
          <Field label="Heading">
            <input name="ctaTitle" defaultValue={s.ctaTitle} className="admin-input" />
          </Field>
          <Field label="Text">
            <textarea name="ctaText" rows={2} defaultValue={s.ctaText} className="admin-input" />
          </Field>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field label="Email">
              <input name="email" type="email" defaultValue={s.email} className="admin-input" />
            </Field>
            <Field label="Phone">
              <input name="phone" defaultValue={s.phone} className="admin-input" />
            </Field>
            <Field label="Address">
              <input name="address" defaultValue={s.address} className="admin-input" />
            </Field>
          </div>
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <div className="rounded-2xl border border-line bg-ink-2/90 p-2 backdrop-blur">
            <SubmitButton />
          </div>
        </div>
      </ActionForm>
    </>
  );
}
