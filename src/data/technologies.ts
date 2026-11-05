export interface Technology {
  id: string;
  name: string;
  description: string;
  type: 'stall_pasture' | 'pasture_year' | 'stall' | 'otgon';
  details: {
    winterFeeding: string;
    summerFeeding: string;
    housingRequirements: string;
    laborIntensity: 'low' | 'medium' | 'high';
    capitalRequirements: 'low' | 'medium' | 'high';
  };
  requirements: {
    minHayProduction: number; // тыс. тонн
    minPastureArea: number; // тыс. га
    preferredZones: ('steppe' | 'forest-steppe' | 'mountain-taiga' | 'mountain-tundra')[];
    minElevation: number;
    maxElevation: number;
  };
  advantages: string[];
  disadvantages: string[];
  examples: string[];
  economicData: {
    costPerHead: string;
    revenuePerHead: string;
    paybackPeriod: string;
  };
}

export const technologies: Technology[] = [
  {
    id: 'stall_pasture',
    name: 'Стойлово-пастбищное содержание',
    type: 'stall_pasture',
    description: 'Комбинированная система: зимний период — стойловое содержание с кормлением заготовленными кормами, летний период — пастбищное содержание. Наиболее распространённая технология в Бурятии.',
    details: {
      winterFeeding: 'Сено, солома, концентраты (0.5-1 кг/гол), корнеплоды. Расход сена: 3-4 кг/гол/сутки',
      summerFeeding: 'Естественные пастбища, культурные пастбища. Подкормка концентратами при необходимости',
      housingRequirements: 'Тёплые или полуоткрытые помещения. Температура не ниже -5°C. Вентиляция обязательна',
      laborIntensity: 'medium',
      capitalRequirements: 'medium',
    },
    requirements: {
      minHayProduction: 10,
      minPastureArea: 50,
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga'],
      minElevation: 300,
      maxElevation: 1200,
    },
    advantages: [
      'Контроль кормления и здоровья животных',
      'Возможность селекционной работы',
      'Снижение потерь от хищников',
      'Универсальность для большинства пород',
    ],
    disadvantages: [
      'Необходимость заготовки кормов',
      'Затраты на строительство помещений',
      'Трудоёмкость в зимний период',
    ],
    examples: [
      'Большинство хозяйств Мухоршибирского района',
      'СПК «Ульдурга» — адаптивная технология с традиционным отгоном',
      'Хозяйства Кабанского района',
    ],
    economicData: {
      costPerHead: '8 000 - 15 000 руб./год',
      revenuePerHead: '18 000 - 35 000 руб./год',
      paybackPeriod: '2-3 года',
    },
  },
  {
    id: 'pasture_year',
    name: 'Круглогодичное пастбищное содержание',
    type: 'pasture_year',
    description: 'Содержание животных на пастбище круглый год с использованием тебенёвки (добыча корма из-под снега). Применимо только для аборигенных пород с высокой зимостойкостью.',
    details: {
      winterFeeding: 'Тебенёвка — добыча корма из-под снега. Подкормка сеном в период джута (гололёда, глубокого снега)',
      summerFeeding: 'Естественные пастбища, сезонные перегонки на горные пастбища',
      housingRequirements: 'Навесы или лёгкие укрытия для защиты от буранов. Ветрозащитные полосы',
      laborIntensity: 'low',
      capitalRequirements: 'low',
    },
    requirements: {
      minHayProduction: 5,
      minPastureArea: 150,
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga', 'mountain-tundra'],
      minElevation: 400,
      maxElevation: 1800,
    },
    advantages: [
      'Минимальные затраты на корма',
      'Низкая себестоимость продукции',
      'Высокая закалка животных',
      'Минимальные затраты труда',
      'Экологичность',
    ],
    disadvantages: [
      'Только для аборигенных пород',
      'Риск потерь в период джута',
      'Сложность ветеринарного контроля',
      'Зависимость от погодных условий',
    ],
    examples: [
      'Табунное коневодство Окинского района',
      'Овцеводство баунтовских хозяйств',
      'Традиционное хозяйство эвенков',
    ],
    economicData: {
      costPerHead: '3 000 - 6 000 руб./год',
      revenuePerHead: '12 000 - 25 000 руб./год',
      paybackPeriod: '1-2 года',
    },
  },
  {
    id: 'stall',
    name: 'Стойловое содержание',
    type: 'stall',
    description: 'Полностью стойловое содержание животных в капитальных помещениях. Применяется в зонах с экстремальными климатическими условиями или для интенсивного производства.',
    details: {
      winterFeeding: 'Полный рацион: сено, силос, сенаж, концентраты, премиксы. Расход сена: 4-5 кг/гол/сутки',
      summerFeeding: 'Зелёная масса с сенокосов, кормосмеси. Выгульные площадки',
      housingRequirements: 'Капитальные утеплённые помещения. Механизация кормления и навозоудаления',
      laborIntensity: 'high',
      capitalRequirements: 'high',
    },
    requirements: {
      minHayProduction: 20,
      minPastureArea: 30,
      preferredZones: ['forest-steppe', 'mountain-taiga'],
      minElevation: 300,
      maxElevation: 800,
    },
    advantages: [
      'Максимальный контроль продуктивности',
      'Высокая интенсивность производства',
      'Независимость от погоды',
      'Возможность круглогодичного получения продукции',
    ],
    disadvantages: [
      'Высокие капитальные затраты',
      'Большой расход кормов',
      'Высокая себестоимость',
      'Необходимость механизации',
    ],
    examples: [
      'Фермерские хозяйства вблизи Улан-Удэ',
      'Овцеводческие комплексы тонкорунного направления',
    ],
    economicData: {
      costPerHead: '15 000 - 25 000 руб./год',
      revenuePerHead: '25 000 - 45 000 руб./год',
      paybackPeriod: '4-6 лет',
    },
  },
  {
    id: 'otgon',
    name: 'Отгонное содержание',
    type: 'otgon',
    description: 'Сезонные перегоны животных между стационарными зимними пастбищами и летними горными пастбищами. Традиционная технология, адаптированная к условиям Бурятии.',
    details: {
      winterFeeding: 'Зимние пастбища в долинах + подкормка сеном. Расход сена: 2-3 кг/гол/сутки',
      summerFeeding: 'Летние горные пастбища (яйлаки). Богатое разнотравье',
      housingRequirements: 'Лёгкие укрытия на зимних стоянках. Временные загоны на летних пастбищах',
      laborIntensity: 'medium',
      capitalRequirements: 'low',
    },
    requirements: {
      minHayProduction: 8,
      minPastureArea: 200,
      preferredZones: ['steppe', 'forest-steppe', 'mountain-taiga'],
      minElevation: 400,
      maxElevation: 1500,
    },
    advantages: [
      'Эффективное использование сезонных пастбищ',
      'Улучшение здоровья животных',
      'Снижение нагрузки на зимние пастбища',
      'Традиционный уклад',
    ],
    disadvantages: [
      'Необходимость инфраструктуры на отгонах',
      'Транспортные расходы',
      'Организационная сложность',
      'Риск потерь при перегоне',
    ],
    examples: [
      'СПК «Ульдурга» — адаптивная технология с традиционным отгоном',
      'Овцеводческие хозяйства Тункинского района',
      'Яковые хозяйства Окинского района',
    ],
    economicData: {
      costPerHead: '5 000 - 10 000 руб./год',
      revenuePerHead: '15 000 - 30 000 руб./год',
      paybackPeriod: '2-3 года',
    },
  },
];
