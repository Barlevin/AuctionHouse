import React, { useMemo, useState } from 'react';
import { X, Upload, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiPost } from '../utils/api';

const BulkAddModal = ({ isOpen, onClose, onItemsAdded, userId }) => {
  const [ign, setIgn] = useState('');
  const [sellerDiscord, setSellerDiscord] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // items and bases copied from AddItemForm scope for matching
  const [items,setItems] = useState([  
    { "class": "Melee", "type": "Armor", "name": "Helm" },
    { "class": "Melee", "type": "Armor", "name": "Gauntlets" },
    { "class": "Melee", "type": "Armor", "name": "Greaves" },
    { "class": "Melee", "type": "Armor", "name": "Platemail" },
    { "class": "Melee", "type": "Armor", "name": "Platelegs" },
    { "class": "Melee", "type": "Armor", "name": "Shield" },
    { "class": "Melee", "type": "Armor", "name": "Gilded Quiver" },
    { "class": "Melee", "type": "Armor", "name": "Thread Bracer" },
    { "class": "Melee", "type": "Armor", "name": "Thread Poleyns" },
    { "class": "Melee", "type": "Armor", "name": "Thread Boots" },
    { "class": "Melee", "type": "Armor", "name": "Thread Mantle" },

    { "class": "Sorcerer", "type": "Armor", "name": "Thread Hood" },
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Hat" },
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Gloves" },
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Boots" },
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Top" },
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Bottom" },
    { "class": "Sorcerer", "type": "Armor", "name": "Gilded Spellbook" },
    
  
    { "class": "Guardian", "type": "Weapon", "name": "Bardiche" },
    { "class": "Guardian", "type": "Weapon", "name": "Battleaxe" },
    { "class": "Guardian", "type": "Weapon", "name": "Mace" },
    { "class": "Guardian", "type": "Weapon", "name": "Warhammer" },
    { "class": "Guardian", "type": "Weapon", "name": "Widesword" },
  
    { "class": "Rogue", "type": "Weapon", "name": "Curved Dagger" },
    { "class": "Rogue", "type": "Weapon", "name": "Dagger" },
    { "class": "Rogue", "type": "Weapon", "name": "Shortsword" },
    { "class": "Rogue", "type": "Weapon", "name": "Sword" },
  
    { "class": "Warrior", "type": "Weapon", "name": "Broadsword" },
    { "class": "Warrior", "type": "Weapon", "name": "Claymore" },
    { "class": "Warrior", "type": "Weapon", "name": "Halberd" },
    { "class": "Warrior", "type": "Weapon", "name": "Longsword" },
    { "class": "Warrior", "type": "Weapon", "name": "Trident" },
  
    { "class": "Sorcerer", "type": "Weapon", "name": "Arcane Staff" },
    { "class": "Sorcerer", "type": "Weapon", "name": "Fire Staff" },
    { "class": "Sorcerer", "type": "Weapon", "name": "Ice Staff" },
    { "class": "Sorcerer", "type": "Weapon", "name": "Thunder Staff" },
  
    { "class": "Archer", "type": "Weapon", "name": "Composite Bow" },
    { "class": "Archer", "type": "Weapon", "name": "Longbow" },
    { "class": "Archer", "type": "Weapon", "name": "Recurve Bow" },
    { "class": "Archer", "type": "Weapon", "name": "Shortbow" },


    { "class": "All", "type": "Amulet", "name": "Amulet Heal I" },
    { "class": "All", "type": "Amulet", "name": "AmuletHeal II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Heal III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Heal IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Heal V" },

    { "class": "All", "type": "Amulet", "name": "Amulet Fire Explosion I" },
    { "class": "All", "type": "Amulet", "name": "Amulet Fire Explosion II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Fire Explosion III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Fire Explosion IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Fire Explosion V" },

    { "class": "All", "type": "Amulet", "name": "Amulet Cure Blindness I" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Blindness II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Blindness III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Blindness IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Blindness V" },

    { "class": "All", "type": "Amulet", "name": "Amulet Cure Slow I" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Slow II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Slow III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Slow IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Slow V" },

    { "class": "All", "type": "Amulet", "name": "Amulet Cure Poison I" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Poison II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Poison III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Poison IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Cure Poison V" },

    { "class": "All", "type": "Amulet", "name": "Amulet Resist Stun I" },
    { "class": "All", "type": "Amulet", "name": "Amulet Resist Stun II" },
    { "class": "All", "type": "Amulet", "name": "Amulet Resist Stun III" },
    { "class": "All", "type": "Amulet", "name": "Amulet Resist Stun IV" },
    { "class": "All", "type": "Amulet", "name": "Amulet Resist Stun V" },

    { "class": "All", "type": "Ring", "name": "Ring Tier I" },
    { "class": "All", "type": "Ring", "name": "Ring Tier II" },
    { "class": "All", "type": "Ring", "name": "Ring Tier III" },
    { "class": "All", "type": "Ring", "name": "Ring Tier IV" },
    { "class": "All", "type": "Ring", "name": "Ring Tier V" },
    { "class": "All", "type": "Ring", "name": "Ring Tier VI" },
    { "class": "All", "type": "Ring", "name": "Ring Tier VII" },
    { "class": "All", "type": "Ring", "name": "Ring Tier VIII" },
    { "class": "All", "type": "Ring", "name": "Ring Tier IX" },
    { "class": "All", "type": "Ring", "name": "Ring Tier X" },
    { "class": "All", "type": "Ring", "name": "Ring Tier XI" },  
    { "class": "All", "type": "Ring", "name": "Ring Tier XII" },
    { "class": "All", "type": "Ring", "name": "Ring Tier XIII" },
    { "class": "All", "type": "Ring", "name": "Ring Tier XIV" },
    { "class": "All", "type": "Ring", "name": "Ring Tier XV" },
    { "class": "All", "type": "Ring", "name": "Ring Tier XVI" }

  
  ]);
    
    
  const baseItems = useMemo(() => [
    'Bronze','Steel','Sunstone','Bloodchrome','Meteor','Onyx','Lypriptite','Azurite','Emerald','Citrine','Kunzite','Aquamarine','Jade','Zircon','Topaz','Rhodonite',
    'Spiderfang','Ghostly','Fireborn','Bone','Pharaoh\'s','Frozen','Frostbite','Scorched','Defiled','Dark Sea','Valiant','Flarium','Ominous','Dark','Abyssal','Void',
    'Scavenge','Perpetual','Famine','Wintertide','Azure Break','Fatebringer','Everfrost','Umbral','Accessories'
  ], []);

  const parseLine = (line) => {
    const raw = line.trim();
    if (!raw) return { error: 'Empty line' };

    // Detect rarity at the very start: allow both "xDark" and "x Dark"
    let working = raw;
    let rarity = null;
    if (/^[xn]/i.test(working)) {
      const firstChar = working[0];
      rarity = /x/i.test(firstChar) ? 'Excellent' : 'Normal';
      // remove leading x/n and an optional space
      working = working.slice(1).trimStart();
    }

    // price: last token like 500k or 1m
    const parts = working.split(/\s+/);
    const priceToken = parts.pop();
    const priceMatch = /^(\d+(?:\.\d+)?)([km])$/i.exec(priceToken);
    if (!priceMatch) return { error: `Invalid price token: ${priceToken}` };
    const price = parseFloat(priceMatch[1]);
    const priceUnit = priceMatch[2].toLowerCase();

    // next token can be level/quality or 'clean'
    const lqToken = parts.pop();
    let level = null;
    let quality = null;
    if (/^\d{1,2}\/\d{1,3}$/.test(lqToken)) {
      const [l, q] = lqToken.split('/');
      level = parseInt(l, 10);
      quality = parseInt(q, 10);
    } else if (/^clean$/i.test(lqToken)) {
      // keep nulls
    } else {
      // put it back if it's part of name
      parts.push(lqToken);
    }

    // If rarity not detected as a prefix, allow it to be first standalone token
    if (!rarity) {
      if (parts.length === 0) return { error: 'Line must start with x or n (rarity)' };
      const maybeRarity = parts[0];
      if (/^[xn]$/i.test(maybeRarity)) {
        rarity = /x/i.test(maybeRarity) ? 'Excellent' : 'Normal';
        parts.shift();
      } else {
        return { error: 'Line must start with x or n (rarity)' };
      }
    }

    // remaining starts with base (choose longest matching base prefix)
    const remaining = parts.join(' ');
    let matchedBase = '';
    let matchedName = '';
    // try to match the longest base from baseItems
    const candidates = baseItems.slice().sort((a,b)=>b.length-a.length);
    for (const base of candidates) {
      if (remaining.toLowerCase().startsWith(base.toLowerCase() + ' ')) {
        matchedBase = base;
        matchedName = remaining.slice(base.length).trim();
        break;
      }
    }
    if (!matchedBase) return { error: 'Base not recognized' };
    if (!matchedName) return { error: 'Item name missing' };

    // find item in items list
    const found = items.find(it => it.name.toLowerCase() === matchedName.toLowerCase());
    if (!found) return { error: `Unknown item name: ${matchedName}` };

    const itemClass = found.class || '';
    const category = found.type || '';

    return { name: found.name, base: matchedBase, rarity, level, quality, price, priceUnit, class: itemClass, category };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ign && !sellerDiscord) {
      toast.error('Provide either IGN or Discord contact');
      return;
    }
    if (ign && sellerDiscord) {
      toast.error('Please fill only one: IGN or Discord, not both');
      return;
    }
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) {
      toast.error('Enter at least one item line');
      return;
    }

    const results = lines.map(parseLine);
    const firstError = results.find(r => r.error);
    if (firstError) {
      toast.error(firstError.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = [];
      for (const data of results) {
        const payload = {
          ign: ign || '',
          sellerDiscord: sellerDiscord || '',
          name: data.name,
          base: data.base,
          rarity: data.rarity,
          level: data.level,
          quality: data.quality,
          price: String(data.price),
          priceUnit: data.priceUnit,
          category: data.category,
          class: data.class,
          userId,
        };
        const newItem = await apiPost('/api/items', payload);
        created.push(newItem);
      }
      onItemsAdded(created);
      toast.success(`Added ${created.length} item(s) successfully`);
      setIgn('');
      setSellerDiscord('');
      setText('');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add items');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Bulk Add Items</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">IGN (optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Your in-game name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Discord Contact (optional)</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={sellerDiscord}
                    onChange={(e) => setSellerDiscord(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="User ID, profile URL or invite"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Fill only one: IGN or Discord</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Items (one per line)</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono text-sm"
                placeholder={"Examples (one per line)\n" +
                  "xDark Thunder Staff 10/100 500k\n" +
                  "nDark Thunder Staff clean 500k\n" +
                  "xVoid Thread Helm 10/93 1m"}
              />
              <p className="text-xs text-gray-500 mt-1">Format: [x|n][Base] [Item Name] [clean|L/Q] [Price(k|m)]</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 disabled:opacity-60">
                {isSubmitting ? 'Adding...' : 'Add Items'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkAddModal;
