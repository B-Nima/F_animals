export interface Breed {
  id: string;
  name: string;
  type: 'sheep' | 'cattle' | 'horse';
  typeName: string;
  description: string;
  characteristics: {
    weight: string;
    productivity: string;
    woolYield?: string;
    milkYield?: string;
    meatYield?: string;
  };
  adaptation: {
    minSumActiveTemps: number;
    maxElevation: number;
    minFrostFreePeriod: number;
    coldResistance: 'low' | 'medium' | 'high' | 'very_high';
    pastureQuality: ('low' | 'medium' | 'high')[];
    preferredZones: ('steppe' | 'forest-steppe' | 'mountain-taiga' | 'mountain-tundra')[];
    maxSnowCoverDays: number;
    maxWinterTemp: number; // минимальная температура (по модулю)
  };
  economicIndicators: {
    profitability: number; // балл рентабельности 1-10
    marketDemand: 'low' | 'medium' | 'high';
    productionCost: 'low' | 'medium' | 'high';
    mainProducts: string[];
  };
  researchSources: string[];
  compatibility: string[]; // совместимые технологии
}

export const breeds: Breed[] = [
  {
    id: 'buubei',
    name: 'Буубэй (бурятская)',
    type: 'sheep',
    typeName: 'Овцы',
    description: 'Аборигенная порода овец Бурятии, адаптированная к суровым условиям Забайкалья. Отличается высокой зимостойкостью, способностью к тебенёвке (добыче корма из-под снега). Шерсть используется для изготовления национальных изделий.',
    characteristics: {
      weight: 'Матки 45-55 кг, бараны 65-75 кг',
      productivity: 'Мясо-сально-шерстная',
      woolYield: '2.5-3.5 кг (матки), 4-5 кг (бараны)',
      meatYield: 'Убойный выход 45-50%',
    },
    adaptation: {
      minSumActiveTemps: 1000,
      maxElevation: 1500,
      minFrostFreePeriod: 50,
      coldResistance: 'very_high',
      pastureQuality: ['low', 'medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga', 'mountain-tundra'],
      maxSnowCoverDays: 200,
      maxWinterTemp: -35,
    },
    economicIndicators: {
      profitability: 7,
      marketDemand: 'medium',
      productionCost: 'low',
      mainProducts: ['Мясо', 'Шерсть', 'Овчина', 'Сало'],
    },
    researchSources: ['БГСХА', 'Бурятский НИИСХ'],
    compatibility: ['pasture_year', 'stall_pasture'],
  },
  {
    id: 'zabaikalskaya_tonkorunnaya',
    name: 'Забайкальская тонкорунная',
    type: 'sheep',
    typeName: 'Овцы',
    description: 'Тонкорунная порода, выведенная в Забайкалье. Хорошо адаптирована к континентальному климату. Ценится за качественную тонкую шерсть и мясную продуктивность.',
    characteristics: {
      weight: 'Матки 48-55 кг, бараны 75-90 кг',
      productivity: 'Шерстно-мясная',
      woolYield: '3.5-4.5 кг (матки), 6-8 кг (бараны)',
      meatYield: 'Убойный выход 48-52%',
    },
    adaptation: {
      minSumActiveTemps: 1500,
      maxElevation: 1000,
      minFrostFreePeriod: 75,
      coldResistance: 'high',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe'],
      maxSnowCoverDays: 170,
      maxWinterTemp: -30,
    },
    economicIndicators: {
      profitability: 8,
      marketDemand: 'high',
      productionCost: 'medium',
      mainProducts: ['Тонкая шерсть', 'Мясо'],
    },
    researchSources: ['БГСХА', 'ВНИИплем'],
    compatibility: ['stall_pasture', 'stall'],
  },
  {
    id: 'romanovskaya',
    name: 'Романовская',
    type: 'sheep',
    typeName: 'Овцы',
    description: 'Грубошёрстная порода с высокой плодовитостью (2-3 ягнёнка за окот). Хорошо адаптируется к различным условиям. Ценится за овчину высокого качества.',
    characteristics: {
      weight: 'Матки 45-55 кг, бараны 70-80 кг',
      productivity: 'Шерстно-мясная, плодовитая',
      woolYield: '2.0-3.0 кг (матки), 3.5-4.5 кг (бараны)',
      meatYield: 'Убойный выход 45-48%',
    },
    adaptation: {
      minSumActiveTemps: 1600,
      maxElevation: 800,
      minFrostFreePeriod: 85,
      coldResistance: 'medium',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe'],
      maxSnowCoverDays: 155,
      maxWinterTemp: -25,
    },
    economicIndicators: {
      profitability: 8,
      marketDemand: 'high',
      productionCost: 'medium',
      mainProducts: ['Овчина', 'Мясо', 'Шерсть'],
    },
    researchSources: ['ВНИИплем', 'ФАНЦА'],
    compatibility: ['stall_pasture', 'stall'],
  },
  {
    id: 'edilbaevskaya',
    name: 'Эдильбаевская',
    type: 'sheep',
    typeName: 'Овцы',
    description: 'Курдючная грубошёрстная порода. Отличается крупной массой, высокой мясной продуктивностью. Хорошо переносит пастбищное содержание в засушливых условиях.',
    characteristics: {
      weight: 'Матки 60-70 кг, бараны 90-110 кг',
      productivity: 'Сально-мясная',
      woolYield: '2.5-3.5 кг (матки), 3.5-4.5 кг (бараны)',
      meatYield: 'Убойный выход 50-55%',
    },
    adaptation: {
      minSumActiveTemps: 1800,
      maxElevation: 900,
      minFrostFreePeriod: 90,
      coldResistance: 'medium',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe'],
      maxSnowCoverDays: 150,
      maxWinterTemp: -25,
    },
    economicIndicators: {
      profitability: 7,
      marketDemand: 'high',
      productionCost: 'low',
      mainProducts: ['Мясо', 'Курдючный жир', 'Шерсть'],
    },
    researchSources: ['ФАНЦА', 'ВНИИплем'],
    compatibility: ['pasture_year', 'stall_pasture'],
  },
  {
    id: 'kazakhskaya_belogolovaya',
    name: 'Казахская белоголовая',
    type: 'cattle',
    typeName: 'КРС',
    description: 'Мясная порода крупного рогатого скота. Отличается высокой адаптивностью к резким перепадам температур, хорошей приспособленностью к пастбищному содержанию. Исследования адаптации в условиях Бурятии проведены БГСХА.',
    characteristics: {
      weight: 'Коровы 480-550 кг, быки 800-950 кг',
      productivity: 'Мясная',
      milkYield: '1200-1500 кг/год',
      meatYield: 'Убойный выход 58-62%',
    },
    adaptation: {
      minSumActiveTemps: 1500,
      maxElevation: 1200,
      minFrostFreePeriod: 70,
      coldResistance: 'high',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga'],
      maxSnowCoverDays: 175,
      maxWinterTemp: -32,
    },
    economicIndicators: {
      profitability: 8,
      marketDemand: 'high',
      productionCost: 'medium',
      mainProducts: ['Говядина', 'Шкуры'],
    },
    researchSources: ['БГСХА', 'ФАНЦА'],
    compatibility: ['pasture_year', 'stall_pasture'],
  },
  {
    id: 'hereford',
    name: 'Герефордская',
    type: 'cattle',
    typeName: 'КРС',
    description: 'Мировая мясная порода. Хорошо адаптируется к различным климатическим условиям. Отличается высокой оплатой корма продукцией, спокойным темпераментом.',
    characteristics: {
      weight: 'Коровы 500-600 кг, быки 850-1000 кг',
      productivity: 'Мясная',
      milkYield: '1500-1800 кг/год',
      meatYield: 'Убойный выход 60-65%',
    },
    adaptation: {
      minSumActiveTemps: 1600,
      maxElevation: 1000,
      minFrostFreePeriod: 80,
      coldResistance: 'high',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe'],
      maxSnowCoverDays: 165,
      maxWinterTemp: -28,
    },
    economicIndicators: {
      profitability: 9,
      marketDemand: 'high',
      productionCost: 'medium',
      mainProducts: ['Мраморная говядина', 'Шкуры'],
    },
    researchSources: ['ВНИИплем', 'ФАНЦА'],
    compatibility: ['pasture_year', 'stall_pasture', 'stall'],
  },
  {
    id: 'buriatskaya_loshad',
    name: 'Бурятская лошадь',
    type: 'horse',
    typeName: 'Лошади',
    description: 'Аборигенная порода лошадей, идеально приспособленная к экстремальным условиям Забайкалья. Способна круглогодично содержаться на пастбище, добывая корм из-под снега глубиной до 30 см.',
    characteristics: {
      weight: 'Кобылы 350-400 кг, жеребцы 420-480 кг',
      productivity: 'Мясо-молочная',
      milkYield: '1500-2000 кг/год (для кумыса)',
      meatYield: 'Убойный выход 52-56%',
    },
    adaptation: {
      minSumActiveTemps: 900,
      maxElevation: 1800,
      minFrostFreePeriod: 45,
      coldResistance: 'very_high',
      pastureQuality: ['low', 'medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga', 'mountain-tundra'],
      maxSnowCoverDays: 210,
      maxWinterTemp: -40,
    },
    economicIndicators: {
      profitability: 7,
      marketDemand: 'medium',
      productionCost: 'low',
      mainProducts: ['Конина', 'Кумыс', 'Табунное содержание'],
    },
    researchSources: ['БГСХА', 'Бурятский НИИСХ'],
    compatibility: ['pasture_year'],
  },
  {
    id: 'kalmytskaya',
    name: 'Калмыцкая (КРС)',
    type: 'cattle',
    typeName: 'КРС',
    description: 'Мясная порода, выведенная в условиях засушливых степей. Обладает высокой устойчивостью к болезням, хорошо переносит жару и холод. Эффективна при пастбищном содержании.',
    characteristics: {
      weight: 'Коровы 450-520 кг, быки 750-900 кг',
      productivity: 'Мясная',
      milkYield: '1300-1600 кг/год',
      meatYield: 'Убойный выход 57-60%',
    },
    adaptation: {
      minSumActiveTemps: 1700,
      maxElevation: 1000,
      minFrostFreePeriod: 80,
      coldResistance: 'high',
      pastureQuality: ['medium', 'high'],
      preferredZones: ['steppe', 'forest-steppe'],
      maxSnowCoverDays: 160,
      maxWinterTemp: -28,
    },
    economicIndicators: {
      profitability: 7,
      marketDemand: 'medium',
      productionCost: 'low',
      mainProducts: ['Говядина', 'Шкуры'],
    },
    researchSources: ['ФАНЦА', 'ВНИИплем'],
    compatibility: ['pasture_year', 'stall_pasture'],
  },
];
