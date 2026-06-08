const EmptyState = ({ title }) => {
  return (
    <div className="bg-white rounded-3xl p-16 shadow-lg text-center">

      <h1 className="text-3xl font-bold text-slate-400">
        {title}
      </h1>

    </div>
  );
};

export default EmptyState;