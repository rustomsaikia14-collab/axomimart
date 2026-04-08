export interface Product {
  id: string;
  name: string;
  assameseName?: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  isFlashDeal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'grocery', name: 'Grocery', icon: '🍎' },
  { id: 'handicraft', name: 'Handicraft', icon: '🏺' },
  { id: 'tea', name: 'Assam Tea', icon: '🍃' },
  { id: 'jewelry', name: 'Jewelry', icon: '💍' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Muga Silk Saree',
    assameseName: 'মুগা পাটৰ সাজ',
    brand: 'AxomSilks',
    category: 'fashion',
    price: 15000,
    originalPrice: 18000,
    discount: 16,
    rating: 4.9,
    reviews: 128,
    image: '👘',
  },
  {
    id: '2',
    name: 'Organic CTC Tea',
    assameseName: 'অসমৰ চাহ',
    brand: 'BrahmaputraBlends',
    category: 'tea',
    price: 450,
    originalPrice: 550,
    discount: 18,
    rating: 4.7,
    reviews: 850,
    image: '☕',
    isFlashDeal: true,
  },
  {
    id: '3',
    name: 'Bamboo Handicraft Lamp',
    assameseName: 'বাঁহৰ চাকি',
    brand: 'MajuliCrafts',
    category: 'handicraft',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    rating: 4.8,
    reviews: 320,
    image: '🏮',
  },
  {
    id: '4',
    name: 'Smartphone X1',
    brand: 'TechPro',
    category: 'electronics',
    price: 25000,
    originalPrice: 30000,
    discount: 16,
    rating: 4.5,
    reviews: 1500,
    image: '📱',
    isFlashDeal: true,
  },
  {
    id: '5',
    name: 'Traditional Japi',
    assameseName: 'অসমীয়া জাপি',
    brand: 'HeritageAssam',
    category: 'handicraft',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    rating: 4.9,
    reviews: 450,
    image: '👒',
  },
  {
    id: '6',
    name: 'Wireless Earbuds',
    brand: 'SoundWave',
    category: 'electronics',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.3,
    reviews: 2100,
    image: '🎧',
  },
  {
    id: '7',
    name: 'Assamese Jewelry Set',
    assameseName: 'অসমীয়া গহনা',
    brand: 'GohonaGhar',
    category: 'jewelry',
    price: 5500,
    originalPrice: 7000,
    discount: 21,
    rating: 4.8,
    reviews: 190,
    image: '💎',
  },
  {
    id: '8',
    name: 'Premium Basmati Rice',
    brand: 'Kheti',
    category: 'grocery',
    price: 120,
    originalPrice: 150,
    discount: 20,
    rating: 4.6,
    reviews: 3400,
    image: '🍚',
  },
  {
    id: '9',
    name: 'Assamese Gamusa',
    assameseName: 'অসমীয়া গামোচা',
    brand: 'HeritageAssam',
    category: 'fashion',
    price: 250,
    originalPrice: 350,
    discount: 28,
    rating: 4.9,
    reviews: 1200,
    image: '🧣',
  },
  {
    id: '10',
    name: 'Bell Metal Plate',
    assameseName: 'কাঁহৰ কাঁহী',
    brand: 'SarthebariMetal',
    category: 'handicraft',
    price: 2500,
    originalPrice: 3000,
    discount: 16,
    rating: 4.8,
    reviews: 45,
    image: '🍽️',
  },
  {
    id: '11',
    name: 'Assam Silk Scarf',
    brand: 'AxomSilks',
    category: 'fashion',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    rating: 4.7,
    reviews: 310,
    image: '🧣',
  },
  {
    id: '12',
    name: 'Organic Honey',
    brand: 'KazirangaWild',
    category: 'grocery',
    price: 650,
    originalPrice: 800,
    discount: 18,
    rating: 4.9,
    reviews: 520,
    image: '🍯',
  },
];
