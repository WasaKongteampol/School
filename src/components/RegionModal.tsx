import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { formatNumber, calculateStatus, getProvinceColor, regionsConfig, provinceThMap, geoUrl } from "../utils/donationConfig";
import type { SchoolDonation, ProvinceData } from "../utils/donationConfig";

interface RegionModalProps {
  selectedRegion: string | null;
  onClose: () => void;
  regionSummary: any;
  donationData: Record<string, ProvinceData>;
  activeProvInRegion: string | null;
  setActiveProvInRegion: (prov: string | null) => void;
  onViewSchoolDetail: (school: SchoolDonation, province: string) => void;
  isAdmin: boolean;
  onCompleteStatus: (province: string, index: number) => void;
  onDeleteDonation: (province: string, index: number) => void;
}

export default function RegionModal({ selectedRegion, onClose, regionSummary, donationData, activeProvInRegion, setActiveProvInRegion, onViewSchoolDetail, isAdmin, onCompleteStatus, onDeleteDonation }: RegionModalProps) {
  if (!selectedRegion || !regionSummary) return null;
  
  const activeProvData = activeProvInRegion ? donationData[activeProvInRegion] : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-zinc-200">
        
        <div className="w-full md:w-[60%] bg-zinc-50 p-6 flex flex-col relative border-r border-zinc-200">
          <h3 className="text-2xl font-extrabold text-emerald-900 mb-2">แผนที่ {selectedRegion}</h3>
          <p className="text-sm text-zinc-500 mb-4">แสดงข้อมูลจากทั้งหมด {regionSummary.provincesCount} จังหวัด (คลิกที่แผนที่เพื่อดูข้อมูล)</p>
          <div className="flex-1 flex items-center justify-center relative bg-white rounded-2xl border border-zinc-200 shadow-inner overflow-hidden">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: regionsConfig[selectedRegion].scale, center: regionsConfig[selectedRegion].center }} className="w-full h-full">
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map((geo) => {
                    const provNameTh = provinceThMap[geo.properties.NAME_1] || geo.properties.NAME_1;
                    if (!regionsConfig[selectedRegion].provinces.includes(provNameTh)) return null;
                    const statusText = calculateStatus(donationData[provNameTh]);
                    const fillColor = getProvinceColor(statusText);
                    const centroid = geoCentroid(geo);
                    const isActive = activeProvInRegion === provNameTh;
                    return (
                      <g key={geo.rsmKey}>
                        <Geography geography={geo} onClick={() => setActiveProvInRegion(provNameTh)} className="cursor-pointer outline-none transition-all duration-300" style={{ default: { fill: fillColor, stroke: isActive ? "#10b981" : "#ffffff", strokeWidth: isActive ? 2.5 : 0.5 }, hover: { fill: fillColor, opacity: 0.8, stroke: "#10b981", strokeWidth: 2 }, pressed: { fill: fillColor, stroke: "#10b981", strokeWidth: 3 } }} />
                        <Marker coordinates={centroid}><text textAnchor="middle" y={1.5} className="pointer-events-none select-none font-bold transition-colors" style={{ fontSize: "14px", fill: statusText === "บริจาคซ้ำ" ? "#ffffff" : "#1e293b", paintOrder: "stroke fill", stroke: statusText === "บริจาคซ้ำ" ? "#0f172a" : "#ffffff", strokeWidth: "3px" }}>{provNameTh}</text></Marker>
                      </g>
                    );
                })}
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        <div className="w-full md:w-[40%] flex flex-col bg-white">
          {activeProvInRegion ? (
            <div className="flex-1 flex flex-col p-8 overflow-hidden animate-fade-in relative">
              <button onClick={() => setActiveProvInRegion(null)} className="text-emerald-600 text-sm font-bold flex items-center gap-1 mb-4 hover:text-emerald-700 transition-colors w-fit cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> กลับไปภาพรวมภูมิภาค
              </button>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-1">ข้อมูลระดับจังหวัด</h4>
                  <h2 className="text-3xl font-extrabold text-zinc-900">{activeProvInRegion}</h2>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <h4 className="text-sm font-bold text-zinc-500 mb-3 border-b border-zinc-100 pb-2">รายชื่อโรงเรียน ({activeProvData?.schools.length || 0} แห่ง)</h4>
                <div className="space-y-3">
                  {activeProvData && activeProvData.schools.length > 0 ? activeProvData.schools.map((school, index) => (
                    <div key={index} className="flex flex-col p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow relative overflow-hidden">
                      <div className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors ${school.status === 'completed' ? 'bg-emerald-500' : 'bg-[#ce9a2d]'}`}></div>
                      <div className="pl-2">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-zinc-800">{school.name}</h4>
                          <button onClick={() => onViewSchoolDetail(school, activeProvInRegion)} className="text-xs text-blue-500 hover:text-blue-700 font-bold underline cursor-pointer">ดูรายละเอียด</button>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">สนับสนุนโดย: <span className="text-emerald-700 font-bold">{school.company}</span></p>
                      </div>
                      <div className="pl-2 mt-3 pt-3 border-t border-zinc-50 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-medium mb-0.5">จำนวนหนังสือ</p>
                          <p className="text-xl font-black text-emerald-600">{formatNumber(school.books)} <span className="text-sm font-bold">เล่ม</span></p>
                        </div>
                        <div>
                          {school.status === 'pending' ? (
                            isAdmin ? (
                              <div className="flex gap-2">
                                <button onClick={() => onCompleteStatus(activeProvInRegion, index)} className="text-[10px] px-2 py-1 rounded-md font-bold border border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer">✅ สำเร็จ</button>
                                <button onClick={() => onDeleteDonation(activeProvInRegion, index)} className="text-[10px] px-2 py-1 rounded-md font-bold border border-red-500 text-red-600 hover:bg-red-50 cursor-pointer">🗑️ ลบ</button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md">⏳ กำลังดำเนินการ</span>
                            )
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">✅ เสร็จสิ้น</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (<p className="text-center text-zinc-400 py-6 text-sm">ยังไม่มีข้อมูลในจังหวัดนี้</p>)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-8 overflow-hidden animate-fade-in">
              <div className="flex justify-between items-start mb-8">
                <div><h4 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-1">สรุปข้อมูล</h4><h2 className="text-3xl font-extrabold text-zinc-900">ภาพรวม{selectedRegion}</h2></div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8 shrink-0">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100"><p className="text-sm text-emerald-700 font-medium mb-1">หนังสือรวม</p><p className="text-3xl font-black text-emerald-600">{formatNumber(regionSummary.totalBooks)}</p></div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100"><p className="text-sm text-amber-700 font-medium mb-1">โรงเรียนที่รับมอบ</p><p className="text-3xl font-black text-amber-600">{formatNumber(regionSummary.totalSchools)}</p></div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <h4 className="text-sm font-bold text-zinc-500 mb-3 border-b border-zinc-100 pb-2">ยอดบริจาคแยกรายจังหวัด</h4>
                <div className="space-y-2">
                  {regionsConfig[selectedRegion].provinces.map(prov => ({ prov, books: donationData[prov]?.totalBooks || 0 })).sort((a, b) => b.books - a.books).map(item => (
                    <button key={item.prov} onClick={() => setActiveProvInRegion(item.prov)} className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors cursor-pointer text-left group">
                      <span className="font-bold text-zinc-700 group-hover:text-emerald-800">{item.prov}</span><span className={`font-black ${item.books > 0 ? 'text-emerald-600' : 'text-zinc-400'}`}>{item.books > 0 ? formatNumber(item.books) + ' เล่ม' : '-'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}