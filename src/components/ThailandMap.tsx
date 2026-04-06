import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

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

// 📌 รายชื่อบริษัทในเครือ ThaiBev และบริษัทในกลุ่ม
const thaiBevCompanies = [
  "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)", 
  "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)", 
  "บริษัท เสริมสุข จำกัด (มหาชน)", 
  "บริษัท ช้างอินเตอร์เนชั่นแนล จำกัด", 
  "บริษัท เอฟแอนด์เอ็น แดรี่ส์ (ประเทศไทย) จำกัด",
  "บริษัท แสงโสม จำกัด",
  "บริษัท เดอะ คิวเอสอาร์ ออฟ เอเชีย จำกัด", // ผู้บริหาร KFC
  "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)",
  "บริษัท เบอร์ลี่ ยุคเกอร์ จำกัด (มหาชน) (BJC)"
];

// 🌟 ข้อมูลหลัก (Mock Data) สำหรับ กทม. เปลี่ยนเป็นเครือ ThaiBev
const mockDonationData: Record<string, { totalAmount: number; schools: { name: string; amount: number; company: string }[] }> = {
  "กทม.": { 
    totalAmount: 5450000, 
    schools: [
      { name: "โรงเรียนเตรียมอุดมศึกษา", amount: 1500000, company: "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)" },
      { name: "โรงเรียนสวนกุหลาบวิทยาลัย", amount: 1200000, company: "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)" },
      { name: "โรงเรียนสตรีวิทยา", amount: 800000, company: "บริษัท เสริมสุข จำกัด (มหาชน)" },
      { name: "โรงเรียนสามเสนวิทยาลัย", amount: 1950000, company: "บริษัท ช้างอินเตอร์เนชั่นแนล จำกัด" },
    ]
  }
};

// สุ่มสร้างข้อมูลให้จังหวัดที่เหลือ (ใช้ชื่อเครือ ThaiBev)
const allProvinces = Array.from(new Set(Object.values(provinceThMap)));
allProvinces.forEach(province => {
  if (!mockDonationData[province]) {
    const statusRandom = Math.random();
    let targetAmount = 0;
    
    if (statusRandom > 0.85) targetAmount = 0; 
    else if (statusRandom > 0.5) targetAmount = Math.floor(Math.random() * 400000) + 50000; 
    else if (statusRandom > 0.15) targetAmount = Math.floor(Math.random() * 1000000) + 500000; 
    else targetAmount = Math.floor(Math.random() * 2000000) + 1600000; 

    if (targetAmount === 0) {
      mockDonationData[province] = { totalAmount: 0, schools: [] };
    } else {
      const schoolCount = Math.floor(Math.random() * 4) + 2; 
      const generatedSchools = [];
      let currentTotal = 0;
      
      for (let i = 0; i < schoolCount; i++) {
        const amount = Math.floor(targetAmount / schoolCount);
        // สุ่มชื่อบริษัทในเครือ ThaiBev
        const randomCompany = thaiBevCompanies[Math.floor(Math.random() * thaiBevCompanies.length)];
        generatedSchools.push({ name: `โรงเรียนชุมชน${province} ${i+1}`, amount: amount, company: randomCompany });
        currentTotal += amount;
      }
      mockDonationData[province] = { totalAmount: currentTotal, schools: generatedSchools };
    }
  }
});

// 🎨 ฟังก์ชันกำหนดสีแผนที่ตามเกณฑ์ยอดบริจาค
const getProvinceColor = (amount: number) => {
  if (amount >= 1500000) return "#1e3a8a"; // บริจาคเยอะแล้ว
  if (amount >= 500000) return "#38bdf8";  // บริจาคพอสมควร
  if (amount > 0) return "#ce9a2d";        // กำลังดำเนินการ
  return "#d4d4d8";                        // ยังไม่มี
};

export default function ThailandMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.5] as [number, number], zoom: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setIsModalOpen(false); }, [selectedProvince]);

  const handleZoomIn = () => { if (position.zoom >= 4) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 })); };
  const handleZoomOut = () => { if (position.zoom <= 1) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 })); };
  const handleMoveEnd = (position: any) => { setPosition(position); };

  const provinceData = selectedProvince ? mockDonationData[selectedProvince] : null;

  const formatCurrency = (num: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(num);
  const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 relative">
      
      {/* ================= Modal Popup รายชื่อโรงเรียน ================= */}
      {isModalOpen && selectedProvince && provinceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900">ข้อมูลการบริจาคใน {selectedProvince}</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  จำนวนทั้งหมด {provinceData.schools.length} โรงเรียน (ยอดรวม {formatCurrency(provinceData.totalAmount)})
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="space-y-4">
                {provinceData.schools.length > 0 ? provinceData.schools.map((school, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-emerald-300 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-2 sm:mb-0">
                      <h4 className="text-xl font-bold text-emerald-700">{school.name}</h4>
                      {/* ชื่อบริษัทในเครือ ThaiBev */}
                      <p className="text-sm text-zinc-500 font-medium mt-1">
                        ผู้สนับสนุน: <span className="text-zinc-800 font-bold">{school.company}</span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-zinc-400 font-medium mb-1">ยอดบริจาค</p>
                      <p className="text-2xl font-black text-emerald-600">{formatCurrency(school.amount)}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-zinc-500 py-10 font-medium">ยังไม่มีข้อมูลยอดบริจาค</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================== */}

      {/* ส่วนซ้าย: แผนที่ */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-white shadow-inner overflow-hidden">
        
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-zinc-200 z-10 pointer-events-none">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">สถานะการบริจาค</h4>
          <div className="space-y-3">
            <LegendItem color="#1e3a8a" label="บริจาคเยอะแล้ว" />
            <LegendItem color="#38bdf8" label="บริจาคพอสมควร" />
            <LegendItem color="#ce9a2d" label="กำลังดำเนินการ" />
            <LegendItem color="#d4d4d8" label="ยังไม่มี" />
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
                    
                    const provData = mockDonationData[provinceNameTh];
                    const amount = provData ? provData.totalAmount : 0;
                    const fillColor = getProvinceColor(amount);

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
                              fill: amount >= 1500000 ? "#ffffff" : "#1e293b",
                              paintOrder: "stroke fill",
                              stroke: amount >= 1500000 ? "#0f172a" : "#ffffff",
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
      <div className="w-full md:w-[380px] lg:w-[450px] border-l border-zinc-200 p-10 flex flex-col justify-between bg-white z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] overflow-y-auto">
        <div>
          <header className="mb-10">
            <h1 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              ThaiBev CSR Dashboard
            </h1>
            <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tighter">
              ระบบติดตาม<br/>ยอดบริจาค
            </h2>
          </header>

          {selectedProvince && provinceData ? (
            <article className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: getProvinceColor(provinceData.totalAmount) }}></div>
                <p className="text-sm text-emerald-700 font-medium mb-1 mt-1">พื้นที่จังหวัด</p>
                <h3 className="text-4xl font-extrabold text-emerald-950 tracking-tight mb-4">{selectedProvince}</h3>
                <div className="pt-4 border-t border-emerald-200/50">
                  <p className="text-sm text-emerald-700 font-medium mb-1">ยอดบริจาครวมในจังหวัด</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(provinceData.totalAmount)}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-zinc-800">ข้อมูลสรุป</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="โรงเรียนที่รับบริจาค" value={`${formatNumber(provinceData.schools.length)} แห่ง`} />
                  <InfoCard title="สถานะ" value={getProvinceStatus(provinceData.totalAmount)} />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 text-center px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition cursor-pointer shadow-md"
                >
                  ดูรายละเอียดผู้บริจาค
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
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 border border-zinc-200 shadow-sm">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">เลือกจังหวัดเพื่อดูข้อมูล</h3>
              <p className="text-zinc-500 max-w-xs text-sm">คลิกที่พื้นที่บนแผนที่เพื่อตรวจสอบโรงเรียนที่ได้รับบริจาคและบริษัทผู้สนับสนุน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getProvinceStatus(amount: number) {
  if (amount >= 1500000) return "เยอะแล้ว";
  if (amount >= 500000) return "พอสมควร";
  if (amount > 0) return "ดำเนินการ";
  return "ยังไม่มี";
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