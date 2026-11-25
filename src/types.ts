// jeek-admin-panel/src/types.ts
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export type PageRoute =
  | 'home'
  | 'products'
  | 'categories'
  | 'orders'
  | 'compare'
  | 'profile'
  | 'product-detail'
  | 'perfect-bike-quiz'
  | 'perfect-bike-result';

export type BikeType = 'mountain' | 'road' | 'hybrid' | 'kids';

export interface ProductDetail {
  name: string;
  value: string;
}

export type CategoryId = 'bikes' | 'accessories' | 'spare-parts' | 'safety';

export interface ProductColor {
  name: string;
  nameAr: string;
  hex: string;
}

export interface BikeGeometry {
  headAngle: string;
  reach: string;
  stack: string;
  wheelbase: string;
}

export interface ProductReview {
  id: string;
  rider: string;
  city: string;
  rating: number;
  comment: string;
  commentAr: string;
}

export interface Product {
  id: string;
  sortIndex?: number;
  name: string;
  nameAr: string;
  category: CategoryId;
  subCategory: string;
  subCategoryAr: string;
  bikeType?: BikeType;
  details?: ProductDetail[];
  price: number;
  element: string;
  elementAr: string;
  elementKey: 'carbon' | 'aluminum' | 'chromoly' | 'iron' | 'gear';
  sizes: string[];
  wheelSize: string;
  weightKg: number;
  drivetrain: string;
  drivetrainAr: string;
  brakes: string;
  brakesAr: string;
  fork: string;
  forkAr: string;
  colors: ProductColor[];
  image: string;
  isTopSale?: boolean;
  rating: number;
  description: string;
  descriptionAr: string;
  highlights: string[];
  highlightsAr: string[];
  geometry?: BikeGeometry;
  reviews: ProductReview[];
  fitProfile?: {
    terrains: string[];
    stance: 'aero' | 'balanced' | 'upright';
    budgetTier: 'entry' | 'mid' | 'pro';
  };
}

export interface CartItem {
  id: string;
  productId: string;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export type OrderStatus = 'Preparing' | 'In Transit' | 'Delivered';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  nameAr: string;
  image: string;
  colorName: string;
  colorNameAr: string;
  colorHex: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export type ProductOrderStatus = OrderStatus | 'Pending' | 'Rejected' | 'Cancelled';

export interface Order {
  id: string;
  docId?: string;
  createdAtMs?: number;
  date: string;
  status: ProductOrderStatus;
  total: number;
  address: string;
  customerName?: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
  items: OrderItemSnapshot[];
}

export interface MaintenanceChecklistItem {
  id: string;
  label: string;
  labelAr: string;
  done: boolean;
}

export interface MaintenanceLineItem {
  id: string;
  label: string;
  labelAr: string;
  cost: number;
}

export interface MaintenanceOrder {
  id: string;
  docId?: string;
  createdAtMs?: number;
  date: string;
  estimatedCompletion: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  serviceMode: 'Workshop Drop-off' | 'Jeek Van Pickup & Delivery';
  serviceModeAr: string;
  bikeModel: string;
  bikeModelAr: string;
  frameElement: string;
  frameElementAr: string;
  serialNumber: string;
  servicePackage: string;
  servicePackageAr: string;
  reportedIssue: string;
  reportedIssueAr: string;
  technician: string;
  technicianNotes: string;
  checklist: MaintenanceChecklistItem[];
  charges: MaintenanceLineItem[];
  total: number;
}

export interface CompareSlot {
  slotId: string;
  query: string;
  selectedBikeId: string | null;
}

export interface QuizAnswers {
  terrain: string;
  material: string;
  stance: string;
  height: string;
  budget: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  city: string;
  heightCm: number;
  inseamCm: number;
  preferredSize: string;
  ridingStyle: string;
  ridingStyleAr: string;
  address: string;
}

export interface MaintenanceOptionItem {
  id: string;
  en: string;
  ar: string;
}

export interface MaintenanceServiceConfig {
  titleEn: string;
  titleAr: string;
  kickerEn: string;
  kickerAr: string;
  badgeEn: string;
  badgeAr: string;
  descriptionEn: string;
  descriptionAr: string;
  pickupModeLabelEn: string;
  pickupModeLabelAr: string;
  pickupModeEn: string;
  pickupModeAr: string;
  turnaroundLabelEn: string;
  turnaroundLabelAr: string;
  turnaroundEn: string;
  turnaroundAr: string;
  galleryImages: string[];
  highlights: MaintenanceOptionItem[];
  maintenanceTypes: MaintenanceOptionItem[];
  bikeModels: MaintenanceOptionItem[];
  allowCustomBike: boolean;
  frameMaterials: MaintenanceOptionItem[];
}