const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:scale-105 transition duration-300">

      <h2 className="text-slate-500 text-lg font-semibold">
        {title}
      </h2>

      <h1 className={`text-5xl font-bold mt-4 ${color}`}>
        {value}
      </h1>

    </div>
  );
};

export default StatCard;