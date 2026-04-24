import { formatNumber } from "../utils/donationConfig";
import type { ProvinceData, SchoolDonation } from "../utils/donationConfig";

interface ProvinceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvince: string | null;
  provinceData: ProvinceData | null;
  currentProvinceStatus: string;
  onCompleteStatus: (province: string, index: number) => void;
  onDeleteDonation: (province: string, index: number) => void;
  onViewSchoolDetail: (school: SchoolDonation, province: string) => void;
  // 📌 1. เพิ่ม Prop รับค่าสถานะ Admin
  isAdmin: boolean;
}

export default function ProvinceModal({ isOpen, onClose, selectedProvince, provinceData, currentProvinceStatus, onCompleteStatus, onDeleteDonation, onViewSchoolDetail, isAdmin }: ProvinceModalProps) {
  if (!isOpen || !selectedProvince || !provinceData) return null;

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h3 className="text-2xl font-extrabold text-zinc-900">โครงการใน {selectedProvince}</h3>
            <p className="text-sm text-zinc-500 mt-1">
              สถานะภาพรวม: <span className="font-bold text-emerald-600">{currentProvinceStatus}</span> (จำนวน {provinceData.schools.length} โรงเรียน)
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="space-y-4">
            {provinceData.schools.length > 0 ? provinceData.schools.map((school, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow relative overflow-hidden">
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors ${school.status === 'completed' ? 'bg-emerald-500' : 'bg-[#ce9a2d]'}`}></div>
                <div className="mb-2 sm:mb-0 pl-3 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-xl font-bold text-zinc-800">{school.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${school.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {school.status === 'completed' ? 'สำเร็จ' : 'กำลังดำเนินการ'}
                    </span>
                    <button onClick={() => onViewSchoolDetail(school, selectedProvince)} className="ml-2 text-xs text-blue-500 hover:text-blue-700 font-bold underline cursor-pointer">
                      ดูรายละเอียด
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">สนับสนุนโดย: <span className="text-emerald-700 font-bold">{school.company}</span></p>
                </div>
                <div className="text-left sm:text-right pl-3 sm:pl-0 flex flex-col items-start sm:items-end">
                  <p className="text-2xl font-black text-emerald-600">{formatNumber(school.books)} <span className="text-lg font-bold">เล่ม</span></p>
                  
                  {/* 📌 2. เช็คว่าถ้าเป็น Admin ถึงจะแสดงปุ่มแก้ไข ถ้าไม่ใช่ให้แสดงแค่ป้ายสถานะ */}
                  {school.status === 'pending' ? (
                    isAdmin ? (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => onCompleteStatus(selectedProvince, index)} className="text-xs px-3 py-1.5 rounded-full font-bold transition-all border bg-white border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer">✅ ปรับเป็นสำเร็จ</button>
                        <button onClick={() => onDeleteDonation(selectedProvince, index)} className="text-xs px-3 py-1.5 rounded-full font-bold transition-all border bg-white border-red-500 text-red-600 hover:bg-red-50 cursor-pointer">🗑️ ลบ</button>
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-md">⏳ กำลังดำเนินการ</div>
                    )
                  ) : (
                    <div className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">✅ เสร็จสิ้น</div>
                  )}
                </div>
              </div>
            )) : (<p className="text-center text-zinc-500 py-10 font-medium">ยังไม่มีข้อมูลการส่งมอบหนังสือ</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}