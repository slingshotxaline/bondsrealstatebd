'use client';
import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/app/components/ui/Toast';
import { adminAPI } from '@/app/lib/api';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import PropertyCard from '@/app/components/dashboard/PropertyCard';
import EmptyState from '@/app/components/ui/EmptyState';
import Pagination from '@/app/components/ui/Pagination';


const STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];
const LISTING_TYPES = ['All', 'Sale', 'Rent'];

export default function AdminPropertiesPage() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('All');
  const [listingType, setListingType] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (status !== 'All') params.set('status', status);
      if (listingType !== 'All') params.set('listingType', listingType);
      if (search) params.set('search', search);
      const data = await adminAPI.getProperties(params.toString());
      setProperties(data.data || []);
      setPagination(data.pagination || {});
    } catch { toast('Failed to load properties', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProps(); }, [page, status, listingType]);
  useEffect(() => {
    const t = setTimeout(fetchProps, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveProperty(id);
      toast('Property approved');
      fetchProps();
    } catch { toast('Failed', 'error'); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try {
      await adminAPI.rejectProperty(id, { reason });
      toast('Property rejected');
      fetchProps();
    } catch { toast('Failed', 'error'); }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminAPI.toggleFeatured(id);
      toast('Featured status toggled');
      fetchProps();
    } catch { toast('Failed', 'error'); }
  };

  return (
    <DashboardLayout title="Properties" subtitle="Review, approve, and manage all property listings">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
            {STATUSES.map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-gray-200 last:border-0
                  ${status === s ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
            {LISTING_TYPES.map(t => (
              <button key={t} onClick={() => { setListingType(t); setPage(1); }}
                className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-gray-200 last:border-0
                  ${listingType === t ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <Link href="/dashboard/properties/add-property">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors whitespace-nowrap">
            <Plus size={14} /> Add Property
          </button>
        </Link>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gray-400 mb-4">
          {pagination.total || 0} propert{pagination.total === 1 ? 'y' : 'ies'} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState icon={Building2} title="No properties found" message="Try adjusting your filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p, i) => (
              <PropertyCard
                key={p._id}
                property={p}
                delay={i * 0.03}
                showAdminActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}
    </DashboardLayout>
  );
}