import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shirt, 
  Sparkles, 
  BedDouble, 
  Footprints, 
  Tag, 
  RectangleVertical,
  Layers,
  PlusCircle
} from 'lucide-react';

interface ItemSelectorProps {
  items: any[];
  onSelect: (item: any) => void;
  onCustomClick: () => void;
}

const getIcon = (itemName: string, category: string) => {
  const name = itemName.toLowerCase();
  const cat = category.toLowerCase();

  if (name.includes('saree') || name.includes('sari')) return <Sparkles size={20} strokeWidth={1.5} />;
  if (name.includes('shoe') || name.includes('sandal')) return <Footprints size={20} strokeWidth={1.5} />;
  if (name.includes('sheet') || name.includes('blanket') || name.includes('cover')) return <BedDouble size={20} strokeWidth={1.5} />;
  
  if (cat.includes('upper') || cat.includes('top') || cat.includes('shirt')) return <Shirt size={20} strokeWidth={1.5} />;
  if (cat.includes('lower') || cat.includes('bottom') || cat.includes('pant')) return <RectangleVertical size={20} strokeWidth={1.5} />;
  if (cat.includes('ethnic') || cat.includes('suit')) return <Layers size={20} strokeWidth={1.5} />;
  
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