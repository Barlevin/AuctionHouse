import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, MessageCircle, Tag, Trash2, RefreshCw, Edit } from "lucide-react";
import { motion } from "framer-motion";

const Table = ({ data, currentUserId, onDeleteItem, onEditItem, onRefresh }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const handleSort = (accessor) => {
    setSortConfig((prev) => {
      if (prev.key === accessor) {
        return { key: accessor, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key: accessor, direction: "asc" };
    });
  };

  const handleDeleteClick = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDeleteItem(itemId);
    }
  };
  

  const sortedData = useMemo(() => {
    const toNumber = (row, key) => {
      if (key !== 'price') return row[key];
      const price = Number(row.price || 0);
      const unit = row.priceUnit === 'm' ? 1_000_000 : row.priceUnit === 'k' ? 1_000 : 1;
      return price * unit;
    };

    let sortable = [...data];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aValue = toNumber(a, sortConfig.key);
        const bValue = toNumber(b, sortConfig.key);
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    return sortable;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    let filtered = sortedData;
    
    // Apply search filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    
    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter((row) => row.class === classFilter);
    }
    
    return filtered;
  }, [sortedData, searchQuery, classFilter]);

  const handleDiscordClick = (sellerDiscord) => {
    if (!sellerDiscord) return;
    const value = String(sellerDiscord).trim();

    const computeLinks = (val) => {
      // deepLink: discord:// protocol (tries to open app)
      // webLink: https fallback
      if (/^discord:\/\//i.test(val)) {
        return { deepLink: val, webLink: val.replace(/^discord:\/\//i, 'https://') };
      }
      const userMatch = val.match(/^https?:\/\/discord\.com\/users\/(\d{17,20})/i);
      if (userMatch) {
        const id = userMatch[1];
        return {
          deepLink: `discord://-/users/${id}`,
          webLink: `https://discord.com/users/${id}`,
        };
      }
      const inviteMatch = val.match(/^https?:\/\/discord\.gg\/([\w-]+)/i) || val.match(/^discord\.gg\/([\w-]+)/i);
      if (inviteMatch) {
        const code = inviteMatch[1];
        return {
          deepLink: `discord://-/invite/${code}`,
          webLink: `https://discord.gg/${code}`,
        };
      }
      if (/^\d{17,20}$/.test(val)) {
        return {
          deepLink: `discord://-/users/${val}`,
          webLink: `https://discord.com/users/${val}`,
        };
      }
      // Unsupported (e.g., username#1234)
      return null;
    };

    const links = computeLinks(value);
    if (!links) {
      // Unknown format (e.g., username#1234). Try opening Discord app Home/DM list.
      const deepLink = 'discord://-/channels/@me';
      const webLink = 'https://discord.com/channels/@me';

      const a = document.createElement('a');
      a.href = deepLink;
      a.style.display = 'none';
      document.body.appendChild(a);

      const timer = setTimeout(() => {
        window.open(webLink, '_blank', 'noopener,noreferrer');
      }, 1200);

      const clear = () => clearTimeout(timer);
      window.addEventListener('blur', clear, { once: true });
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.removeEventListener('blur', clear);
      }, 1500);
      return;
    }

    // Create a temporary anchor to trigger the custom protocol reliably from a user gesture
    const a = document.createElement('a');
    a.href = links.deepLink;
    a.style.display = 'none';
    document.body.appendChild(a);

    const timer = setTimeout(() => {
      window.open(links.webLink, '_blank', 'noopener,noreferrer');
    }, 1200);

    const clear = () => clearTimeout(timer);
    window.addEventListener('blur', clear, { once: true });
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.removeEventListener('blur', clear);
    }, 1500);
  };

  const formatCompact = (value, unit) => {
    if (value == null || isNaN(value)) return '0';
    const v = Number(value);
    const base = v % 1 === 0 ? v.toString() : v.toFixed(2).replace(/\.?0+$/, '');
    if (unit === 'm') return `${base}m`;
    if (unit === 'k') return `${base}k`;
    return base;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search size={20} className="text-purple-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full outline-none bg-transparent text-gray-700 font-medium text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm min-w-[120px]"
          >
            <option value="">All Classes</option>
            <option value="Warrior">Warrior</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Rogue">Rogue</option>
            <option value="Guardian">Guardian</option>
            <option value="Archer">Archer</option>
          </select>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-sm whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
            {filteredData.length} item{filteredData.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] sm:max-h-[600px]">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white sticky top-0 z-10">
            <tr>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs">
                Item Name
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs cursor-pointer hover:bg-purple-700 transition-colors"
                onClick={() => handleSort('base')}>
                <div className="flex items-center gap-1">
                  Base
                  {sortConfig.key === 'base' && (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs">
                Category
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs cursor-pointer hover:bg-purple-700 transition-colors"
                onClick={() => handleSort('class')}>
                <div className="flex items-center gap-1">
                  Class
                  {sortConfig.key === 'class' && (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs cursor-pointer hover:bg-purple-700 transition-colors"
                onClick={() => handleSort('rarity')}>
                <div className="flex items-center gap-1">
                  Rarity
                  {sortConfig.key === 'rarity' && (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs">
                Level
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs">
                Quality
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs cursor-pointer hover:bg-purple-700 transition-colors"
                onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs text-center">
                Contact
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-12 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-12 h-12 text-gray-300" />
                    <p className="text-lg font-medium">No items found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-purple-50 transition-colors border-b border-gray-100"
                >
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{row.name}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className="text-gray-700 font-semibold text-sm">
                      {row.base || '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    {row.category && (
                      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        <Tag className="w-3 h-3" />
                        <span className="hidden sm:inline">{row.category}</span>
                        <span className="sm:hidden">{row.category.charAt(0)}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-semibold text-sm">
                      {row.class || '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className={`font-semibold text-sm ${
                      row.rarity === 'Excellent' 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent'
                    }`}>
                      {row.rarity || '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className={`font-semibold text-sm ${
                      row.level == 10 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent'
                    }`}>
                      {row.level || '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className={`font-semibold text-sm ${
                      row.quality == 100 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent'
                    }`}>
                      {row.quality ? `${row.quality}%` : '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm">
                        {formatCompact(row.price, row.priceUnit)}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-center">
                      {row.sellerDiscord ? (
                        <button
                          onClick={() => handleDiscordClick(row.sellerDiscord)}
                          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-xs sm:text-sm"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Contact on Discord</span>
                          <span className="sm:hidden">Contact</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">No contact</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-center gap-2">
                      {row.userId === currentUserId && (
                        <>
                          <button
                            onClick={() => onEditItem(row)}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(row.id)}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Table;
