import { Activity, ShieldCheck, Store, Truck } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Truck className="h-7 w-7 text-primary" />,
      title: "Fast local fulfillment",
      description:
        "From cart to doorstep, the ordering path is built to keep routine medicine purchases moving quickly."
    },
    {
      icon: <ShieldCheck className="h-7 w-7 text-primary" />,
      title: "Protected role access",
      description:
        "Customers, sellers, and admins stay in their proper areas, reducing confusion and improving control."
    },
    {
      icon: <Store className="h-7 w-7 text-primary" />,
      title: "Operational seller tools",
      description:
        "Sellers can manage stock, medicines, and orders through dedicated dashboard flows that feel focused."
    },
    {
      icon: <Activity className="h-7 w-7 text-primary" />,
      title: "Healthcare-first clarity",
      description:
        "The homepage and shopping layout are now designed to guide customers through decisions with less friction."
    }
  ];

  return (
    <section className="bg-background py-20 text-foreground md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/15 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Why MedQuix
          </span>
          <h2 className="mt-5 font-serif text-3xl font-black tracking-tight sm:text-4xl">
            A storefront for customers, with stronger structure behind the scenes.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            These improvements are not just visual. The platform now communicates
            trust, route separation, and smoother commerce more clearly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-accent p-3">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
