import Link from "next/link";
import { ArrowRight, ClipboardList, ShieldCheck, Store, Truck } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Explore by concern",
    description:
      "Browse categories that match real health needs instead of searching through a generic grid first.",
    icon: ClipboardList,
  },
  {
    id: "02",
    title: "Order with clarity",
    description:
      "Track pricing, stock, and checkout flow through a simpler customer journey built for confidence.",
    icon: Truck,
  },
  {
    id: "03",
    title: "Trust verified sellers",
    description:
      "Sellers manage medicines through dedicated tools while customers stay in the right protected experience.",
    icon: Store,
  },
  {
    id: "04",
    title: "Stay protected",
    description:
      "Role-based routing keeps admin, seller, and customer spaces separated for a cleaner workflow.",
    icon: ShieldCheck,
  },
];

export default function CareJourney() {
  return (
    <section
      id="care-journey"
      className="bg-[linear-gradient(180deg,var(--background)_0%,var(--muted)_100%)] py-20 text-foreground md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-primary/15 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Care Journey
            </span>
            <h2 className="max-w-lg font-serif text-3xl font-black leading-tight sm:text-4xl">
              Four sections of the experience, designed to feel purposeful.
            </h2>
            <p className="max-w-lg text-base leading-8 text-muted-foreground">
              The homepage now tells a clearer story: discover what you need,
              order faster, keep each role in the correct workspace, and make
              the whole flow easier to trust.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
            >
              Start browsing medicines
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.id}
                  className="group rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="mb-6 inline-flex rounded-2xl bg-accent px-4 py-4 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    Step {step.id}
                  </p>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
