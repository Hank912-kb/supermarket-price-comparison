"use client";

import { useState } from "react";

type SupermarketName = "Coles" | "Woolworths" | "ALDI";

type SupermarketPrice = {
  price: number;
  unitPrice: string;
  sourceUrl: string;
};

type GroceryProduct = {
  id: string;
  productName: string;
  category: string;
  unit: string;
  prices: Record<Lowercase<SupermarketName>, SupermarketPrice>;
  cheapestSupermarket: SupermarketName;
  priceDifference: number;
  lastUpdated: string;
};

type FormState = {
  name: string;
  unit: string;
  colesPrice: string;
  woolworthsPrice: string;
  aldiPrice: string;
};

type AdminProduct = {
  id: string;
  name: string;
  unit: string;
  colesPrice: number;
  woolworthsPrice: number;
  aldiPrice: number;
};

const selectedGroceryProducts: GroceryProduct[] = [
  {
    id: "full-cream-milk-2l",
    productName: "Full Cream Milk",
    category: "Dairy",
    unit: "2L bottle",
    prices: {
      coles: {
        price: 3.1,
        unitPrice: "$1.55 / 1L",
        sourceUrl: "https://www.coles.com.au/search/products?q=full%20cream%20milk%202l",
      },
      woolworths: {
        price: 3.2,
        unitPrice: "$1.60 / 1L",
        sourceUrl: "https://www.woolworths.com.au/shop/search/products?searchTerm=full%20cream%20milk%202l",
      },
      aldi: {
        price: 2.99,
        unitPrice: "$1.50 / 1L",
        sourceUrl: "https://www.aldi.com.au/groceries/",
      },
    },
    cheapestSupermarket: "ALDI",
    priceDifference: 0.21,
    lastUpdated: "30 Jun 2026",
  },
  {
    id: "wholemeal-bread-700g",
    productName: "Wholemeal Bread",
    category: "Bakery",
    unit: "700g loaf",
    prices: {
      coles: {
        price: 2.7,
        unitPrice: "$0.39 / 100g",
        sourceUrl: "https://www.coles.com.au/search/products?q=wholemeal%20bread%20700g",
      },
      woolworths: {
        price: 2.9,
        unitPrice: "$0.41 / 100g",
        sourceUrl: "https://www.woolworths.com.au/shop/search/products?searchTerm=wholemeal%20bread%20700g",
      },
      aldi: {
        price: 2.49,
        unitPrice: "$0.36 / 100g",
        sourceUrl: "https://www.aldi.com.au/groceries/",
      },
    },
    cheapestSupermarket: "ALDI",
    priceDifference: 0.41,
    lastUpdated: "30 Jun 2026",
  },
  {
    id: "free-range-eggs-12-pack",
    productName: "Free Range Eggs",
    category: "Dairy and eggs",
    unit: "12 pack",
    prices: {
      coles: {
        price: 6.8,
        unitPrice: "$0.57 / egg",
        sourceUrl: "https://www.coles.com.au/search/products?q=free%20range%20eggs%2012%20pack",
      },
      woolworths: {
        price: 6.5,
        unitPrice: "$0.54 / egg",
        sourceUrl: "https://www.woolworths.com.au/shop/search/products?searchTerm=free%20range%20eggs%2012%20pack",
      },
      aldi: {
        price: 5.99,
        unitPrice: "$0.50 / egg",
        sourceUrl: "https://www.aldi.com.au/groceries/",
      },
    },
    cheapestSupermarket: "ALDI",
    priceDifference: 0.81,
    lastUpdated: "29 Jun 2026",
  },
  {
    id: "bananas-1kg",
    productName: "Bananas",
    category: "Fruit and vegetables",
    unit: "1kg",
    prices: {
      coles: {
        price: 4.0,
        unitPrice: "$4.00 / 1kg",
        sourceUrl: "https://www.coles.com.au/search/products?q=bananas%201kg",
      },
      woolworths: {
        price: 3.9,
        unitPrice: "$3.90 / 1kg",
        sourceUrl: "https://www.woolworths.com.au/shop/search/products?searchTerm=bananas%201kg",
      },
      aldi: {
        price: 3.49,
        unitPrice: "$3.49 / 1kg",
        sourceUrl: "https://www.aldi.com.au/groceries/",
      },
    },
    cheapestSupermarket: "ALDI",
    priceDifference: 0.51,
    lastUpdated: "30 Jun 2026",
  },
  {
    id: "jasmine-rice-5kg",
    productName: "Jasmine Rice",
    category: "Pantry",
    unit: "5kg bag",
    prices: {
      coles: {
        price: 16.0,
        unitPrice: "$0.32 / 100g",
        sourceUrl: "https://www.coles.com.au/search/products?q=jasmine%20rice%205kg",
      },
      woolworths: {
        price: 15.5,
        unitPrice: "$0.31 / 100g",
        sourceUrl: "https://www.woolworths.com.au/shop/search/products?searchTerm=jasmine%20rice%205kg",
      },
      aldi: {
        price: 14.99,
        unitPrice: "$0.30 / 100g",
        sourceUrl: "https://www.aldi.com.au/groceries/",
      },
    },
    cheapestSupermarket: "ALDI",
    priceDifference: 1.01,
    lastUpdated: "28 Jun 2026",
  },
];

const emptyForm: FormState = {
  name: "",
  unit: "",
  colesPrice: "",
  woolworthsPrice: "",
  aldiPrice: "",
};

const showAdminProductForm = false;

function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

function isValidPrice(value: string): boolean {
  const parsed = Number.parseFloat(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
}

function AdminProductForm({
  onSave,
}: {
  onSave: (product: AdminProduct) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);

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

    onSave({
      id: crypto.randomUUID(),
      name: trimmedName,
      unit: trimmedUnit,
      colesPrice: Number.parseFloat(form.colesPrice),
      woolworthsPrice: Number.parseFloat(form.woolworthsPrice),
      aldiPrice: Number.parseFloat(form.aldiPrice),
    });

    setForm(emptyForm);
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

  return (
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
            onChange={(event) => updateField("colesPrice", event.target.value)}
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
            onChange={(event) => updateField("aldiPrice", event.target.value)}
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
  );
}

export default function Home() {
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([]);

  function handleAdminProductSave(product: AdminProduct) {
    setAdminProducts((prev) => [...prev, product]);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Popular grocery prices</h2>

              <p className="mt-2 text-slate-600">
                Browse selected grocery prices across everyday supermarket
                products.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Mock data for public preview
            </p>
          </div>

          {showAdminProductForm && (
            <AdminProductForm onSave={handleAdminProductSave} />
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {selectedGroceryProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-emerald-600">
                      {product.category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {product.productName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {product.unit}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Cheapest: {product.cheapestSupermarket}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-3">
                    <dt className="text-slate-500">Coles price</dt>
                    <dd className="mt-1 font-semibold">
                      {formatAud(product.prices.coles.price)}
                    </dd>
                    <dd className="mt-1 text-xs text-slate-500">
                      {product.prices.coles.unitPrice}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <dt className="text-slate-500">Woolworths price</dt>
                    <dd className="mt-1 font-semibold">
                      {formatAud(product.prices.woolworths.price)}
                    </dd>
                    <dd className="mt-1 text-xs text-slate-500">
                      {product.prices.woolworths.unitPrice}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <dt className="text-slate-500">ALDI price</dt>
                    <dd className="mt-1 font-semibold">
                      {formatAud(product.prices.aldi.price)}
                    </dd>
                    <dd className="mt-1 text-xs text-slate-500">
                      {product.prices.aldi.unitPrice}
                    </dd>
                  </div>
                </dl>

                <dl className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Price difference</dt>
                    <dd className="mt-1 font-medium">
                      Save up to {formatAud(product.priceDifference)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Last updated</dt>
                    <dd className="mt-1 font-medium">{product.lastUpdated}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 pt-4 text-sm">
                  <a
                    href={product.prices.coles.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Coles source
                  </a>
                  <a
                    href={product.prices.woolworths.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Woolworths source
                  </a>
                  <a
                    href={product.prices.aldi.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    ALDI source
                  </a>
                </div>
              </article>
            ))}
          </div>

          <span className="sr-only">{adminProducts.length}</span>
        </section>
      </div>
    </main>
  );
}
