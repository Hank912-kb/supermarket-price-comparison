"use client";

import { useState } from "react";

type FormState = {
  name: string;
  unit: string;
  colesPrice: string;
  woolworthsPrice: string;
  aldiPrice: string;
};

type Product = {
  id: string;
  name: string;
  unit: string;
  colesPrice: number;
  woolworthsPrice: number;
  aldiPrice: number;
};

const emptyForm: FormState = {
  name: "",
  unit: "",
  colesPrice: "",
  woolworthsPrice: "",
  aldiPrice: "",
};

function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

function getPriceComparison(product: Product) {
  const stores = [
    { name: "Coles", price: product.colesPrice },
    { name: "Woolworths", price: product.woolworthsPrice },
    { name: "ALDI", price: product.aldiPrice },
  ];

  const cheapestPrice = Math.min(...stores.map((store) => store.price));
  const highestPrice = Math.max(...stores.map((store) => store.price));
  const cheapestSupermarket = stores
    .filter((store) => store.price === cheapestPrice)
    .map((store) => store.name)
    .join(", ");

  return {
    cheapestSupermarket,
    cheapestPrice,
    priceDifference: highestPrice - cheapestPrice,
  };
}

function isValidPrice(value: string): boolean {
  const parsed = Number.parseFloat(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
}

export default function Home() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [products, setProducts] = useState<Product[]>([]);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedUnit = form.unit.trim();

    if (
      !trimmedName ||
      !trimmedUnit ||
      !isValidPrice(form.colesPrice) ||
      !isValidPrice(form.woolworthsPrice) ||
      !isValidPrice(form.aldiPrice)
    ) {
      return;
    }

    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        unit: trimmedUnit,
        colesPrice: Number.parseFloat(form.colesPrice),
        woolworthsPrice: Number.parseFloat(form.woolworthsPrice),
        aldiPrice: Number.parseFloat(form.aldiPrice),
      },
    ]);

    setForm(emptyForm);
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-semibold text-emerald-600">
            Grocery Price Comparison
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            GrocCompare
          </h1>

          <p className="mt-3 text-slate-600">
            Compare grocery prices across Coles, Woolworths and ALDI.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Your products</h2>

          <p className="mt-2 text-slate-600">
            Add up to 20 products and compare prices manually.
          </p>

          <button
            type="button"
            className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white"
          >
            Add product
          </button>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-slate-700"
              >
                Product name
              </label>
              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g. Milk"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-unit"
                className="text-sm font-medium text-slate-700"
              >
                Unit / size
              </label>
              <input
                id="product-unit"
                type="text"
                value={form.unit}
                onChange={(event) => updateField("unit", event.target.value)}
                placeholder="e.g. 2L"
                className={inputClassName}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="coles-price"
                  className="text-sm font-medium text-slate-700"
                >
                  Coles price
                </label>
                <input
                  id="coles-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.colesPrice}
                  onChange={(event) =>
                    updateField("colesPrice", event.target.value)
                  }
                  placeholder="0.00"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="woolworths-price"
                  className="text-sm font-medium text-slate-700"
                >
                  Woolworths price
                </label>
                <input
                  id="woolworths-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.woolworthsPrice}
                  onChange={(event) =>
                    updateField("woolworthsPrice", event.target.value)
                  }
                  placeholder="0.00"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="aldi-price"
                  className="text-sm font-medium text-slate-700"
                >
                  ALDI price
                </label>
                <input
                  id="aldi-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.aldiPrice}
                  onChange={(event) =>
                    updateField("aldiPrice", event.target.value)
                  }
                  placeholder="0.00"
                  className={inputClassName}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white"
            >
              Save product
            </button>
          </form>

          {products.length > 0 && (
            <div className="mt-8 space-y-3">
              {products.map((product) => {
                const comparison = getPriceComparison(product);

                return (
                  <article
                    key={product.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {product.unit}
                    </p>

                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-slate-500">Coles</dt>
                        <dd className="font-medium">
                          {formatAud(product.colesPrice)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Woolworths</dt>
                        <dd className="font-medium">
                          {formatAud(product.woolworthsPrice)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">ALDI</dt>
                        <dd className="font-medium">
                          {formatAud(product.aldiPrice)}
                        </dd>
                      </div>
                    </dl>

                    <dl className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-slate-500">Cheapest supermarket</dt>
                        <dd className="font-medium text-emerald-700">
                          {comparison.cheapestSupermarket}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Cheapest price</dt>
                        <dd className="font-medium text-emerald-700">
                          {formatAud(comparison.cheapestPrice)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Price difference</dt>
                        <dd className="font-medium">
                          {formatAud(comparison.priceDifference)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
