import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import {
  HeritageDivider,
  PaisleyButaOrnament,
  LataJaaliRunner,
} from '@/components/ui/heritage-ornaments';
import {
  IconCafeLounge,
  IconTraditionalCuisine,
  IconIndoorOutdoor,
} from '@/components/ui/heritage-art';
import { Clock } from 'lucide-react';

export const metadata = {
  title: 'Café & Lounge | Relax, Sip, Soak in the Heritage | Rajmahal Heritage Hotel',
  description:
    'A cozy space to enjoy freshly brewed coffee, Rajasthani snacks and a relaxed ambience with beautiful views. Open daily 8:00 AM – 11:00 PM.',
};

export default function CafePage() {
  const outlet = dataRepository.getOutletByType('cafe')!;
  const categories = dataRepository.getMenuCategories(outlet.id);

  const features = [
    { label: 'Coffee & Beverages', icon: IconCafeLounge },
    { label: 'Quick Bites', icon: IconTraditionalCuisine },
    { label: 'Indoor & Outdoor Seating', icon: IconIndoorOutdoor },
  ];

  return (
    <div className="relative bg-[#F5F1E8] min-h-screen py-10 sm:py-16 text-[#241F1A] overflow-hidden">
      {/* ── BESPOKE VERTICAL LATA JAALI BORDERS ── */}
      <LataJaaliRunner side="left" opacity={0.15} color="#B08D57" className="hidden lg:block" />
      <LataJaaliRunner side="right" opacity={0.15} color="#B08D57" className="hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* ── HERO BANNER (Matching Mobile - Café mockup) ── */}
        <div className="relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden shadow-xl border border-[#D4CBBB]">
          <Image
            src="/images/food/cafe.jpg"
            alt="Café & Lounge at Rajmahal Heritage Hotel"
            fill
            priority
            className="object-cover"
          />

          {/* Dedicated Paisley Kalka Ornaments in Hero Corners with subtle opacity */}
          <div className="absolute top-2 left-2 pointer-events-none hidden sm:block">
            <PaisleyButaOrnament size="180px" opacity={0.15} color="#C9A96E" />
          </div>
          <div className="absolute top-2 right-2 pointer-events-none hidden sm:block scale-x-[-1]">
            <PaisleyButaOrnament size="180px" opacity={0.15} color="#C9A96E" />
          </div>

          {/* Subtle clear overlay so cafe photo stays bright and inviting */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10 flex items-center justify-center p-6 sm:p-12 text-center">
            <div className="max-w-2xl">
              <h1 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight">
                Café & Lounge
              </h1>
              <p className="text-base sm:text-xl font-medium text-[#C9A96E] mb-3">
                Relax, Sip, Soak in the Heritage.
              </p>
              <p className="text-xs sm:text-sm text-[#E0DCD3] max-w-xl mx-auto font-light leading-relaxed mb-4">
                A cozy space to enjoy freshly brewed coffee, Rajasthani snacks and a relaxed ambience with beautiful views.
              </p>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#C9A96E] bg-black/40 px-3.5 py-1.5 rounded-full border border-[#B08D57]/40 mb-6">
                <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Open Daily: 8:00 AM – 11:00 PM</span>
              </div>

              <div>
                <a
                  href="#cafe-menu"
                  className="px-6 py-3 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#4A0A0C] font-semibold text-sm tracking-wide transition-all shadow"
                >
                  View Café Menu
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3 FEATURE ICONS (Matching image) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-5 rounded-xl bg-white border border-[#D4CBBB]/70 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#B08D57]/50 flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-[#B08D57]" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#670E10]">
                  {feat.label}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Symmetrical Jaali Divider */}
        <HeritageDivider className="opacity-35 my-6" color="#B08D57" />

        {/* ── CAFÉ MENU ITEMS ── */}
        <div id="cafe-menu" className="pt-4 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#670E10] mb-2">
              Artisan Brews & Pastries
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F62]">
              Single-origin coffees, royal saffron chai, and handcrafted viennoiserie
            </p>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="font-heritage text-xl font-bold text-[#670E10] pb-2 border-b border-[#D4CBBB]">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-[#D4CBBB]/70 shadow-2xs hover:border-[#B08D57] transition-all flex justify-between items-start"
                  >
                    <div className="pr-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`w-3 h-3 rounded-full ${(item.dietary_labels || []).includes('veg') ? 'bg-emerald-600' : 'bg-red-700'}`} />
                        <h4 className="font-semibold text-sm text-[#670E10]">{item.name}</h4>
                      </div>
                      <p className="text-xs text-[#7A6F62] leading-relaxed mb-2 font-light">
                        {item.description}
                      </p>
                      <span className="font-heritage font-bold text-sm text-[#670E10]">
                        {formatMoney(item.price_minor)}
                      </span>
                    </div>

                    <Link
                      href="/order/pickup"
                      className="px-3 py-1.5 rounded bg-[#FAF8F3] hover:bg-[#670E10] hover:text-[#FAF8F3] border border-[#D4CBBB] text-xs font-medium text-[#670E10] transition-all shrink-0"
                    >
                      Order
                    </Link>
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
