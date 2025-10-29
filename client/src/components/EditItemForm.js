import React, { useState, useMemo, useEffect } from 'react';
import { X, Edit, MessageCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPut } from '../utils/api';
import toast from 'react-hot-toast';

const EditItemForm = ({ isOpen, onClose, onUpdateItem, itemToEdit }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscordHelp, setShowDiscordHelp] = useState(false);

  
  const [items,setItems] = useState([  { "type": "Armor", "name": "Helm" },
    { "class": "Melee", "type": "Armor", "name": "Gauntlets" },
    { "class": "Melee", "type": "Armor", "name": "Greaves" },
    { "class": "Melee", "type": "Armor", "name": "Platemail" },
    { "class": "Melee", "type": "Armor", "name": "Platelegs" },
    { "class": "Melee", "type": "Armor", "name": "Shield" },
  
    { "class": "Sorcerer", "type": "Armor", "name": "Thread Helm" },
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

  const baseItems = [
    "Bronze", "Steel", "Sunstone", "Bloodchrome", "Meteor", "Onyx", "Lypriptite", "Azurite", "Emerald", "Citrine", "Kunzite", "Aquamarine", "Jade", "Zircon", "Topaz", "Rhodonite",
    "Remnant", "Spiderfang", "Ghostly", "Fireborn", "Bone", "Pharaoh's", "Frozen", "Frostbite", "Scorched", "Defiled", "Dark Sea", "Empty", "Valiant", "Flarium", "Ominous", "Dark", "Abyssal", "Void",
    "Spoils", "Scavenge", "Perpetual", "Famine",
    "Trials", "Wintertide", "Azure Break", "Fatebringer", "Everfrost", "Umbral",
    "Accessories"
  ];

  // Check if selected item is Ring or Amulet
  const selectedItem = useMemo(() => {
    return items.find(item => item.name === formData.name);
  }, [formData.name, items]);

  const isAccessoryItem = useMemo(() => {
    return selectedItem && (selectedItem.type === 'Ring' || selectedItem.type === 'Amulet');
  }, [selectedItem]);

  // Pre-fill form data when itemToEdit changes
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        ign: itemToEdit.ign || '',
        base: itemToEdit.base || '',
        name: itemToEdit.name || '',
        rarity: itemToEdit.rarity || '',
        class: itemToEdit.class || '',
        level: itemToEdit.level || '',
        quality: itemToEdit.quality || '',
        price: itemToEdit.price || '',
        priceUnit: itemToEdit.priceUnit || 'k',
        sellerDiscord: itemToEdit.sellerDiscord || '',
      });
    }
  }, [itemToEdit]);

  const filteredItems = useMemo(() => {
    if (!formData.name) return [];
    return items.filter(item =>
      item.name.toLowerCase().includes(formData.name.toLowerCase())
    ).slice(0, 25);
  }, [formData.name, items]);

  const filteredBaseItems = useMemo(() => {
    if (!formData.base) return [];
    return baseItems.filter(base =>
      base.toLowerCase().includes(formData.base.toLowerCase())
    ).slice(0, 5);
  }, [formData.base, baseItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If name changed, check if it's a Ring/Amulet and auto-set base/class
    if (name === 'name') {
      const selectedItem = items.find(item => item.name === value);
      const isAccessory = selectedItem && (selectedItem.type === 'Ring' || selectedItem.type === 'Amulet');
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(isAccessory ? { base: 'Accessories', class: 'All' } : {}),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSuggestionClick = (item) => {
    const isAccessory = item.type === 'Ring' || item.type === 'Amulet';
    
    setFormData(prev => ({
      ...prev,
      name: item.name,
      ...(isAccessory ? { base: 'Accessories', class: 'All' } : {}),
    }));
    setShowSuggestions(false);
  };

  const handleBaseSuggestionClick = (base) => {
    setFormData(prev => ({
      ...prev,
      base: base
    }));
    setShowBaseSuggestions(false);
  };

  const isValidDiscordContact = (contact) => {
    if (!contact) return false;
    
    // Check for numeric user ID (recommended)
    if (/^\d{17,19}$/.test(contact)) return true;
    
    // Check for Discord profile URL
    if (/^https:\/\/discord\.com\/users\/\d{17,19}$/.test(contact)) return true;
    
    // Check for Discord invite URL
    if (/^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/.test(contact)) return true;
    
    // Check for discord:// deep link
    if (/^discord:\/\/-/.test(contact)) return true;
    
    // Allow usernames (less reliable but still valid)
    if (/^[a-zA-Z0-9._]+$/.test(contact) && contact.length >= 2) return true;
    
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.price && formData.rarity && formData.class) {
      try {
        // Validate that the item name exists in the items list
        const isValidItem = items.some(item => item.name === formData.name);
        if (!isValidItem) {
          toast.error('Please select a valid item from the suggestions or enter the exact item name.');
          return;
        }

        // Find the item to get its category/type
        const selectedItem = items.find(item => item.name === formData.name);
        const itemCategory = selectedItem ? selectedItem.type : '';

        if (!isValidDiscordContact(formData.sellerDiscord)) {
          toast.error('Please enter a valid Discord contact: numeric user ID (recommended), a full profile URL (https://discord.com/users/{id}), an invite (https://discord.gg/{code}), or a discord:// deep link.');
          return;
        }
        
        setIsSubmitting(true);
        const updatedItem = await apiPut(`/api/items/${itemToEdit.id}`, {
          ...formData,
          category: itemCategory,
          userId: itemToEdit.userId,
        });
        onUpdateItem(updatedItem);
        toast.success('Item updated successfully!');
        onClose();
      } catch (err) {
        toast.error(err.message || 'Failed to update item');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Item
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Base Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Base
                  </label>
                  <input
                    type="text"
                    name="base"
                    value={formData.base}
                    onChange={handleChange}
                    onFocus={() => !isAccessoryItem && setShowBaseSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowBaseSuggestions(false), 200)}
                    disabled={isAccessoryItem}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                      isAccessoryItem ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                    }`}
                    placeholder="Enter base material..."
                  />
                  {showBaseSuggestions && filteredBaseItems.length > 0 && !isAccessoryItem && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredBaseItems.map((base, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleBaseSuggestionClick(base)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                        >
                          {base}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* IGN Input */}
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

                {/* Item Name Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter item name..."
                  />
                  {showSuggestions && filteredItems.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[500px] overflow-y-auto">
                      {filteredItems.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.type}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rarity Select */}
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

              {/* Class Select */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Level Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Level (1-10)
                  </label>
                  <input
                    type="number"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter level..."
                  />
                </div>

                {/* Quality Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quality (1-100%)
                  </label>
                  <input
                    type="number"
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter quality percentage..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Price */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter price..."
                  />
                </div>

                {/* Price Unit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price Unit
                  </label>
                  <select
                    name="priceUnit"
                    value={formData.priceUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option value="k">Thousands (k)</option>
                    <option value="m">Millions (m)</option>
                  </select>
                </div>
              </div>

              {/* Discord Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Discord Contact *
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
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="sellerDiscord"
                    value={formData.sellerDiscord}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Discord user ID, profile URL, or invite..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Numeric user ID (e.g., 123456789012345678)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditItemForm;
