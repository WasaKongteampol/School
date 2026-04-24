import { useState } from "react";

interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 📌 เพิ่ม students เข้าไปใน onSave
  onSave: (province: string, schoolName: string, company: string, books: number, students: number, status: 'completed' | 'pending') => void;
  selectedProvince: string;
  companies: string[];
}

export default function AddDonationModal({ isOpen, onClose, onSave, selectedProvince, companies }: AddDonationModalProps) {
  const [schoolName, setSchoolName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || "");
  const [books, setBooks] = useState<number | "">("");
  const [students, setStudents] = useState<number | "">(""); // 📌 State สำหรับเด็ก
  const [status, setStatus] = useState<'completed' | 'pending'>('completed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !selectedCompany || !books || !students) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (รวมถึงจำนวนเด็ก)");
      return;
    }
    
    onSave(selectedProvince, schoolName, selectedCompany, Number(books), Number(students), status);
    
    setSchoolName("");
    setBooks("");
    setStudents("");
    setStatus('completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-emerald-50/50">
          <h3 className="text-xl font-extrabold text-emerald-900">บันทึกส่งมอบหนังสือใหม่</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-zinc-100 text-zinc-500 transition cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">จังหวัดพื้นที่</label>
            <div className="relative">
              <input type="text" value={selectedProvince} disabled className="w-full p-3 pl-4 pr-10 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 font-bold outline-none cursor-not-allowed" />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">ชื่อโรงเรียน</label>
            <input type="text" placeholder="เช่น โรงเรียนบ้านทุ่งสว่าง..." value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">บริษัทผู้สนับสนุน</label>
            <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer">
              {companies.map((comp) => <option key={comp} value={comp}>{comp}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">จำนวนเด็ก (คน)</label>
              <input type="number" min="1" placeholder="0" value={students} onChange={(e) => setStudents(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">จำนวน (เล่ม)</label>
              <input type="number" min="1" placeholder="0" value={books} onChange={(e) => setBooks(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">สถานะโครงการ</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'completed' | 'pending')} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer">
                <option value="completed">ส่งมอบสำเร็จ</option>
                <option value="pending">กำลังดำเนินการ</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 transition cursor-pointer">ยกเลิก</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-md cursor-pointer">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
}