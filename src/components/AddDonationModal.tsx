import { useState } from "react";

// รับ Props จากหน้าหลัก
interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (province: string, schoolName: string, company: string, books: number) => void;
  provinces: string[];
  companies: string[];
}

export default function AddDonationModal({ isOpen, onClose, onSave, provinces, companies }: AddDonationModalProps) {
  // State สำหรับเก็บค่าฟอร์ม
  const [selectedProvince, setSelectedProvince] = useState(provinces[0] || "");
  const [schoolName, setSchoolName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || "");
  const [books, setBooks] = useState<number | "">("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvince || !schoolName || !selectedCompany || !books) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    // ส่งข้อมูลกลับไปให้หน้าหลัก
    onSave(selectedProvince, schoolName, selectedCompany, Number(books));
    
    // เคลียร์ฟอร์มและปิด Modal
    setSchoolName("");
    setBooks("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-emerald-50/50">
          <h3 className="text-xl font-extrabold text-emerald-900">บันทึกส่งมอบหนังสือใหม่</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-zinc-100 text-zinc-500 transition cursor-pointer shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. เลือกจังหวัด (Dropdown) */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">จังหวัดพื้นที่</label>
            <select 
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all cursor-pointer"
            >
              {provinces.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          {/* 2. ชื่อโรงเรียน (Input) */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">ชื่อโรงเรียน</label>
            <input 
              type="text" 
              placeholder="เช่น โรงเรียนบ้านทุ่งสว่าง..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>

          {/* 3. เลือกบริษัท (Dropdown) */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">บริษัทผู้สนับสนุน</label>
            <select 
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all cursor-pointer"
            >
              {companies.map((comp) => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>

          {/* 4. จำนวนหนังสือ (Input Number) */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">จำนวนหนังสือ (เล่ม)</label>
            <input 
              type="number" 
              placeholder="0"
              min="1"
              value={books}
              onChange={(e) => setBooks(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-md cursor-pointer"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}