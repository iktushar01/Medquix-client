import Link from "next/link";
import { Apple, Baby, Bandage, ChevronRight, Sparkles, Thermometer } from "lucide-react";

const concerns = [
  {
    id: 1,
    title: "Fever & Pain",
    description: "Quick relief products for headaches, fever, and body pain.",
    icon: Thermometer,
    href: "/shop?cat=fever",
  },
  {
    id: 2,
    title: "Skincare",
    description: "Daily care and treatment essentials for healthier skin.",
    icon: Sparkles,
    href: "/shop?cat=skin",
  },
  {
    id: 3,
    title: "Vitamins",
    description: "Supplements that support routine wellness and immunity.",
    icon: Apple,
    href: "/shop?cat=vitamins",
  },
  {
    id: 4,
    title: "First Aid",
    description: "Must-have supplies for everyday cuts, sprains, and care.",
    icon: Bandage,
    href: "/shop?cat=firstaid",
  },
  {
    id: 5,
    title: "Baby Care",
    description: "Gentle products tailored for newborns and growing families.",
    icon: Baby,
    href: "/shop?cat=baby",
  },
];

export default function ShopByConcern() {
  return (
    <section className="bg-[linear-gradient(180deg,var(--background)_0%,var(--accent)_100%)] py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Browse By Need
            </span>
            <h2 className="mt-5 font-serif text-3xl font-black text-foreground sm:text-4xl">
              Start with the concern, not the clutter.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Each category acts like a guided shortcut so customers can move
              into the right product collection faster.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            Explore full catalog
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {concerns.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary/25"
              >
                <div className="mb-5 inline-flex rounded-[1.25rem] bg-accent p-4 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  Open collection
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
