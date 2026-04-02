import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Rahat Chowdhury",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahat", // Replace with your imgpost link
      comment: "MedQuix has made getting my regular vitamins so easy. The tracking feature is very accurate!",
      rating: 5
    },
    {
      name: "Dr. Samira Ahmed",
      role: "Pharmacy Owner (Seller)",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samira", // Replace with your imgpost link
      comment: "As a seller, the dashboard provides everything I need to manage my inventory and orders efficiently.",
      rating: 5
    },
    {
      name: "Anika Tabassum",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika", // Replace with your imgpost link
      comment: "Very impressed with the fast delivery. The medicines were packed securely and were exactly what I ordered.",
      rating: 4
    }
  ];

  return (
    <section className="bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-accent bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-foreground">
              Community Voice
            </span>
            <h2 className="mt-5 font-serif text-3xl font-black text-foreground sm:text-4xl">
              What customers and pharmacy partners feel after using MedQuix.
            </h2>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            Visit support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-[1.75rem] border border-border bg-card p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 fill-current ${
                          i < review.rating ? "text-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-border not-italic">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </div>

                <p className="mb-6 text-base leading-8 text-muted-foreground">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="flex flex-col">
                <p className="font-bold not-italic text-foreground">{review.name}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground not-italic">
                  {review.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
