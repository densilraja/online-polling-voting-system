const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-4 rounded-2xl font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;