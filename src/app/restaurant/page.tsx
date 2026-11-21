import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { menuService } from '@/lib/services/menu-service';
import { formatMoney } from '@/lib/utils/money';
import {
  HeritageDivider,
  LataJaaliRunner,
  RoyalProcessionBanner,
  PaisleyButaOrnament,
} from '@/components/ui/heritage-ornaments';
import {
  IconTraditionalCuisine,
  IconIndoorOutdoor,
  IconLiveFolkMusic,
  IconSpecialThali,
  IconCafeLounge,
} from '@/components/ui/heritage-art';
import { ArrowRight, QrCode, Clock, Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';
import { RestaurantReservationCTA } from '@/components/restaurant/restaurant-reservation-cta';

export const metadata = {
  title: 'Restaurant & Café | Authentic Rajasthani Dining & Artisan Brews | Rajmahal Heritage Hotel',
  description:
    'Experience the culinary heritage of Rajasthan at our royal restaurant and Jharokha artisan café. Traditional royal recipes, thalis, single-origin coffees, and handcrafted delicacies.',
};

async function RestaurantAndCafeContent() {
  const restaurantOutlet = dataRepository.getOutletByType('restaurant')!;
  const cafeOutlet = dataRepository.getOutletByType('cafe')!;

  const [restaurantCategories, cafeCategories] = await Promise.all([
    menuService.getMenuCategories(restaurantOutlet?.id || ''),
    menuService.getMenuCategories(cafeOutlet?.id || ''),
  ]);

  const signatureDishes = [
    {
      name: 'Dal Baati Churma',
      image: '/images/food/dal-baati.jpg',
      desc: 'Golden crisp baati rolls drenched in desi ghee with spiced dal and sweet churma.',
    },
    {
      name: 'Laal Maas',
      image: '/images/food/laal-maas.jpg',
      desc: 'Royal Rajputana mutton simmered in Mathania red chillies and fragrant spices.',
    },
    {
      name: 'Gatte ki Sabzi',
      image: '/images/food/gatte-ki-sabzi.jpg',
      desc: 'Gram flour dumplings poached in an aromatic spiced curd gravy.',
    },
    {
      name: 'Ker Sangri',
      image: '/images/food/ker-sangri.jpg',
      desc: 'Authentic wild desert berries and dried beans cooked with dry mango and cumin.',
    },
  ];

  const restaurantFeatures = [
    { label: 'Traditional Rajasthani Cuisine', icon: IconTraditionalCuisine },
    { label: 'Indoor & Courtyard Seating', icon: IconIndoorOutdoor },
    { label: 'Live Folk Music (Evenings)', icon: IconLiveFolkMusic },
    { label: 'Royal Thali Feasts', icon: IconSpecialThali },
  ];

  const cafeFeatures = [
    { label: 'Artisan Udaipur Coffees', icon: IconCafeLounge },
    { label: 'Fresh Pastries & Quick Bites', icon: IconTraditionalCuisine },
    { label: 'Scenic Jharokha Seating', icon: IconIndoorOutdoor },
  ];

  return (
    <div className="relative bg-[#F5F1E8] min-h-screen py-8 sm:py-14 text-[#241F1A] overflow-hidden">
      {/* ── BESPOKE VERTICAL LATA JAALI BORDERS ── */}
      <LataJaaliRunner side="left" opacity={0.15} color="#B08D57" className="hidden lg:block" />
      <LataJaaliRunner side="right" opacity={0.15} color="#B08D57" className="hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── TOP OUTLET SWITCHER & SUB-HEADER ── */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d8aa67]/20 border border-[#d8aa67]/60 text-[#4f0809] text-xs font-bold tracking-[0.22em] uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Royal Dining &amp; Café Collection</span>
          </div>
          <h1 className="font-heritage text-3xl sm:text-5xl font-bold text-[#670E10] tracking-tight">
            Culinary Experiences at Rajmahal
          </h1>
          <p className="text-xs sm:text-base text-[#6E6356] max-w-2xl mx-auto font-light leading-relaxed">
            From imperial Rajasthani banquets at our traditional restaurant to relaxed artisanal brews at the Jharokha Café, indulge in authentic royal flavors.
          </p>

          {/* Quick-Jump Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#restaurant"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#670E10] text-[#FAF8F3] hover:bg-[#821215] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#D8AA67]" />
              <span>Rajasthani Restaurant</span>
            </a>
            <a
              href="#cafe"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-[#670E10] hover:bg-[#FAF8F3] border border-[#B08D57]/70 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm"
            >
              <Coffee className="w-4 h-4 text-[#B08D57]" />
              <span>Jharokha Café &amp; Lounge</span>
            </a>
            <RestaurantReservationCTA />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: RAJASTHANI RESTAURANT
        ═══════════════════════════════════════════════════════════════ */}
        <section id="restaurant" className="space-y-12 scroll-mt-24">
          {/* ── 1. RESTAURANT HERO BANNER ── */}
          <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-[#D4CBBB]">
            <Image
              src="/images/food/restaurant.jpg"
              alt="Rajasthani Restaurant at Rajmahal Heritage Hotel"
              fill
              priority
              className="object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center p-6 sm:p-12 text-center">
              <div className="max-w-3xl">
                <span className="text-[#D8AA67] text-xs font-bold tracking-[0.28em] uppercase mb-2 block">
                  Fine Dining &amp; Thali
                </span>
                <h2 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight drop-shadow-lg">
                  Rajasthani Restaurant
                </h2>
                <p className="text-base sm:text-xl font-medium text-[#C9A96E] mb-3 drop-shadow">
                  Authentic Flavors, Royal Ambience
                </p>
                <p className="text-xs sm:text-base text-[#E0DCD3] max-w-2xl mx-auto font-light leading-relaxed mb-6 drop-shadow">
                  Experience the true taste of Rajasthan with traditional recipes, fresh local ingredients, and a regal heritage dining atmosphere.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="#restaurant-menu"
                    className="px-6 py-2.5 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#4A0A0C] font-semibold text-sm tracking-wide transition-all shadow"
                  >
                    View Restaurant Menu
                  </a>
                  <RestaurantReservationCTA
                    className="!rounded-md !px-6 !py-2.5 !bg-[#670E10] !border !border-[#B08D57]/60 hover:!bg-[#821215] !text-[#FAF8F3]"
                  />
                  <Link
                    href="/qr/table-t01"
                    className="px-4 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F3] text-sm font-medium backdrop-blur-xs flex items-center space-x-1.5 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-[#C9A96E]" />
                    <span>Dine-In QR</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4 RESTAURANT FEATURES ROW ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {restaurantFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center p-4 rounded-xl bg-white border border-[#D4CBBB]/70 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="w-13 h-13 rounded-full bg-[#FAF8F3] border border-[#B08D57]/50 flex items-center justify-center mb-2.5">
                    <Icon className="w-6 h-6 text-[#B08D57]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#670E10] max-w-[160px] leading-snug">
                    {feat.label}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Symmetrical Jaali Divider */}
          <HeritageDivider className="opacity-35" color="#B08D57" />

          {/* ── SIGNATURE DISHES ── */}
          <div className="space-y-8 text-center">
            <div>
              <h3 className="font-heritage text-2xl sm:text-4xl font-bold text-[#670E10] mb-2">
                Our Signature Dishes
              </h3>
              <p className="text-sm text-[#6E6356] font-light">
                Centuries-old royal recipes crafted by our khansama masters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {signatureDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-[#D4CBBB]/70 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center group"
                >
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-[#B08D57]/40 shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-heritage text-base sm:text-lg font-bold text-[#670E10] mb-1.5 group-hover:text-[#B08D57] transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-[#7A6F62] leading-relaxed font-light">
                    {dish.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DINE LIKE ROYALTY BANNER ── */}
          <div className="relative bg-[#4A0A0C] text-[#FAF8F3] rounded-2xl overflow-hidden p-8 sm:p-12 border border-[#B08D57]/50 shadow-2xl text-center">
            <div className="relative z-10 max-w-4xl mx-auto space-y-4">
              <span className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase block">
                ✦ Shahi Sawari &amp; Royal Feasts ✦
              </span>
              <h3 className="font-heritage text-2xl sm:text-4xl font-bold text-[#FAF8F3] tracking-wide">
                Dine Like Royalty
              </h3>
              <p className="text-[#D8D2C4] text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
                A culinary journey through the rich heritage of Rajasthan, served in a regal setting with recipes passed down through royal palace kitchens.
              </p>

              <div className="pt-2 pb-2">
                <RoyalProcessionBanner color="#C9A96E" opacity={0.45} />
              </div>

              <div className="pt-2 flex justify-center gap-4">
                <Link
                  href="/order/pickup"
                  className="px-6 py-2.5 rounded bg-[#C59B63] hover:bg-[#B88E55] text-[#4A0A0C] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md"
                >
                  Order Direct
                </Link>
                <a
                  href="#restaurant-menu"
                  className="px-6 py-2.5 rounded bg-transparent hover:bg-white/10 text-[#C9A96E] border border-[#B08D57]/60 text-xs sm:text-sm font-medium transition-all"
                >
                  Explore Delicacies
                </a>
              </div>
            </div>
          </div>

          {/* ── RESTAURANT MENU ITEMS ── */}
          <div id="restaurant-menu" className="pt-4 space-y-10 scroll-mt-24">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[#B08D57] text-xs font-bold tracking-[0.2em] uppercase">Culinary Menu</span>
              <h3 className="font-heritage text-2xl sm:text-3xl font-bold text-[#670E10] mt-1 mb-1">
                Rajasthani Restaurant Selection
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6F62]">
                Traditional thalis, gravies, and heritage specialties
              </p>
            </div>

            {restaurantCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h4 className="font-heritage text-lg sm:text-xl font-bold text-[#670E10] pb-2 border-b border-[#D4CBBB] flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs font-normal text-[#8A7D6E]">
                    {category.items?.length || 0} items
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-[#D4CBBB]/70 shadow-2xs hover:border-[#B08D57] transition-all flex justify-between items-start"
                    >
                      <div className="pr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              (item.dietary_labels || []).includes('veg') ? 'bg-emerald-600' : 'bg-red-700'
                            }`}
                          />
                          <h5 className="font-semibold text-sm text-[#670E10]">{item.name}</h5>
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
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DIVIDER BETWEEN RESTAURANT & CAFE
        ═══════════════════════════════════════════════════════════════ */}
        <div className="py-6">
          <HeritageDivider className="opacity-45" color="#B08D57" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: JHAROKHA CAFÉ & LOUNGE
        ═══════════════════════════════════════════════════════════════ */}
        <section id="cafe" className="space-y-12 scroll-mt-24">
          {/* ── CAFÉ HERO BANNER ── */}
          <div className="relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden shadow-xl border border-[#D4CBBB]">
            <Image
              src="/images/food/cafe.jpg"
              alt="Jharokha Café & Lounge at Rajmahal Heritage Hotel"
              fill
              className="object-cover"
            />

            {/* Paisley Buta Ornaments in Corners */}
            <div className="absolute top-2 left-2 pointer-events-none hidden sm:block">
              <PaisleyButaOrnament size="180px" opacity={0.15} color="#C9A96E" />
            </div>
            <div className="absolute top-2 right-2 pointer-events-none hidden sm:block scale-x-[-1]">
              <PaisleyButaOrnament size="180px" opacity={0.15} color="#C9A96E" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center p-6 sm:p-12 text-center">
              <div className="max-w-2xl">
                <span className="text-[#D8AA67] text-xs font-bold tracking-[0.28em] uppercase mb-2 block">
                  Artisan Brews &amp; Light Delicacies
                </span>
                <h2 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight drop-shadow-lg">
                  Jharokha Café &amp; Lounge
                </h2>
                <p className="text-base sm:text-xl font-medium text-[#C9A96E] mb-3 drop-shadow">
                  Relax, Sip, Soak in the Heritage.
                </p>
                <p className="text-xs sm:text-sm text-[#E0DCD3] max-w-xl mx-auto font-light leading-relaxed mb-4 drop-shadow">
                  A cozy courtyard space to enjoy freshly brewed single-origin coffees, royal saffron chai, delicate pastries, and a relaxed ambience overlooking palace gardens.
                </p>
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#C9A96E] bg-black/40 px-3.5 py-1.5 rounded-full border border-[#B08D57]/40 mb-6 backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Open Daily: 8:00 AM – 11:00 PM</span>
                </div>

                <div>
                  <a
                    href="#cafe-menu"
                    className="px-6 py-2.5 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#4A0A0C] font-semibold text-sm tracking-wide transition-all shadow"
                  >
                    View Café Menu
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3 CAFÉ FEATURES ROW ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto text-center">
            {cafeFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center p-5 rounded-xl bg-white border border-[#D4CBBB]/70 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="w-13 h-13 rounded-full bg-[#FAF8F3] border border-[#B08D57]/50 flex items-center justify-center mb-2.5">
                    <Icon className="w-6 h-6 text-[#B08D57]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#670E10]">
                    {feat.label}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* ── CAFÉ MENU ITEMS ── */}
          <div id="cafe-menu" className="pt-4 space-y-10 scroll-mt-24">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[#B08D57] text-xs font-bold tracking-[0.2em] uppercase">Café &amp; Bakery</span>
              <h3 className="font-heritage text-2xl sm:text-3xl font-bold text-[#670E10] mt-1 mb-1">
                Artisan Brews &amp; Pastries
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6F62]">
                Single-origin coffees, royal saffron chai, and handcrafted viennoiserie
              </p>
            </div>

            {cafeCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h4 className="font-heritage text-lg sm:text-xl font-bold text-[#670E10] pb-2 border-b border-[#D4CBBB] flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs font-normal text-[#8A7D6E]">
                    {category.items?.length || 0} items
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-[#D4CBBB]/70 shadow-2xs hover:border-[#B08D57] transition-all flex justify-between items-start"
                    >
                      <div className="pr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              (item.dietary_labels || []).includes('veg') ? 'bg-emerald-600' : 'bg-red-700'
                            }`}
                          />
                          <h5 className="font-semibold text-sm text-[#670E10]">{item.name}</h5>
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
        </section>
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center text-[#670E10] font-heritage text-lg">
          Loading royal culinary experiences...
        </div>
      }
    >
      <RestaurantAndCafeContent />
    </Suspense>
  );
}
