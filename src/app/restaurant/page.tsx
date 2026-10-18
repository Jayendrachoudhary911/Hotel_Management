import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import {
  HeritageDivider,
  LataJaaliRunner,
  RoyalProcessionBanner,
} from '@/components/ui/heritage-ornaments';
import {
  IconTraditionalCuisine,
  IconIndoorOutdoor,
  IconLiveFolkMusic,
  IconSpecialThali,
} from '@/components/ui/heritage-art';
import { ArrowRight, QrCode } from 'lucide-react';

export const metadata = {
  title: 'Rajasthani Restaurant | Authentic Flavors, Royal Ambience | Rajmahal Heritage Hotel',
  description:
    'Experience the true taste of Rajasthan with traditional recipes, fresh local ingredients and a heritage dining atmosphere. Dal Baati Churma, Laal Maas, Gatte ki Sabzi, Ker Sangri.',
};

export default function RestaurantPage() {
  const outlet = dataRepository.getOutletByType('restaurant')!;
  const categories = dataRepository.getMenuCategories(outlet.id);

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

  const features = [
    { label: 'Traditional Rajasthani Cuisine', icon: IconTraditionalCuisine },
    { label: 'Indoor & Outdoor Seating', icon: IconIndoorOutdoor },
    { label: 'Live Folk Music (Weekends)', icon: IconLiveFolkMusic },
    { label: 'Special Thali Experiences', icon: IconSpecialThali },
  ];

  return (
    <div className="relative bg-[#F5F1E8] min-h-screen py-10 sm:py-16 text-[#241F1A] overflow-hidden">
      {/* ── BESPOKE VERTICAL LATA JAALI BORDERS (Flanking Margins) ── */}
      <LataJaaliRunner side="left" opacity={0.35} color="#B08D57" className="hidden lg:block" />
      <LataJaaliRunner side="right" opacity={0.35} color="#B08D57" className="hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── 1. HERO BANNER (Matching image) ── */}
        <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-[#D4CBBB]">
          <Image
            src="/images/food/restaurant.jpg"
            alt="Rajasthani Restaurant at Rajmahal Heritage Hotel"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2723]/95 via-[#0F2723]/65 to-transparent flex items-center justify-center p-6 sm:p-12 text-center">
            <div className="max-w-3xl">
              <h1 className="font-heritage text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FAF8F3] mb-3 leading-tight">
                Rajasthani Restaurant
              </h1>
              <p className="text-base sm:text-xl font-medium text-[#C9A96E] mb-4">
                Authentic Flavors, Royal Ambience
              </p>
              <p className="text-xs sm:text-base text-[#E0DCD3] max-w-2xl mx-auto font-light leading-relaxed mb-8">
                Experience the true taste of Rajasthan with traditional recipes, fresh local ingredients and a heritage dining atmosphere.
              </p>

              {/* Action Buttons matching image */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#menu"
                  className="px-6 py-3 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#173B35] font-medium text-sm tracking-wide transition-all shadow"
                >
                  View Menu
                </a>
                <Link
                  href="/#contact"
                  className="px-6 py-3 rounded-md bg-[#173B35] border border-[#B08D57]/60 hover:bg-[#22524A] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow"
                >
                  Reserve a Table
                </Link>
                <Link
                  href="/qr/table-t01"
                  className="px-4 py-3 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F3] text-sm font-medium backdrop-blur-xs flex items-center space-x-1.5 transition-all"
                >
                  <QrCode className="w-4 h-4 text-[#C9A96E]" />
                  <span>Dine-In QR</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. FOUR FEATURES ROW WITH ICONS (Matching image) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center py-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-4 rounded-xl bg-white border border-[#D4CBBB]/70 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#B08D57]/50 flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-[#B08D57]" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#173B35] max-w-[160px] leading-snug">
                  {feat.label}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Symmetrical Jaali Divider */}
        <HeritageDivider className="opacity-70" color="#B08D57" />

        {/* ── 3. OUR SIGNATURE DISHES (Matching image with circular food photos) ── */}
        <div className="space-y-8 text-center">
          <div>
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#173B35] mb-2">
              Our Signature Dishes
            </h2>
            <p className="text-sm text-[#6E6356] font-light">
              Centuries-old royal recipes crafted by our khansama masters
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {signatureDishes.map((dish, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#D4CBBB]/70 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center group"
              >
                {/* Circular image matching image */}
                <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-[#B08D57]/40 shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-heritage text-lg font-bold text-[#173B35] mb-1.5 group-hover:text-[#B08D57] transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-[#7A6F62] leading-relaxed font-light">
                  {dish.desc}
                </p>
              </div>
            ))}
          </div>

          <div>
            <a
              href="#menu"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-[#173B35] hover:bg-[#22524A] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </a>
          </div>
        </div>

        {/* ── 4. DINE LIKE ROYALTY (Matching Reference Image Screen 4) ── */}
        <div className="relative bg-[#173B35] text-[#FAF8F3] rounded-2xl overflow-hidden p-8 sm:p-12 border border-[#B08D57]/50 shadow-2xl text-center">
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <span className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase block">
              ✦ Shahi Sawari & Royal Feasts ✦
            </span>
            <h3 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF8F3] tracking-wide">
              Dine Like Royalty
            </h3>
            <p className="text-[#D8D2C4] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              A culinary journey through the rich heritage of Rajasthan, served in a regal setting with recipes passed down through royal palace kitchens.
            </p>

            {/* Bespoke Royal Rajput Procession Artwork: Elephant with Howdah, Camel, Chhatri */}
            <div className="pt-2 pb-2">
              <RoyalProcessionBanner color="#C9A96E" opacity={0.95} />
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/order/pickup"
                className="px-6 py-2.5 rounded bg-[#C59B63] hover:bg-[#B88E55] text-[#173B35] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md"
              >
                Order Direct
              </Link>
              <a
                href="#menu"
                className="px-6 py-2.5 rounded bg-transparent hover:bg-white/10 text-[#C9A96E] border border-[#B08D57]/60 text-xs sm:text-sm font-medium transition-all"
              >
                Explore Delicacies
              </a>
            </div>
          </div>
        </div>

        {/* Symmetrical Jaali Divider */}
        <HeritageDivider className="opacity-70" color="#B08D57" />

        {/* ── 5. FULL CATEGORIZED ROYAL MENU ── */}
        <div id="menu" className="pt-4 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#173B35] mb-2">
              Royal Dining Selection
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F62]">
              Select any delicacy for dine-in, table reservation, or direct delivery
            </p>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="font-heritage text-xl font-bold text-[#173B35] pb-2 border-b border-[#D4CBBB]">
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
                        <h4 className="font-semibold text-sm text-[#173B35]">{item.name}</h4>
                      </div>
                      <p className="text-xs text-[#7A6F62] leading-relaxed mb-2 font-light">
                        {item.description}
                      </p>
                      <span className="font-heritage font-bold text-sm text-[#173B35]">
                        {formatMoney(item.price_minor)}
                      </span>
                    </div>

                    <Link
                      href="/order/pickup"
                      className="px-3 py-1.5 rounded bg-[#FAF8F3] hover:bg-[#173B35] hover:text-[#FAF8F3] border border-[#D4CBBB] text-xs font-medium text-[#173B35] transition-all shrink-0"
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
