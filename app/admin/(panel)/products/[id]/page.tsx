import Link from "next/link";
import { notFound } from "next/navigation";
import { saveProduct } from "@/app/admin/actions";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { ActionForm, Field, SubmitButton } from "@/components/admin/ui";
import { getContent } from "@/lib/store";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products } = await getContent();
  const isNew = id === "new";
  const product = isNew ? undefined : products.find((p) => p.id === id);
  if (!isNew && !product) notFound();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <>
      <Link href="/admin/products" className="text-sm text-white/50 hover:text-white">← Back to products</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{isNew ? "New product" : `Edit ${product!.name}`}</h1>

      <ActionForm action={saveProduct} className="mt-8 space-y-6 rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" required defaultValue={product?.name} className="admin-input" />
          </Field>
          <Field label="URL slug" hint="Leave empty to generate from the name">
            <input name="slug" defaultValue={product?.slug} className="admin-input" />
          </Field>
          <Field label="Category" hint="Used for the filter on the products page">
            <input name="category" list="categories" defaultValue={product?.category} className="admin-input" />
            <datalist id="categories">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field label="Price" hint="Free text, e.g. $249 or “From $99”">
            <input name="price" defaultValue={product?.price} className="admin-input" />
          </Field>
        </div>
        <Field label="Tagline">
          <input name="tagline" defaultValue={product?.tagline} className="admin-input" />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={5} defaultValue={product?.description} className="admin-input" />
        </Field>
        <Field label="Key features" hint="One per line">
          <textarea name="features" rows={4} defaultValue={product?.features.join("\n")} className="admin-input" />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField name="cover" label="Cover image" current={product?.cover} />
          <GalleryField existing={product?.gallery ?? []} />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-violet-500" />
          Feature this product on the homepage
        </label>
        <div className="flex gap-3 border-t border-line pt-6">
          <SubmitButton>{isNew ? "Create product" : "Save changes"}</SubmitButton>
          <Link href="/admin/products" className="rounded-xl px-5 py-2.5 text-sm text-white/60 hover:text-white">Cancel</Link>
        </div>
      </ActionForm>
    </>
  );
}
