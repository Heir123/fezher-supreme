export default function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">

      <h1 className="text-3xl font-bold text-blue-500">
        Fezher Supreme
      </h1>

      <div className="flex gap-8">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </div>

      <div className="flex gap-3">
        <button className="border border-blue-500 px-4 py-2 rounded-lg">
          Login
        </button>

        <button className="bg-blue-600 px-4 py-2 rounded-lg">
          Sign Up
        </button>
      </div>

    </nav>
  );
}
