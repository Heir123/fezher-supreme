export default function Toolbar({ children }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      {children}
    </div>
  );
}