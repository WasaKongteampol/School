import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://raw.githubusercontent.com/cvibhagool/thailand-map/master/thailand-provinces.topojson";

// พจนานุกรมแปลชื่อภาษาอังกฤษเป็นภาษาไทย (ย่อคำยาวๆ เพื่อไม่ให้ทับกัน)
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

export default function ThailandMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.5] as [number, number], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900">
      
      {/* ส่วนซ้าย: Area สำหรับแผนที่ */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-white shadow-inner overflow-hidden">
        
        <div className="w-full h-full flex items-center justify-center">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2000,
              center: [100.5, 13.5],
            }}
            className="w-full h-full max-h-[90vh]"
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
              maxZoom={4}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceNameEng = geo.properties.NAME_1; 
                    // แปลงชื่อภาษาอังกฤษเป็นภาษาไทย (ถ้าไม่มีในดิกชินารี ให้ใช้ชื่อเดิมไปก่อน)
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

                        {/* ชื่อจังหวัด (ภาษาไทย) */}
                        {/* ชื่อจังหวัด (ภาษาไทย) */}
                        <Marker coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            y={1.5}
                            // เปลี่ยนเป็น font-bold และเพิ่ม tracking-wide เพื่อให้ช่องไฟกว้างขึ้นนิดนึง
                            className="pointer-events-none select-none font-bold tracking-wide transition-colors duration-300"
                            style={{ 
                              // ขยายขนาดฟอนต์ขึ้นจาก 5 เป็น 5.5
                              fontSize: `${5.5 / position.zoom}px`,
                              fill: isSelected ? "#ffffff" : "#475569", // ตัวอักษรสีขาวเมื่อเลือก, สีเทาเข้ม (slate-600) ตอนปกติ
                              
                              // เทคนิคการทำ Halo Effect (ขอบตัวหนังสือ) ให้อ่านง่าย
                              paintOrder: "stroke fill",
                              stroke: isSelected ? "#0284c7" : "#ffffff", // ขอบขาวตอนปกติ, ขอบน้ำเงินตอนกด
                              strokeWidth: `${1.2 / position.zoom}px`, // ความหนาของขอบตัวหนังสือ
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
        
        {/* กลุ่มปุ่ม Zoom */}
        <div className="absolute bottom-8 right-8 flex gap-1 bg-white p-1 rounded-xl shadow-md border border-zinc-200">
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer"
          >
            −
          </button>
          <div className="w-[1px] bg-zinc-200 my-2"></div>
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-medium text-2xl transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <div className="absolute bottom-6 left-6 text-sm text-zinc-400 font-medium bg-white/80 p-2 rounded-lg backdrop-blur-sm">
          *คลิกและลากเพื่อเลื่อนแผนที่ / ใช้ปุ่มขวาล่างเพื่อซูม
        </div>
      </div>

      {/* ส่วนขวา: Side Panel */}
      <div className="w-full md:w-[380px] lg:w-[450px] border-l border-zinc-200 p-10 flex flex-col justify-between bg-white z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        <div>
          <header className="mb-12">
            <h1 className="text-sm font-bold uppercase tracking-widest text-sky-600 mb-2">
              Thailand Interactive Map
            </h1>
            <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tighter">
              ระบบเลือกจังหวัด
            </h2>
          </header>

          {selectedProvince ? (
            <article className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-sky-50 border border-sky-100 shadow-sm">
                <p className="text-sm text-sky-700 font-medium mb-1">จังหวัดที่เลือก</p>
                <h3 className="text-4xl font-extrabold text-sky-950 tracking-tight">
                  {selectedProvince}
                </h3>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-zinc-800">ข้อมูลเบื้องต้น</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="ภูมิภาค" value="-" />
                  <InfoCard title="พื้นที่" value="- ตร.กม." />
                  <InfoCard title="ประชากร" value="- คน" />
                </div>
              </div>

              <button 
                onClick={() => setSelectedProvince(null)}
                className="w-full text-center mt-8 px-6 py-3 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 transition cursor-pointer shadow-md"
              >
                ล้างการเลือก
              </button>
            </article>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 border border-zinc-200 shadow-sm">
                <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">ยังไม่ได้เลือกจังหวัด</h3>
              <p className="text-zinc-500 max-w-xs text-sm">
                กรุณาคลิกพื้นที่บนแผนที่ทางด้านซ้ายเพื่อดูรายละเอียด
              </p>
            </div>
          )}
        </div>

        <footer className="text-center text-xs text-zinc-400 pt-10 border-t border-zinc-100">
          Created with Vite + React + Bun + Tailwind 4
        </footer>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
}
function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-500 mb-1 font-medium">{title}</p>
      <p className="text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}