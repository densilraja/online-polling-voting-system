const Input = ({
  type = "text",
  placeholder,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500"
    />
  );
};

export default Input;