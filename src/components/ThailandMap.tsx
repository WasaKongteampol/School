import { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

import { 
  geoUrl, provinceThMap, regionsConfig, thaiBevCompanies, allProvinceNames, 
  calculateStatus, getProvinceColor, generateInitialData, formatNumber 
} from "../utils/donationConfig";
import type { SchoolDonation } from "../utils/donationConfig";

import AddDonationModal from "./AddDonationModal"; 
import ProvinceModal from "./ProvinceModal";
import RegionModal from "./RegionModal";
import SchoolDetailModal from "./SchoolDetailModal";

export default function ThailandMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.5] as [number, number], zoom: 1 });
  
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeProvInRegion, setActiveProvInRegion] = useState<string | null>(null);
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState<{school: SchoolDonation, province: string} | null>(null);

  const [donationData, setDonationData] = useState(generateInitialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // 📌 สร้าง State ควบคุมสิทธิ์ (ค่าเริ่มต้นเป็น User)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { setIsListModalOpen(false); }, [selectedProvince]);
  useEffect(() => { if (!selectedRegion) setActiveProvInRegion(null); }, [selectedRegion]);

  const handleZoomIn = () => { if (position.zoom >= 4) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 })); };
  const handleZoomOut = () => { if (position.zoom <= 1) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 })); };
  const handleMoveEnd = (position: any) => { setPosition(position); };

  const handleAddNewDonation = (province: string, schoolName: string, company: string, books: number, students: number, status: 'completed' | 'pending') => {
    setDonationData(prev => {
      const prevProvData = prev[province] || { totalBooks: 0, schools: [] };
      return {
        ...prev, [province]: {
          totalBooks: prevProvData.totalBooks + books,
          schools: [{ 
            name: schoolName, books, students, company, status, 
            description: "ข้อมูลโครงการใหม่...", 
            images: ["https://picsum.photos/seed/n1/400/300", "https://picsum.photos/seed/n2/400/300", "https://picsum.photos/seed/n3/400/300", "https://picsum.photos/seed/n4/400/300"] 
          }, ...prevProvData.schools]
        }
      };
    });
    setSelectedProvince(province);
  };

  const handleCompleteStatus = (province: string, schoolIndex: number) => {
    setDonationData(prev => {
      const prevProvData = prev[province];
      if (!prevProvData) return prev;
      const newSchools = [...prevProvData.schools];
      newSchools[schoolIndex] = { ...newSchools[schoolIndex], status: 'completed' };
      return { ...prev, [province]: { ...prevProvData, schools: newSchools } };
    });
  };

  const handleDeleteDonation = (province: string, schoolIndex: number) => {
    const isConfirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?");
    if (!isConfirm) return;
    setDonationData(prev => {
      const prevProvData = prev[province];
      if (!prevProvData) return prev;
      const newSchools = [...prevProvData.schools];
      const removedSchool = newSchools.splice(schoolIndex, 1)[0];
      return { ...prev, [province]: { totalBooks: prevProvData.totalBooks - removedSchool.books, schools: newSchools } };
    });
  };

  const provinceData = selectedProvince ? donationData[selectedProvince] : null;
  const currentProvinceStatus = calculateStatus(provinceData);

  const nationalTotalBooks = useMemo(() => Object.values(donationData).reduce((sum, item) => sum + item.totalBooks, 0), [donationData]);
  const filteredProvinces = useMemo(() => !searchTerm ? [] : allProvinceNames.filter(prov => prov.includes(searchTerm)), [searchTerm]);

  const regionSummary = useMemo(() => {
    if (!selectedRegion) return null;
    let totalBooks = 0, totalSchools = 0;
    regionsConfig[selectedRegion].provinces.forEach(prov => {
      if (donationData[prov]) {
        totalBooks += donationData[prov].totalBooks;
        totalSchools += donationData[prov].schools.length;
      }
    });
    return { totalBooks, totalSchools, provincesCount: regionsConfig[selectedRegion].provinces.length };
  }, [selectedRegion, donationData]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 relative">
      
      <AddDonationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddNewDonation} selectedProvince={selectedProvince || ""} companies={thaiBevCompanies} />
      
      {/* 📌 ส่ง isAdmin ไปให้ Popup ย่อยเพื่อซ่อน/แสดงปุ่ม */}
      <ProvinceModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} selectedProvince={selectedProvince} provinceData={provinceData} currentProvinceStatus={currentProvinceStatus} onCompleteStatus={handleCompleteStatus} onDeleteDonation={handleDeleteDonation} onViewSchoolDetail={(school, prov) => setSelectedSchoolDetail({school, province: prov})} isAdmin={isAdmin} />
      
      <RegionModal selectedRegion={selectedRegion} onClose={() => setSelectedRegion(null)} regionSummary={regionSummary} donationData={donationData} activeProvInRegion={activeProvInRegion} setActiveProvInRegion={setActiveProvInRegion} onViewSchoolDetail={(school, prov) => setSelectedSchoolDetail({school, province: prov})} isAdmin={isAdmin} onCompleteStatus={handleCompleteStatus} onDeleteDonation={handleDeleteDonation} />
      
      <SchoolDetailModal isOpen={!!selectedSchoolDetail} onClose={() => setSelectedSchoolDetail(null)} school={selectedSchoolDetail?.school || null} province={selectedSchoolDetail?.province || ""} />

      {/* แผนที่ซ้ายมือ... */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-white shadow-inner overflow-hidden">
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-zinc-200 z-10 pointer-events-none">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">สถานะโครงการ</h4>
          <div className="space-y-3">
            <LegendItem color="#1e3a8a" label="บริจาคซ้ำ" />
            <LegendItem color="#38bdf8" label="บริจาคแล้ว" />
            <LegendItem color="#ce9a2d" label="กำลังดำเนินการ" />
            <LegendItem color="#d4d4d8" label="ยังไม่บริจาค" />
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [100.5, 13.5] }} className="w-full h-full max-h-[90vh]">
            <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd} maxZoom={4}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceNameTh = provinceThMap[geo.properties.NAME_1] || geo.properties.NAME_1;
                    const isSelected = selectedProvince === provinceNameTh;
                    const centroid = geoCentroid(geo);
                    const statusText = calculateStatus(donationData[provinceNameTh]);
                    const fillColor = getProvinceColor(statusText);

                    return (
                      <g key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          onClick={() => setSelectedProvince(provinceNameTh)}
                          className="cursor-pointer outline-none transition-all duration-300"
                          style={{
                            default: { fill: fillColor, stroke: isSelected ? "#ffffff" : "rgba(255,255,255,0.4)", strokeWidth: isSelected ? 1.5 / position.zoom : 0.5 / position.zoom },
                            hover: { fill: fillColor, opacity: 0.8, stroke: "#ffffff", strokeWidth: 1.5 / position.zoom },
                            pressed: { fill: fillColor, stroke: "#ffffff", strokeWidth: 2 / position.zoom },
                          }}
                        />
                        <Marker coordinates={centroid}>
                          <text
                            textAnchor="middle" y={1.5}
                            className="pointer-events-none select-none font-bold tracking-wide transition-colors duration-300"
                            style={{ 
                              fontSize: `${5.5 / position.zoom}px`, 
                              fill: statusText === "บริจาคซ้ำ" ? "#ffffff" : "#1e293b",
                              paintOrder: "stroke fill", stroke: statusText === "บริจาคซ้ำ" ? "#0f172a" : "#ffffff", strokeWidth: `${1.2 / position.zoom}px`,
                              strokeLinecap: "round", strokeLinejoin: "round",
                            }}
                          >
                            {provinceNameTh}
                          </text>
                        </Marker>
                      </g>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
        
        <div className="absolute bottom-8 right-8 flex gap-1 bg-white p-1 rounded-xl shadow-md border border-zinc-200">
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer">−</button>
          <div className="w-[1px] bg-zinc-200 my-2"></div>
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer">+</button>
        </div>
      </div>

      {/* ส่วนขวา: Side Panel สรุปข้อมูล */}
      <div className="w-full md:w-[380px] lg:w-[450px] border-l border-zinc-200 p-8 md:p-10 flex flex-col bg-white z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] h-screen">
        
        {/* 📌 ปรับ Header เพื่อใส่ สวิตช์สลับโหมด Admin / User */}
        <header className="mb-8 shrink-0 flex justify-between items-start">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /><path d="M12 2v4a2 2 0 002 2h4" /></svg>
              CSR Dashboard
            </h1>
            <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tighter">ระบบติดตาม<br/>หนังสือบริจาค</h2>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 bg-zinc-50 p-2.5 rounded-2xl border border-zinc-200 shadow-sm cursor-pointer" onClick={() => setIsAdmin(!isAdmin)}>
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Mode</span>
             <div className="flex items-center gap-2">
                <span className={`text-xs font-bold transition-colors ${!isAdmin ? 'text-zinc-800' : 'text-zinc-400'}`}>User</span>
                <div className={`w-9 h-5 rounded-full relative transition-colors ${isAdmin ? 'bg-zinc-800' : 'bg-emerald-500'}`}>
                   <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${isAdmin ? 'left-[19px]' : 'left-1'}`}></div>
                </div>
                <span className={`text-xs font-bold transition-colors ${isAdmin ? 'text-zinc-800' : 'text-zinc-400'}`}>Admin</span>
             </div>
          </div>
        </header>

        <div className="relative z-20 mb-6 shrink-0">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text" placeholder="ค้นหาชื่อจังหวัด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchDropdown(true)} onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)} 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>
          {showSearchDropdown && searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-hidden">
              {filteredProvinces.length > 0 ? (
                filteredProvinces.map(prov => (
                  <button key={prov} onClick={() => { setSelectedProvince(prov); setSearchTerm(""); setShowSearchDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-emerald-50 focus:bg-emerald-50 transition-colors text-zinc-800 font-medium cursor-pointer border-b border-zinc-50 last:border-0">
                    {prov}
                  </button>
                ))
              ) : (<div className="px-4 py-3 text-zinc-500 text-sm text-center">ไม่พบจังหวัด "{searchTerm}"</div>)}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {selectedProvince && provinceData ? (
            <article className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 transition-colors" style={{ backgroundColor: getProvinceColor(currentProvinceStatus) }}></div>
                <p className="text-sm text-emerald-700 font-medium mb-1 mt-1">พื้นที่จังหวัด</p>
                <h3 className="text-4xl font-extrabold text-emerald-950 tracking-tight mb-4">{selectedProvince}</h3>
                <div className="pt-4 border-t border-emerald-200/50">
                  <p className="text-sm text-emerald-700 font-medium mb-1">หนังสือส่งมอบรวม</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tight">{formatNumber(provinceData.totalBooks)} <span className="text-xl">เล่ม</span></p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-zinc-800">ข้อมูลสรุป</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="โรงเรียนที่รับมอบ" value={`${formatNumber(provinceData.schools.length)} แห่ง`} />
                  <InfoCard title="สถานะ" value={currentProvinceStatus} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setIsListModalOpen(true)} className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition cursor-pointer">ดูรายละเอียดโรงเรียน</button>
                <button onClick={() => setSelectedProvince(null)} className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-semibold text-sm hover:bg-zinc-200 transition cursor-pointer">ปิด</button>
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-start pt-2 pb-10 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">ยอดบริจาคทั้งประเทศ</h3>
              <p className="text-5xl font-black text-emerald-600 mb-8">{formatNumber(nationalTotalBooks)} <span className="text-2xl">เล่ม</span></p>
              
              <div className="w-full border-t border-zinc-100 pt-8">
                <h4 className="text-sm font-bold text-zinc-500 mb-4 text-left">ดูข้อมูลแยกตามภูมิภาค</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(regionsConfig).map(region => (
                    <button key={region} onClick={() => setSelectedRegion(region)} className="px-4 py-3 text-left rounded-xl border border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-700 font-bold text-sm transition-all shadow-sm cursor-pointer">
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 📌 3. เช็คสถานะ Admin ซ่อน/แสดงปุ่มเพิ่มข้อมูลด้านล่างสุด */}
        {selectedProvince && isAdmin && (
          <div className="shrink-0 pt-6 border-t border-zinc-100 mt-auto animate-fade-in">
            <button onClick={() => setIsAddModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 text-white font-bold text-md hover:bg-zinc-800 hover:shadow-lg transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> เพิ่มบันทึกส่งมอบใน {selectedProvince}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: color }}></div><span className="text-sm font-bold text-zinc-700">{label}</span>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-500 mb-2 font-medium">{title}</p><p className="text-xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}