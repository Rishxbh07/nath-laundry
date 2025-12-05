import React, { useState, useMemo, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Search
} from 'lucide-react';

// 1. Phosphor Icons
import { 
  PiShirtFoldedLight, // Shirt
  PiHoodieDuotone,    // Hoodie
} from "react-icons/pi";

// 2. Ionicons 5
import { 
  IoShirtSharp // T-Shirt
} from "react-icons/io5";

// 3. Game Icons
import { 
  GiSleevelessTop,  // Top
  GiShirt,          // Kurta
  GiTrousers,       // Trouser
  GiShorts,         // Shorts
  GiSkirt,          // Skirt
  GiTowel,          // Lungi, Dhoti, Towel
  GiSchoolBag,      // Bag
  GiAmpleDress,     // Saree
  GiRunningShoe,    // Shoes
  GiBed,            // Bedding/Blankets
  GiTheaterCurtains,// Curtains
  GiPrayer,         // Carpet
  GiPillow,         // Pillow
  GiLeatherBoot,    // Leather items
  GiHandBag         // Handbag
} from "react-icons/gi";

interface ItemSelectorProps {
  items: any[];
  onSelect: (item: any) => void;
  onCustomClick: () => void;
}

// Helper to map item names to the requested icons
const getIcon = (itemName: string, category: string) => {
  const name = itemName.toLowerCase();
  
  // --- 1. User Specified Mappings ---
  
  // Shirt -> PiShirtFoldedLight
  if (name === 'shirt') return <PiShirtFoldedLight size={28} />;
  
  // T-Shirt -> IoShirtSharp
  if (name === 't-shirt') return <IoShirtSharp size={26} />;
  
  // Top -> GiSleevelessTop
  if (name === 'top') return <GiSleevelessTop size={24} />;
  
  // Kurta -> GiShirt
  if (name.includes('kurta') || name.includes('sherwani') || name.includes('bandhgala')) return <GiShirt size={24} />;
  
  // Hoodie/Sweatshirt -> PiHoodieDuotone
  if (name.includes('hoodie') || name.includes('sweat') || name.includes('jacket')) return <PiHoodieDuotone size={28} />;
  
  // Trouser/Jeans -> GiTrousers
  if (name.includes('trouser') || name.includes('jeans') || name.includes('leggings') || name.includes('track') || name.includes('pajama')) return <GiTrousers size={24} />;
  
  // Shorts -> GiShorts
  if (name.includes('shorts')) return <GiShorts size={24} />;
  
  // Skirt -> GiSkirt
  if (name.includes('skirt')) return <GiSkirt size={24} />;
  
  // Lungi/Dhoti/Towel -> GiTowel
  if (name.includes('lungi') || name.includes('dhoti') || name.includes('towel') || name.includes('stole') || name.includes('shawl')) return <GiTowel size={26} />;

  // Saree/Lehenga/Gown -> GiAmpleDress
  if (name.includes('saree') || name.includes('lehenga') || name.includes('gown') || name.includes('anarkali') || name.includes('salwar')) return <GiAmpleDress size={26} />;

  // Bag -> GiSchoolBag / GiHandBag
  if (name.includes('bag') && !name.includes('hand')) return <GiSchoolBag size={24} />;
  if (name.includes('backpack')) return <GiSchoolBag size={24} />;
  if (name.includes('handbag')) return <GiHandBag size={24} />;

  // --- 2. Extra Mappings for SQL Items ---

  // Shoes
  if (name.includes('shoe') || name.includes('boot')) return <GiRunningShoe size={24} />;
  
  // Bedding
  if (name.includes('bed') || name.includes('blanket')) return <GiBed size={26} />;
  
  // Pillow
  if (name.includes('pillow') || name.includes('cushion')) return <GiPillow size={24} />;
  
  // Curtains
  if (name.includes('curtain')) return <GiTheaterCurtains size={24} />;
  
  // Carpet / Rug / Mat
  if (name.includes('carpet') || name.includes('rug') || name.includes('mat')) return <GiPrayer size={24} />;
  
  // Blouse
  if (name.includes('blouse')) return <GiSleevelessTop size={24} />;

  // Default Fallback
  return <Tag size={24} strokeWidth={1.5} />;
};

export default function ItemSelector({ items, onSelect, onCustomClick }: ItemSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Helper to format category names (e.g. "HOME_LINEN" -> "Home Linen")
  const formatCategoryLabel = (cat: string) => {
    return cat
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(items.map(i => i.category)));
    
    // Priority scoring: Lower number = Higher priority
    const getPriority = (cat: string) => {
      const c = cat.toLowerCase();
      if (c.includes('upper') || c.includes('top')) return 1;
      if (c.includes('lower') || c.includes('bottom') || c.includes('pant')) return 2;
      if (c.includes('ethnic') || c.includes('suit')) return 3;
      return 100; // All others
    };

    return uniqueCats.sort((a, b) => {
      const pA = getPriority(a);
      const pB = getPriority(b);
      
      if (pA !== pB) return pA - pB;
      return a.localeCompare(b);
    });
  }, [items]);

  // Initial Selection
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Categories Horizontal Scroll / Wrap */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Categories
          </p>
          <button
            onClick={onCustomClick}
            className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus size={12} /> Custom Item
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2.5 px-5 rounded-full text-[11px] font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 scale-105' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {formatCategoryLabel(cat)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Grid */}
      <div className="bg-slate-50/50 p-2 rounded-3xl border border-slate-100/50 min-h-[200px]">
        <div className="grid grid-cols-4 gap-3">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative flex flex-col items-center justify-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:border-blue-300 hover:shadow-md active:scale-95 transition-all aspect-square"
            >
              <div className="text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">
                {getIcon(item.name, item.category)}
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-3 line-clamp-2 w-full group-hover:text-slate-800">
                {item.name}
              </span>
            </button>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
           <div className="flex flex-col items-center justify-center h-48 text-slate-300">
             <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Search size={20} />
             </div>
             <p className="text-xs font-medium">No items in this category</p>
           </div>
        )}
      </div>
    </div>
  );
}