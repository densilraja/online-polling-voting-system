const Modal = ({ title, children, isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[500px] rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <button
            onClick={onClose}
            className="text-red-500 text-xl"
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
};

export default Modal;