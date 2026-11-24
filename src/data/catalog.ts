import { Language, Order, Product, QuizAnswers } from '../types';

export const STORE_LOGO = '/assets/aistudio/jeekstore1-removebg-preview.png';

export function formatCurrency(amount: number, language: Language): string {
  return language === 'ar'
    ? `${amount.toLocaleString()} ج.م`
    : `${amount.toLocaleString()} EGP`;
}

export const PRODUCTS: Product[] = [
  {
    id: 'jeek-apex-r1',
    name: 'Jeek Apex Carbon R1',
    nameAr: 'جيك أبيكس كربون R1',
    category: 'bikes',
    subCategory: 'Aero Road',
    subCategoryAr: 'طريق انسيابية',
    price: 1890,
    element: 'T800 Carbon Fiber',
    elementAr: 'ألياف كربون T800',
    elementKey: 'carbon',
    sizes: ['S', 'M', 'L'],
    wheelSize: '700c',
    weightKg: 7.4,
    drivetrain: 'Shimano 105 Di2 24-Speed',
    drivetrainAr: 'شيمانو 105 إلكتروني ٢٤ سرعة',
    brakes: 'Hydraulic Flat-Mount Disc',
    brakesAr: 'فرامل قرصية هيدروليكية',
    fork: 'Full Monocoque Aero Carbon',
    forkAr: 'شوكة كربون انسيابية كاملة',
    colors: [
      { name: 'Crimson Red', nameAr: 'أحمر قرمزي', hex: '#DC2626' },
      { name: 'Jet Black', nameAr: 'أسود مطفي', hex: '#09090B' },
      { name: 'Chalk White', nameAr: 'أبيض ناصع', hex: '#F4F4F5' },
    ],
    image: '/src/assets/images/bike_crimson_apex_1795132241297.jpg',
    isTopSale: true,
    rating: 4.9,
    description:
      'Engineered with wind-tunnel Kamm-tail tubing and internal cockpit routing, the Apex Carbon R1 turns pure leg watt output into razor-sharp tarmac velocity.',
    descriptionAr:
      'مصممة بأنابيب كربون هوائية وتمديد أسلاك داخلي لتحويل كل طاقة الدفع إلى سرعة فائقة على الأسفلت.',
    highlights: [
      'Featherweight 7.4 kg full carbon race chassis',
      '50mm deep-section carbon wheelset with sealed ceramic hubs',
      'Internal cockpit cable routing with integrated stem mount',
    ],
    highlightsAr: [
      'هيكل سباق خفيف الوزن ٧.٤ كجم بالكامل من الكربون',
      'جنوط كربون بعمق ٥٠ مم مع رمان بلي سيراميك',
      'تمديد داخلي كامل للأسلاك بمظهر انسيابي',
    ],
    geometry: {
      headAngle: '73.0°',
      reach: '391 mm',
      stack: '544 mm',
      wheelbase: '988 mm',
    },
    reviews: [
      {
        id: 'r1',
        rider: 'Karim T.',
        city: 'Cairo',
        rating: 5,
        comment: 'Feels unreal above 38 km/h. Zero flex on sprints and the crimson paint hits different in sunlight.',
        commentAr: 'أداء مذهل فوق ٣٨ كم/ساعة وثبات رائع في الانطلاقات السريعة.',
      },
      {
        id: 'r2',
        rider: 'Nadia M.',
        city: 'Alexandria',
        rating: 4.8,
        comment: 'Super light carrying up stairs and effortless climbing on weekend coastal rides.',
        commentAr: 'خفيفة جداً في الحمل وممتازة في المسافات الطويلة.',
      },
    ],
    fitProfile: {
      terrains: ['tarmac', 'mixed'],
      stance: 'aero',
      budgetTier: 'pro',
    },
  },
  {
    id: 'jeek-vandal-29',
    name: 'Jeek Vandal Trail 29',
    nameAr: 'جيك فاندال تريل 29',
    category: 'bikes',
    subCategory: 'Hardtail MTB',
    subCategoryAr: 'جبلية صلبة',
    price: 1150,
    element: '6061 Hydroformed Aluminum',
    elementAr: 'ألومنيوم 6061 مُشكّل هيدروليكياً',
    elementKey: 'aluminum',
    sizes: ['M', 'L', 'XL'],
    wheelSize: '29"',
    weightKg: 12.6,
    drivetrain: 'SRAM SX Eagle 1x12',
    drivetrainAr: 'سرام إيجل ١×١٢ سرعة',
    brakes: 'Dual-Piston Hydraulic 180mm',
    brakesAr: 'فرامل هيدروليك ثنائية المكبس ١٨٠ مم',
    fork: '130mm Air Suspension Lockout',
    forkAr: 'مساعد هوائي ١٣٠ مم مع قفل',
    colors: [
      { name: 'Stealth Black', nameAr: 'أسود خفي', hex: '#18181B' },
      { name: 'Racing Red', nameAr: 'أحمر سباقات', hex: '#DC2626' },
      { name: 'Ash Silver', nameAr: 'فضي رمادي', hex: '#71717A' },
    ],
    image: '/src/assets/images/bike_obsidian_trail_1795132241402.jpg',
    isTopSale: true,
    rating: 4.8,
    description:
      'Slack 66° head angle meets rugged 6061 aluminum tubing and a crimson anodized 130mm air fork—built to eat rock gardens, urban stairs, and singletrack.',
    descriptionAr:
      'هيكل ألومنيوم متين مع شوكة هوائية حمراء ١٣٠ مم وإطارات ٢٩ بوصة لاقتحام الطرق الوعرة والمنحدرات.',
    highlights: [
      'Hydroformed 6061-T6 alloy frame with tapered headtube',
      'Wide 2.4" knobby tubeless-ready trail tires',
      'Internal dropper-post routing ready for aggressive descents',
    ],
    highlightsAr: [
      'هيكل ألومنيوم 6061 مقوى بتقنية التشكيل المائي',
      'إطارات عريضة ٢.٤ بوصة جاهزة للتيوبلس',
      'تجهيز داخلي لعمود المقعد الهيدروليكي',
    ],
    geometry: {
      headAngle: '66.0°',
      reach: '455 mm',
      stack: '622 mm',
      wheelbase: '1198 mm',
    },
    reviews: [
      {
        id: 'r3',
        rider: 'Omar H.',
        city: 'Giza',
        rating: 4.9,
        comment: 'Took it straight to Wadi Degla trails—rock solid control and crisp 1x12 shifting.',
        commentAr: 'جربتها في المسارات الصخرية وثباتها ممتاز جداً مع ناقل الحركة ١×١٢.',
      },
    ],
    fitProfile: {
      terrains: ['trail', 'mixed'],
      stance: 'balanced',
      budgetTier: 'mid',
    },
  },
  {
    id: 'jeek-phantom-fixie',
    name: 'Jeek Phantom Street Fixie',
    nameAr: 'جيك فانتوم فيكسي',
    category: 'bikes',
    subCategory: 'Urban Fixed / Single',
    subCategoryAr: 'حضرية سريعة',
    price: 640,
    element: '4130 Chromoly Steel',
    elementAr: 'صلب كرومولي 4130',
    elementKey: 'chromoly',
    sizes: ['S', 'M', 'L'],
    wheelSize: '700c',
    weightKg: 9.2,
    drivetrain: '48T CNC Alloy Flip-Flop Hub',
    drivetrainAr: 'ترس ٤٨ سن مع صرة وجهين',
    brakes: 'Dual-Pivot Forged Caliper',
    brakesAr: 'فرامل كاليبر مزدوجة المحور',
    fork: 'Brazed Chromoly Straight Blade',
    forkAr: 'شوكة كرومولي مستقيمة',
    colors: [
      { name: 'Pure White', nameAr: 'أبيض صافي', hex: '#FFFFFF' },
      { name: 'Crimson Chain', nameAr: 'أحمر قرمزي', hex: '#DC2626' },
      { name: 'Obsidian', nameAr: 'أسود داكن', hex: '#09090B' },
    ],
    image: '/src/assets/images/bike_phantom_fixie_1795132241812.jpg',
    isTopSale: true,
    rating: 4.8,
    description:
      'Clean-welded 4130 chromoly track geometry finished in gallery white with deep-V black rims and a crimson half-link chain. Flip-flop hub lets you run fixed or freewheel.',
    descriptionAr:
      'تصميم تراك بسيط من الكرومولي باللون الأبيض النقي وجنوط سوداء عميقة مع إمكانية التبديل بين الثابت والحر.',
    highlights: [
      'Double-butted 4130 chromoly frame absorbs rough city asphalt',
      'Flip-flop rear hub: switch between fixed gear and coasting freewheel',
      'Zero-clutter minimalist silhouette with 42mm deep-dish rims',
    ],
    highlightsAr: [
      'هيكل كرومولي مزدوج السماكة يمتص اهتزازات الشوارع',
      'صرة خلفية بوجهين للقيادة الحرة أو الثابتة',
      'مظهر نظيف وبسيط مع جنوط عميقة ٤٢ مم',
    ],
    geometry: {
      headAngle: '74.0°',
      reach: '398 mm',
      stack: '528 mm',
      wheelbase: '974 mm',
    },
    reviews: [
      {
        id: 'r4',
        rider: 'Youssef A.',
        city: 'Downtown',
        rating: 4.9,
        comment: 'Zero maintenance, super snappy in traffic, and everyone asks about the white & red colorway.',
        commentAr: 'سريعة جداً في الزحام ولا تحتاج صيانة معقدة وشكلها خطف الأنظار.',
      },
    ],
    fitProfile: {
      terrains: ['city', 'tarmac'],
      stance: 'balanced',
      budgetTier: 'entry',
    },
  },
  {
    id: 'jeek-riot-bmx',
    name: 'Jeek Riot Street BMX',
    nameAr: 'جيك رايوت BMX',
    category: 'bikes',
    subCategory: 'Freestyle BMX',
    subCategoryAr: 'استعراضية شوارع',
    price: 480,
    element: 'High-Tensile Iron Alloy',
    elementAr: 'سبيكة حديد عالي الصلابة',
    elementKey: 'iron',
    sizes: ['One Size (20.5" TT)'],
    wheelSize: '20"',
    weightKg: 11.1,
    drivetrain: '25T Splined CrMo 3-Piece Crank',
    drivetrainAr: 'كرنك ٣ قطع مع ترس ٢٥ سن',
    brakes: 'Rear Alloy U-Brake',
    brakesAr: 'فرامل خلفية U-Brake',
    fork: '100% Hi-Ten Tapered Street Fork',
    forkAr: 'شوكة حديد مقوى للشارع',
    colors: [
      { name: 'Matte Black', nameAr: 'أسود مطفي', hex: '#09090B' },
      { name: 'Blood Red', nameAr: 'أحمر داكن', hex: '#B91C1C' },
      { name: 'Chalk White', nameAr: 'أبيض طباشيري', hex: '#FAFAFA' },
    ],
    image: '/src/assets/images/bike_iron_bmx_1795132241775.jpg',
    isTopSale: true,
    rating: 4.7,
    description:
      'Built for ledges, rails, and skatepark bowls. Thick-walled high-tensile iron-alloy frame paired with CNC red anodized top-load stem, sealed 9T cassette hub, and 2.4" street slicks.',
    descriptionAr:
      'دراجة استعراضات شوارع بهيكل حديد عالي التحمل مع رقبة حمراء CNC وعجلات ٢٠ بوصة عريضة.',
    highlights: [
      'Heavy-duty high-tensile iron-alloy tubes built for hard landings',
      'Anodized crimson CNC top-load stem & sealed bearing 9T driver',
      'Wide 9" rise 2-piece handlebars for effortless manuals and spins',
    ],
    highlightsAr: [
      'أنابيب حديد عالية التحمل مصممة للقفزات والشارع',
      'رقبة ألومنيوم حمراء وتروس مغلقة الأداء',
      'مقود عريض بارتفاع ٩ بوصة للتحكم الكامل في الحركات',
    ],
    geometry: {
      headAngle: '75.5°',
      reach: '20.5 in',
      stack: '9.0 in',
      wheelbase: '35.2 in',
    },
    reviews: [
      {
        id: 'r5',
        rider: 'Ziad K.',
        city: 'Maadi',
        rating: 4.7,
        comment: 'Took massive drops on day one without a single creak. Best value street rig.',
        commentAr: 'تحمل عالي جداً من أول يوم وأفضل قيمة مقابل السعر.',
      },
    ],
    fitProfile: {
      terrains: ['park', 'city'],
      stance: 'upright',
      budgetTier: 'entry',
    },
  },
  {
    id: 'jeek-nomad-gravel',
    name: 'Jeek Nomad Gravel X',
    nameAr: 'جيك نوماد جرافيل X',
    category: 'bikes',
    subCategory: 'All-Road Gravel',
    subCategoryAr: 'طرق مختلطة وجرافيل',
    price: 1420,
    element: '7005 Aerospace Aluminum',
    elementAr: 'ألومنيوم طيران 7005',
    elementKey: 'aluminum',
    sizes: ['S', 'M', 'L', 'XL'],
    wheelSize: '700x42c',
    weightKg: 9.8,
    drivetrain: 'Shimano GRX 1x11 Clutch',
    drivetrainAr: 'شيمانو GRX ١×١١ سرعة',
    brakes: 'GRX Hydraulic 160mm Rotors',
    brakesAr: 'فرامل هيدروليك GRX ١٦٠ مم',
    fork: 'Carbon Adventure Fork w/ Mounts',
    forkAr: 'شوكة كربون مع نقاط تثبيت',
    colors: [
      { name: 'Brushed Silver', nameAr: 'فضي مصقول', hex: '#D4D4D8' },
      { name: 'Crimson Geo', nameAr: 'أحمر هندسي', hex: '#DC2626' },
      { name: 'Graphite Black', nameAr: 'جرافيت أسود', hex: '#18181B' },
    ],
    image: '/src/assets/images/bike_gravel_nomad_1795132241700.jpg',
    isTopSale: true,
    rating: 4.9,
    description:
      'One quiver killer for rough city shortcuts and dirt desert tracks. Aerospace 7005 aluminum tubes, flared drop bars, and clearance up to 48mm tires.',
    descriptionAr:
      'دراجة متعددة الطرق من ألومنيوم الطيران 7005 تجمع بين سرعة الطريق وثبات الدروب الرملية.',
    highlights: [
      'Triple-butted 7005 aluminum chassis with carbon adventure fork',
      'Flared gravel drop bars for confident control on loose surfaces',
      'Integrated bottle, rack, and top-tube bikepacking mounts',
    ],
    highlightsAr: [
      'هيكل ألومنيوم 7005 ثلاثي السماكة مع شوكة كربون',
      'مقود جرافيل مفتوح الزاوية للتحكم في المسارات الحصوية',
      'نقاط تثبيت متعددة للحقائب والرحلات الطويلة',
    ],
    geometry: {
      headAngle: '71.2°',
      reach: '386 mm',
      stack: '579 mm',
      wheelbase: '1038 mm',
    },
    reviews: [
      {
        id: 'r6',
        rider: 'Salma R.',
        city: 'New Cairo',
        rating: 5,
        comment: 'Smooth on broken pavement and flies on gravel fire roads. My daily commuter and weekend escape.',
        commentAr: 'مريحة جداً على الشوارع غير الممهدة وسريعة في الرحلات.',
      },
    ],
    fitProfile: {
      terrains: ['mixed', 'city', 'tarmac'],
      stance: 'balanced',
      budgetTier: 'mid',
    },
  },
  {
    id: 'jeek-fury-enduro',
    name: 'Jeek Fury Enduro FS',
    nameAr: 'جيك فيوري إندورو FS',
    category: 'bikes',
    subCategory: 'Full-Suspension MTB',
    subCategoryAr: 'تعليق كامل جبلية',
    price: 2450,
    element: '6066 Forged Aluminum',
    elementAr: 'ألومنيوم 6066 مطروق',
    elementKey: 'aluminum',
    sizes: ['M', 'L'],
    wheelSize: '27.5"',
    weightKg: 14.3,
    drivetrain: 'SRAM GX Eagle 12-Speed',
    drivetrainAr: 'سرام GX إيجل ١٢ سرعة',
    brakes: '4-Piston DH Hydraulic 203mm',
    brakesAr: 'فرامل ٤ مكابس ٢٠٣ مم',
    fork: '160mm Red Anodized Coil/Air',
    forkAr: 'مساعد أمامي ١٦٠ مم وخلفي لولبي',
    colors: [
      { name: 'Crimson Carbon', nameAr: 'أحمر وأسود', hex: '#DC2626' },
      { name: 'Jet Black', nameAr: 'أسود نفاث', hex: '#09090B' },
    ],
    image: '/src/assets/images/bike_enduro_pro_1795132241241.jpg',
    isTopSale: false,
    rating: 4.9,
    description:
      'Built for big drops and steep technical descents. 160mm front & coil rear suspension paired with forged 6066 alloy linkage and 4-piston stopping power.',
    descriptionAr:
      'دراجة تعليق كامل للمنحدرات الصعبة مع مساعد أمامي ١٦٠ مم ومساعد خلفي لولبي وفرامل ٤ مكابس.',
    highlights: [
      '160mm travel front & rear coil shock with rebound tuning',
      '4-piston 203mm hydraulic rotors for fade-free braking',
      'Slack enduro geometry engineered for high-speed stability',
    ],
    highlightsAr: [
      'تعليق أمامي وخلفي ١٦٠ مم قابل للتعديل',
      'فرامل ٤ مكابس بقرص ٢٠٣ مم للثبات في المنحدرات',
      'هندسة إندورو مصممة للثبات عند السرعات العالية',
    ],
    geometry: {
      headAngle: '64.5°',
      reach: '470 mm',
      stack: '630 mm',
      wheelbase: '1245 mm',
    },
    reviews: [
      {
        id: 'r7',
        rider: 'Hady S.',
        city: 'Sinai',
        rating: 5,
        comment: 'Point it down anything rocky and it tracks like a train.',
        commentAr: 'تمتص كل الصدمات على الصخور بثبات مذهل.',
      },
    ],
    fitProfile: {
      terrains: ['trail'],
      stance: 'balanced',
      budgetTier: 'pro',
    },
  },
  // Accessories
  {
    id: 'acc-street-kit',
    name: 'Jeek Urban Essentials Pack',
    nameAr: 'طقم إكسسوارات جيك الحضري',
    category: 'accessories',
    subCategory: 'Carry & Security',
    subCategoryAr: 'حمل وأمان',
    price: 135,
    element: 'Ballistic Nylon & Hardened Steel',
    elementAr: 'نايلون مقوى وصلب مقسى',
    elementKey: 'gear',
    sizes: ['Universal'],
    wheelSize: 'Universal',
    weightKg: 1.4,
    drivetrain: 'N/A',
    drivetrainAr: 'غير منطبق',
    brakes: 'N/A',
    brakesAr: 'غير منطبق',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [
      { name: 'Black / Crimson', nameAr: 'أسود / قرمزي', hex: '#09090B' },
      { name: 'Red Edition', nameAr: 'إصدار أحمر', hex: '#DC2626' },
    ],
    image: '/src/assets/images/cat_accessories_1795132241553.jpg',
    rating: 4.8,
    description:
      'Complete city commuter pack: magnetic Fidlock-style bottle, 800-lumen USB-C anodized headlight, weatherproof handlebar pack, and 13mm hardened U-lock.',
    descriptionAr:
      'حزمة متكاملة للمدينة تشمل زجاجة مغناطيسية، كشاف ٨٠٠ لومين، حقيبة مقاومة للماء، وقفل صلب مقوى.',
    highlights: [
      '800-lumen CNC aluminum USB-C rechargeable front light',
      'Waterproof zipper frame bag with crimson piping',
      '13mm hardened steel shackle U-lock with 2 laser keys',
    ],
    highlightsAr: [
      'كشاف أمامي ألومنيوم ٨٠٠ لومين قابل للشحن USB-C',
      'حقيبة مقود بسحابات مقاومة للمطر',
      'قفل حديد مقوى بسمك ١٣ مم مع مفتاحين',
    ],
    reviews: [],
  },
  {
    id: 'acc-beacon-light',
    name: 'Jeek 1200LM Night Beacon',
    nameAr: 'كشاف جيك الليلي ١٢٠٠ لومين',
    category: 'accessories',
    subCategory: 'Lighting',
    subCategoryAr: 'إضاءة ليلية',
    price: 58,
    element: 'CNC 6061 Aluminum',
    elementAr: 'ألومنيوم CNC 6061',
    elementKey: 'gear',
    sizes: ['31.8mm / 35mm Mount'],
    wheelSize: 'Universal',
    weightKg: 0.19,
    drivetrain: 'N/A',
    drivetrainAr: 'غير منطبق',
    brakes: 'N/A',
    brakesAr: 'غير منطبق',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [
      { name: 'Anodized Black/Red', nameAr: 'أسود وأحمر', hex: '#DC2626' },
    ],
    image: '/src/assets/images/cat_accessories_1795132241553.jpg',
    rating: 4.9,
    description:
      'Compact CNC-milled headlight with side visibility cutouts, IPX6 waterproofing, and 6-hour battery runtime.',
    descriptionAr:
      'كشاف ليلي مدمج من الألومنيوم المقاوم للماء بسطوع ١٢٠٠ لومين وبطارية تدوم ٦ ساعات.',
    highlights: [
      '1200 lumens wide-beam lens with anti-glare cutoff',
      'Tool-free silicone quick-release strap',
    ],
    highlightsAr: [
      'عدسة واسعة بسطوع ١٢٠٠ لومين غير مبهرة للمشاة',
      'تركيب سريع بدون أدوات',
    ],
    reviews: [],
  },
  // Spare Parts
  {
    id: 'part-cnc-upgrade',
    name: 'Jeek CNC Pro Cockpit & Brake Kit',
    nameAr: 'طقم قطع غيار جيك الاحترافي CNC',
    category: 'spare-parts',
    subCategory: 'Drivetrain & Braking',
    subCategoryAr: 'فرامل ونقل حركة',
    price: 220,
    element: 'Carbon & 7075-T6 Alloy',
    elementAr: 'كربون وألومنيوم 7075',
    elementKey: 'gear',
    sizes: ['760mm Bar · 180mm Rotor'],
    wheelSize: 'Universal',
    weightKg: 0.85,
    drivetrain: 'Ceramic Oversized Pulley',
    drivetrainAr: 'بكرة سيراميك عالية الأداء',
    brakes: '180mm Floating Red Rotor',
    brakesAr: 'قرص فرامل عائم ١٨٠ مم',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [
      { name: 'Crimson Anodized', nameAr: 'أحمر مؤكسد', hex: '#DC2626' },
      { name: 'Stealth Black', nameAr: 'أسود مطفي', hex: '#09090B' },
    ],
    image: '/src/assets/images/cat_spare_parts_1795132240789.jpg',
    rating: 4.9,
    description:
      'Upgrade your stopping power and cockpit stiffness in one drop: carbon riser bar, crimson floating 180mm disc rotor, ceramic derailleur cage, and sealed alloy flat pedals.',
    descriptionAr:
      'ترقية شاملة تشمل مقود كربون، قرص فرامل ١٨٠ مم باللون الأحمر، بكرة سيراميك، ودواسات ألومنيوم.',
    highlights: [
      'Floating stainless/alloy 180mm rotor dissipates heat fast',
      'Ceramic bearing derailleur cage cuts drivetrain friction',
      'Wide-platform CNC flat pedals with replaceable grip pins',
    ],
    highlightsAr: [
      'قرص فرامل عائم ١٨٠ مم لتشتيت الحرارة ومنع التآكل',
      'بكرة خلفية برمان سيراميك لتقليل الاحتكاك',
      'دواسات CNC مسطحة بمسامير تثبيت قابلة للاستبدال',
    ],
    reviews: [],
  },
  {
    id: 'part-rotor-180',
    name: 'Jeek Crimson Floating Rotor 180mm',
    nameAr: 'قرص فرامل جيك العائم ١٨٠ مم',
    category: 'spare-parts',
    subCategory: 'Brakes',
    subCategoryAr: 'فرامل',
    price: 49,
    element: 'Stainless Steel / 7075 Carrier',
    elementAr: 'فولاذ مقاوم للصدأ وألومنيوم',
    elementKey: 'gear',
    sizes: ['160mm', '180mm', '203mm'],
    wheelSize: '6-Bolt',
    weightKg: 0.14,
    drivetrain: 'N/A',
    drivetrainAr: 'غير منطبق',
    brakes: '6-Bolt ISO Mount',
    brakesAr: 'تثبيت ٦ مسامير',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [{ name: 'Crimson Carrier', nameAr: 'أحمر قرمزي', hex: '#DC2626' }],
    image: '/src/assets/images/cat_spare_parts_1795132240789.jpg',
    rating: 4.8,
    description:
      'Laser-cut stainless braking track riveted to a crimson 7075 alloy spider for warp-free modulation.',
    descriptionAr:
      'قرص فرامل مقصوص بالليزر مع قلب ألومنيوم أحمر لتبديد الحرارة وثبات الأداء.',
    highlights: ['True floating rivet construction', 'Includes 6 Torx T25 titanium-coated bolts'],
    highlightsAr: ['تصميم عائم حقيقي مقاوم للالتواء', 'يشمل ٦ مسامير تثبيت'],
    reviews: [],
  },
  // Safety Equipment
  {
    id: 'safety-mips-bundle',
    name: 'Jeek Aero MIPS Helmet & Armor Kit',
    nameAr: 'طقم حماية جيك خوذة MIPS وقفازات',
    category: 'safety',
    subCategory: 'Head & Hand Protection',
    subCategoryAr: 'حماية الرأس واليدين',
    price: 175,
    element: 'Polycarbonate / EPS + MIPS',
    elementAr: 'بولي كربونات ونظام MIPS',
    elementKey: 'gear',
    sizes: ['S (52-55cm)', 'M (55-59cm)', 'L (59-62cm)'],
    wheelSize: 'Universal',
    weightKg: 0.42,
    drivetrain: 'N/A',
    drivetrainAr: 'غير منطبق',
    brakes: 'N/A',
    brakesAr: 'غير منطبق',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [
      { name: 'Crimson / Matte Black', nameAr: 'قرمزي / أسود مطفي', hex: '#DC2626' },
      { name: 'Chalk White / Black', nameAr: 'أبيض / أسود', hex: '#FFFFFF' },
    ],
    image: '/src/assets/images/cat_safety_1795132241059.jpg',
    rating: 5.0,
    description:
      'Full rotational-impact protection: 22-vent MIPS street/aero helmet paired with knuckle-armored breathable gloves and UV400 photochromic riding shades.',
    descriptionAr:
      'حماية كاملة تشمل خوذة بنظام MIPS مع ٢٢ فتحة تهوية، قفازات مبطنة، ونظارة قيادة رياضية.',
    highlights: [
      'MIPS multi-directional impact protection liner',
      'Magnetic Fidlock chin buckle for one-handed release',
      'Touchscreen-compatible reinforced palm riding gloves',
    ],
    highlightsAr: [
      'نظام MIPS للحماية من الصدمات الدوارة',
      'إبزيم مغناطيسي سريع الفك بيد واحدة',
      'قفازات مبطنة متوافقة مع شاشات اللمس',
    ],
    reviews: [],
  },
  {
    id: 'safety-armor-gloves',
    name: 'Jeek Knuckle Guard Gloves',
    nameAr: 'قفازات جيك المصفحة للقيادة',
    category: 'safety',
    subCategory: 'Gloves',
    subCategoryAr: 'قفازات',
    price: 42,
    element: 'Clarino Suede & Kevlar Mesh',
    elementAr: 'جلد صناعي وشبك كيفلار',
    elementKey: 'gear',
    sizes: ['S', 'M', 'L', 'XL'],
    wheelSize: 'Universal',
    weightKg: 0.11,
    drivetrain: 'N/A',
    drivetrainAr: 'غير منطبق',
    brakes: 'N/A',
    brakesAr: 'غير منطبق',
    fork: 'N/A',
    forkAr: 'غير منطبق',
    colors: [{ name: 'Obsidian Black', nameAr: 'أسود داكن', hex: '#09090B' }],
    image: '/src/assets/images/cat_safety_1795132241059.jpg',
    rating: 4.8,
    description:
      'Abrasion-resistant riding gloves with molded knuckle shields and vibration-damping palm pads.',
    descriptionAr:
      'قفازات قيادة مقاومة للاحتكاك مع حماية للمفاصل ووسائد لامتصاص الاهتزاز.',
    highlights: ['Silicone brake-lever grip fingers', 'Microfiber thumb wipe'],
    highlightsAr: ['طباعة سيليكون للثبات على الفرامل', 'تهوية ممتازة للصيف'],
    reviews: [],
  },
];

export interface QuizQuestion {
  id: keyof QuizAnswers;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  options: {
    value: string;
    label: string;
    labelAr: string;
    hint: string;
    hintAr: string;
  }[];
}

export const PERFECT_BIKE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'terrain',
    title: 'Where will you ride most days?',
    titleAr: 'أين ستقود دراجتك في أغلب الأيام؟',
    subtitle: 'Pick your primary surface and riding environment.',
    subtitleAr: 'اختر السطح والبيئة الأساسية لقيادتك.',
    options: [
      {
        value: 'city',
        label: 'City Streets & Commutes',
        labelAr: 'شوارع المدينة والتنقل اليومي',
        hint: 'Fast agility through traffic and urban alleys',
        hintAr: 'رشاقة عالية وسرعة وسط شوارع المدينة',
      },
      {
        value: 'tarmac',
        label: 'Open Road & Pure Speed',
        labelAr: 'الطرق السريعة والسرعة العالية',
        hint: 'Long-distance endurance and tarmac sprints',
        hintAr: 'مسافات طويلة وسرعة قصوى على الأسفلت',
      },
      {
        value: 'trail',
        label: 'Mountain Trails & Drops',
        labelAr: 'المسارات الجبلية والمنحدرات',
        hint: 'Rocks, dirt climbs, and suspension control',
        hintAr: 'طرق صخرية ووعرة تتطلب نظام تعليق قوي',
      },
      {
        value: 'park',
        label: 'Skateparks & Street Tricks',
        labelAr: 'الساحات وحركات الشوارع',
        hint: 'Jumps, grinds, manuals, and compact toughness',
        hintAr: 'قفزات وحركات استعراضية بهيكل صلب',
      },
      {
        value: 'mixed',
        label: 'Mixed Asphalt & Gravel',
        labelAr: 'مزيج بين الأسفلت والطرق الحصوية',
        hint: 'All-road freedom without limits',
        hintAr: 'حرية كاملة على جميع أنواع الطرق',
      },
    ],
  },
  {
    id: 'material',
    title: 'Which frame element matches your priority?',
    titleAr: 'ما خامة الهيكل المفضلة لديك؟',
    subtitle: 'Each element changes ride feel, weight, and durability.',
    subtitleAr: 'كل خامة تمنحك وزناً وإحساس قيادة مختلفاً.',
    options: [
      {
        value: 'carbon',
        label: 'T800 Carbon Fiber',
        labelAr: 'ألياف الكربون T800',
        hint: 'Ultra-lightweight and race-stiff acceleration',
        hintAr: 'أخف وزن وأقصى استجابة للسرعة',
      },
      {
        value: 'aluminum',
        label: 'Aerospace / 6061 Aluminum',
        labelAr: 'ألومنيوم 6061 / 7005',
        hint: 'Balanced strength, rust-proof, crisp handling',
        hintAr: 'توازن مثالي بين القوة والوزن الخفيف',
      },
      {
        value: 'chromoly',
        label: '4130 Chromoly Steel',
        labelAr: 'صلب كرومولي 4130',
        hint: 'Silky street vibration damping and timeless look',
        hintAr: 'يمتص اهتزازات الطريق بمظهر كلاسيكي حديث',
      },
      {
        value: 'iron',
        label: 'High-Tensile Iron Alloy',
        labelAr: 'سبيكة حديد عالية التحمل',
        hint: 'Bulletproof street toughness at sharp value',
        hintAr: 'صلابة قصوى للقفزات والاستخدام الشاق',
      },
    ],
  },
  {
    id: 'stance',
    title: 'What riding posture feels natural to you?',
    titleAr: 'ما وضعية القيادة الأكثر راحة لك؟',
    subtitle: 'Controls your handlebar reach and back angle.',
    subtitleAr: 'تحدد زاوية الجسم والانحناء أثناء القيادة.',
    options: [
      {
        value: 'aero',
        label: 'Aggressive Aero Tuck',
        labelAr: 'وضعية هجومية هوائية',
        hint: 'Low forward lean built for top speed',
        hintAr: 'انحناء أمامي لقص الهواء وتحقيق أقصى سرعة',
      },
      {
        value: 'balanced',
        label: 'Balanced Athletic Stance',
        labelAr: 'وضعية رياضية متوازنة',
        hint: 'Equal mix of power transfer and all-day comfort',
        hintAr: 'توازن بين الأداء الرياضي وراحة المسافات',
      },
      {
        value: 'upright',
        label: 'Upright & Playful',
        labelAr: 'وضعية مستقيمة وتحكم حر',
        hint: 'Tall bars, full visibility, agile control',
        hintAr: 'رؤية واضحة وتحكم مرن في المناورات',
      },
    ],
  },
  {
    id: 'height',
    title: 'What is your height bracket?',
    titleAr: 'ما هو طولك التقريبي؟',
    subtitle: 'We calibrate your recommended frame size automatically.',
    subtitleAr: 'نحدد مقاس الهيكل المثالي لك تلقائياً.',
    options: [
      {
        value: 'S',
        label: 'Under 168 cm (Frame S)',
        labelAr: 'أقل من ١٦٨ سم (مقاس S)',
        hint: 'Compact reach for nimble control',
        hintAr: 'أبعاد مدمجة للتحكم الدقيق',
      },
      {
        value: 'M',
        label: '168 – 179 cm (Frame M)',
        labelAr: '١٦٨ – ١٧٩ سم (مقاس M)',
        hint: 'Balanced mid-frame geometry',
        hintAr: 'توازن قياسي لمعظم الدراجين',
      },
      {
        value: 'L',
        label: '180 – 189 cm (Frame L)',
        labelAr: '١٨٠ – ١٨٩ سم (مقاس L)',
        hint: 'Extended cockpit for long leverage',
        hintAr: 'مساحة مريحة للقامات الطويلة',
      },
      {
        value: 'XL',
        label: '190 cm+ (Frame XL)',
        labelAr: '١٩٠ سم فأكثر (مقاس XL)',
        hint: 'Max wheelbase and tall stack height',
        hintAr: 'أكبر قاعدة عجلات لثبات كامل',
      },
    ],
  },
  {
    id: 'budget',
    title: 'Pick your target build tier',
    titleAr: 'اختر الفئة السعرية المناسبة',
    subtitle: 'Aligns drivetrain spec and wheelset level.',
    subtitleAr: 'تحدد مستوى العتاد والجنوط المناسبة لميزانيتك.',
    options: [
      {
        value: 'entry',
        label: 'Street Essential (450 – 750 EGP)',
        labelAr: 'فئة الشارع الأساسية (٤٥٠ – ٧٥٠ ج.م)',
        hint: 'Clean, tough, low-maintenance daily builds',
        hintAr: 'بساطة وقوة بتكلفة اقتصادية',
      },
      {
        value: 'mid',
        label: 'Performance Alloy (1,000 – 1,600 EGP)',
        labelAr: 'أداء الألومنيوم المتقدم (١٠٠٠ – ١٦٠٠ ج.م)',
        hint: 'Hydraulic brakes, air suspension or GRX shifting',
        hintAr: 'فرامل هيدروليك وناقل حركة احترافي',
      },
      {
        value: 'pro',
        label: 'Pro Flagship (1,800+ EGP)',
        labelAr: 'الفئة الاحترافية العليا (+١٨٠٠ ج.م)',
        hint: 'Carbon aero frames, Di2 electronic & full enduro rigs',
        hintAr: 'أعلى المواصفات من الكربون والتعليق الكامل',
      },
    ],
  },
];

export interface ScoredBikeMatch {
  bike: Product;
  score: number;
  reasons: string[];
  reasonsAr: string[];
}

export function scorePerfectBikes(
  answers: QuizAnswers,
  catalogProducts: Product[] = PRODUCTS,
): ScoredBikeMatch[] {
  const bikes = catalogProducts.filter((p) => p.category === 'bikes');
  const results: ScoredBikeMatch[] = bikes.map((bike) => {
    let points = 55;
    const reasons: string[] = [];
    const reasonsAr: string[] = [];

    if (bike.fitProfile?.terrains.includes(answers.terrain)) {
      points += 20;
      reasons.push(`Engineered specifically for ${answers.terrain} riding`);
      reasonsAr.push('مصممة خصيصاً لنوع المسار الذي اخترته');
    }

    if (bike.elementKey === answers.material) {
      points += 14;
      reasons.push(`Matches your preferred ${bike.element} frame`);
      reasonsAr.push(`تأتي بخامة ${bike.elementAr} التي فضلتها`);
    }

    if (bike.fitProfile?.stance === answers.stance) {
      points += 8;
      reasons.push('Geometry aligns directly with your preferred riding posture');
      reasonsAr.push('هندسة الهيكل تطابق وضعية القيادة المفضلة لديك');
    }

    if (bike.fitProfile?.budgetTier === answers.budget) {
      points += 7;
      reasons.push('Hits your target build tier and component level');
      reasonsAr.push('تناسب الفئة السعرية ومستوى المواصفات المطلوب');
    }

    const sizeMatched =
      bike.sizes.some((s) => s.startsWith(answers.height)) || bike.sizes.length === 1;
    if (sizeMatched) {
      points += 3;
    }

    if (reasons.length === 0) {
      reasons.push(`Versatile ${bike.element} build adaptable to daily street riding`);
      reasonsAr.push(`تصميم عملي من ${bike.elementAr} قابل للتكيف مع القيادة اليومية`);
    }

    return {
      bike,
      score: Math.min(99, points),
      reasons,
      reasonsAr,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}
