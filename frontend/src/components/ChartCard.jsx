function ChartCard({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 transition duration-300 hover:scale-[1.02] hover:border-blue-400/40 hover:shadow-blue-500/20">
      
      <h3 className="text-2xl font-semibold mb-4 text-blue-300 tracking-wide drop-shadow">
        {title}
      </h3>

      <div className="h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default ChartCard;
