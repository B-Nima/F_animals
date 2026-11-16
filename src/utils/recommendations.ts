import { District, districts } from '../data/districts';
import { Breed, breeds } from '../data/breeds';
import { Technology, technologies } from '../data/technologies';

export interface BreedRecommendation {
  breed: Breed;
  score: number; // 0-100
  reasons: string[];
  warnings: string[];
}

export interface TechnologyRecommendation {
  technology: Technology;
  score: number;
  reasons: string[];
  warnings: string[];
}

export function calculateBreedScore(breed: Breed, district: District): BreedRecommendation {
  let score = 50; // базовый
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Климатическая адаптация
  const { climate } = district;
  const { adaptation } = breed;

  // Сумма активных температур
  if (climate.sumActiveTemps >= adaptation.minSumActiveTemps) {
    score += 10;
    reasons.push('Достаточная сумма активных температур');
  } else {
    score -= 15;
    warnings.push(`Сумма активных температур (${climate.sumActiveTemps}°C) ниже минимальной (${adaptation.minSumActiveTemps}°C)`);
  }

  // Высота над уровнем моря
  if (district.elevation <= adaptation.maxElevation) {
    score += 8;
    reasons.push('Подходит по высотной зоне');
  } else {
    score -= 20;
    warnings.push(`Высота района (${district.elevation}м) превышает максимум для породы (${adaptation.maxElevation}м)`);
  }

  // Безморозный период
  if (climate.frostFreePeriod >= adaptation.minFrostFreePeriod) {
    score += 8;
    reasons.push('Достаточная продолжительность безморозного периода');
  } else {
    score -= 10;
    warnings.push('Короткий безморозный период');
  }

  // Морозостойкость
  const winterTempAbs = Math.abs(climate.avgWinterTemp);
  if (winterTempAbs <= Math.abs(adaptation.maxWinterTemp)) {
    score += 12;
    reasons.push(`Хорошо переносит зимние температуры района (до ${adaptation.maxWinterTemp}°C)`);
  } else {
    score -= 15;
    warnings.push('Может не выдержать зимних температур района');
  }

  // Снежный покров
  if (climate.snowCoverDays <= adaptation.maxSnowCoverDays) {
    score += 5;
    reasons.push('Способна содержаться при данной продолжительности снежного покрова');
  } else {
    score -= 10;
    warnings.push('Длительный снежный покров может затруднить тебенёвку');
  }

  // Природная зона
  if (adaptation.preferredZones.includes(district.zone)) {
    score += 10;
    reasons.push(`Природная зона "${getZoneName(district.zone)}" входит в предпочтительные`);
  } else {
    score -= 10;
    warnings.push('Природная зона не является предпочтительной для породы');
  }

  // Качество пастбищ
  if (adaptation.pastureQuality.includes(district.feedBase.pastureQuality)) {
    score += 8;
    reasons.push('Подходит качество пастбищ района');
  } else {
    score -= 10;
    warnings.push('Качество пастбищ может не соответствовать требованиям породы');
  }

  // Кормовая база
  if (district.feedBase.hayProduction >= 20) {
    score += 5;
    reasons.push('Хорошая кормовая база района');
  } else if (district.feedBase.hayProduction >= 10) {
    score += 2;
  } else {
    if (breed.adaptation.coldResistance === 'very_high') {
      score += 3;
      reasons.push('Аборигенная порода — минимальные потребности в кормах');
    } else {
      score -= 8;
      warnings.push('Слабая кормовая база района');
    }
  }

  // Бонус для аборигенных пород
  if (breed.id === 'buubei' || breed.id === 'buriatskaya_loshad') {
    score += 5;
    reasons.push('Аборигенная порода — максимальная адаптация к условиям Бурятии');
  }

  // Ограничение 0-100
  score = Math.max(0, Math.min(100, score));

  return { breed, score, reasons, warnings };
}

export function calculateTechnologyScore(technology: Technology, district: District): TechnologyRecommendation {
  let score = 50;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Кормовая база
  if (district.feedBase.hayProduction >= technology.requirements.minHayProduction) {
    score += 15;
    reasons.push('Кормовая база достаточна для данной технологии');
  } else {
    score -= 15;
    warnings.push(`Недостаточная заготовка сена (нужно ${technology.requirements.minHayProduction} тыс.т, есть ${district.feedBase.hayProduction} тыс.т)`);
  }

  // Площадь пастбищ
  if (district.feedBase.pastureArea >= technology.requirements.minPastureArea) {
    score += 12;
    reasons.push('Достаточная площадь пастбищ');
  } else {
    score -= 12;
    warnings.push('Недостаточная площадь пастбищ');
  }

  // Природная зона
  if (technology.requirements.preferredZones.includes(district.zone)) {
    score += 10;
    reasons.push('Технология подходит для природной зоны района');
  } else {
    score -= 10;
    warnings.push('Природная зона не оптимальна для данной технологии');
  }

  // Высота
  if (district.elevation >= technology.requirements.minElevation && 
      district.elevation <= technology.requirements.maxElevation) {
    score += 8;
    reasons.push('Подходит по высотному поясу');
  } else {
    score -= 8;
    warnings.push('Высота района выходит за рекомендуемые пределы');
  }

  // Качество пастбищ
  if (district.feedBase.pastureQuality === 'high') {
    score += 5;
    reasons.push('Высокое качество пастбищ');
  } else if (district.feedBase.pastureQuality === 'low') {
    if (technology.type === 'pasture_year') {
      score -= 5;
      warnings.push('Низкое качество пастбищ — необходимы дополнительные подкормки');
    }
  }

  // Специфические бонусы
  if (technology.type === 'pasture_year' && district.zone === 'mountain-tundra') {
    score += 10;
    reasons.push('Круглогодичное пастбищное содержание — оптимально для горных районов');
  }

  if (technology.type === 'otgon' && district.feedBase.pastureArea > 300) {
    score += 8;
    reasons.push('Большие площади пастбищ позволяют эффективно использовать отгонную систему');
  }

  if (technology.type === 'stall' && district.feedBase.hayProduction > 30) {
    score += 5;
    reasons.push('Хорошая кормовая база для стойлового содержания');
  }

  score = Math.max(0, Math.min(100, score));

  return { technology, score, reasons, warnings };
}

export function getRecommendations(district: District): {
  breeds: BreedRecommendation[];
  technologies: TechnologyRecommendation[];
} {
  const breedRecs = breeds.map(breed => calculateBreedScore(breed, district))
    .sort((a, b) => b.score - a.score);

  const techRecs = technologies.map(tech => calculateTechnologyScore(tech, district))
    .sort((a, b) => b.score - a.score);

  return { breeds: breedRecs, technologies: techRecs };
}

export function getZoneName(zone: string): string {
  const names: Record<string, string> = {
    'steppe': 'Степная',
    'forest-steppe': 'Лесостепная',
    'mountain-taiga': 'Горно-таёжная',
    'mountain-tundra': 'Горно-тундровая',
  };
  return names[zone] || zone;
}

export function getDistricts() {
  return districts;
}

export function getDistrictById(id: string): District | undefined {
  return districts.find(d => d.id === id);
}

export function getBreeds() {
  return breeds;
}

export function getTechnologies() {
  return technologies;
}
