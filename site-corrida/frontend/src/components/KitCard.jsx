// components/KitCard.jsx
export default function KitCard({ nome, preco, itens, observacao }) {
  return (
    <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg border hover:scale-105 transition">
      <h4 className="text-xl font-bold mb-2">{nome}</h4>
      <p className="text-2xl font-bold text-pink-600 mb-4">R$ {preco},00</p>

      <ul className="space-y-1 text-sm mb-3">
        {itens.map((item, i) => (
          <li key={i}>✔️ {item}</li>
        ))}
      </ul>

      {observacao && (
        <p className="text-xs text-red-500 font-semibold">⚠️ {observacao}</p>
      )}
    </div>
  );
}
