'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MapPin, Clock, CheckCircle, Loader, XCircle } from 'lucide-react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import EmptyState from '@/app/components/ui/EmptyState';
import { userAPI } from '@/app/lib/api';
import Pagination from '@/app/components/ui/Pagination';


const BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const STATUS_STYLES = {
  Open:        'bg-blue-50 text-blue-600 border-blue-200',
  'In Progress':'bg-amber-50 text-amber-600 border-amber-200',
  Resolved:    'bg-emerald-50 text-emerald-600 border-emerald-200',
  Closed:      'bg-gray-50 text-gray-500 border-gray-200',
};

const TYPE_STYLES = {
  General:  'bg-purple-50 text-purple-600',
  Purchase: 'bg-[#004835]/8 text-[#004835]',
  Visit:    'bg-[#C89A6C]/15 text-[#8B6035]',
};

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userAPI.getInquiries(`page=${page}&limit=8`)
      .then(d => { setInquiries(d.data || []); setPagination(d.pagination || {}); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <DashboardLayout title="My Inquiries" subtitle="Track your property inquiries and purchase requests">
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No inquiries yet" message="Your submitted inquiries will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {inquiries.map((inq, i) => {
              const thumb = inq.property?.thumbnail
                ? `${BASE}/uploads/thumbnails/${inq.property.thumbnail}`
                : null;
              return (
                <motion.div
                  key={inq._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Property thumbnail */}
                    {thumb && (
                      <img src={thumb} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" onError={e => e.target.style.display='none'} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {inq.property?.title || 'Property'}
                          </h3>
                          {inq.property?.city && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <MapPin size={10} className="text-[#004835]" />
                              {inq.property.city}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${TYPE_STYLES[inq.inquiryType] || ''}`}>
                            {inq.inquiryType}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[inq.status] || ''}`}>
                            {inq.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{inq.message}</p>
                      {inq.adminNotes && (
                        <div className="mt-2 px-3 py-2 bg-[#004835]/5 rounded-lg text-xs text-[#004835]">
                          <strong>Admin note:</strong> {inq.adminNotes}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Clock size={10} />
                        {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}
    </DashboardLayout>
  );
}