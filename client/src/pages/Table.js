import React, { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, Search, MessageCircle, Tag, Trash2, RefreshCw, Edit } from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const Table = ({ data, currentUserId, onDeleteItem, onEditItem, onRefresh, currentPage, pageSize, totalCount, onPageChange, onFetchAll, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [fullData, setFullData] = useState(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const isFiltering = Boolean(searchQuery || classFilter);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      if (!isFiltering) return;
      if (fullData) return;
      try {
        setIsLoadingAll(true);
        const all = await onFetchAll();
        if (!cancelled) setFullData(all);
      } catch (e) {
        toast.error('Failed to load all items for filtering');
      } finally {
        if (!cancelled) setIsLoadingAll(false);
      }
    };
    loadAll();
    return () => { cancelled = true; };
  }, [isFiltering, fullData, onFetchAll]);

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
  
  const dataSource = isFiltering ? (fullData || []) : data;

  const sortedData = useMemo(() => {
    const toNumber = (row, key) => {
      if (key !== 'price') return row[key];
      const price = Number(row.price || 0);
      const unit = row.priceUnit === 'm' ? 1_000_000 : row.priceUnit === 'k' ? 1_000 : 1;
      return price * unit;
    };

    let sortable = [...dataSource];
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
  }, [dataSource, sortConfig]);

  const filteredData = useMemo(() => {
    let filtered = sortedData;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (classFilter) {
      filtered = filtered.filter((row) => row.class === classFilter);
    }
    return filtered;
  }, [sortedData, searchQuery, classFilter]);

  const handleDiscordClick = (sellerDiscord) => {
    if (!sellerDiscord) {
      toast.error('Seller did not add a Discord ID please use his IGN');
      return;
    }
    const value = String(sellerDiscord).trim();
    const computeLinks = (val) => {
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
      return null;
    };

    const links = computeLinks(value);
    if (!links) {
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

  const totalPages = Math.max(1, Math.ceil((isFiltering ? filteredData.length : totalCount) / pageSize || 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden w-full max-w-full"
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
            <option value="Melee">Melee</option>
            <option value="Warrior">Warrior</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Rogue">Rogue</option>
            <option value="Guardian">Guardian</option>
            <option value="Archer">Archer</option>
            <option value="All">All</option>
          </select>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-sm whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
            {isFiltering ? filteredData.length : totalCount} item{(isFiltering ? filteredData.length : totalCount) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] sm:max-h-[600px]">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white sticky top-0 z-10">
            <tr>
            
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
                Item Name
              </th>
              <th className="px-2 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-wide text-xs">
                IGN
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
                    <span className="text-gray-700 font-semibold text-sm">
                      {row.base || '-'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{row.name}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <span className="text-gray-600 text-sm">{row.ign || '-'}</span>
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
                    <div className="flex justify-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (row.sellerDiscord) {
                              handleDiscordClick(row.sellerDiscord);
                            } else {
                              toast.error('Seller did not add a Discord ID please use his IGN');
                            }
                          }}
                          className="flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                          title="Contact on Discord"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          Contact on Discord
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                      {row.userId === currentUserId && (
                        <>
                          <div className="relative group">
                            <button
                              onClick={() => onEditItem(row)}
                              className="flex items-center justify-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Edit Item"
                            >
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              Edit Item
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => handleDeleteClick(row.id)}
                              className="flex items-center justify-center p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              Delete Item
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
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

      {/* Pagination (only when not filtering) */}
      {!isFiltering && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t bg-white">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Table;
