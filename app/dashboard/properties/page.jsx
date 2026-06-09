'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Building2, Filter } from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import { propertyAPI } from '@/app/lib/api';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { ConfirmDialog } from '@/app/components/ui/Modal';
import Pagination from '@/app/components/ui/Pagination';
import PropertyCard from '@/app/components/dashboard/PropertyCard';
import EmptyState from '@/app/components/ui/EmptyState';


const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function MyPropertiesPage() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (status !== 'All') params.set('status', status);
      const data = await propertyAPI.getMy(params.toString());
      setProperties(data.data || []);
      setPagination(data.pagination || {});
    } catch { toast('Failed to load properties', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProps(); }, [page, status]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await propertyAPI.delete(deleteId);
      toast('Property deleted successfully');
      setDeleteId(null);
      fetchProps();
    } catch { toast('Failed to delete property', 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <DashboardLayout title="My Properties" subtitle="Manage your property listings">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${status === s
                  ? 'bg-[#004835] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[#004835]/40'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="sm:ml-auto">
          <Link href="/dashboard/properties/add-property">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors shadow-sm shadow-[#004835]/20">
              <Plus size={15} /> Add Property
            </button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties found"
          message={status === 'All' ? "You haven't submitted any properties yet." : `No ${status.toLowerCase()} properties.`}
          action={
            <Link href="/dashboard/properties/add-property">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors">
                <Plus size={15} /> Post Property
              </button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p, i) => (
              <PropertyCard key={p._id} property={p} delay={i * 0.04} onDelete={setDeleteId} />
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </DashboardLayout>
  );
}