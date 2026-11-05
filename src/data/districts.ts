export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  climate: {
    sumActiveTemps: number; // сумма активных температур, °C
    precipitation: number; // осадки, мм/год
    frostFreePeriod: number; // безморозный период, дней
    avgWinterTemp: number; // средняя зимняя температура, °C
    avgSummerTemp: number; // средняя летняя температура, °C
    snowCoverDays: number; // дней со снежным покровом
  };
  feedBase: {
    hayProduction: number; // заготовка сена, тыс. тонн
    pastureArea: number; // площадь пастбищ, тыс. га
    pastureQuality: 'low' | 'medium' | 'high'; // качество пастбищ
    naturalMeadows: number; // естественные сенокосы, тыс. га
  };
  soilType: string;
  elevation: number; // средняя высота, м
  zone: 'steppe' | 'forest-steppe' | 'mountain-taiga' | 'mountain-tundra';
}

export const districts: District[] = [
  {
    id: 'tunkinsky',
    name: 'Тункинский район',
    lat: 51.33,
    lng: 102.23,
    climate: {
      sumActiveTemps: 1800,
      precipitation: 350,
      frostFreePeriod: 95,
      avgWinterTemp: -22,
      avgSummerTemp: 17,
      snowCoverDays: 155,
    },
    feedBase: {
      hayProduction: 45.2,
      pastureArea: 285,
      pastureQuality: 'high',
      naturalMeadows: 42,
    },
    soilType: 'Чернозёмы луговые',
    elevation: 620,
    zone: 'forest-steppe',
  },
  {
    id: 'mukhorshibirsky',
    name: 'Мухоршибирский район',
    lat: 51.63,
    lng: 107.18,
    climate: {
      sumActiveTemps: 2100,
      precipitation: 290,
      frostFreePeriod: 105,
      avgWinterTemp: -20,
      avgSummerTemp: 19,
      snowCoverDays: 140,
    },
    feedBase: {
      hayProduction: 38.7,
      pastureArea: 320,
      pastureQuality: 'medium',
      naturalMeadows: 35,
    },
    soilType: 'Чернозёмы обыкновенные',
    elevation: 480,
    zone: 'steppe',
  },
  {
    id: 'kabansky',
    name: 'Кабанский район',
    lat: 52.05,
    lng: 106.85,
    climate: {
      sumActiveTemps: 2200,
      precipitation: 320,
      frostFreePeriod: 110,
      avgWinterTemp: -19,
      avgSummerTemp: 20,
      snowCoverDays: 135,
    },
    feedBase: {
      hayProduction: 42.1,
      pastureArea: 195,
      pastureQuality: 'high',
      naturalMeadows: 48,
    },
    soilType: 'Чернозёмы выщелоченные',
    elevation: 460,
    zone: 'forest-steppe',
  },
  {
    id: 'selenginsky',
    name: 'Селенгинский район',
    lat: 51.48,
    lng: 106.55,
    climate: {
      sumActiveTemps: 2050,
      precipitation: 280,
      frostFreePeriod: 100,
      avgWinterTemp: -21,
      avgSummerTemp: 19,
      snowCoverDays: 145,
    },
    feedBase: {
      hayProduction: 35.4,
      pastureArea: 410,
      pastureQuality: 'medium',
      naturalMeadows: 30,
    },
    soilType: 'Каштановые почвы',
    elevation: 520,
    zone: 'steppe',
  },
  {
    id: 'dzidinsky',
    name: 'Джидинский район',
    lat: 50.95,
    lng: 105.75,
    climate: {
      sumActiveTemps: 1950,
      precipitation: 310,
      frostFreePeriod: 98,
      avgWinterTemp: -21,
      avgSummerTemp: 18,
      snowCoverDays: 148,
    },
    feedBase: {
      hayProduction: 28.3,
      pastureArea: 350,
      pastureQuality: 'medium',
      naturalMeadows: 25,
    },
    soilType: 'Чернозёмы обыкновенные',
    elevation: 550,
    zone: 'forest-steppe',
  },
  {
    id: 'kyakhtinsky',
    name: 'Кяхтинский район',
    lat: 50.35,
    lng: 106.45,
    climate: {
      sumActiveTemps: 2000,
      precipitation: 300,
      frostFreePeriod: 100,
      avgWinterTemp: -20,
      avgSummerTemp: 19,
      snowCoverDays: 142,
    },
    feedBase: {
      hayProduction: 25.6,
      pastureArea: 380,
      pastureQuality: 'medium',
      naturalMeadows: 22,
    },
    soilType: 'Каштановые почвы',
    elevation: 580,
    zone: 'steppe',
  },
  {
    id: 'bauntovsky',
    name: 'Баунтовский район',
    lat: 55.15,
    lng: 114.65,
    climate: {
      sumActiveTemps: 1200,
      precipitation: 380,
      frostFreePeriod: 65,
      avgWinterTemp: -30,
      avgSummerTemp: 14,
      snowCoverDays: 185,
    },
    feedBase: {
      hayProduction: 8.2,
      pastureArea: 520,
      pastureQuality: 'low',
      naturalMeadows: 12,
    },
    soilType: 'Мерзлотно-таёжные',
    elevation: 850,
    zone: 'mountain-taiga',
  },
  {
    id: 'okinsky',
    name: 'Окинский район',
    lat: 51.45,
    lng: 106.55,
    climate: {
      sumActiveTemps: 1100,
      precipitation: 400,
      frostFreePeriod: 55,
      avgWinterTemp: -28,
      avgSummerTemp: 13,
      snowCoverDays: 195,
    },
    feedBase: {
      hayProduction: 5.8,
      pastureArea: 680,
      pastureQuality: 'low',
      naturalMeadows: 8,
    },
    soilType: 'Горно-таёжные',
    elevation: 1200,
    zone: 'mountain-tundra',
  },
  {
    id: 'barguzinsky',
    name: 'Баргузинский район',
    lat: 53.55,
    lng: 109.65,
    climate: {
      sumActiveTemps: 1600,
      precipitation: 350,
      frostFreePeriod: 85,
      avgWinterTemp: -24,
      avgSummerTemp: 16,
      snowCoverDays: 165,
    },
    feedBase: {
      hayProduction: 15.4,
      pastureArea: 290,
      pastureQuality: 'medium',
      naturalMeadows: 18,
    },
    soilType: 'Подзолистые',
    elevation: 550,
    zone: 'forest-steppe',
  },
  {
    id: 'kurumkansky',
    name: 'Курумканский район',
    lat: 54.25,
    lng: 110.45,
    climate: {
      sumActiveTemps: 1500,
      precipitation: 340,
      frostFreePeriod: 80,
      avgWinterTemp: -25,
      avgSummerTemp: 16,
      snowCoverDays: 170,
    },
    feedBase: {
      hayProduction: 12.8,
      pastureArea: 310,
      pastureQuality: 'medium',
      naturalMeadows: 15,
    },
    soilType: 'Горно-чернозёмные',
    elevation: 620,
    zone: 'mountain-taiga',
  },
  {
    id: 'kizhinginsky',
    name: 'Кижингинский район',
    lat: 51.55,
    lng: 109.55,
    climate: {
      sumActiveTemps: 1850,
      precipitation: 300,
      frostFreePeriod: 92,
      avgWinterTemp: -22,
      avgSummerTemp: 17,
      snowCoverDays: 152,
    },
    feedBase: {
      hayProduction: 22.5,
      pastureArea: 340,
      pastureQuality: 'medium',
      naturalMeadows: 20,
    },
    soilType: 'Чернозёмы обыкновенные',
    elevation: 580,
    zone: 'forest-steppe',
  },
  {
    id: 'khorinsky',
    name: 'Хоринский район',
    lat: 53.15,
    lng: 110.25,
    climate: {
      sumActiveTemps: 1700,
      precipitation: 330,
      frostFreePeriod: 88,
      avgWinterTemp: -23,
      avgSummerTemp: 17,
      snowCoverDays: 160,
    },
    feedBase: {
      hayProduction: 18.6,
      pastureArea: 275,
      pastureQuality: 'medium',
      naturalMeadows: 16,
    },
    soilType: 'Чернозёмы лесные',
    elevation: 560,
    zone: 'forest-steppe',
  },
];
