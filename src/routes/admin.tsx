import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ImagePlus, LockKeyhole, LogIn, Pencil, Plus, RefreshCw, Save, Trash2, Upload, X } from "lucide-react";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const BUCKET = "product-images";
type ProductRow = { id: string; name: string; slug: string; description: string | null; fabric: string | null; is_published: boolean; category_id: string | null; product_prices?: { channel: string; price_paise: number; is_active: boolean }[]; product_images?: { id: string; storage_path: string; alt_text: string | null; is_primary: boolean; sort_order: number }[] };
type Category = { id: string; slug: string; name: string };
type Draft = { id?: string; name: string; slug: string; category_id: string; description: string; fabric: string; retail: string; wholesale: string; published: boolean; sku: string; sizes: string; stock: string };
const emptyDraft: Draft = { name: "", slug: "", category_id: "", description: "", fabric: "", retail: "", wholesale: "", published: false, sku: "", sizes: "", stock: "0" };

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [files, setFiles] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const headers = (extra: Record<string, string> = {}) => ({ apikey: SUPABASE_KEY!, Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...extra });
  async function api(path: string, init: RequestInit = {}) {
    if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.");
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: headers(init.headers as Record<string, string> || {}) });
    const body = await response.text();
    if (!response.ok) throw new Error(body || `Request failed (${response.status})`);
    return body ? JSON.parse(body) : null;
  }
  async function loadStore(accessToken = token) {
    const previous = token;
    if (accessToken !== previous) setToken(accessToken);
    const authHeaders = { apikey: SUPABASE_KEY!, Authorization: `Bearer ${accessToken}` };
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId || "00000000-0000-0000-0000-000000000000"}&select=role`, { headers: authHeaders });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || profile?.[0]?.role !== "admin") throw new Error("This account is not registered as a KANIRA administrator.");
    setIsAdmin(true);
    const [cats, rows] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,slug,name&is_active=eq.true&order=sort_order`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/products?select=*,product_prices(channel,price_paise,is_active),product_images(id,storage_path,alt_text,is_primary,sort_order)&order=created_at.desc`, { headers: authHeaders }).then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
    ]);
    setCategories(cats);
    setProducts(rows);
  }
  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase environment variables are missing. Configure them in Vercel first.");
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.message || "Sign in failed.");
      setToken(data.access_token); setUserId(data.user.id);
      const p = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}&select=role`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${data.access_token}` } }).then(r => r.json());
      if (p?.[0]?.role !== "admin") throw new Error("This account does not have KANIRA admin access.");
      setIsAdmin(true);
      const [cats, rows] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,slug,name&is_active=eq.true&order=sort_order`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${data.access_token}` } }).then(r => r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/products?select=*,product_prices(channel,price_paise,is_active),product_images(id,storage_path,alt_text,is_primary,sort_order)&order=created_at.desc`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${data.access_token}` } }).then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
      ]);
      setCategories(cats); setProducts(rows);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); setIsAdmin(false); }
    finally { setBusy(false); }
  }
  function editProduct(p: ProductRow) {
    const price = (channel: string) => p.product_prices?.find(x => x.channel === channel && x.is_active)?.price_paise;
    setDraft({ id: p.id, name: p.name, slug: p.slug, category_id: p.category_id || "", description: p.description || "", fabric: p.fabric || "", retail: price("retail") ? String(price("retail")! / 100) : "", wholesale: price("wholesale") ? String(price("wholesale")! / 100) : "", published: p.is_published, sku: "", sizes: "", stock: "0" });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function saveProduct(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (!draft.category_id) throw new Error("Choose a collection/category.");
      const payload = { name: draft.name.trim(), slug: draft.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""), category_id: draft.category_id, description: draft.description || null, fabric: draft.fabric || null, is_published: draft.published };
      if (!payload.name || !payload.slug) throw new Error("Product name and URL slug are required.");
      const saved = await api(draft.id ? `products?id=eq.${draft.id}` : "products", { method: draft.id ? "PATCH" : "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) });
      const productId = draft.id || saved?.[0]?.id;
      if (!productId) throw new Error("Product saved, but its ID was not returned.");
      if (!draft.id && (!draft.sku.trim() || !draft.sizes.trim())) throw new Error("Add at least one SKU and size before creating a product.");\n      if (!draft.id) {\n        const sizeList = draft.sizes.split(",").map(s => s.trim()).filter(Boolean);\n        await api("product_variants", { method: "POST", body: JSON.stringify(sizeList.map((size, index) => ({ product_id: productId, sku: sizeList.length === 1 ? draft.sku.trim() : `${draft.sku.trim()}-${size.replace(/[^a-z0-9]/gi, "").toUpperCase()}`, size_label: size, stock_quantity: Math.max(0, Number(draft.stock) || 0), is_active: true })) ) });\n      }\n      for (const channel of ["retail", "wholesale"] as const) {
        const value = channel === "retail" ? draft.retail : draft.wholesale;
        if (!value.trim()) continue;
        const amount = Math.round(Number(value) * 100);
        if (!Number.isFinite(amount) || amount < 0) throw new Error(`Enter a valid ${channel} price.`);
        await api("product_prices?on_conflict=product_id,channel", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ product_id: productId, channel, price_paise: amount, is_active: true }) });
      }
      for (const file of files) {
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) throw new Error("Choose images under 5 MB each (JPG, PNG or WebP).");
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
        const path = `${productId}/${Date.now()}-${safeName}`;
        const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, { method: "POST", headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" }, body: file });
        if (!upload.ok) throw new Error(await upload.text());
        await api("product_images", { method: "POST", body: JSON.stringify({ product_id: productId, storage_path: path, alt_text: draft.name, is_primary: !products.find(p => p.id === productId)?.product_images?.length, sort_order: 0 }) });
      }
      setDraft(emptyDraft); setFiles([]); await loadStore(token); setNotice("Product saved successfully.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save product."); }
    finally { setBusy(false); }
  }
  async function deleteProduct(p: ProductRow) {
    if (!window.confirm(`Delete “${p.name}” and its product images? This cannot be undone.`)) return;
    setBusy(true); setError("");
    try {
      for (const img of p.product_images || []) {
        await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${img.storage_path}`, { method: "DELETE", headers: headers() });
      }
      await api(`products?id=eq.${p.id}`, { method: "DELETE" });
      setProducts(list => list.filter(x => x.id !== p.id)); setNotice("Product deleted.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to delete product."); }
    finally { setBusy(false); }
  }
  async function deleteImage(productId: string, imageId: string, path: string) {
    if (!window.confirm("Delete this product image?")) return;
    setBusy(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, { method: "DELETE", headers: headers() });
      if (!res.ok) throw new Error(await res.text());
      await api(`product_images?id=eq.${imageId}`, { method: "DELETE" });
      setProducts(list => list.map(p => p.id === productId ? { ...p, product_images: p.product_images?.filter(i => i.id !== imageId) } : p));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to delete image."); }
    finally { setBusy(false); }
  }
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())), [products, search]);
  const imageUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  return <SiteLayout><main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="KANIRA OPERATIONS" title="Product & image manager" description="Add new products, update catalogue details and prices, upload product photos, or remove products and images."/>
    {!isAdmin ? <form onSubmit={signIn} className="mx-auto mt-8 max-w-md rounded-2xl border border-[#e5d9ce] bg-white p-6 shadow-sm">
      <LockKeyhole className="text-[#a77a5b]" size={28}/><h2 className="mt-3 font-serif text-2xl">Administrator sign in</h2>
      <p className="mt-2 text-sm text-[#786c62]">Only accounts with the admin role in the KANIRA Supabase project can manage products.</p>
      <label className="mt-5 block text-sm">Email<input className="mt-1 w-full rounded-xl border p-3" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label className="mt-3 block text-sm">Password<input className="mt-1 w-full rounded-xl border p-3" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <button disabled={busy} className="primary-button mt-5 w-full justify-center"><LogIn size={16}/>{busy?"Signing in…":"Sign in securely"}</button>
      {!SUPABASE_URL || !SUPABASE_KEY ? <p className="mt-3 text-xs text-amber-800">Supabase environment variables are not configured yet.</p> : null}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </form> : <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#786c62]">{products.length} products in your catalogue</p><button className="secondary-button" onClick={()=>{setIsAdmin(false);setToken("");setUserId("");setProducts([]);}}><LockKeyhole size={15}/> Sign out</button></div>
      <form onSubmit={saveProduct} className="mt-6 rounded-2xl border border-[#e5d9ce] bg-white p-5 md:p-7">
        <div className="flex items-center justify-between gap-3"><h2 className="font-serif text-2xl">{draft.id?"Edit product":"Add a new product"}</h2><button type="button" className="secondary-button" onClick={()=>{setDraft(emptyDraft);setFiles([]);}}><X size={15}/> Clear</button></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">Product name<input required className="mt-1 w-full rounded-xl border p-3" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value,slug:draft.id?draft.slug:e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})}/></label>
          <label className="text-sm">URL slug<input required className="mt-1 w-full rounded-xl border p-3" value={draft.slug} onChange={e=>setDraft({...draft,slug:e.target.value})}/></label>
          <label className="text-sm">Collection<select required className="mt-1 w-full rounded-xl border p-3" value={draft.category_id} onChange={e=>setDraft({...draft,category_id:e.target.value})}><option value="">Choose collection</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="text-sm">Fabric<input className="mt-1 w-full rounded-xl border p-3" value={draft.fabric} onChange={e=>setDraft({...draft,fabric:e.target.value})} placeholder="Only if verified"/></label>\n          {!draft.id && <><label className="text-sm">Base SKU<input required className="mt-1 w-full rounded-xl border p-3" value={draft.sku} onChange={e=>setDraft({...draft,sku:e.target.value})} placeholder="e.g. KNR-FRK-010"/></label><label className="text-sm">Sizes (comma separated)<input required className="mt-1 w-full rounded-xl border p-3" value={draft.sizes} onChange={e=>setDraft({...draft,sizes:e.target.value})} placeholder="e.g. 1Y, 2Y, 3Y"/></label><label className="text-sm">Opening stock per size<input type="number" min="0" className="mt-1 w-full rounded-xl border p-3" value={draft.stock} onChange={e=>setDraft({...draft,stock:e.target.value})}/></label></>}
          <label className="text-sm">Retail price (₹)<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-xl border p-3" value={draft.retail} onChange={e=>setDraft({...draft,retail:e.target.value})} placeholder="Leave blank if not confirmed"/></label>
          <label className="text-sm">Wholesale price (₹)<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-xl border p-3" value={draft.wholesale} onChange={e=>setDraft({...draft,wholesale:e.target.value})} placeholder="Leave blank if not confirmed"/></label>
          <label className="text-sm md:col-span-2">Description<textarea rows={3} className="mt-1 w-full rounded-xl border p-3" value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label>
          <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> Publish this product on the storefront</label>
          <label className="md:col-span-2 block rounded-xl border border-dashed border-[#cdb9a8] p-4 text-sm"><span className="flex items-center gap-2 font-medium"><ImagePlus size={18}/> Upload product photos</span><span className="mt-1 block text-xs text-[#786c62]">JPG, PNG or WebP · up to 5 MB each. Images upload to KANIRA Supabase Storage.</span><input className="mt-3 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))}/>{files.length>0&&<p className="mt-2 text-xs">{files.length} image(s) selected</p>}</label>
        </div>
        <button disabled={busy} className="primary-button mt-5"><Save size={16}/>{busy?"Saving…":draft.id?"Save changes":"Add product"}</button>
      </form>
      <div className="mt-9 flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Current products</h2><input aria-label="Search products" className="rounded-xl border bg-white px-3 py-2 text-sm" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="mt-4 grid gap-3">{filtered.map(p=><article key={p.id} className="rounded-2xl border border-[#e5d9ce] bg-white p-4"><div className="flex flex-wrap items-start gap-4">{p.product_images?.[0]&&<img src={imageUrl(p.product_images[0].storage_path)} alt={p.product_images[0].alt_text||p.name} className="h-24 w-20 rounded-lg object-cover"/>}<div className="min-w-0 flex-1"><h3 className="font-medium">{p.name}</h3><p className="mt-1 text-xs text-[#786c62]">{p.slug} · {p.is_published?"Published":"Draft"} · {p.product_images?.length||0} photos</p><div className="mt-2 flex flex-wrap gap-2">{(p.product_prices||[]).filter(x=>x.is_active).map(x=><span key={x.channel} className="rounded-full bg-[#f5eee5] px-2 py-1 text-xs">{x.channel}: ₹{(x.price_paise/100).toFixed(2)}</span>)}</div></div><div className="flex gap-2"><button aria-label={`Edit ${p.name}`} className="secondary-button" onClick={()=>editProduct(p)}><Pencil size={15}/></button><button aria-label={`Delete ${p.name}`} className="secondary-button text-red-700" onClick={()=>deleteProduct(p)}><Trash2 size={15}/></button></div></div>
        {p.product_images?.length ? <div className="mt-3 flex flex-wrap gap-2">{p.product_images.map(img=><div key={img.id} className="relative"><img src={imageUrl(img.storage_path)} alt={img.alt_text||p.name} className="h-16 w-16 rounded-lg object-cover"/><button type="button" aria-label="Delete image" className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow" onClick={()=>deleteImage(p.id,img.id,img.storage_path)}><X size={13}/></button></div>)}</div>:null}
      </article>)}</div>
    </>}
    {notice&&<p role="status" className="mt-4 text-sm text-green-800">{notice}</p>}
    {error&&isAdmin&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <p className="mt-8 text-xs leading-5 text-[#887c72]">Product changes are restricted by Supabase admin-role checks and row-level security. Do not enter unverified prices or product claims. Existing customer orders are not deleted when a product is removed.</p>
  </main></SiteLayout>;
}
