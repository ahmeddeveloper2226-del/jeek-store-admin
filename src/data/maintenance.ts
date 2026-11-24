import { MaintenanceOrder, MaintenanceServiceConfig } from '../types';

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceServiceConfig = {
  titleEn: 'Door to Door Maintenance',
  titleAr: 'صيانة من الباب للباب',
  kickerEn: 'Workshop Care · Van Pickup',
  kickerAr: 'خدمة صيانة متنقلة',
  badgeEn: 'Door to Door',
  badgeAr: 'من الباب للباب',
  descriptionEn:
    'Select your service focus, choose your bike model, and confirm your doorstep address to place your maintenance order.',
  descriptionAr:
    'اختر نوع الصيانة وحدد موديل دراجتك وعنوان الاستلام لإرسال الطلب فوراً بدون سعر مسبق.',
  pickupModeLabelEn: 'Pickup Mode',
  pickupModeLabelAr: 'طريقة الاستلام',
  pickupModeEn: 'Jeek Van Pickup',
  pickupModeAr: 'فان جيك المتنقل',
  turnaroundLabelEn: 'Turnaround',
  turnaroundLabelAr: 'مدة التنفيذ المتوقعة',
  turnaroundEn: '24 - 48 Hours',
  turnaroundAr: '٢٤ - ٤٨ ساعة',
  galleryImages: [
    '/src/assets/images/maintenance_door_to_door_1795444135290.jpg',
    '/src/assets/images/detail_cockpit_macro_1795132717840.jpg',
    '/src/assets/images/hero_street_editorial_1795132717746.jpg',
  ],
  highlights: [
    {
      id: 'hl-1',
      en: 'Direct pickup from your home or office inside a padded Jeek mobile service van.',
      ar: 'استلام الدراجة مباشرة من باب منزلك أو عملك عبر فان جيك المجهز.',
    },
    {
      id: 'hl-2',
      en: 'Full structural, hydraulic brake, and drivetrain calibration by certified Jeek mechanics.',
      ar: 'فحص شامل للهيكل والكربون والفرامل وناقل الحركة على يد فنيين متخصصين.',
    },
    {
      id: 'hl-3',
      en: 'Returned ready to ride with live Preparing, In Transit, and Delivered tracking.',
      ar: 'إعادة الدراجة جاهزة تماماً للقيادة مع تتبع حالة الصيانة خطوة بخطوة.',
    },
  ],
  maintenanceTypes: [
    { id: 'overhaul', en: 'Full Bike Overhaul', ar: 'صيانة شاملة للدراجة' },
    { id: 'brakes', en: 'Brakes & Shifting Tune', ar: 'ضبط الفرامل والغيارات' },
    { id: 'suspension', en: 'Suspension & Wheel Truing', ar: 'المساعدين واستقامة الجنوط' },
    { id: 'safety', en: 'Safety Check & Wash', ar: 'فحص أمان وغسيل' },
  ],
  bikeModels: [
    { id: 'bm-1', en: 'Jeek Apex Carbon R1', ar: 'جيك أبيكس كربون R1' },
    { id: 'bm-2', en: 'Jeek Vandal Trail 29', ar: 'جيك فاندال تريل 29' },
    { id: 'bm-3', en: 'Jeek Phantom Fixie', ar: 'جيك فانتوم فيكسي' },
    { id: 'bm-4', en: 'Jeek Riot Street BMX', ar: 'جيك رايوت BMX' },
    { id: 'bm-5', en: 'Jeek Nomad Gravel X', ar: 'جيك نوماد جرافيل X' },
    { id: 'bm-6', en: 'Jeek Fury Enduro Pro', ar: 'جيك فيوري إندورو برو' },
  ],
  allowCustomBike: true,
  frameMaterials: [
    { id: 'carbon', en: 'T800 Carbon Fiber', ar: 'ألياف كربون T800' },
    { id: 'aluminum', en: '6061 Aluminum Alloy', ar: 'ألومنيوم 6061' },
    { id: 'chromoly', en: '4130 Chromoly Steel', ar: 'صلب كرومولي 4130' },
    { id: 'iron', en: 'High-Tensile Iron / BMX', ar: 'حديد صلب / BMX' },
  ],
};

export const STUDIO_IMAGE_PRESETS = [
  {
    label: 'Door to Door Van Workshop',
    labelAr: 'فان صيانة جيك المتنقل',
    url: '/src/assets/images/maintenance_door_to_door_1795444135290.jpg',
  },
  {
    label: 'Crimson Apex Road Bike',
    labelAr: 'دراجة طريق قرمزية',
    url: '/src/assets/images/bike_crimson_apex_1795132241297.jpg',
  },
  {
    label: 'Obsidian Trail MTB',
    labelAr: 'دراجة جبلية سوداء',
    url: '/src/assets/images/bike_obsidian_trail_1795132241402.jpg',
  },
  {
    label: 'Phantom Street Fixie',
    labelAr: 'دراجة فيكسي بيضاء',
    url: '/src/assets/images/bike_phantom_fixie_1795132241812.jpg',
  },
  {
    label: 'Riot Street BMX',
    labelAr: 'دراجة BMX استعراضية',
    url: '/src/assets/images/bike_iron_bmx_1795132241775.jpg',
  },
  {
    label: 'Nomad Gravel Bike',
    labelAr: 'دراجة جرافيل فضية',
    url: '/src/assets/images/bike_gravel_nomad_1795132241700.jpg',
  },
  {
    label: 'Fury Enduro Pro',
    labelAr: 'دراجة إندورو تعليق كامل',
    url: '/src/assets/images/bike_enduro_pro_1795132241241.jpg',
  },
  {
    label: 'Accessories Pack',
    labelAr: 'حزمة إكسسوارات',
    url: '/src/assets/images/cat_accessories_1795132241553.jpg',
  },
  {
    label: 'CNC Spare Parts',
    labelAr: 'قطع غيار CNC',
    url: '/src/assets/images/cat_spare_parts_1795132240789.jpg',
  },
  {
    label: 'Safety Helmet & Gear',
    labelAr: 'خوذة ومعدات أمان',
    url: '/src/assets/images/cat_safety_1795132241059.jpg',
  },
];
