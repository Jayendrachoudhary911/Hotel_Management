import Image from 'next/image';
import Link from 'next/link';
import { BookingBar } from '@/components/home/booking-bar';
import { dataRepository } from '@/lib/data/repository';
import {
  MandalaOrnament,
  HeritageDivider,
  JharokhaFrame,
} from '@/components/ui/heritage-ornaments';
import {
  IconThemedRooms,
  IconRajasthaniRestaurant,
  IconCafeLounge,
  IconPartyHall,
  IconEventsWeddings,
  IconKingBed,
  IconGuests,
} from '@/components/ui/heritage-art';
import { ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata = {
  title: 'Rajmahal Heritage Hotel | A Royal Stay Rooted in Rajasthan',
  description:
    'Experience the royal heritage of Rajasthan at Rajmahal Heritage Hotel. Six authentic heritage suites, traditional Rajasthani restaurant, café & lounge, and grand party hall.',
};

export default function HomePage() {
  const roomTypes = dataRepository.getRoomTypes();
  const property = dataRepository.getProperty();

  const featureIcons = [
    { label: '6 Themed Rooms', href: '/rooms', icon: IconThemedRooms },
    { label: 'Rajasthani Restaurant', href: '/restaurant', icon: IconRajasthaniRestaurant },
    { label: 'Café & Lounge', href: '/cafe', icon: IconCafeLounge },
    { label: 'Party Hall', href: '/hall', icon: IconPartyHall },
    { label: 'Events & Weddings', href: '/hall', icon: IconEventsWeddings },
  ];

  return (
    <div className="flex flex-col w-full bg-[#F5F1E8] text-[#241F1A]">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
        {/* Palace Heritage Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero_haveli.jpg"
            alt="Rajmahal Heritage Hotel Palace Interior"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Subtle warm royal darkened overlay for high text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#102924]/92 via-[#102924]/75 to-[#102924]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102924]/95 via-transparent to-black/25" />
        </div>


        {/* Hero Content - Left Aligned with generous top breathing room below navbar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-20 w-full">
          <div className="max-w-xl text-left">
            <span className="text-[#E5C388] font-heritage text-base sm:text-xl font-medium tracking-[0.25em] uppercase block mb-3 drop-shadow">
              A Royal Stay
            </span>
            <h1 className="font-heritage text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF8F3] mb-5 leading-[1.1] drop-shadow-xl">
              Rooted in Rajasthan
            </h1>
            <p className="text-base sm:text-lg text-[#E6E0D5] mb-8 font-light leading-relaxed drop-shadow">
              Heritage rooms, authentic cuisine and unforgettable experiences.
            </p>
            <Link
              href="/rooms"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#173B35] font-semibold text-base tracking-wide transition-all shadow-lg hover:shadow-xl group"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Overlapping Floating Booking Widget */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mb-8 sm:-mb-10">
          <BookingBar />
        </div>
      </section>

      {/* ── 2. FIVE HERITAGE FEATURE ICONS STRIP ── */}
      <section className="pt-16 pb-12 bg-[#F5F1E8] border-b border-[#D4CBBB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 text-center">
            {featureIcons.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <Link
                  key={idx}
                  href={feature.href}
                  className="flex flex-col items-center group p-3 rounded-xl hover:bg-[#EBE5D6]/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full border border-[#B08D57]/50 flex items-center justify-center bg-white group-hover:border-[#B08D57] group-hover:shadow-md transition-all mb-3">
                    <IconComp className="w-8 h-8 text-[#B08D57] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#241F1A] tracking-tight group-hover:text-[#173B35]">
                    {feature.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. EXPERIENCE THE ROYAL HERITAGE OF RAJASTHAN ── */}
      <section className="relative py-20 overflow-hidden bg-[#FAF8F3]">
        {/* Intricate Corner Mandala Ornaments in Top-Left and Bottom-Right */}
        <MandalaOrnament
          position="top-left"
          color="#B08D57"
          opacity={0.45}
        />
        <MandalaOrnament
          position="bottom-right"
          color="#B08D57"
          opacity={0.45}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Jharokha Arch Picture Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <JharokhaFrame className="w-full max-w-sm sm:max-w-md shadow-2xl">
                <div className="relative h-96 sm:h-[420px] w-full">
                  <Image
                    src="/images/rooms/lakeview-suite.jpg"
                    alt="Royal Heritage Courtyard and Arches"
                    fill
                    className="object-cover"
                  />
                </div>
              </JharokhaFrame>
            </div>

            {/* Right: Heritage Content */}
            <div className="lg:col-span-7 lg:pl-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8F7245] block mb-2">
                Authentic Rajputana Grandeur
              </span>
              <h2 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173B35] mb-6 leading-tight">
                Experience the Royal Heritage <br />
                of Rajasthan
              </h2>
              <p className="text-base sm:text-lg text-[#554C41] mb-8 leading-relaxed font-light">
                A blend of traditional Rajasthani architecture and modern luxury, designed for travelers who seek authentic experiences. From hand-painted jharokhas to authentic royal khansama recipes, every moment at Rajmahal echoes the splendour of historic Udaipur.
              </p>
              <Link
                href="/rooms"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#173B35] font-medium text-sm tracking-wide transition-all shadow group"
              >
                <span>Explore Property</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SYMMETRICAL FLORAL JAALI ORNAMENTAL SECTION DIVIDER ── */}
      <HeritageDivider className="opacity-80" color="#B08D57" />

      {/* ── 4. OUR HERITAGE ROOMS (6 SUITES SHOWCASE) ── */}
      <section className="py-16 bg-[#F5F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#173B35] mb-3">
              Our Heritage Rooms
            </h2>
            <p className="text-sm sm:text-base text-[#6E6356] font-light">
              Six unique Rajasthani experiences, each with its own story, architecture and charm.
            </p>
          </div>

          {/* 3x2 Grid of 6 Suites matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {roomTypes.map((room) => {
              const roomImage = room.photos?.[0] || '/images/rooms/haveli-suite.jpg';
              return (
                <div
                  key={room.id}
                  className="bg-white rounded-xl border border-[#D4CBBB]/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#B08D57] transition-all flex flex-col group"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={roomImage}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heritage text-xl font-bold text-[#173B35] mb-2 group-hover:text-[#B08D57] transition-colors">
                        {room.name}
                      </h3>
                      {/* Icons row: King Bed & 2 Guests */}
                      <div className="flex items-center space-x-4 text-xs text-[#7A6F62] mb-4">
                        <span className="flex items-center">
                          <IconKingBed className="w-4 h-4 text-[#8F7245] mr-1.5" />
                          <span>King Bed</span>
                        </span>
                        <span className="flex items-center">
                          <IconGuests className="w-4 h-4 text-[#8F7245] mr-1.5" />
                          <span>{room.capacity} Guests</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
                      <Link
                        href={`/rooms/${room.id}`}
                        className="inline-flex items-center text-xs font-semibold text-[#173B35] hover:text-[#C59B63] transition-colors group/link"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href={`/book?roomTypeId=${room.id}`}
                        className="px-3.5 py-1.5 rounded bg-[#173B35] hover:bg-[#215149] text-[#FAF8F3] text-xs font-medium transition-all"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Recommendation Dark Banner matching image */}
          <div className="mt-14 bg-[#173B35] text-[#FAF8F3] rounded-xl p-6 sm:p-8 border border-[#B08D57]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-left max-w-xl">
              <h3 className="font-heritage text-xl sm:text-2xl font-bold text-[#FAF8F3] mb-2">
                Not sure which room to choose?
              </h3>
              <p className="text-sm text-[#D8D2C4] font-light">
                Get personalized recommendations from our concierge team based on your travel preferences.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/#contact"
                className="px-6 py-3 rounded-md bg-[#0F2723] border border-[#B08D57]/60 hover:bg-[#C59B63] hover:text-[#173B35] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all flex items-center space-x-2"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CONTACT US SECTION (Matching Mobile - Contact mockup) ── */}
      <section id="contact" className="py-16 bg-[#FAF8F3] border-t border-[#D4CBBB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heritage text-3xl font-bold text-[#173B35] mb-2">
              Contact Us
            </h2>
            <p className="text-sm text-[#6E6356] font-light">
              We&apos;d love to hear from you. Reach out to our concierge for reservations, custom banquet requests, and transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#D4CBBB]/70 shadow-xs text-left">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#B08D57]/40 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-[#8F7245]" />
              </div>
              <h4 className="text-sm font-bold text-[#173B35] mb-1">Address</h4>
              <p className="text-xs text-[#6E6356] leading-relaxed">
                {property.address}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D4CBBB]/70 shadow-xs text-left">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#B08D57]/40 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-[#8F7245]" />
              </div>
              <h4 className="text-sm font-bold text-[#173B35] mb-1">Phone</h4>
              <p className="text-xs text-[#6E6356] leading-relaxed">
                {property.phone}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D4CBBB]/70 shadow-xs text-left">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#B08D57]/40 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-[#8F7245]" />
              </div>
              <h4 className="text-sm font-bold text-[#173B35] mb-1">Email</h4>
              <p className="text-xs text-[#6E6356] leading-relaxed">
                {property.email}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D4CBBB]/70 shadow-xs text-left">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#B08D57]/40 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[#8F7245]" />
              </div>
              <h4 className="text-sm font-bold text-[#173B35] mb-1">Operating Hours</h4>
              <p className="text-xs text-[#6E6356] leading-relaxed">
                Hotel: 24 x 7<br />
                Dining: 12:30 PM – 11:00 PM<br />
                Café: 07:00 AM – 11:30 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
