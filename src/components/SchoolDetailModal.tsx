import { useState, useEffect } from "react";
import { formatNumber, companyLogos } from "../utils/donationConfig";
import type { SchoolDonation } from "../utils/donationConfig";

interface SchoolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolDonation | null;
  province: string;
}

export default function SchoolDetailModal({ isOpen, onClose, school, province }: SchoolDetailModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [school?.company]);

  if (!isOpen || !school) return null;

  const logoUrl = companyLogos[school.company];

  const getShortCompanyName = (name: string) => {
    return name
      .replace("บริษัท ", "")
      .replace(" จำกัด (มหาชน)", "")
      .replace(" จำกัด", "");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-[1200px] rounded-[32px] shadow-2xl relative flex flex-col border border-zinc-200">

        {/* ปุ่มปิด */}
        <button onClick={() => { setImgError(false); onClose(); }} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition cursor-pointer z-20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8 md:px-12 md:py-10 w-full font-sans">
          <div className="mb-6 border-b border-zinc-100 pb-5">
             <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs mb-2">Detailed Report</p>
             <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">ข้อมูลการส่งมอบหนังสือ</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* --- ฝั่งซ้าย: ข้อมูลโรงเรียนและบริษัท --- */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] text-zinc-400 mb-1 uppercase tracking-widest font-bold">จังหวัด</p>
                  <p className="text-2xl font-extrabold text-zinc-900">{province}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 mb-1 uppercase tracking-widest font-bold">โรงเรียน</p>
                  <p className="text-2xl font-extrabold text-zinc-900">{school.name}</p>
                </div>
              </div>

              {/* สถิติตัวเลข */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-3xl p-5 border border-zinc-100 shadow-sm">
                  <p className="text-[11px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">จำนวนเด็กนักเรียน</p>
                  <p className="text-4xl font-black text-zinc-900">{formatNumber(school.students)} <span className="text-lg font-medium text-zinc-400">คน</span></p>
                </div>
                <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100 shadow-sm">
                  <p className="text-[11px] text-emerald-600 mb-2 font-bold uppercase tracking-wider">หนังสือที่บริจาคแล้ว</p>
                  <p className="text-4xl font-black text-emerald-600">{formatNumber(school.books)} <span className="text-lg font-medium text-emerald-400">เล่ม</span></p>
                </div>
              </div>

              {/* 📌 ส่วนบริษัทผู้สนับสนุน (Logo & Name) */}
              <div className="pt-1">
                <p className="text-[11px] text-zinc-400 mb-4 uppercase tracking-[0.2em] font-bold">Official Support By</p>
                
                <div className="flex flex-col items-start gap-5">
                  {/* ชื่อบริษัทขนาดใหญ่ */}
                  <div className="inline-flex items-center gap-4 bg-[#e8f7f0] border border-[#d1ebd9] rounded-2xl px-6 py-4 shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-[#2aaa6c] animate-pulse"></div>
                    <span className="text-2xl font-black text-[#0f6e56] leading-tight">{school.company}</span>
                  </div>

                  {/* 📌 โลโก้แบบขยายเต็มพื้นที่ (ลบ Padding ออก และขยายขนาดกรอบ) */}
                  <div className="h-[180px] w-full max-w-[450px] bg-white border border-zinc-200 rounded-[24px] overflow-hidden flex items-center justify-center p-0 shadow-md transition-transform hover:scale-[1.02]">
                    {logoUrl && !imgError ? (
                      <img
                        src={logoUrl}
                        alt={school.company}
                        className="w-full h-full object-contain mix-blend-multiply" 
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span className="text-3xl font-black text-emerald-600 text-center uppercase px-6">
                        {getShortCompanyName(school.company)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* --- ฝั่งขวา: รูปภาพและคำอธิบายโครงการ --- */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[24px] overflow-hidden shadow-lg aspect-[16/10] bg-zinc-100 flex items-center justify-center relative border border-zinc-200 group">
                {school.images && school.images.length > 0 ? (
                  <img 
                    src={school.images[0]} 
                    alt="ภาพโครงการ" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">No Image Available</span>
                  </div>
                )}
              </div>

              {/* กล่องคำอธิบายสีเข้ม */}
              <div className="bg-zinc-900 rounded-[24px] p-6 shadow-md border border-zinc-800">
                <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-widest border-b border-zinc-800 pb-2">Project Description</p>
                <p className="text-[14px] text-zinc-300 leading-[1.7] font-medium whitespace-pre-line text-left">
                  {school.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}