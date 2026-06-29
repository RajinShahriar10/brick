"use client";

import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { formatPrice } from "@/lib/utils";
import { Plus, Upload, Archive, Package, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  stock: number;
  isArchived: boolean;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (productId: string, file: File) => {
    setUploading(productId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        const product = products.find((p) => p.id === productId);
        if (product) {
          await fetch("/api/admin/products", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: productId,
              images: [...product.images, url],
            }),
          });
          fetchProducts();
        }
      }
    } catch {
      /* silent */
    } finally {
      setUploading(null);
    }
  };

  const toggleArchive = async (product: Product) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, isArchived: !product.isArchived }),
    });
    fetchProducts();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Products</h1>

        {loading ? (
          <p className="text-xs text-white/20">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-xs text-white/20">No products yet.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-500 ${
                  product.isArchived ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    {/* Image */}
                    <div
                      className="w-20 h-14 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex-shrink-0 overflow-hidden border border-white/5"
                    >
                      {product.images[0] ? (
                        <CloudinaryImage
                          src={product.images[0]}
                          alt={product.name}
                          width={160}
                          height={112}
                          crop="fill"
                          className="w-full h-full object-cover"
                          wrapperClassName="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-white/20" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-white">{product.name}</h3>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            product.isArchived
                              ? "bg-red-600/10 text-red-400"
                              : "bg-emerald-600/10 text-emerald-400"
                          }`}
                        >
                          {product.isArchived ? "Archived" : "Active"}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mb-2">{product.tagline}</p>
                      <div className="flex items-center gap-4 text-xs text-white/30">
                        <span>{formatPrice(product.price)}</span>
                        <span>Stock: {product.stock}</span>
                      </div>

                      {/* Image gallery */}
                      {product.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {product.images.map((url, i) => (
                            <CloudinaryImage
                              key={i}
                              src={url}
                              alt=""
                              width={80}
                              height={64}
                              crop="fill"
                              className="w-10 h-8 rounded object-cover"
                              wrapperClassName="w-10 h-8 rounded border border-white/5"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(product.id, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading === product.id}
                      className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium bg-white/5 text-white/50 rounded-lg hover:bg-white/10 hover:text-white/70 transition-all disabled:opacity-30"
                    >
                      {uploading === product.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                      Upload
                    </button>
                    <button
                      onClick={() => toggleArchive(product)}
                      className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium bg-white/5 text-white/50 rounded-lg hover:bg-white/10 hover:text-white/70 transition-all"
                    >
                      <Archive className="h-3 w-3" />
                      {product.isArchived ? "Restore" : "Archive"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
