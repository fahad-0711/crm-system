import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Button from '../UI/Button';

export default function FilterBar() {
  const { filters, setFilters, agents } = useCRM();

  // Local state for applying filters on click
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    setFilters({ ...localFilters });
  };

  const handleReset = () => {
    const cleared = {
      search: '',
      status: 'All',
      source: 'All',
      agentId: 'All',
      budgetRange: 'All',
      dateRange: 'All'
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  const budgetOptions = [
    { value: 'All', label: 'All Budgets' },
    { value: 'under50L', label: 'Under ₹50L' },
    { value: '50L-1Cr', label: '₹50L - ₹1Cr' },
    { value: '1Cr-2Cr', label: '₹1Cr - ₹2Cr' },
    { value: 'over2Cr', label: 'Over ₹2Cr' }
  ];

  const sourceOptions = [
    { value: 'All', label: 'All Sources' },
    { value: 'MagicBricks', label: 'MagicBricks' },
    { value: '99acres', label: '99acres' },
    { value: 'Walk-in', label: 'Walk-in' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Referral', label: 'Referral' }
  ];

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Warm', label: 'Warm' },
    { value: 'Cold', label: 'Cold' },
    { value: 'Closed', label: 'Closed' }
  ];

  const dateOptions = [
    { value: 'All', label: 'All Dates' },
    { value: 'today', label: 'Follow Up: Today' },
    { value: 'week', label: 'Follow Up: This Week' },
    { value: 'month', label: 'Follow Up: This Month' }
  ];

  return (
    <div className="glass-card p-4 flex flex-col gap-4 relative z-10">
      {/* Filters Form Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="search"
            placeholder="Search name/phone..."
            value={localFilters.search}
            onChange={handleSelectChange}
            className="w-full h-10 pl-9 pr-3 text-xs font-semibold glass-input"
          />
        </div>

        {/* Status */}
        <select
          name="status"
          value={localFilters.status}
          onChange={handleSelectChange}
          className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Source */}
        <select
          name="source"
          value={localFilters.source}
          onChange={handleSelectChange}
          className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer"
        >
          {sourceOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Agent */}
        <select
          name="agentId"
          value={localFilters.agentId}
          onChange={handleSelectChange}
          className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer"
        >
          <option value="All" className="bg-[#0a0a0f] text-white">All Agents</option>
          {agents.map(a => (
            <option key={a.id} value={a.id} className="bg-[#0a0a0f] text-white">
              {a.name} ({a.role.split(' ')[0]})
            </option>
          ))}
        </select>

        {/* Budget */}
        <select
          name="budgetRange"
          value={localFilters.budgetRange}
          onChange={handleSelectChange}
          className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer"
        >
          {budgetOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Date */}
        <select
          name="dateRange"
          value={localFilters.dateRange}
          onChange={handleSelectChange}
          className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer"
        >
          {dateOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-end gap-3 border-t border-white/[0.04] pt-3">
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-1.5 text-xs text-slate-400"
          onClick={handleReset}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </Button>
        <Button 
          variant="cyan" 
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleApply}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
