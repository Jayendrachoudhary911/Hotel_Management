import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingBar } from '@/components/home/booking-bar';
import { roomsService } from '@/lib/services/rooms-service';
import { formatMoney } from '@/lib/utils/money';
import { ArrowRight, BedDouble, Users } from 'lucide-react';
import { InstaLookbook } from '@/components/home/insta-lookbook';
import { EventMemories } from '@/components/home/event-memories';
import { Testimonials } from '@/components/home/testimonials';
import { Promotions } from '@/components/home/promotions';
import { RestaurantReservationCTA } from '@/components/restaurant/restaurant-reservation-cta';

export const metadata = {
  title: 'Rajmahal Heritage Hotel | A Royal Stay Rooted in Rajasthan',
  description:
    'Experience the royal heritage of Rajasthan at Rajmahal Heritage Hotel. Six authentic heritage suites, traditional Rajasthani restaurant, café & lounge, and grand party hall.',
};

type HeritageIconName = 'arch' | 'dining' | 'cafe' | 'pavilion' | 'wedding' | 'menu' | 'booking' | 'calendar';

function HeritageQuickIcon({ name }: { name: HeritageIconName }) {
  const common = {
    className:
      'w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform duration-300 group-hover:scale-110 text-[#d8aa67]',
    viewBox: '0 0 72 72',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.35,
    'aria-hidden': true,
  };

  if (name === 'arch') {
    return (
      <svg {...common}>
        <path d="M11 62V29L36 8l25 21v33M16 62V31l20-17 20 17v31M22 62V34l14-13 14 13v28" />
        <path d="M28 62V43c0-6 3.3-10.3 8-13 4.7 2.7 8 7 8 13v19M8 62h56M17 29 36 12l19 17" />
        <path d="M24 52h24M31 52v-7h10v7M14 58h8M50 58h8" />
      </svg>
    );
  }

  if (name === 'dining') {
    return (
      <svg {...common}>
        <ellipse cx="36" cy="49" rx="27" ry="10" />
        <ellipse cx="36" cy="46" rx="21" ry="7" />
        <path d="M20 43v-8h12v9M22 35c0-4 8-4 8 0M40 44v-9h12v8M42 35c0-4 8-4 8 0" />
        <circle cx="36" cy="42" r="5" />
        <path d="M9 58h54M14 54c6 5 38 5 44 0M13 24v14M9 24v8c0 4 8 4 8 0v-8M58 24v14M63 24v14" />
      </svg>
    );
  }

  if (name === 'menu') {
    return (
      <svg {...common}>
        <ellipse cx="36" cy="52" rx="26" ry="8" />
        <path d="M12 52h48" />
        <path d="M16 50c0-14 9-24 20-24s20 10 20 24" />
        <path d="M22 47c2-9 7-16 14-16s12 7 14 16" strokeDasharray="3 3" />
        <circle cx="36" cy="22" r="4" />
        <path d="M36 18v-5M33 13h6" />
        <path d="M26 18c-2-3 2-4 0-7M46 18c2-3-2-4 0-7" strokeWidth="1.1" />
        <path d="M10 58h52" />
      </svg>
    );
  }

  if (name === 'booking' || name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="14" y="18" width="44" height="42" rx="5" />
        <path d="M14 28h44M24 12v10M48 12v10" />
        <path d="m36 34 2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8 2.5-5Z" />
        <path d="M20 54h32M10 64h52" />
      </svg>
    );
  }

  if (name === 'cafe') {
    return (
      <svg {...common}>
        <path d="M17 30h34v12c0 10-6.5 16-17 16S17 52 17 42V30Z" />
        <path d="M51 35h5c8 0 8 12 0 12h-6M12 62h48M18 57h32" />
        <path d="M27 24c-4-5 4-7 0-12M36 24c-4-5 4-7 0-12M45 24c-4-5 4-7 0-12" />
      </svg>
    );
  }

  if (name === 'pavilion') {
    return (
      <svg {...common}>
        <path d="M8 62h56M13 58h46M16 58V31h40v27M11 31h50L36 9 11 31Z" />
        <path d="M20 31 36 14l16 17M25 31 36 19l11 12M36 9v22" />
        <path d="M22 58V39l7 7 7-8 7 8 7-7v19M16 35h40" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M36 61c-16 0-25-10-25-22 0-9 7-16 16-16 5 0 9 2 12 6 3-4 7-6 12-6 8 0 14 6 14 14 0 13-13 24-29 24Z" />
      <path d="M29 45c-6-1-10-5-10-10 0-4 3-7 7-7 5 0 8 5 10 10M43 45c6-1 10-5 10-10 0-4-3-7-7-7-5 0-8 5-10 10" />
      <circle cx="36" cy="43" r="10" />
      <path d="m36 33 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6ZM32 18l4-7 4 7-4 5-4-5Z" />
      <path d="M19 53c-4 0-8-2-11-5M53 53c4 0 8-2 11-5" />
    </svg>
  );
}

async function HomeContent() {
  const roomTypes = await roomsService.getRoomTypes();

  const quickLinks: { label: string; href: string; icon: HeritageIconName }[] = [
    { label: 'Heritage Rooms', href: '/rooms', icon: 'arch' },
    { label: 'Hotel & Celebrations', href: '/hotel', icon: 'pavilion' },
    { label: 'Restaurant & Café', href: '/restaurant', icon: 'dining' },
    { label: 'Palace Menu', href: '/menu', icon: 'menu' },
    { label: 'Book Your Stay', href: '/book', icon: 'booking' },
  ];

  return (
    <div className="flex flex-col w-full text-[#151c1a]" style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}>
      {/* ── 1. HERO SECTION (FIGMA SPEC) ── */}
      <section className="relative z-20 min-h-[620px] lg:min-h-[700px] flex flex-col justify-between -mt-[72px] sm:-mt-[78px]">
        {/* Background Palace Image with Corner Radius & Framing Inset */}
        <div className="absolute inset-x-2.5 sm:inset-x-4 lg:inset-x-6 top-2 sm:top-3.5 bottom-0 z-0 overflow-hidden rounded-[24px] sm:rounded-[36px] lg:rounded-[42px] border border-[#D8AA67]/40 shadow-[0_24px_60px_-10px_rgba(20,8,10,0.22)]">
          <Image
            src="/images/palace-interior.jpg"
            alt="Rajmahal Heritage Hotel Grand Palace Interior"
            fill
            priority
            className="object-cover object-center scale-105"
            style={{ filter: 'saturate(1.08) sepia(0.08)' }}
          />
          {/* Hero Warmth overlay */}
          <div className="hero-warmth pointer-events-none" />
          {/* Hero Shade overlay */}
          <div className="hero-shade pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* Hero Content Left Aligned */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-36 sm:pt-44 md:pt-48 pb-16 sm:pb-20 w-full">
          <div className="max-w-xl text-left">
            <span
              className="text-[#eee1cc] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase block mb-3 drop-shadow"
              style={{ letterSpacing: '0.22em' }}
            >
              A Royal Stay
            </span>
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#fff8eb] mb-5 leading-[0.92] drop-shadow-2xl"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              Rooted in
              <br />
              Rajasthan
            </h1>
            <p className="text-sm sm:text-base text-[#fff8eb]/90 mb-4 sm:mb-6 font-normal leading-relaxed max-w-md drop-shadow">
              Heritage rooms, authentic cuisine and unforgettable experiences in the heart of Udaipur.
            </p>
          </div>
        </div>

        {/* Overlapping Floating Booking Widget (High z-index to sit cleanly above sections) */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mb-10 sm:-mb-12">
          <BookingBar />
        </div>
      </section>

      {/* ── 2. QUICK LINKS WITH HERITAGE ORNAMENTS ── */}
      <section className="relative z-10 pt-20 sm:pt-24 pb-16 overflow-hidden border-b border-[#dfcdb1]/60" style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}>
        {/* Left and Right Floral Artworks */}
        <img
          className="floral-artwork left opacity-25"
          src="/images/ornaments/floral-left.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="floral-artwork right opacity-25"
          src="/images/ornaments/floral-right.png"
          alt=""
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-4 text-center">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col items-center justify-start p-3 rounded-xl hover:bg-[#fffaf1] transition-all cursor-pointer relative"
              >
                <div className="mb-3">
                  <HeritageQuickIcon name={item.icon} />
                </div>
                <span
                  className="text-base sm:text-lg font-semibold text-[#4f0809] tracking-normal group-hover:text-[#d8aa67] transition-colors"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Border and Lotus Artwork at section bottom */}
        <img
          className="border-artwork opacity-20"
          src="/images/ornaments/border-line.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="lotus-artwork opacity-25"
          src="/images/ornaments/center-lotus.png"
          alt=""
          aria-hidden="true"
        />
      </section>

      {/* ── 3. EXPERIENCE THE ROYAL HERITAGE OF RAJASTHAN ── */}
      <section className="relative py-20 lg:py-24 overflow-hidden" style={{ backgroundColor: 'var(--heritage-ivory, #fff7e8)' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Framed Bedroom with Frame Softener */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden shadow-2xl border border-[#d8aa67]/40">
                <img
                  src="/images/heritage-reference/framed-bedroom.png"
                  alt="Warmly lit Rajputana bedroom overlooking lake"
                  className="w-full h-auto object-cover"
                />
                <img
                  src="/images/heritage-reference/frame-softener.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40"
                />
              </div>
            </div>

            {/* Right: Heritage Story Copy */}
            <div className="lg:col-span-7 lg:pl-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8aa67] flex items-center gap-3 mb-3">
                Authentic Rajputana Grandeur
                <span className="w-10 h-[1px] bg-[#d8aa67]/70" />
              </span>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[0.95] text-[#781c1c]"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                }}
              >
                Experience the Royal <br />
                Heritage of Rajasthan
              </h2>
              <p className="text-sm sm:text-base text-[#4f0809] mb-8 leading-relaxed font-normal max-w-xl">
                A blend of traditional Rajasthani architecture and modern luxury, designed for a truly memorable stay. From handcrafted interiors to breathtaking views, every moment at Rajmahal reflects the rich heritage and timeless charm of Udaipur.
              </p>
              <Link
                href="/rooms"
                className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-[6px] text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                style={{
                  backgroundColor: 'var(--antique-gold, #d8aa67)',
                  color: 'var(--forest-ink, #380506)',
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: '16px',
                }}
              >
                <span>Discover Our Heritage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Palace Line Art in background */}
        <img
          className="heritage-palace-art opacity-25"
          src="/images/heritage-reference/palace-art.png"
          alt=""
          aria-hidden="true"
        />

        {/* Bottom Decorative Divider */}
        <img
          className="heritage-bottom-divider opacity-60"
          src="/images/heritage-reference/bottom-divider.png"
          alt=""
          aria-hidden="true"
        />
      </section>

      {/* ── 4. OUR HERITAGE ROOMS (DYNAMIC DATA FROM DATABASE) ── */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}>
        {/* Left and Right Palace Trees Art */}
        <img
          className="room-side-art left opacity-15"
          src="/images/room-art/left-palace-tree.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="room-side-art right opacity-15"
          src="/images/room-art/right-palace-tree.png"
          alt=""
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8aa67] block mb-2">
              Royal Comforts, Timeless Stories
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-3 text-[#781c1c]"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              Our Heritage Rooms
            </h2>
            <p className="text-sm sm:text-base text-[#5a4334]">
              Six unique Rajasthani experiences, each with its own story, architecture and charm.
            </p>
          </div>

          {/* Dynamic Rooms Grid with Figma Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {roomTypes.map((room) => {
              const roomImage = room.photos?.[0] || '/images/rooms/lakeview-palace-suite.png';
              return (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="group flex flex-col justify-between rounded-[10px] overflow-hidden bg-[#fffaf1] border border-[#c99554]/60 shadow-[0_8px_20px_rgba(67,42,19,0.07)] hover:border-[#d8aa67] hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(67,42,19,0.18)] transition-all duration-300 ease-out cursor-pointer"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={roomImage}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-2xl font-bold mb-2 text-[#781c1c] group-hover:text-[#d8aa67] transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                        }}
                      >
                        {room.name}
                      </h3>

                      {/* Amenities Row */}
                      <div className="flex items-center space-x-4 text-xs text-[#857866] mb-3">
                        <span className="flex items-center">
                          <BedDouble className="w-4 h-4 text-[#d8aa67] mr-1.5" />
                          <span>King Bed</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 text-[#d8aa67] mr-1.5" />
                          <span>{room.capacity} Guests</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#4f0809] line-clamp-2 mb-4 leading-relaxed font-light">
                        {room.description || 'Experience authentic royal heritage comforts with handcrafted furnishings and scenic views.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#dfcdb1]/60 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-[#857866]">Starting from</span>
                        <span
                          className="text-xl font-bold text-[#781c1c]"
                          style={{
                            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                          }}
                        >
                          {formatMoney(room.base_rate_minor)}{' '}
                          <span className="text-xs font-normal text-[#5a4334]">/ night</span>
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200 shadow group-hover:shadow-md group-hover:bg-[#680b0c] group-hover:-translate-y-0.5 active:translate-y-0"
                          style={{
                            backgroundColor: 'var(--forest-deep, #4f0809)',
                            color: 'var(--ivory, #fff8eb)',
                          }}
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5 stroke-[2] group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. DINING SECTION (FIGMA SPEC) ── */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: 'var(--heritage-ivory, #fff7e8)' }}>
        <img
          className="dining-side-art left opacity-20"
          src="/images/dining/edge-left.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="dining-side-art right opacity-20"
          src="/images/dining/edge-right.png"
          alt=""
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Rajasthani Restaurant */}
            <article
              className="group flex flex-col rounded-[12px] overflow-hidden bg-[#fffaf1] border border-[#c99554]/60 shadow-[0_8px_22px_rgba(67,42,19,0.08)] hover:border-[#d8aa67] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(67,42,19,0.18)] transition-all duration-300 ease-out"
            >
              <div className="relative h-64 sm:h-72 w-full p-3.5 pb-0">
                <div className="w-full h-full overflow-hidden rounded-[10px]">
                  <img
                    src="/images/dining/rajasthani-restaurant.png"
                    alt="Rajasthani restaurant dining room overlooking the lake"
                    className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#d8aa67] block mb-1">
                    Authentic Flavors
                  </span>
                  <h3
                    className="text-3xl font-bold mb-3 text-[#781c1c] group-hover:text-[#d8aa67] transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    Rajasthani Restaurant
                  </h3>
                  <p className="text-sm text-[#4f0809] leading-relaxed mb-6">
                    Experience the true taste of Rajasthan with traditional recipes, fresh local ingredients and a heritage dining atmosphere.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    href="/restaurant"
                    className="flex items-center justify-center space-x-2 h-11 rounded-[6px] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                    style={{
                      backgroundColor: 'var(--antique-gold, #d8aa67)',
                      color: 'var(--forest-ink, #380506)',
                    }}
                  >
                    <span>View Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <RestaurantReservationCTA
                    venue="restaurant"
                    variant="card"
                    label="Reserve a Table"
                  />
                </div>
              </div>
            </article>

            {/* Feature 2: Café & Lounge */}
            <article
              className="group flex flex-col rounded-[12px] overflow-hidden bg-[#fffaf1] border border-[#c99554]/60 shadow-[0_8px_22px_rgba(67,42,19,0.08)] hover:border-[#d8aa67] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(67,42,19,0.18)] transition-all duration-300 ease-out"
            >
              <div className="relative h-64 sm:h-72 w-full p-3.5 pb-0">
                <div className="w-full h-full overflow-hidden rounded-[10px]">
                  <img
                    src="/images/dining/cafe-lounge.png"
                    alt="Heritage café and lounge with lake views"
                    className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#d8aa67] block mb-1">
                    Relax, Sip & Unwind
                  </span>
                  <h3
                    className="text-3xl font-bold mb-3 text-[#781c1c] group-hover:text-[#d8aa67] transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    Café & Lounge
                  </h3>
                  <p className="text-sm text-[#4f0809] leading-relaxed mb-6">
                    A cozy space to enjoy freshly brewed coffee, Rajasthani snacks and a relaxed ambience with beautiful views.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    href="/restaurant#cafe"
                    className="flex items-center justify-center space-x-2 h-11 rounded-[6px] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                    style={{
                      backgroundColor: 'var(--antique-gold, #d8aa67)',
                      color: 'var(--forest-ink, #380506)',
                    }}
                  >
                    <span>View Café Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/restaurant"
                    className="flex items-center justify-center h-11 rounded-[6px] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:bg-[#680b0c] hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      backgroundColor: 'var(--forest-deep, #4f0809)',
                      color: 'var(--ivory, #fff8eb)',
                    }}
                  >
                    <span>Order Now</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 6. EVENT MEMORIES GALLERY (FIGMA EXACT RECREATION) ── */}
      <EventMemories />

      {/* ── 6.5 PROMOTIONS — CURRENT OFFERS ── */}
      <Promotions />

      {/* ── 7. INSTA LOOKBOOK & REELS SECTION ── */}
      <InstaLookbook />

      {/* ── 8. GUEST EXPERIENCES — WHAT OUR GUESTS SAY ── */}
      <Testimonials />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf5e9]" />}>
      <HomeContent />
    </Suspense>
  );
}
