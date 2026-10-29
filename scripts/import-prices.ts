import { readdir, readFile } from "fs/promises";
import path from "path";
import { prisma } from "../lib/db";

type ImportedProduct = {
  productName: string;
  price: number;
  unitPrice?: number | null;
  unitPriceLabel?: string | null;
  packageSize?: string | null;
  sourceUrl?: string | null;
};

type ImportFile = {
  supermarket: string;
  searchTerm: string;
  products: ImportedProduct[];
};

const DATA_DIR = path.join(process.cwd(), "data");

async function importFile(filePath: string) {
  const raw = await readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw) as ImportFile;

  console.log(
    `Importing ${parsed.products.length} product(s) from ${path.basename(filePath)} (${parsed.supermarket}, "${parsed.searchTerm}")`,
  );

  await prisma.$transaction([
    prisma.priceObservation.deleteMany({
      where: {
        supermarket: parsed.supermarket,
        searchTerm: parsed.searchTerm,
      },
    }),
    prisma.priceObservation.createMany({
      data: parsed.products.map((product) => ({
        supermarket: parsed.supermarket,
        searchTerm: parsed.searchTerm,
        productName: product.productName,
        price: product.price,
        unitPrice: product.unitPrice ?? null,
        unitPriceLabel: product.unitPriceLabel ?? null,
        packageSize: product.packageSize ?? null,
        sourceUrl: product.sourceUrl ?? null,
      })),
    }),
  ]);
}

async function run() {
  const entries = await readdir(DATA_DIR);
  const jsonFiles = entries.filter((name) => name.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.log(`No JSON files found in ${DATA_DIR}.`);
    return;
  }

  for (const file of jsonFiles) {
    await importFile(path.join(DATA_DIR, file));
  }

  console.log("Import complete.");
}

run()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
