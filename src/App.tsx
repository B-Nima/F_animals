import { useState } from 'react';
import { District, districts } from './data/districts';
import { getRecommendations, getZoneName, BreedRecommendation, TechnologyRecommendation } from './utils/recommendations';
import { MapChart } from './components/MapChart';
import { ClimateChart } from './components/ClimateChart';
import { BreedsRadar } from './components/BreedsRadar';
import { FeedBaseChart } from './components/FeedBaseChart';

type TabType = 'map' | 'breeds' | 'technologies' | 'data';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('map');

  const recommendations = selectedDistrict ? getRecommendations(selectedDistrict) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                🐑
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">АгроРекомендатель</h1>
                <p className="text-xs text-slate-400">Система выбора пород и технологий для Республики Бурятия</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-800 rounded">ФГИС ЗСН</span>
              <span className="px-2 py-1 bg-slate-800 rounded">ФАНЦА/ВНИИплем</span>
              <span className="px-2 py-1 bg-slate-800 rounded">Росгидромет</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {([
              { id: 'map', label: '🗺️ Карта районов', icon: '' },
              { id: 'breeds', label: '🐑 Породы', icon: '' },
              { id: 'technologies', label: '🏗️ Технологии', icon: '' },
              { id: 'data', label: '📊 Данные', icon: '' },
            ] as { id: TabType; label: string; icon: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* District Selector */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <label className="text-sm font-medium text-slate-300">Выберите район:</label>
            <select
              value={selectedDistrict?.id || ''}
              onChange={(e) => {
                const d = districts.find(d => d.id === e.target.value);
                if (d) setSelectedDistrict(d);
              }}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full md:w-auto"
            >
              <option value="">— Выберите район —</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {selectedDistrict && (
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded text-xs">
                  {getZoneName(selectedDistrict.zone)}
                </span>
                <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">
                  {selectedDistrict.elevation}м
                </span>
                <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs">
                  {selectedDistrict.soilType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content based on tab */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <MapChart
                districts={districts}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Нажмите на точку для выбора района
              </p>
            </div>
            <div className="space-y-4">
              {selectedDistrict ? (
                <>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <h3 className="text-lg font-semibold mb-3 text-emerald-400">{selectedDistrict.name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <InfoCard label="САТ" value={`${selectedDistrict.climate.sumActiveTemps}°C`} />
                      <InfoCard label="Осадки" value={`${selectedDistrict.climate.precipitation} мм/год`} />
                      <InfoCard label="Безморозный период" value={`${selectedDistrict.climate.frostFreePeriod} дней`} />
                      <InfoCard label="Ср. зимняя t°" value={`${selectedDistrict.climate.avgWinterTemp}°C`} />
                      <InfoCard label="Ср. летняя t°" value={`${selectedDistrict.climate.avgSummerTemp}°C`} />
                      <InfoCard label="Снежный покров" value={`${selectedDistrict.climate.snowCoverDays} дней`} />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <ClimateChart district={selectedDistrict} />
                  </div>
                </>
              ) : (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Выберите район</h3>
                  <p className="text-sm text-slate-500">
                    Нажмите на точку на карте или выберите район из списка для получения рекомендаций
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'breeds' && (
          <div className="space-y-6">
            {recommendations ? (
              <>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">
                    Рекомендуемые породы для {selectedDistrict?.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.breeds.slice(0, 6).map((rec, idx) => (
                      <BreedCard key={rec.breed.id} rec={rec} rank={idx + 1} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <BreedsRadar recommendations={recommendations.breeds} />
                </div>
              </>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                <div className="text-4xl mb-4">🐑</div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Выберите район</h3>
                <p className="text-sm text-slate-500">
                  Для получения рекомендаций по породам выберите район Бурятии
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'technologies' && (
          <div className="space-y-6">
            {recommendations ? (
              <>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">
                    Рекомендуемые технологии для {selectedDistrict?.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.technologies.map((rec, idx) => (
                      <TechnologyCard key={rec.technology.id} rec={rec} rank={idx + 1} />
                    ))}
                  </div>
                </div>
                {/* Совместимость пород и технологий */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">
                    Оптимальные комбинации «Порода + Технология»
                  </h3>
                  <CompatibilityTable recommendations={recommendations} />
                </div>
              </>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Выберите район</h3>
                <p className="text-sm text-slate-500">
                  Для получения рекомендаций по технологиям выберите район Бурятии
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            {selectedDistrict ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <ClimateChart district={selectedDistrict} />
                  </div>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <FeedBaseChart district={selectedDistrict} />
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Подробные данные района</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">🌡️ Климат</h4>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li>САТ: {selectedDistrict.climate.sumActiveTemps}°C</li>
                        <li>Осадки: {selectedDistrict.climate.precipitation} мм/год</li>
                        <li>Безморозный: {selectedDistrict.climate.frostFreePeriod} дней</li>
                        <li>Зимняя t°: {selectedDistrict.climate.avgWinterTemp}°C</li>
                        <li>Летняя t°: {selectedDistrict.climate.avgSummerTemp}°C</li>
                        <li>Снег: {selectedDistrict.climate.snowCoverDays} дней</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">🌾 Кормовая база</h4>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li>Сено: {selectedDistrict.feedBase.hayProduction} тыс.т</li>
                        <li>Пастбища: {selectedDistrict.feedBase.pastureArea} тыс.га</li>
                        <li>Сенокосы: {selectedDistrict.feedBase.naturalMeadows} тыс.га</li>
                        <li>Качество: {selectedDistrict.feedBase.pastureQuality === 'high' ? 'Высокое' : selectedDistrict.feedBase.pastureQuality === 'medium' ? 'Среднее' : 'Низкое'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">🏔️ Рельеф и почвы</h4>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li>Высота: {selectedDistrict.elevation} м</li>
                        <li>Зона: {getZoneName(selectedDistrict.zone)}</li>
                        <li>Почвы: {selectedDistrict.soilType}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Источники данных */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Источники данных</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <DataSourceCard
                      title="Породный состав"
                      source="БГСХА, Бурятский НИИСХ, племенные регистры"
                      note="Адаптация 6 пород овец, характеристика буубэй, забайкальской тонкорунной, казахской белоголовой"
                    />
                    <DataSourceCard
                      title="Агроклиматические данные"
                      source="Росгидромет (метеостанции Бурятии)"
                      note="Сумма активных температур, осадки, длина безморозного периода"
                    />
                    <DataSourceCard
                      title="Кормовая база"
                      source="Минсельхозпрод Бурятии"
                      note="Статистика заготовки кормов по районам. Лидеры: Тункинский, Мухоршибирский, Кабанский"
                    />
                    <DataSourceCard
                      title="Технологии содержания"
                      source="Методические рекомендации БГСХА"
                      note="СПК «Ульдурга» — адаптивная технология с традиционным отгоном"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Выберите район</h3>
                <p className="text-sm text-slate-500">
                  Для просмотра данных выберите район Бурятии
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>Рекомендательная система по выбору пород и технологий содержания с/х животных</p>
          <p className="mt-1">Республика Бурятия | ФГИС ЗСН | ФАНЦА/ВНИИплем | Росгидромет | БГСХА</p>
          <p className="mt-1">Компетенции: ID 28, ID 485, ID 331</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-200">{value}</div>
    </div>
  );
}

function BreedCard({ rec, rank }: { rec: BreedRecommendation; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = rec.score >= 80 ? 'text-emerald-400' : rec.score >= 60 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = rec.score >= 80 ? 'bg-emerald-900/30' : rec.score >= 60 ? 'bg-amber-900/30' : 'bg-red-900/30';

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-500">#{rank}</span>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">{rec.breed.name}</h4>
            <span className="text-xs text-slate-500">{rec.breed.typeName}</span>
          </div>
        </div>
        <div className={`${scoreBg} ${scoreColor} px-2 py-1 rounded text-sm font-bold`}>
          {rec.score}%
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-2 line-clamp-2">{rec.breed.description}</p>
      <div className="text-xs text-slate-500 mb-2">
        <span className="text-slate-400">Масса:</span> {rec.breed.characteristics.weight}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {rec.breed.economicIndicators.mainProducts.map(p => (
          <span key={p} className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">{p}</span>
        ))}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-emerald-400 hover:text-emerald-300"
      >
        {expanded ? '▼ Скрыть детали' : '▶ Подробнее'}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 text-xs">
          {rec.reasons.length > 0 && (
            <div>
              <div className="text-emerald-400 font-medium mb-1">✓ Преимущества:</div>
              <ul className="space-y-0.5">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="text-slate-400">• {r}</li>
                ))}
              </ul>
            </div>
          )}
          {rec.warnings.length > 0 && (
            <div>
              <div className="text-amber-400 font-medium mb-1">⚠ Ограничения:</div>
              <ul className="space-y-0.5">
                {rec.warnings.map((w, i) => (
                  <li key={i} className="text-slate-400">• {w}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-slate-500 mt-2">
            Рентабельность: {'★'.repeat(rec.breed.economicIndicators.profitability)}{'☆'.repeat(10 - rec.breed.economicIndicators.profitability)}
          </div>
          <div className="text-slate-500">
            Источники: {rec.breed.researchSources.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

function TechnologyCard({ rec, rank }: { rec: TechnologyRecommendation; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = rec.score >= 80 ? 'text-emerald-400' : rec.score >= 60 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = rec.score >= 80 ? 'bg-emerald-900/30' : rec.score >= 60 ? 'bg-amber-900/30' : 'bg-red-900/30';

  const typeIcons: Record<string, string> = {
    'stall_pasture': '🏠🌿',
    'pasture_year': '🌿',
    'stall': '🏠',
    'otgon': '🏔️',
  };

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[rec.technology.type] || '🔧'}</span>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">{rec.technology.name}</h4>
            <span className="text-xs text-slate-500">Рекомендация #{rank}</span>
          </div>
        </div>
        <div className={`${scoreBg} ${scoreColor} px-2 py-1 rounded text-sm font-bold`}>
          {rec.score}%
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-3">{rec.technology.description}</p>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-slate-500">Затраты/гол</div>
          <div className="text-slate-300 font-medium">{rec.technology.economicData.costPerHead}</div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-slate-500">Доход/гол</div>
          <div className="text-slate-300 font-medium">{rec.technology.economicData.revenuePerHead}</div>
        </div>
      </div>

      <div className="flex gap-2 text-xs mb-3">
        <span className={`px-2 py-0.5 rounded ${rec.technology.details.laborIntensity === 'low' ? 'bg-emerald-900/30 text-emerald-400' : rec.technology.details.laborIntensity === 'medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
          Труд: {rec.technology.details.laborIntensity === 'low' ? 'Низкий' : rec.technology.details.laborIntensity === 'medium' ? 'Средний' : 'Высокий'}
        </span>
        <span className={`px-2 py-0.5 rounded ${rec.technology.details.capitalRequirements === 'low' ? 'bg-emerald-900/30 text-emerald-400' : rec.technology.details.capitalRequirements === 'medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
          Капвложения: {rec.technology.details.capitalRequirements === 'low' ? 'Низкие' : rec.technology.details.capitalRequirements === 'medium' ? 'Средние' : 'Высокие'}
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-emerald-400 hover:text-emerald-300"
      >
        {expanded ? '▼ Скрыть детали' : '▶ Подробнее'}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 text-xs">
          {rec.reasons.length > 0 && (
            <div>
              <div className="text-emerald-400 font-medium mb-1">✓ Преимущества:</div>
              <ul className="space-y-0.5">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="text-slate-400">• {r}</li>
                ))}
              </ul>
            </div>
          )}
          {rec.warnings.length > 0 && (
            <div>
              <div className="text-amber-400 font-medium mb-1">⚠ Ограничения:</div>
              <ul className="space-y-0.5">
                {rec.warnings.map((w, i) => (
                  <li key={i} className="text-slate-400">• {w}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-slate-500">
            <div className="font-medium text-slate-400 mb-1">Примеры хозяйств:</div>
            {rec.technology.examples.map((e, i) => (
              <div key={i} className="text-slate-500">• {e}</div>
            ))}
          </div>
          <div className="text-slate-500">
            Окупаемость: {rec.technology.economicData.paybackPeriod}
          </div>
        </div>
      )}
    </div>
  );
}

function CompatibilityTable({ recommendations }: { recommendations: { breeds: BreedRecommendation[]; technologies: TechnologyRecommendation[] } }) {
  const topBreeds = recommendations.breeds.slice(0, 4);
  const topTechs = recommendations.technologies.slice(0, 4);

  const getCompatibility = (breedId: string, techType: string): 'full' | 'partial' | 'none' => {
    const breed = recommendations.breeds.find(b => b.breed.id === breedId)?.breed;
    if (!breed) return 'none';
    if (breed.compatibility.includes(techType)) return 'full';
    // Check partial compatibility
    if (techType === 'stall_pasture' && breed.compatibility.includes('pasture_year')) return 'partial';
    if (techType === 'otgon' && breed.compatibility.includes('pasture_year')) return 'partial';
    return 'none';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Порода</th>
            {topTechs.map(t => (
              <th key={t.technology.id} className="text-center py-2 px-3 text-slate-400 font-medium text-xs">
                {t.technology.name.split(' ')[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topBreeds.map(b => (
            <tr key={b.breed.id} className="border-b border-slate-800">
              <td className="py-2 px-3 text-slate-300 text-xs">{b.breed.name}</td>
              {topTechs.map(t => {
                const compat = getCompatibility(b.breed.id, t.technology.type);
                return (
                  <td key={t.technology.id} className="text-center py-2 px-3">
                    {compat === 'full' && <span className="text-emerald-400 text-lg">●</span>}
                    {compat === 'partial' && <span className="text-amber-400 text-lg">◐</span>}
                    {compat === 'none' && <span className="text-red-400/50 text-lg">○</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span><span className="text-emerald-400">●</span> Полная совместимость</span>
        <span><span className="text-amber-400">◐</span> Частичная совместимость</span>
        <span><span className="text-red-400/50">○</span> Не рекомендуется</span>
      </div>
    </div>
  );
}

function DataSourceCard({ title, source, note }: { title: string; source: string; note: string }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
      <h4 className="font-medium text-slate-300 text-sm mb-1">{title}</h4>
      <p className="text-xs text-emerald-400 mb-1">{source}</p>
      <p className="text-xs text-slate-500">{note}</p>
    </div>
  );
}

export default App;
