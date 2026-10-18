export default function SectionTitle({ a, b, sub }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-extrabold tracking-tight text-green-900 sm:text-3xl lg:text-4xl">
        {a} <span className="text-orange-500">{b}</span>
      </h2>
      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-green-700 to-orange-500" />
      {sub && <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">{sub}</p>}
    </div>
  );
}
