import dynamic from "next/dynamic";

const NexusERPFull = dynamic(() => import("./NexusERPFull"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#2453ff] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg animate-pulse">
          #
        </div>
        <p className="text-sm text-[#9AA8BA] font-medium">Carregando Nexus ERP...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <NexusERPFull />;
}
