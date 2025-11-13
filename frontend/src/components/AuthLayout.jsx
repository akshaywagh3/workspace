export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
