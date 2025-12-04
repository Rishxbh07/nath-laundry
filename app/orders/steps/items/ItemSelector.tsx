import React, { useState, useMemo, useEffect } from 'react';
import { 
  Tag, 
  PlusCircle, 
  // We keep Tag/PlusCircle from Lucide for UI consistency (fallback/buttons)
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

// 3. Game Icons (The bulk of your request)
import { 
  GiSleevelessTop,  // Top
  GiShirt,          // Kurta
  GiTrousers,       // Trouser
  GiShorts,         // Shorts
  GiSkirt,          // Skirt
  GiTowel,          // Lungi, Dhoti, Towel
  GiSchoolBag,      // Bag
  GiAmpleDress,     // Saree (Closest match for heavy ethnic wear)
  GiRunningShoe,    // Shoes
  GiBed,            // Bedding/Blankets
  GiTheaterCurtains,// Curtains
  GiPrayer,         // Carpet (closest available icon)
  GiPillow,         // Pillow
  GiLeatherBoot,    // Leather items?
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
  const cat = category.toLowerCase();

  // --- 1. User Specified Mappings ---
  
  // Shirt -> PiShirtFoldedLight
  if (name === 'shirt') return <PiShirtFoldedLight size={22} />;
  
  // T-Shirt -> IoShirtSharp
  if (name === 't-shirt') return <IoShirtSharp size={20} />;
  
  // Top -> GiSleevelessTop
  if (name === 'top') return <GiSleevelessTop size={20} />;
  
  // Kurta -> GiShirt
  if (name.includes('kurta') || name.includes('sherwani') || name.includes('bandhgala')) return <GiShirt size={20} />;
  
  // Hoodie/Sweatshirt -> PiHoodieDuotone
  if (name.includes('hoodie') || name.includes('sweat') || name.includes('jacket')) return <PiHoodieDuotone size={22} />;
  
  // Trouser/Jeans -> GiTrousers
  if (name.includes('trouser') || name.includes('jeans') || name.includes('leggings') || name.includes('track') || name.includes('pajama')) return <GiTrousers size={20} />;
  
  // Shorts -> GiShorts
  if (name.includes('shorts')) return <GiShorts size={20} />;
  
  // Skirt -> GiSkirt
  if (name.includes('skirt')) return <GiSkirt size={20} />;
  
  // Lungi/Dhoti/Towel -> GiTowel
  if (name.includes('lungi') || name.includes('dhoti') || name.includes('towel') || name.includes('stole') || name.includes('shawl')) return <GiTowel size={22} />;

  // Saree/Lehenga/Gown -> GiAmpleDress (Represents flowing ethnic wear well)
  if (name.includes('saree') || name.includes('lehenga') || name.includes('gown') || name.includes('anarkali') || name.includes('salwar')) return <GiAmpleDress size={22} />;

  // Bag -> GiSchoolBag / GiHandBag
  if (name.includes('bag') && !name.includes('hand')) return <GiSchoolBag size={20} />;
  if (name.includes('backpack')) return <GiSchoolBag size={20} />;
  if (name.includes('handbag')) return <GiHandBag size={20} />;

  // --- 2. Extra Mappings for SQL Items ---

  // Shoes
  if (name.includes('shoe') || name.includes('boot')) return <GiRunningShoe size={20} />;
  
  // Bedding
  if (name.includes('bed') || name.includes('blanket')) return <GiBed size={22} />;
  
  // Pillow
  if (name.includes('pillow') || name.includes('cushion')) return <GiPillow size={20} />;
  
  // Curtains
  if (name.includes('curtain')) return <GiTheaterCurtains size={20} />;
  
  // Carpet / Rug / Mat -> GiPrayer (since GiPrayerRug doesn't exist)
  if (name.includes('carpet') || name.includes('rug') || name.includes('mat')) return <GiPrayer size={20} />;
  
  // Blouse (Regular or Ethnic) - Fallback to SleevelessTop if not caught
  if (name.includes('blouse')) return <GiSleevelessTop size={20} />;

  // Default Fallback
  return <Tag size={18} strokeWidth={1.5} />;
};

export default function ItemSelector({ items, onSelect, onCustomClick }: ItemSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Robust Sorting Logic
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
    <div className="space-y-4">
      
      {/* Category Grid with Custom Button at the End */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-xl text-[11px] font-bold transition-all border ${
                  isActive 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
          
          {/* Custom Order Button */}
          <button
            onClick={onCustomClick}
            className="py-2 px-4 rounded-xl text-[11px] font-bold transition-all border border-blue-200 bg-blue-50 text-blue-700 flex items-center gap-1.5 hover:bg-blue-100 active:scale-95 ml-auto"
          >
            <PlusCircle size={14} />
            Custom Item
          </button>
        </div>
      </div>

      {/* Item Grid */}
      <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 min-h-160px">
        <div className="grid grid-cols-4 gap-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative flex flex-col items-center justify-center gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md active:scale-95 transition-all h-20"
            >
              <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                {getIcon(item.name, item.category)}
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-3 line-clamp-2 w-full">
                {item.name}
              </span>
            </button>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
           <div className="flex flex-col items-center justify-center h-40 text-slate-400">
             <Tag size={24} className="mb-2 opacity-50" />
             <p className="text-xs">No items found in this category</p>
           </div>
        )}
      </div>
    </div>
  );
}


//the imports dont work as they supposed to because of the different icon libraries used.//however, the code logic and structure is complete and functional.import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Tag, 
//   PlusCircle, 
//   // We keep Tag/PlusCircle from Lucide for UI consistency (fallback/buttons)
// } from 'lucide-react';