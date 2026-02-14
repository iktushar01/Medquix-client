import React from 'react';
import { 
  Thermometer, 
  Sparkles, 
  Apple, 
  Bandage, 
  Baby, 
  ChevronRight 
} from 'lucide-react';

const concerns = [
  {
    id: 1,
    title: "Fever & Pain",
    icon: <Thermometer className="w-8 h-8" />,
    color: "bg-orange-100 text-orange-600",
    href: "/shop?cat=fever",
  },
  {
    id: 2,
    title: "Skincare",
    icon: <Sparkles className="w-8 h-8" />,
    color: "bg-pink-100 text-pink-600",
    href: "/shop?cat=skin",
  },
  {
    id: 3,
    title: "Vitamins",
    icon: <Apple className="w-8 h-8" />,
    color: "bg-emerald-100 text-emerald-600",
    href: "/shop?cat=vitamins",
  },
  {
    id: 4,
    title: "First Aid",
    icon: <Bandage className="w-8 h-8" />,
    color: "bg-blue-100 text-blue-600",
    href: "/shop?cat=firstaid",
  },
  {
    id: 5,
    title: "Baby Care",
    icon: <Baby className="w-8 h-8" />,
    color: "bg-purple-100 text-purple-600",
    href: "/shop?cat=baby",
  },
];

export default function ShopByConcern() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Shop by Concern
            </h2>
            <p className="text-slate-500 mt-2">
              Find the right medicine based on your symptoms
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-emerald-600 font-medium hover:underline">
            View All <ChevronRight size={16} />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {concerns.map((item) => (
            <div 
              key={item.id}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Circular Icon Wrapper */}
              <div className={`
                w-24 h-24 md:w-28 md:h-28 
                rounded-full flex items-center justify-center 
                transition-all duration-300 
                group-hover:scale-110 group-hover:shadow-lg
                ${item.color}
              `}>
                {item.icon}
              </div>
              
              {/* Label */}
              <h3 className="mt-4 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}