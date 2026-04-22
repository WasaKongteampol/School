import { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import AddDonationModal from "./AddDonationModal"; 

const geoUrl = "https://raw.githubusercontent.com/cvibhagool/thailand-map/master/thailand-provinces.topojson";

const provinceThMap: Record<string, string> = {
  "Amnat Charoen": "อำนาจเจริญ", "Ang Thong": "อ่างทอง", "Bangkok Metropolis": "กทม.", "Bangkok Metrop.": "กทม.", "Bangkok": "กทม.",
  "Bueng Kan": "บึงกาฬ", "Buri Ram": "บุรีรัมย์", "Chachoengsao": "ฉะเชิงเทรา", "Chai Nat": "ชัยนาท", "Chaiyaphum": "ชัยภูมิ",
  "Chanthaburi": "จันทบุรี", "Chiang Mai": "เชียงใหม่", "Chiang Rai": "เชียงราย", "Chon Buri": "ชลบุรี", "Chumphon": "ชุมพร",
  "Kalasin": "กาฬสินธุ์", "Kamphaeng Phet": "กำแพงเพชร", "Kanchanaburi": "กาญจนบุรี", "Khon Kaen": "ขอนแก่น", "Krabi": "กระบี่",
  "Lop Buri": "ลพบุรี", "Loei": "เลย", "Lampang": "ลำปาง", "Lamphun": "ลำพูน", "Mukdahan": "มุกดาหาร", "Mae Hong Son": "แม่ฮ่องสอน",
  "Maha Sarakham": "มหาสารคาม", "Nakhon Nayok": "นครนายก", "Nakhon Pathom": "นครปฐม", "Nakhon Phanom": "นครพนม",
  "Nakhon Ratchasima": "นครราชสีมา", "Nakhon Sawan": "นครสวรรค์", "Nakhon Si Thammarat": "นครศรีธรรมราช", "Nan": "น่าน",
  "Narathiwat": "นราธิวาส", "Nong Bua Lam Phu": "หนองบัวลำภู", "Nong Khai": "หนองคาย", "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี", "Pattani": "ปัตตานี", "Phangnga": "พังงา", "Phatthalung": "พัทลุง", "Phayao": "พะเยา",
  "Phetchabun": "เพชรบูรณ์", "Phetchaburi": "เพชรบุรี", "Phichit": "พิจิตร", "Phitsanulok": "พิษณุโลก",
  "Phra Nakhon Si Ayutthaya": "อยุธยา", "Ayutthaya": "อยุธยา", "Phrae": "แพร่", "Phuket": "ภูเก็ต",
  "Prachin Buri": "ปราจีนบุรี", "Prachuap Khiri Khan": "ประจวบฯ", "Ranong": "ระนอง", "Ratchaburi": "ราชบุรี",
  "Rayong": "ระยอง", "Roi Et": "ร้อยเอ็ด", "Sa Kaeo": "สระแก้ว", "Sakon Nakhon": "สกลนคร", "Samut Prakan": "สมุทรปราการ",
  "Samut Sakhon": "สมุทรสาคร", "Samut Songkhram": "สมุทรสงคราม", "Saraburi": "สระบุรี", "Satun": "สตูล",
  "Sing Buri": "สิงห์บุรี", "Si Sa Ket": "ศรีสะเกษ", "Songkhla": "สงขลา", "Sukhothai": "สุโขทัย", "Suphan Buri": "สุพรรณบุรี",
  "Surat Thani": "สุราษฎร์ธานี", "Surin": "สุรินทร์", "Tak": "ตาก", "Trang": "ตรัง", "Trat": "ตราด",
  "Ubon Ratchathani": "อุบลราชธานี", "Udon Thani": "อุดรธานี", "Uthai Thani": "อุทัยธานี", "Uttaradit": "อุตรดิตถ์",
  "Yala": "ยะลา", "Yasothon": "ยโสธร"
};

const thaiBevCompanies = [
  "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)", "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)", "บริษัท เสริมสุข จำกัด (มหาชน)", 
  "บริษัท ช้างอินเตอร์เนชั่นแนล จำกัด", "บริษัท เอฟแอนด์เอ็น แดรี่ส์ (ประเทศไทย) จำกัด", "บริษัท แสงโสม จำกัด",
  "บริษัท เดอะ คิวเอสอาร์ ออฟ เอเชีย จำกัด", "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)", "บริษัท เบอร์ลี่ ยุคเกอร์ จำกัด (มหาชน) (BJC)"
];

const allProvinceNames = Array.from(new Set(Object.values(provinceThMap))).sort((a, b) => a.localeCompare(b, 'th'));

type SchoolDonation = { name: string; books: number; company: string; status: 'completed' | 'pending' };
type ProvinceData = { totalBooks: number; schools: SchoolDonation[] };

const calculateStatus = (data: ProvinceData | null) => {
  if (!data || data.schools.length === 0) return "ยังไม่บริจาค";
  
  const completedCount = data.schools.filter(s => s.status === 'completed').length;
  const pendingCount = data.schools.filter(s => s.status === 'pending').length;

  if (completedCount >= 2) return "บริจาคซ้ำ";
  if (completedCount === 1) return "บริจาคแล้ว";
  if (pendingCount > 0) return "กำลังดำเนินการ";
  return "ยังไม่บริจาค";
};

// 🎨 ฟังก์ชันกำหนดสีแผนที่
const getProvinceColor = (status: string) => {
  switch (status) {
    case "บริจาคซ้ำ": return "#1e3a8a"; // น้ำเงินเข้ม
    case "บริจาคแล้ว": return "#38bdf8"; // ฟ้า
    case "กำลังดำเนินการ": return "#ce9a2d"; // สีที่แก้ไขใหม่ (ทอง/ส้ม)
    default: return "#d4d4d8"; // เทา
  }
};

const generateInitialData = () => {
  const data: Record<string, ProvinceData> = {
    "กทม.": { 
      totalBooks: 8500, 
      schools: [
        { name: "โรงเรียนเตรียมอุดมศึกษา", books: 5000, company: "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)", status: 'completed' },
        { name: "โรงเรียนสวนกุหลาบวิทยาลัย", books: 3500, company: "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)", status: 'pending' }, // เปลี่ยนกทมให้มี pending ไว้เทสต์
      ]
    }
  };
  
  allProvinceNames.forEach(province => {
    if (!data[province]) {
      const statusRandom = Math.random();
      let schoolCount = 0;
      let generateStatus: 'completed' | 'pending' = 'completed';

      if (statusRandom > 0.8) { schoolCount = 0; } 
      else if (statusRandom > 0.5) { schoolCount = 1; generateStatus = 'pending'; } 
      else if (statusRandom > 0.2) { schoolCount = 1; generateStatus = 'completed'; } 
      else { schoolCount = Math.floor(Math.random() * 2) + 2; generateStatus = 'completed'; }

      if (schoolCount === 0) {
        data[province] = { totalBooks: 0, schools: [] };
      } else {
        const generatedSchools: SchoolDonation[] = [];
        let currentTotal = 0;
        for (let i = 0; i < schoolCount; i++) {
          const books = Math.floor(Math.random() * 2000) + 500;
          const randomCompany = thaiBevCompanies[Math.floor(Math.random() * thaiBevCompanies.length)];
          // สุ่มผสม pending และ completed ให้ดูสมจริง
          const indvStatus = Math.random() > 0.3 ? generateStatus : (generateStatus === 'completed' ? 'pending' : 'completed');
          generatedSchools.push({ name: `โรงเรียนชุมชน${province} ${i+1}`, books, company: randomCompany, status: indvStatus });
          currentTotal += books;
        }
        data[province] = { totalBooks: currentTotal, schools: generatedSchools };
      }
    }
  });
  return data;
};

export default function ThailandMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.5] as [number, number], zoom: 1 });
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [donationData, setDonationData] = useState(generateInitialData);

  useEffect(() => { setIsListModalOpen(false); }, [selectedProvince]);

  const handleZoomIn = () => { if (position.zoom >= 4) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 })); };
  const handleZoomOut = () => { if (position.zoom <= 1) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 })); };
  const handleMoveEnd = (position: any) => { setPosition(position); };

  // 📌 ฟังก์ชันเพิ่มข้อมูลใหม่
  const handleAddNewDonation = (province: string, schoolName: string, company: string, books: number, status: 'completed' | 'pending') => {
    setDonationData(prev => {
      const prevProvData = prev[province] || { totalBooks: 0, schools: [] };
      return {
        ...prev,
        [province]: {
          totalBooks: prevProvData.totalBooks + books,
          schools: [
            { name: schoolName, books, company, status },
            ...prevProvData.schools
          ]
        }
      };
    });
    setSelectedProvince(province);
  };

  // 📌 1. ฟังก์ชันใหม่: สำหรับเปลี่ยนสถานะโครงการ (Toggle Status)
  const handleToggleStatus = (province: string, schoolIndex: number) => {
    setDonationData(prev => {
      const prevProvData = prev[province];
      if (!prevProvData) return prev;
      
      const newSchools = [...prevProvData.schools];
      const currentStatus = newSchools[schoolIndex].status;
      
      // สลับสถานะ
      newSchools[schoolIndex] = {
        ...newSchools[schoolIndex],
        status: currentStatus === 'pending' ? 'completed' : 'pending'
      };

      return {
        ...prev,
        [province]: {
          ...prevProvData,
          schools: newSchools
        }
      };
    });
  };

  const provinceData = selectedProvince ? donationData[selectedProvince] : null;
  const currentProvinceStatus = calculateStatus(provinceData);
  const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num);

  const nationalTotalBooks = useMemo(() => {
    return Object.values(donationData).reduce((sum, item) => sum + item.totalBooks, 0);
  }, [donationData]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 relative">
      
      <AddDonationModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddNewDonation}
        provinces={allProvinceNames}
        companies={thaiBevCompanies}
      />

      {/* Modal รายละเอียดโรงเรียน */}
      {isListModalOpen && selectedProvince && provinceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900">โครงการใน {selectedProvince}</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  สถานะภาพรวม: <span className="font-bold text-emerald-600">{currentProvinceStatus}</span> (จำนวน {provinceData.schools.length} โรงเรียน)
                </p>
              </div>
              <button onClick={() => setIsListModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="space-y-4">
                {provinceData.schools.length > 0 ? provinceData.schools.map((school, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors ${school.status === 'completed' ? 'bg-emerald-500' : 'bg-[#ce9a2d]'}`}></div>
                    
                    <div className="mb-2 sm:mb-0 pl-3 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold text-zinc-800">{school.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${school.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {school.status === 'completed' ? 'สำเร็จ' : 'กำลังดำเนินการ'}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 font-medium">
                        สนับสนุนโดย: <span className="text-emerald-700 font-bold">{school.company}</span>
                      </p>
                    </div>
                    
                    {/* 📌 2. ส่วนแสดงตัวเลขและปุ่มเปลี่ยนสถานะ */}
                    <div className="text-left sm:text-right pl-3 sm:pl-0 flex flex-col items-start sm:items-end">
                      <p className="text-2xl font-black text-emerald-600">{formatNumber(school.books)} <span className="text-lg font-bold">เล่ม</span></p>
                      
                      {/* ปุ่มกดสลับสถานะ */}
                      <button 
                        onClick={() => handleToggleStatus(selectedProvince, index)}
                        className={`mt-2 text-xs px-3 py-1.5 rounded-full font-bold transition-all border cursor-pointer ${
                          school.status === 'pending' 
                            ? 'bg-white border-emerald-500 text-emerald-600 hover:bg-emerald-50' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                        }`}
                      >
                        {school.status === 'pending' ? '✅ ปรับเป็นสำเร็จ' : '↺ ยกเลิกการสำเร็จ'}
                      </button>
                    </div>

                  </div>
                )) : (
                  <p className="text-center text-zinc-500 py-10 font-medium">ยังไม่มีข้อมูลการส่งมอบหนังสือ</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ส่วนซ้าย: แผนที่ */}
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
                    const provinceNameEng = geo.properties.NAME_1; 
                    const provinceNameTh = provinceThMap[provinceNameEng] || provinceNameEng;
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
                            textAnchor="middle"
                            y={1.5}
                            className="pointer-events-none select-none font-bold tracking-wide transition-colors duration-300"
                            style={{ 
                              fontSize: `${5.5 / position.zoom}px`,
                              fill: statusText === "บริจาคซ้ำ" ? "#ffffff" : "#1e293b",
                              paintOrder: "stroke fill",
                              stroke: statusText === "บริจาคซ้ำ" ? "#0f172a" : "#ffffff",
                              strokeWidth: `${1.2 / position.zoom}px`,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
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
      <div className="w-full md:w-[380px] lg:w-[450px] border-l border-zinc-200 p-10 flex flex-col bg-white z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] h-screen">
        
        <header className="mb-10 shrink-0">
          <h1 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /><path d="M12 2v4a2 2 0 002 2h4" /></svg>
            Books Donation Dashboard
          </h1>
          <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tighter">
            ระบบติดตาม<br/>หนังสือบริจาค
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {selectedProvince && provinceData ? (
            <article className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 transition-colors" style={{ backgroundColor: getProvinceColor(currentProvinceStatus) }}></div>
                <p className="text-sm text-emerald-700 font-medium mb-1 mt-1">พื้นที่จังหวัด</p>
                <h3 className="text-4xl font-extrabold text-emerald-950 tracking-tight mb-4">{selectedProvince}</h3>
                <div className="pt-4 border-t border-emerald-200/50">
                  <p className="text-sm text-emerald-700 font-medium mb-1">หนังสือส่งมอบรวม</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tight">
                    {formatNumber(provinceData.totalBooks)} <span className="text-xl">เล่ม</span>
                  </p>
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
                <button 
                  onClick={() => setIsListModalOpen(true)}
                  className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition cursor-pointer"
                >
                  ดูรายละเอียดโรงเรียน
                </button>
                <button 
                  onClick={() => setSelectedProvince(null)}
                  className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-semibold text-sm hover:bg-zinc-200 transition cursor-pointer"
                >
                  ปิด
                </button>
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center pb-20">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">ยอดบริจาคทั้งประเทศ</h3>
              <p className="text-5xl font-black text-emerald-600 mb-4">{formatNumber(nationalTotalBooks)} <span className="text-2xl">เล่ม</span></p>
              <p className="text-zinc-500 max-w-xs text-sm">คลิกที่พื้นที่บนแผนที่เพื่อดูข้อมูลแยกระดับจังหวัด</p>
            </div>
          )}
        </div>

        <div className="shrink-0 pt-6 border-t border-zinc-100 mt-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 text-white font-bold text-md hover:bg-zinc-800 hover:shadow-lg transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            เพิ่มบันทึกส่งมอบใหม่
          </button>
        </div>

      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: color }}></div>
      <span className="text-sm font-bold text-zinc-700">{label}</span>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-500 mb-2 font-medium">{title}</p>
      <p className="text-xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}