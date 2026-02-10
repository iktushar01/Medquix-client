import { Truck, ShieldCheck, Users, Clock } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Get your medicines delivered to your doorstep within 24 hours of ordering."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Trusted Sellers",
      description: "Every pharmacy on our platform is verified and licensed by health authorities."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Our customer service team is always available to help with your orders."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Quality Medicines",
      description: "We only list OTC medicines from reputable global and local manufacturers."
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose MedQuix?</h2>
          <p className="text-muted-foreground">
            We bridge the gap between local pharmacies and customers, ensuring safe and accessible healthcare for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border hover:border-primary/50 transition-colors">
              <div className="mb-4 inline-block p-3 bg-primary/10 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}