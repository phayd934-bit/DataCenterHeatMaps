export default function App() {
  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-xs text-[#5f6368] mt-1">Data Center Cooling Market Intelligence</p>
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center text-[#9aa0a6]">
          Map loads here
        </div>
      </main>
    </div>
  )
}
