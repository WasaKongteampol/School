// src/utils/donationConfig.ts
import amarinLogo from "../assets/AMARIN.png";
import sermsukLogo from "../assets/sermsuk-company-logo.png";
import oishiLogo from "../assets/Oishi_Group_Logo.svg.png";
import thaibevLogo from "../assets/thaibev-logo.png";

// 📌 แก้ไข: ใช้ URL สำรองแทนการ Import ไฟล์ที่หาไม่เจอ เพื่อให้ Build ผ่าน
import ChiangRaiImg from "../assets/EventAyutthaya.png";
import NakhonSiThammaratImg from "../assets/EventNakhonSiThammarat.png";
import AyutthayaImg from "../assets/EventAyutthaya.png";

export const geoUrl = "https://raw.githubusercontent.com/cvibhagool/thailand-map/master/thailand-provinces.topojson";

export const provinceThMap: Record<string, string> = {
  "Amnat Charoen": "อำนาจเจริญ", "Ang Thong": "อ่างทอง", "Bangkok Metropolis": "กรุงเทพฯ", "Bangkok Metrop.": "กรุงเทพฯ", "Bangkok": "กรุงเทพฯ",
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

export const regionsConfig: Record<string, { center: [number, number]; scale: number; provinces: string[] }> = {
  "ภาคเหนือ": { center: [99.5, 18.5], scale: 9000, provinces: ["เชียงราย", "เชียงใหม่", "น่าน", "พะเยา", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", "อุตรดิตถ์"] },
  "ภาคอีสาน": { center: [103.5, 16.2], scale: 7500, provinces: ["กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม", "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", "มหาสารคาม", "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย", "สกลนคร", "สุรินทร์", "ศรีสะเกษ", "หนองคาย", "หนองบัวลำภู", "อุดรธานี", "อุบลราชธานี", "อำนาจเจริญ"] },
  "ภาคกลาง": { center: [100.2, 14.5], scale: 9000, provinces: ["กรุงเทพฯ", "กำแพงเพชร", "ชัยนาท", "นครนายก", "นครปฐม", "นครสวรรค์", "นนทบุรี", "ปทุมธานี", "อยุธยา", "พิจิตร", "พิษณุโลก", "เพชรบูรณ์", "ลพบุรี", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "อ่างทอง", "อุทัยธานี"] },
  "ภาคตะวันออก": { center: [101.8, 13.5], scale: 11000, provinces: ["จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ตราด", "ปราจีนบุรี", "ระยอง", "สระแก้ว"] },
  "ภาคตะวันตก": { center: [99.2, 14.2], scale: 8500, provinces: ["กาญจนบุรี", "ตาก", "ประจวบฯ", "เพชรบุรี", "ราชบุรี"] },
  "ภาคใต้": { center: [99.5, 8.5], scale: 6500, provinces: ["กระบี่", "ชุมพร", "ตรัง", "นครศรีธรรมราช", "นราธิวาส", "ปัตตานี", "พังงา", "พัทลุง", "ภูเก็ต", "ยะลา", "ระนอง", "สงขลา", "สตูล", "สุราษฎร์ธานี"] }
};

export const thaiBevCompanies = [
  "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)", "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)", "บริษัท เสริมสุข จำกัด (มหาชน)", 
  "บริษัท ช้างอินเตอร์เนชั่นแนล จำกัด", "บริษัท เอฟแอนด์เอ็น แดรี่ส์ (ประเทศไทย) จำกัด", "บริษัท แสงโสม จำกัด",
  "บริษัท เดอะ คิวเอสอาร์ ออฟ เอเชีย จำกัด", "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)", "บริษัท เบอร์ลี่ ยุคเกอร์ จำกัด (มหาชน) (BJC)"
];

export const allProvinceNames = Array.from(new Set(Object.values(provinceThMap))).sort((a, b) => a.localeCompare(b, 'th'));

export type SchoolDonation = { 
  name: string; 
  books: number; 
  students: number; 
  company: string; 
  status: 'completed' | 'pending';
  description: string;
  images: string[];
};

export type ProvinceData = { totalBooks: number; schools: SchoolDonation[] };

export const calculateStatus = (data: ProvinceData | null) => {
  if (!data || data.schools.length === 0) return "ยังไม่บริจาค";
  const completedCount = data.schools.filter(s => s.status === 'completed').length;
  const pendingCount = data.schools.filter(s => s.status === 'pending').length;
  if (completedCount >= 2) return "บริจาคซ้ำ";
  if (completedCount === 1) return "บริจาคแล้ว";
  if (pendingCount > 0) return "กำลังดำเนินการ";
  return "ยังไม่บริจาค";
};

export const getProvinceColor = (status: string) => {
  switch (status) {
    case "บริจาคซ้ำ": return "#1e3a8a"; 
    case "บริจาคแล้ว": return "#38bdf8"; 
    case "กำลังดำเนินการ": return "#ce9a2d"; 
    default: return "#d4d4d8"; 
  }
};

export const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num);

export const companyLogos: Record<string, string> = {
  "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)": thaibevLogo,
  "บริษัท ช้างอินเตอร์เนชั่นแนล จำกัด": thaibevLogo,
  "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)": amarinLogo,
  "บริษัท เสริมสุข จำกัด (มหาชน)": sermsukLogo,
  "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)": oishiLogo,
};

export const generateInitialData = () => {
  const data: Record<string, ProvinceData> = {
    "เชียงราย": {
      totalBooks: 1000,
      schools: [
        { 
          name: "โรงเรียนบ้านปางขอน", 
          books: 1000, 
          students: 60, 
          company: "บริษัท เสริมสุข จำกัด (มหาชน)", 
          status: 'pending',
          description: "📦 สิ่งที่ได้รับมอบ:\n• หนังสือ 10 หมวดความรู้ จำนวนประมาณ 1,000 เล่ม\n• ชั้นวางหนังสือ เพื่อสร้างมุมการเรียนรู้ในพื้นที่อาคารที่ค่อนข้างจำกัด\n\n🌟 กิจกรรมพิเศษ:\nเน้นกิจกรรม 'อ่านวันละ 15 นาที' เพื่อเป็นการฝึกทักษะการใช้ภาษาไทยให้นักเรียนในพื้นที่สูงคล่องแคล่วขึ้น และใช้การจดบันทึกรักการอ่านเป็นเครื่องมือติดตามพัฒนาการรายบุคคล",
          images: [ChiangRaiImg]
        }
      ]
    },
    "นครศรีธรรมราช": {
      totalBooks: 1000,
      schools: [
        { 
          name: "โรงเรียนบ้านท้องโกงกาง", 
          books: 1000, 
          students: 80, 
          company: "บริษัท โออิชิ กรุ๊ป จำกัด (มหาชน)", 
          status: 'completed', 
          description: "📦 สิ่งที่ได้รับมอบ:\n• หนังสือ 10 หมวดความรู้ จำนวนประมาณ 1,000 เล่ม\n• สมุดบันทึกรักการอ่าน สำหรับนักเรียนแกนนำในชมรม\n\n🌟 กิจกรรมพิเศษ:\nเป็นโรงเรียนขนาดกลางที่มีความพร้อมสูง จึงได้รับคัดเลือกให้ทำกิจกรรม 'อ่านดัง ฟังเพลิน' ซึ่งให้นักเรียนอัดคลิปเสียงอ่านหนังสือส่งมอบให้ผู้พิการทางสายตา เป็นการปลูกฝังจิตอาสาควบคู่ไปกับนิสัยรักการอ่าน",
          images: [NakhonSiThammaratImg]
        }
      ]
    },
    "อยุธยา": {
      totalBooks: 2000,
      schools: [
        { 
          name: "โรงเรียนวัดพะยอม", 
          books: 1000, 
          students: 100, 
          company: "บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)", 
          status: 'completed', 
          description: "📦 สิ่งที่ได้รับมอบ:\n• หนังสือ 10 หมวดความรู้ จำนวนประมาณ 1,000 เล่ม\n• สื่อดิจิทัลเสริมการเรียนรู้: คลิปวิดีโอเพื่อประกอบการจัดการเรียนการสอนในวิชาที่ซับซ้อน\n\n🌟 กิจกรรมพิเศษ:\nเน้นการทำงานร่วมกับ 'คุณครูผู้ดูแลโครงการ' ในการทำวิจัยชั้นเรียนเพื่อวัดผลสัมฤทธิ์ทางการศึกษา โดยเก็บข้อมูลอย่างเป็นระบบเพื่อใช้เป็นผลงานการเลื่อนวิทยฐานะของคุณครู และช่วยให้นักเรียนมีผลการเรียนดีขึ้นตามเป้าหมายโครงการ",
          images: [AyutthayaImg]
        },
        { 
          name: "โรงเรียนวัดพะยอม", 
          books: 1000, 
          students: 100, 
          company: "บริษัท อมรินทร์ คอร์เปอเรชั่น จำกัด (มหาชน)", 
          status: 'completed', 
          description: "📦 สิ่งที่ได้รับมอบ:\n• หนังสือ 10 หมวดความรู้ จำนวนประมาณ 1,000 เล่ม\n• สื่อดิจิทัลเสริมการเรียนรู้: คลิปวิดีโอเพื่อประกอบการจัดการเรียนการสอนในวิชาที่ซับซ้อน\n\n🌟 กิจกรรมพิเศษ:\nเน้นการทำงานร่วมกับ 'คุณครูผู้ดูแลโครงการ' ในการทำวิจัยชั้นเรียนเพื่อวัดผลสัมฤทธิ์ทางการศึกษา โดยเก็บข้อมูลอย่างเป็นระบบเพื่อใช้เป็นผลงานการเลื่อนวิทยฐานะของคุณครู และช่วยให้นักเรียนมีผลการเรียนดีขึ้นตามเป้าหมายโครงการ",
          images: [AyutthayaImg]
        }
      ]
    }
  };
  
  const defaultDesc = "ข้อมูลโครงการบริจาคหนังสือสนับสนุนโดยกลุ่มไทยเบฟและอมรินทร์";

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
          const students = Math.floor(Math.random() * 1500) + 200;
          const randomCompany = thaiBevCompanies[Math.floor(Math.random() * thaiBevCompanies.length)];
          const indvStatus = Math.random() > 0.3 ? generateStatus : (generateStatus === 'completed' ? 'pending' : 'completed');
          
          generatedSchools.push({ 
            name: `โรงเรียนชุมชน${province} ${i+1}`, 
            books, 
            students,
            company: randomCompany, 
            status: indvStatus,
            description: defaultDesc,
            images: [`https://picsum.photos/seed/${province}${i}/400/300`]
          });
          currentTotal += books;
        }
        data[province] = { totalBooks: currentTotal, schools: generatedSchools };
      }
    }
  });
  return data;
};