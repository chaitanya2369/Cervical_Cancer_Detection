export default function Button({ children, className, ...props }) {
    return (
      <button
        className={`bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }