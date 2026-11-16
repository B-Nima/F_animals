import { useState } from 'react';
import { Breed, breeds } from '../data/breeds';
import { Technology, technologies } from '../data/technologies';

interface EconomicCalculatorProps {
  districtName: string;
}

export function EconomicCalculator({ districtName }: EconomicCalculatorProps) {
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [headCount, setHeadCount] = useState(100);

  const calculateEconomics = () => {
    if (!selectedBreed || !selectedTech) return null;

    // Упрощённый расчёт
    const costFactors: Record<string, number> = {
      'stall_pasture': 12000,
      'pasture_year': 4500,
      'stall': 20000,
      'otgon': 7500,
    };

    const revenueFactors: Record<string, Record<string, number>> = {
      'sheep': {
        'stall_pasture': 26000,
        'pasture_year': 18000,
        'stall': 35000,
        'otgon': 22000,
      },
      'cattle': {
        'stall_pasture': 45000,
        'pasture_year': 35000,
        'stall': 55000,
        'otgon': 40000,
      },
      'horse': {
        'stall_pasture': 20000,
        'pasture_year': 15000,
        'stall': 28000,
        'otgon': 17000,
      },
    };

    const costPerHead = costFactors[selectedTech.type] || 10000;
    const revenuePerHead = revenueFactors[selectedBreed.type]?.[selectedTech.type] || 25000;

    const totalCost = costPerHead * headCount;
    const totalRevenue = revenuePerHead * headCount;
    const profit = totalRevenue - totalCost;
    const profitability = ((profit / totalCost) * 100).toFixed(1);

    return {
      costPerHead,
      revenuePerHead,
      totalCost,
      totalRevenue,
      profit,
      profitability: parseFloat(profitability),
    };
  };

  const economics = calculateEconomics();

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
      <h3 className="text-lg font-semibold mb-4 text-amber-400">
        💰 Экономический калькулятор для {districtName}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Порода</label>
          <select
            value={selectedBreed?.id || ''}
            onChange={(e) => setSelectedBreed(breeds.find(b => b.id === e.target.value) || null)}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200"
          >
            <option value="">— Выберите —</option>
            {breeds.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Технология</label>
          <select
            value={selectedTech?.id || ''}
            onChange={(e) => setSelectedTech(technologies.find(t => t.id === e.target.value) || null)}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200"
          >
            <option value="">— Выберите —</option>
            {technologies.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Поголовье</label>
          <input
            type="number"
            value={headCount}
            onChange={(e) => setHeadCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <div className="text-xs text-slate-500">
            {selectedBreed && <div className="text-slate-400">{selectedBreed.typeName}</div>}
            {selectedTech && <div className="text-slate-400">Окупаемость: {selectedTech.economicData.paybackPeriod}</div>}
          </div>
        </div>
      </div>

      {economics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Затраты/гол/год</div>
            <div className="text-lg font-bold text-red-400">
              {economics.costPerHead.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Доход/гол/год</div>
            <div className="text-lg font-bold text-emerald-400">
              {economics.revenuePerHead.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Общая прибыль</div>
            <div className={`text-lg font-bold ${economics.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {economics.profit >= 0 ? '+' : ''}{economics.profit.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Рентабельность</div>
            <div className={`text-lg font-bold ${economics.profitability >= 50 ? 'text-emerald-400' : economics.profitability >= 20 ? 'text-amber-400' : 'text-red-400'}`}>
              {economics.profitability}%
            </div>
          </div>
        </div>
      )}

      {economics && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Общие затраты ({headCount} гол.)</div>
            <div className="text-lg font-bold text-slate-300">
              {economics.totalCost.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs text-slate-500">Общий доход ({headCount} гол.)</div>
            <div className="text-lg font-bold text-slate-300">
              {economics.totalRevenue.toLocaleString()} ₽
            </div>
          </div>
        </div>
      )}

      {!selectedBreed || !selectedTech ? (
        <div className="text-center py-4 text-sm text-slate-500">
          Выберите породу и технологию для расчёта экономики
        </div>
      ) : (
        <div className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
          <div className="text-xs text-slate-400">
            <strong className="text-slate-300">Примечание:</strong> Расчёт носит оценочный характер. 
            Фактические показатели зависят от конкретных условий хозяйства, квалификации персонала, 
            состояния кормовой базы и рыночной конъюнктуры. Данные основаны на средних показателях 
            по Республике Бурятия.
          </div>
        </div>
      )}
    </div>
  );
}
