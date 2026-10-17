import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Clock, MapPin, Sparkles, Croissant, ArrowRight, QrCode } from 'lucide-react';

export const metadata = {
  title: 'The Courtyard Artisan Cafe | Aura Grand Palace Udaipur',
  description:
    'Single-estate Indian coffees, hand-pulled espresso, royal saffron chai, French butter viennoiserie, and sourdough tartines in a tranquil courtyard setting.',
};

export default function CafePage() {
  const outlet = dataRepository.getOutletByType('cafe')!;
  const categories = dataRepository.getMenuCategories(outlet.id);

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative h-[440px] rounded-3xl overflow-hidden mb-12 border-2 border-[#B08D57]/40 shadow-xl">
          <Image
            src="/images/food/cafe.jpg"
            alt="The Courtyard Artisan Cafe"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241F1A] via-[#241F1A]/50 to-transparent flex items-end p-8 sm:p-14">
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-3">
                Courtyard Roastery & Patisserie
              </Badge>
              <h1 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight drop-shadow-md">
                {outlet.name}
              </h1>
              <p className="text-[#EBE5D6] text-sm sm:text-base font-normal leading-relaxed">
                Single-origin Arabica coffees from Chikmagalur estates, saffron-infused chai, freshly baked butter croissants, and organic sourdough tartines nestled within ancient palace stone arches.
              </p>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="heritage-card bg-white p-5 rounded-2xl flex items-center space-x-4 border border-[#D4CBBB] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center shrink-0 text-[#670E10]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase text-[#8F7245] font-bold block">Operating Hours</span>
              <span className="text-sm font-bold text-[#241F1A]">Daily: 07:30 AM – 10:00 PM</span>
            </div>
          </div>

          <div className="heritage-card bg-white p-5 rounded-2xl flex items-center space-x-4 border border-[#D4CBBB] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center shrink-0 text-[#670E10]">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase text-[#8F7245] font-bold block">Artisan Brews</span>
              <span className="text-sm font-bold text-[#241F1A]">Espresso, Pour-over & Masala Chai</span>
            </div>
          </div>

          <div className="heritage-card bg-white p-5 rounded-2xl flex items-center justify-between border border-[#D4CBBB] shadow-sm">
            <div>
              <span className="text-[11px] uppercase text-[#8F7245] font-bold block">Pickup & Room Delivery</span>
              <span className="text-sm font-bold text-[#670E10]">Fresh Bakes to Doorstep</span>
            </div>
            <Link href="/order/pickup">
              <Button size="sm">Order Cafe</Button>
            </Link>
          </div>
        </div>

        {/* Categorized Menu */}
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center space-x-4 pb-3 border-b-2 border-[#D4CBBB]">
                <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#241F1A]">{category.name}</h2>
                <span className="text-xs text-[#8F7245] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#D4CBBB]">
                  {category.items?.length || 0} Selection{category.items?.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items?.map((item) => (
                  <div
                    key={item.id}
                    className="heritage-card bg-white p-6 rounded-2xl border border-[#D4CBBB] flex flex-col justify-between hover:border-[#670E10] shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          </span>
                          <h3 className="text-base font-bold text-[#241F1A] tracking-tight">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-base font-heritage font-bold text-[#670E10] whitespace-nowrap">
                          {formatMoney(item.price_minor)}
                        </span>
                      </div>

                      <p className="text-xs text-[#6B6155] mb-4 leading-relaxed pl-5">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pl-5 mb-4">
                        {item.dietary_labels?.map((label, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-[#FAF8F3] border border-[#D4CBBB] text-[#8F7245]"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D4CBBB] flex items-center justify-between pl-5">
                      <span className="text-[11px] text-[#6B6155]">Freshly brewed / baked</span>
                      <Link href="/order/pickup">
                        <Button size="sm" variant="outline">
                          Order This Item
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
