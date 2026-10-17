'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils/money';
import { dataRepository } from '@/lib/data/repository';
import { INITIAL_OUTLETS } from '@/lib/data/initial-data';
import type { MenuCategory } from '@/lib/types';
import { Utensils, CheckCircle2, XCircle, Power, RotateCw } from 'lucide-react';

export default function MenuManagementDashboardPage() {
  const [selectedOutletId, setSelectedOutletId] = useState(INITIAL_OUTLETS[0].id);
  const [categories, setCategories] = useState<MenuCategory[]>(
    dataRepository.getMenuCategories(INITIAL_OUTLETS[0].id)
  );

  const handleToggle = (itemId: string) => {
    dataRepository.toggleItemAvailability(itemId);
    setCategories([...dataRepository.getMenuCategories(selectedOutletId)]);
  };

  const handleOutletChange = (outletId: string) => {
    setSelectedOutletId(outletId);
    setCategories([...dataRepository.getMenuCategories(outletId)]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Food &amp; Beverage Control
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Live Availability (86-List)</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Menu Item Availability &amp; Outlets
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Instant 86-toggle updates guest menus and QR ordering in real-time
          </p>
        </div>

        <div className="flex bg-[#2A2420] p-1 rounded-xl border border-[#3D352C]">
          {INITIAL_OUTLETS.map((outlet) => (
            <button
              key={outlet.id}
              onClick={() => handleOutletChange(outlet.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedOutletId === outlet.id
                  ? 'bg-[#670E10] text-white shadow'
                  : 'text-[#D4CBBB] hover:text-white'
              }`}
            >
              {outlet.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <h2 className="font-heritage text-base font-bold uppercase tracking-wider text-[#C9A96E] border-b border-[#3D352C] pb-2">
              {cat.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items?.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl flex flex-col justify-between border-2 transition-all shadow-xs ${
                    item.is_available
                      ? 'border-[#3D352C] bg-[#241F1A]'
                      : 'border-[#9B2226]/50 bg-[#341618]/60 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-[#FAF8F3] text-sm">{item.name}</h3>
                      <span className="font-mono text-xs font-bold text-[#C9A96E] whitespace-nowrap">
                        {formatMoney(item.price_minor)}
                      </span>
                    </div>

                    <p className="text-xs text-[#9A8E7F] line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.dietary_labels.map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#1C1814] text-[#D4CBBB] border border-[#3D352C]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#3D352C] flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {item.is_available ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-semibold">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-xs text-rose-400 font-semibold">86 / Sold Out</span>
                        </>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant={item.is_available ? 'outline' : 'primary'}
                      className="text-xs px-2.5 py-1"
                      onClick={() => handleToggle(item.id)}
                    >
                      <Power className="w-3 h-3 mr-1" />
                      {item.is_available ? '86 Item' : 'Restore'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
