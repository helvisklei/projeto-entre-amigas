// components/KitExtrasSection.jsx

import KitCard from "./KitCard";
import { kitsExtras } from "../models/Kits";

export default function KitExtrasSection() {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center">
        🎯 Outras opções de participação
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {kitsExtras.map((kit) => (
          <KitCard key={kit.id} {...kit} />
        ))}
      </div>
    </div>
  );
}
