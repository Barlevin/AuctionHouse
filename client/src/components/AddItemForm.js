import React, { useState, useMemo } from 'react';
import { X, Plus, MessageCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPost } from '../utils/api';
import toast from 'react-hot-toast';

const AddItemForm = ({ isOpen, onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    ign: '',
    base: '',
    name: '',
    rarity: '',
    class: '',
    level: '',
    quality: '',
    price: '',
    priceUnit: 'k',
    sellerDiscord: '',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBaseSuggestions, setShowBaseSuggestions] = useState(false);
  const [showDiscordHelp, setShowDiscordHelp] = useState(false);

  const [items,setItems] = useState([  
    { "class": "Melee", "type": "Armor", "name": "Helm" },
    { "class": "Melee", "type": "Armor", "name": "Gauntlets" },
    { "class": "Melee", "type": "Armor", "name": "Greaves" },
    { "class": "Melee", "type": "Armor", "name": "Platemail" },
    { "class": "Melee", "type": "Armor", "name": "Platelegs" },
    { "class": "Melee", "type": "Armor", "name": "Shield" },
    { "class": "Melee", "type": "Armor", "name": "Gilded Quiver" },

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
    { "class": "Rogue", "type": "Weapon", "name": "Short Sword" },
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
    
    

  const [baseItems] = useState([
    // Base materials
    "Bronze", "Steel", "Sunstone", "Bloodchrome", "Meteor", "Onyx", "Lypriptite", "Azurite", "Emerald", "Citrine", "Kunzite", "Aquamarine", "Jade", "Zircon", "Topaz", "Rhodonite",
    // Remnant
    "Spiderfang", "Ghostly", "Fireborn", "Bone", "Pharaoh's", "Frozen", "Frostbite", "Scorched", "Defiled", "Dark Sea", "Valiant", "Flarium", "Ominous", "Dark", "Abyssal", "Void",
    // Spoils
    "Scavenge", "Perpetual", "Famine",
    // Trials
    "Wintertide", "Azure Break", "Fatebringer", "Everfrost", "Umbral",
    // Accessories
    "Accessories"
  ]);

  // Check if selected item is Ring or Amulet
  const selectedItem = useMemo(() => {
    return items.find(item => item.name === formData.name);
  }, [formData.name, items]);

  const isAccessoryItem = useMemo(() => {
    return selectedItem && (selectedItem.type === 'Ring' || selectedItem.type === 'Amulet');
  }, [selectedItem]);
  const userId = (() => {
    let id = localStorage.getItem('auction_user_id');
    if (!id) {
      id = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('auction_user_id', id);
    }
    return id;
  })();

  const filteredItems = useMemo(() => {
    if (!formData.name || formData.name.length < 2) return [];
    const query = formData.name.toLowerCase();
    return items
      .filter(item => item.name.toLowerCase().includes(query))
      .slice(0, 25); // Limit to 25 suggestions
  }, [formData.name, items]);

  const filteredBaseItems = useMemo(() => {
    if (!formData.base || formData.base.length < 2) return [];
    const query = formData.base.toLowerCase();
    return baseItems
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 8); // Limit to 8 suggestions
  }, [formData.base, baseItems]);

  const isValidDiscordContact = (val) => {
    if (!val) return false;
    const v = String(val).trim();
    // Accept: numeric user ID, discord.com user URL, discord invite, full discord:// deep link
    if (/^\d{17,20}$/.test(v)) return true;
    if (/^https?:\/\/discord\.com\/users\/\d{17,20}$/i.test(v)) return true;
    if (/^https?:\/\/discord\.gg\/[\w-]+$/i.test(v)) return true;
    if (/^discord:\/\//i.test(v)) return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      try {
        // At least one of IGN or Discord must be provided
        if (!formData.ign && !formData.sellerDiscord) {
          toast.error('Please provide either IGN or Discord contact');
          return;
        }

        // Validate that the item name exists in the items list
        const isValidItem = items.some(item => item.name === formData.name);
        if (!isValidItem) {
          toast.error('Please select a valid item from the suggestions or enter the exact item name.');
          return;
        }

        // Find the item to get its category/type
        const selectedItem = items.find(item => item.name === formData.name);
        const itemCategory = selectedItem ? selectedItem.type : '';

        // If Discord is filled, validate format
        if (formData.sellerDiscord && !isValidDiscordContact(formData.sellerDiscord)) {
          toast.error('Please enter a valid Discord contact: numeric user ID (recommended), a full profile URL (https://discord.com/users/{id}), an invite (https://discord.gg/{code}), or a discord:// deep link.');
          return;
        }
        const newItem = await apiPost('/api/items', {
        ...formData,
          category: itemCategory,
          userId,
        });
      onAddItem(newItem);
        toast.success('Item added successfully!');
      setFormData({
          ign: '',
          base: '',
        name: '',
          rarity: '',
          class: '',
          level: '',
          quality: '',
        price: '',
        sellerDiscord: '',
      });
      onClose();
      } catch (err) {
        toast.error(err.message || 'Failed to add item');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If name changed, check if it's a Ring/Amulet and auto-set base/class
    if (name === 'name') {
      const selectedItem = items.find(item => item.name === value);
      const isAccessory = selectedItem && (selectedItem.type === 'Ring' || selectedItem.type === 'Amulet');
      
      setFormData({
        ...formData,
        [name]: value,
        ...(isAccessory ? { base: 'Accessories', class: 'All' } : {}),
      });
      setShowSuggestions(value.length >= 2);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    if (name === 'base') {
      setShowBaseSuggestions(value.length >= 2);
    }
  };

  const handleSuggestionClick = (itemName) => {
    const selectedItem = items.find(item => item.name === itemName);
    const isAccessory = selectedItem && (selectedItem.type === 'Ring' || selectedItem.type === 'Amulet');
    
    setFormData({
      ...formData,
      name: itemName,
      ...(isAccessory ? { base: 'Accessories', class: 'All' } : {}),
    });
    setShowSuggestions(false);
  };

  const handleBaseSuggestionClick = (baseName) => {
    setFormData({
      ...formData,
      base: baseName,
    });
    setShowBaseSuggestions(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Add New Item
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    IGN (In-Game Name)
                  </label>
                  <input
                    type="text"
                    name="ign"
                    value={formData.ign}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your in-game name..."
                  />
                </div>
              <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(formData.name.length >= 2)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                  {showSuggestions && filteredItems.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[500px] overflow-y-auto">
                      {filteredItems.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(item.name)}
                          className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.type}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Base *
                  </label>
                  <input
                    type="text"
                    name="base"
                    value={formData.base}
                    onChange={handleChange}
                    onFocus={() => !isAccessoryItem && setShowBaseSuggestions(formData.base.length >= 2)}
                    onBlur={() => setTimeout(() => setShowBaseSuggestions(false), 200)}
                    required
                    disabled={isAccessoryItem}
                    placeholder="e.g. Steel, Bronze, Void..."
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                      isAccessoryItem ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                    }`}
                  />
                  {showBaseSuggestions && filteredBaseItems.length > 0 && !isAccessoryItem && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredBaseItems.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleBaseSuggestionClick(item)}
                          className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="font-medium text-gray-900">{item}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Rarity *
                  </label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Rarity</option>
                    <option value="Normal">Normal</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                    disabled={isAccessoryItem}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                      isAccessoryItem ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    <option value="">Select Class</option>
                    <option value="All">All</option>
                    <option value="Melee">Melee</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Sorcerer">Sorcerer</option>
                    <option value="Rogue">Rogue</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Archer">Archer</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Level
                    </label>
                    <input
                      type="number"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      placeholder="1-10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Quality (%)
                    </label>
                    <input
                      type="number"
                      name="quality"
                      value={formData.quality}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      placeholder="1-100%"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Starting Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Price Unit *
                    </label>
                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    >
                      <option value="k">Thousands (k)</option>
                      <option value="m">Millions (m)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <MessageCircle className="inline w-4 h-4 mr-1" />
                    Discord Contact
                    <button
                      type="button"
                      onClick={() => setShowDiscordHelp(!showDiscordHelp)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <HelpCircle className="w-3 h-3 text-gray-600" />
                    </button>
                  </label>
                  <AnimatePresence>
                    {showDiscordHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 overflow-hidden"
                      >
                        <div className="font-semibold mb-1">How to get your Discord User ID:</div>
                        <div className="space-y-1">
                          <div>1. Discord → Settings → Advanced → Developer Mode ON</div>
                          <div>2. Click your name → "Copy User ID"</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input
                    type="text"
                    name="sellerDiscord"
                    value={formData.sellerDiscord}
                    onChange={handleChange}
                    placeholder="e.g. 123456789012345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide at least one: IGN or Discord. Items older than 14 days are auto-removed.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all shadow-md"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddItemForm;

