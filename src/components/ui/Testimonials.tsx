import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Rahat Chowdhury",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahat", // Replace with your imgpost link
      comment: "MediStore has made getting my regular vitamins so easy. The tracking feature is very accurate!",
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
    <section className="py-20 border-t bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Community Says</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="flex flex-col justify-between p-6 rounded-2xl border bg-white dark:bg-slate-950 shadow-sm italic transition-transform hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Star Ratings */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 fill-current ${
                          i < review.rating ? "text-yellow-400" : "text-slate-200"
                        }`} 
                      />
                    ))}
                  </div>
                  {/* Doctor/User Image */}
                  <div className="h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden not-italic">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex flex-col">
                <p className="font-bold not-italic text-slate-900 dark:text-slate-100">
                  {review.name}
                </p>
                <p className="text-xs text-muted-foreground not-italic font-medium">
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