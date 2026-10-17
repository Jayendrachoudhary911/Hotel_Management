import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingBar } from '@/components/home/booking-bar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { dataRepository } from '@/lib/data/repository';
import {
  BedDouble,
  Utensils,
  Coffee,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Users,
  QrCode,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export const metadata = {
  title: 'Aura Grand Palace & Heritage Resort | Udaipur, Rajasthan',
  description:
    'Experience timeless Rajputana grandeur at Aura Grand. Luxury heritage suites, Awadhi royal dining, artisan courtyard cafe, and majestic wedding ballroom in Udaipur.',
};

export default function HomePage() {
  const property = dataRepository.getProperty();
  const roomTypes = dataRepository.getRoomTypes();
  const outlets = dataRepository.getOutlets();
  const hall = dataRepository.getHall();

  return (
    <div className="flex flex-col w-full bg-[#F5F1E8]">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Warm Rajasthani Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_resort.jpg"
            alt="Aura Grand Palatial Resort Udaipur"
            fill
            priority
            className="object-cover object-center scale-105 transform animate-in fade-in duration-1000"
          />
          {/* Deep Royal Maroon & Espresso Tinted Gradient for high readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241F1A] via-[#241F1A]/70 to-[#670E10]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#241F1A]/30 to-[#241F1A]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FAF8F3]/15 border border-[#B08D57]/50 backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#FAF8F3]">
              Udaipur&apos;s Crown Royal Heritage Sanctuary
            </span>
          </div>

          <h1 className="font-heritage text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF8F3] mb-6 leading-[1.15] drop-shadow-md">
            Where Rajput Grandeur <br />
            <span className="text-[#C9A96E]">Meets Timeless Luxury</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#EBE5D6] mb-10 leading-relaxed font-normal">
            Nestled on the serene banks of Udaipur, Aura Grand invites you to bespoke palatial chambers,
            slow-fired Rajputana gastronomy, and unforgettable royal celebrations under starlit skies.
          </p>

          {/* Quick Availability Bar */}
          <BookingBar />

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#EBE5D6] pt-2">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#C9A96E] mr-1.5" /> Best Direct Tariff Guaranteed
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 text-[#C9A96E] mr-1.5" /> 24/7 Royal Khansama & Concierge
            </span>
            <span className="flex items-center">
              <Award className="w-4 h-4 text-[#C9A96E] mr-1.5" /> Authentic Heritage Architecture
            </span>
          </div>
        </div>
      </section>

      {/* ── ESTATE HIGHLIGHTS REALMS ── */}
      <section className="py-20 bg-[#FAF8F3] border-t border-b border-[#D4CBBB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="maroon" className="mb-3">
              The Heritage Experience
            </Badge>
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#241F1A] tracking-tight">
              Four Opulent Realms of Rajputana Hospitality
            </h2>
            <div className="w-20 h-0.5 bg-[#B08D57] mx-auto mt-4 mb-3" />
            <p className="text-[#6B6155] text-sm sm:text-base">
              From hand-carved sandstone suites to royal dining alcoves and starlit wedding lawns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Suites */}
            <div className="group heritage-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#670E10]">
              <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#670E10] group-hover:text-white transition-all text-[#670E10]">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2">Heritage Suites</h3>
              <p className="text-xs text-[#6B6155] mb-5 leading-relaxed">
                Jharokha chambers, Meenakari ceilings, and Sheesh Mahal presidential suites with private plunge pools.
              </p>
              <Link href="/rooms" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] group-hover:translate-x-1 transition-transform">
                Explore Suites <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 2: Restaurant */}
            <div className="group heritage-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#670E10]">
              <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#670E10] group-hover:text-white transition-all text-[#670E10]">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2">Saffron & Spice</h3>
              <p className="text-xs text-[#6B6155] mb-5 leading-relaxed">
                Royal Awadhi dum curries, clay tandoor kebabs, and Rajasthani thalis served on fine brassware.
              </p>
              <Link href="/restaurant" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] group-hover:translate-x-1 transition-transform">
                Royal Menu <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 3: Cafe */}
            <div className="group heritage-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#670E10]">
              <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#670E10] group-hover:text-white transition-all text-[#670E10]">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2">The Courtyard Cafe</h3>
              <p className="text-xs text-[#6B6155] mb-5 leading-relaxed">
                Single-estate artisanal coffees, saffron masala chai, fresh bakery, and serene open-air courtyard seating.
              </p>
              <Link href="/cafe" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] group-hover:translate-x-1 transition-transform">
                Cafe Menu <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 4: Hall */}
            <div className="group heritage-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#670E10]">
              <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#670E10] group-hover:text-white transition-all text-[#670E10]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2">The Crystal Ballroom</h3>
              <p className="text-xs text-[#6B6155] mb-5 leading-relaxed">
                Grand 350-capacity pillarless banquet hall with Bohemian chandeliers and starlit lawn for destination weddings.
              </p>
              <Link href="/hall" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] group-hover:translate-x-1 transition-transform">
                Enquire Venue <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED HERITAGE SUITES (WEB-01, WEB-04) ── */}
      <section className="py-24 bg-[#F5F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <Badge variant="maroon" className="mb-2">Royal Accommodations</Badge>
              <h2 className="font-heritage text-3xl sm:text-5xl font-bold text-[#241F1A]">
                Bespoke Heritage Chambers & Suites
              </h2>
              <p className="text-[#6B6155] text-sm sm:text-base mt-2">
                Handcrafted interiors blending antique Rajput charm with modern royal comfort.
              </p>
            </div>
            <Link href="/rooms" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                View All 6 Suites &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.slice(0, 6).map((room) => (
              <Card key={room.id} className="p-0 overflow-hidden group border-[#D4CBBB] shadow-md bg-white">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={room.photos[0] || '/images/hero_resort.jpg'}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-md bg-[#670E10] text-white text-xs font-bold shadow-md">
                      {formatMoney(room.base_rate_minor)} <span className="font-normal opacity-80 text-[10px]">/ night</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-[#8F7245] font-semibold mb-2">
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Up to {room.capacity} Guests
                    </span>
                    <span className="flex items-center">
                      <BedDouble className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Royal King Bed
                    </span>
                  </div>

                  <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2 group-hover:text-[#670E10] transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#6B6155] line-clamp-2 mb-4 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F3] border border-[#D4CBBB] text-[#3D352C] font-medium">
                        {a}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F3] text-[#8F7245] font-semibold">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#D4CBBB] flex items-center justify-between">
                    <Link href={`/rooms`} className="text-xs font-bold text-[#670E10] hover:underline">
                      Chamber Details
                    </Link>
                    <Link href={`/book?roomTypeId=${room.id}`}>
                      <Button size="sm">Reserve Chamber</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── GASTRONOMY & QR DINING BANNER ── */}
      <section className="py-20 relative overflow-hidden bg-[#241F1A] text-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="gold">Royal Gastronomy & Instant QR Ordering</Badge>
              <h2 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] leading-tight">
                Dine Amidst Palatial Arches or <br />
                <span className="text-[#C9A96E]">Order Direct to Your Chamber</span>
              </h2>
              <p className="text-[#D4CBBB] text-sm sm:text-base leading-relaxed">
                Scan the brass table QR token at your dining alcove for instant digital ordering sent straight to our Royal Khansama (Head Chef&apos;s KDS). Or order gourmet doorstep delivery across Udaipur.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/order/pickup">
                  <Button size="lg" variant="primary">
                    Order Delivery / Pickup
                  </Button>
                </Link>
                <Link href="/restaurant">
                  <Button variant="secondary" size="lg">
                    Explore Restaurant
                  </Button>
                </Link>
                <Link href="/qr/table-01-token">
                  <Button variant="gold" size="lg" className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 mr-2" />
                    <span>Try QR Table Demo</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden border-2 border-[#B08D57]/40 shadow-2xl">
              <Image
                src="/images/food/restaurant.jpg"
                alt="Fine Dining at Saffron & Spice"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241F1A]/95 via-transparent to-transparent flex items-end p-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E]">Featured Culinary Realm</span>
                  <h4 className="font-heritage text-2xl font-bold text-white">Saffron & Spice Fine Dining</h4>
                  <p className="text-xs text-[#D4CBBB] mt-1">Operating Hours: 11:00 AM – 11:00 PM Daily • Table Reservations Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPERTY DETAILS & OPERATING HOURS (WEB-02) ── */}
      <section className="py-20 bg-[#FAF8F3] border-t border-[#D4CBBB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="maroon" className="mb-2">Property Information</Badge>
            <h2 className="font-heritage text-3xl font-bold text-[#241F1A]">
              Palace Enclave & Concierge Services
            </h2>
            <div className="w-16 h-0.5 bg-[#B08D57] mx-auto mt-3 mb-2" />
            <p className="text-sm text-[#6B6155]">
              Everything you need to know for your seamless royal sojourn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1: Location & Contact */}
            <div className="heritage-card rounded-2xl p-6 bg-white border border-[#D4CBBB]">
              <div className="w-10 h-10 rounded-lg bg-[#670E10]/10 flex items-center justify-center text-[#670E10] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#241F1A] mb-3">Address & Sanctuary</h3>
              <p className="text-xs text-[#6B6155] leading-relaxed mb-4">
                {property.address}
              </p>
              <div className="space-y-1.5 text-xs text-[#241F1A]">
                <div className="flex items-center">
                  <Phone className="w-3.5 h-3.5 text-[#670E10] mr-2" />
                  <span className="font-semibold">{property.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3.5 h-3.5 text-[#670E10] mr-2" />
                  <span>{property.email}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Operating Hours */}
            <div className="heritage-card rounded-2xl p-6 bg-white border border-[#D4CBBB]">
              <div className="w-10 h-10 rounded-lg bg-[#670E10]/10 flex items-center justify-center text-[#670E10] mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#241F1A] mb-3">Operating Hours</h3>
              <ul className="space-y-2 text-xs text-[#6B6155]">
                <li className="flex justify-between border-b border-[#D4CBBB]/40 pb-1">
                  <span>Front Desk & Concierge:</span>
                  <span className="font-semibold text-[#241F1A]">24 Hours / 7 Days</span>
                </li>
                <li className="flex justify-between border-b border-[#D4CBBB]/40 pb-1">
                  <span>Saffron & Spice Dining:</span>
                  <span className="font-semibold text-[#241F1A]">11:00 AM – 11:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-[#D4CBBB]/40 pb-1">
                  <span>Courtyard Artisan Cafe:</span>
                  <span className="font-semibold text-[#241F1A]">07:30 AM – 10:00 PM</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>In-Room Royal Dining:</span>
                  <span className="font-semibold text-[#241F1A]">24 Hours</span>
                </li>
              </ul>
            </div>

            {/* Box 3: Policies & Guarantees */}
            <div className="heritage-card rounded-2xl p-6 bg-white border border-[#D4CBBB]">
              <div className="w-10 h-10 rounded-lg bg-[#670E10]/10 flex items-center justify-center text-[#670E10] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#241F1A] mb-3">Check-in & Policies</h3>
              <ul className="space-y-2 text-xs text-[#6B6155]">
                <li>
                  <span className="font-semibold text-[#241F1A]">Check-in:</span> From 2:00 PM
                </li>
                <li>
                  <span className="font-semibold text-[#241F1A]">Check-out:</span> Until 11:00 AM
                </li>
                <li>
                  <span className="font-semibold text-[#241F1A]">Cancellation:</span> Full refund up to 48 hours prior to arrival
                </li>
                <li>
                  <span className="font-semibold text-[#241F1A]">Valet & Parking:</span> Complimentary covered royal parking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
