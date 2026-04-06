import { useState } from "react";
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

// 🌟 ข้อมูลจำลอง (Mock Data) สำหรับแอปบริจาค
const mockDonationData: Record<string, { schools: number; totalAmount: number; transactions: number }> = {
  "กทม.": { schools: 145, totalAmount: 5450000, transactions: 1250 },
  "เชียงใหม่": { schools: 89, totalAmount: 1250000, transactions: 840 },
  "ขอนแก่น": { schools: 112, totalAmount: 850500, transactions: 620 },
  "ภูเก็ต": { schools: 34, totalAmount: 3400000, transactions: 950 },
  "ลำปาง": { schools: 45, totalAmount: 450000, transactions: 310 },
  // จังหวัดอื่นๆ ที่ไม่มีใน Mock จะเป็น 0 โดยอัตโนมัติ
};

export default function ThailandMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.5] as [number, number], zoom: 1 });

  const handleZoomIn = () => { if (position.zoom >= 4) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 })); };
  const handleZoomOut = () => { if (position.zoom <= 1) return; setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 })); };
  const handleMoveEnd = (position: any) => { setPosition(position); };

  // ดึงข้อมูลจังหวัดที่ถูกเลือก (ถ้าไม่มีข้อมูลให้เป็น 0)
  const provinceData = selectedProvince 
    ? (mockDonationData[selectedProvince] || { schools: 0, totalAmount: 0, transactions: 0 }) 
    : null;

  // ฟังก์ชันจัดรูปแบบตัวเลข (เพิ่มลูกน้ำ และ ใส่ ฿)
  const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num);
  const formatCurrency = (num: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900">
      
      {/* ส่วนซ้าย: Area สำหรับแผนที่ */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-white shadow-inner overflow-hidden">
        
        <div className="w-full h-full flex items-center justify-center">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 2000, center: [100.5, 13.5] }}
            className="w-full h-full max-h-[90vh]"
          >
            <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd} maxZoom={4}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceNameEng = geo.properties.NAME_1; 
                    const provinceNameTh = provinceThMap[provinceNameEng] || provinceNameEng;
                    const isSelected = selectedProvince === provinceNameTh;
                    const centroid = geoCentroid(geo);

                    return (
                      <g key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          onClick={() => setSelectedProvince(provinceNameTh)}
                          className="cursor-pointer outline-none transition-colors duration-300"
                          style={{
                            default: {
                              fill: isSelected ? "#0ea5e9" : "#f4f4f5",
                              stroke: "#d4d4d8",
                              strokeWidth: 0.5 / position.zoom,
                            },
                            hover: {
                              fill: isSelected ? "#0ea5e9" : "#e0f2fe",
                              stroke: "#38bdf8",
                              strokeWidth: 1 / position.zoom,
                            },
                            pressed: {
                              fill: "#0284c7",
                              stroke: "#ffffff",
                              strokeWidth: 1 / position.zoom,
                            },
                          }}
                        />
                        <Marker coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            y={1.5}
                            className="pointer-events-none select-none font-bold tracking-wide transition-colors duration-300"
                            style={{ 
                              fontSize: `${5.5 / position.zoom}px`,
                              fill: isSelected ? "#ffffff" : "#475569",
                              paintOrder: "stroke fill",
                              stroke: isSelected ? "#0284c7" : "#ffffff",
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
        
        {/* ปุ่ม Zoom */}
        <div className="absolute bottom-8 right-8 flex gap-1 bg-white p-1 rounded-xl shadow-md border border-zinc-200">
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer">−</button>
          <div className="w-[1px] bg-zinc-200 my-2"></div>
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer">+</button>
        </div>
      </div>

      {/* ส่วนขวา: Side Panel สรุปข้อมูลการบริจาค */}
      <div className="w-full md:w-[380px] lg:w-[450px] border-l border-zinc-200 p-10 flex flex-col justify-between bg-white z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] overflow-y-auto">
        <div>
          <header className="mb-10">
            <h1 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              School Donation Tracker
            </h1>
            <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tighter">
              ระบบติดตาม<br/>ยอดบริจาค
            </h2>
          </header>

          {selectedProvince && provinceData ? (
            <article className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm">
                <p className="text-sm text-emerald-700 font-medium mb-1">พื้นที่จังหวัด</p>
                <h3 className="text-4xl font-extrabold text-emerald-950 tracking-tight mb-4">
                  {selectedProvince}
                </h3>
                <div className="pt-4 border-t border-emerald-200/50">
                  <p className="text-sm text-emerald-700 font-medium mb-1">ยอดบริจาคสะสม</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tight">
                    {formatCurrency(provinceData.totalAmount)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-zinc-800">ข้อมูลรายละเอียด</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="โรงเรียนที่เข้าร่วม" value={`${formatNumber(provinceData.schools)} แห่ง`} />
                  <InfoCard title="จำนวนรายการบริจาค" value={`${formatNumber(provinceData.transactions)} รายการ`} />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 text-center px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition cursor-pointer shadow-md">
                  ดูรายชื่อโรงเรียน
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
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">เลือกจังหวัดเพื่อดูยอดบริจาค</h3>
              <p className="text-zinc-500 max-w-xs text-sm">
                คลิกที่พื้นที่บนแผนที่เพื่อดูจำนวนโรงเรียนและยอดบริจาคสะสมของจังหวัดนั้นๆ
              </p>
            </div>
          )}
        </div>

        <footer className="text-center text-xs text-zinc-400 pt-10 border-t border-zinc-100 mt-8">
          ระบบจัดการยอดบริจาคโรงเรียน
        </footer>
      </div>
    </div>
  );
}

// Component สำหรับแสดง Card ข้อมูล (ปรับดีไซน์นิดหน่อย)
interface InfoCardProps {
  title: string;
  value: string;
}
function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-500 mb-2 font-medium">{title}</p>
      <p className="text-xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}