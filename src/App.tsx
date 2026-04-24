import ThailandMap from "./components/ThailandMap";

function App() {
  return (
    // กำหนดให้แอปเต็มจอ (h-screen) และกว้างสุด (w-full) 
    // พร้อมตั้งค่าฟอนต์เริ่มต้น (ถ้าคุณใช้ Tailwind)
    <div className="w-full h-screen antialiased bg-zinc-50 overflow-hidden">
      <ThailandMap />
    </div>
  );
}

export default App;