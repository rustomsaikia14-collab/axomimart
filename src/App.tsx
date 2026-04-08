import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, ShoppingCart, Heart, User, ChevronDown, 
  Star, ArrowUp, Truck, ShieldCheck, RefreshCcw, 
  Headphones, Tag, Facebook, Twitter, Instagram, 
  Youtube, Menu, X, Bell, Zap, Clock
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { PRODUCTS, CATEGORIES, Product } from './data';

// --- Components ---

interface ToastProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, x: '-50%' }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 glass ${
      type === 'success' ? 'text-gold' : 'text-white'
    }`}
  >
    {type === 'success' ? <ShieldCheck size={18} className="text-gold" /> : <Bell size={18} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={14} /></button>
  </motion.div>
);

const StatCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-blue-brand/60 font-semibold">{label}</div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onAddToWishlist }: { 
  product: Product, 
  onAddToCart: (p: Product) => void,
  onAddToWishlist: (p: Product) => void
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        perspective: '1000px',
        rotateX: rotate.x,
        rotateY: rotate.y,
        transition: isHovered ? 'none' : 'all 0.5s ease'
      }}
      className="glass rounded-2xl overflow-hidden hover:shadow-gold/20 hover:shadow-2xl transition-all duration-500 group relative product-card-zoom"
    >
      <div className="relative aspect-square bg-white/5 flex items-center justify-center text-8xl overflow-hidden">
        <motion.span 
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.image}
        </motion.span>
        
        {/* Quick View Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              <button 
                onClick={() => onAddToCart(product)}
                className="bg-white text-primary p-3 rounded-full hover:bg-gold hover:text-black transition-colors shadow-lg"
              >
                <ShoppingCart size={20} />
              </button>
              <button 
                onClick={() => onAddToWishlist(product)}
                className="bg-white text-primary p-3 rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg"
              >
                <Heart size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Made in Assam Badge */}
        <div className="absolute top-4 right-4 bg-gold/90 text-black text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-lg">
          <Zap size={10} fill="currentColor" /> MADE IN ASSAM
        </div>

        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">{product.brand}</div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors">{product.name}</h3>
        {product.assameseName && (
          <div className="text-sm font-assamese text-white/70 mb-2 italic">{product.assameseName}</div>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-xs text-white/40">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-white/40 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-gold hover:text-black transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'info' }[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 30 });
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Page Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to Top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    addToast(`Added ${product.name} to cart!`);
  };

  const addToWishlist = (product: Product) => {
    if (wishlist.find(p => p.id === product.id)) {
      addToast(`${product.name} is already in wishlist!`, 'info');
      return;
    }
    setWishlist(prev => [...prev, product]);
    addToast(`Added ${product.name} to wishlist!`);
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeTab !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-bg z-[200] flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 border-4 border-primary/20 border-t-gold rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="input_file_0.png" alt="AxomiMart Logo" className="w-16 h-16 object-contain" />
          </div>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-3xl font-bold text-gold tracking-widest uppercase"
        >
          AXOMIMART
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-2 text-white font-assamese text-xl"
        >
          আপোনাৰ নিজৰ দোকান...
        </motion.p>
        
        {/* Floating Motifs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, 0], 
              x: [0, i % 2 === 0 ? 50 : -50, 0],
              rotate: [0, 360],
              opacity: [0, 0.3, 0]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute text-4xl opacity-10 pointer-events-none"
            style={{ 
              top: `${20 + i * 15}%`, 
              left: `${10 + i * 15}%` 
            }}
          >
            {['🍃', '🏺', '👒', '👘', '☕', '💎'][i]}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold z-[110] origin-left" style={{ scaleX }} />

      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 text-center text-xs md:text-sm font-medium z-[100] gamusa-border-bottom">
        Free delivery above ₹499 | Use code <span className="text-gold font-bold">BIHU20</span> for 20% off
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-[90] glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <motion.img 
              whileHover={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' }}
              src="input_file_0.png" 
              alt="AxomiMart" 
              className="w-12 h-12 object-contain transition-all" 
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white leading-none">AxomiMart</h1>
              <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Where Tradition Meets Trend</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative hidden md:flex">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/40 border-r border-white/10 pr-3">
              <span className="text-xs font-bold uppercase">All</span>
              <ChevronDown size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addToast(`Searching for "${searchQuery}"...`, 'info')}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-20 pr-12 focus:ring-2 focus:ring-gold/20 transition-all outline-none text-sm text-white"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-full hover:bg-white transition-colors">
              <Search size={18} />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-5">
            <button className="p-2 text-white hover:text-gold transition-colors relative group">
              <User size={24} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-full transition-all" />
            </button>
            <button className="p-2 text-white hover:text-gold transition-colors relative group">
              <Heart size={24} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-full transition-all" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-white hover:text-gold transition-colors relative group"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-full transition-all" />
            </button>
            <button className="md:hidden p-2 text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-white/5 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-10 py-3">
            {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Grocery', 'Handicraft', 'Tea'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-sm font-semibold uppercase tracking-widest transition-all relative group ${activeTab === cat ? 'text-gold' : 'text-white/60 hover:text-white'}`}
              >
                {cat}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all ${activeTab === cat ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] overflow-hidden flex items-center justify-center">
          {/* Hero Video Background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-tea-plantation-in-the-mountains-4444-large.mp4" type="video/mp4" />
            {/* Fallback Image */}
            <img src="https://picsum.photos/seed/assam-nature/1920/1080" alt="Assam Nature" className="w-full h-full object-cover" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark-bg" />
          
          {/* Logo Watermark */}
          <img src="input_file_0.png" alt="" className="hero-watermark" />

          <div className="max-w-7xl mx-auto px-4 w-full relative z-10 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block bg-gold/10 text-gold border border-gold/20 px-6 py-2 rounded-full text-sm font-bold mb-8 tracking-[0.3em] uppercase backdrop-blur-md"
              >
                Premium Assamese Heritage
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight text-glow">
                Celebrating <span className="gold-gradient">Assam</span>
              </h2>
              
              <div className="space-y-4 mb-12">
                <p className="text-3xl md:text-4xl font-assamese text-white/90 italic">
                  "শদিয়াৰ পৰা ধুবুৰীলৈ, আমি ডিলিভাৰী কৰোঁ"
                </p>
                <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide">
                  From Sadiya to Dhubri, we deliver everywhere.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-gold text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95">
                  Shop Collection
                </button>
                <button className="glass text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all active:scale-95">
                  Our Story
                </button>
              </div>
            </motion.div>
          </div>

          {/* Floating Particles (Simplified) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -500], 
                  x: [0, (i % 2 === 0 ? 1 : -1) * 100],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
                className="absolute w-1 h-1 bg-gold rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  bottom: `-10%` 
                }}
              />
            ))}
          </div>
        </section>

        {/* Promo Banners */}
        <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Electronics Sale', sub: 'Up to 50% Off', color: 'from-blue-brand to-blue-900', icon: '📱' },
            { title: 'Bihu Fashion', sub: 'New Arrivals', color: 'from-red-brand to-orange-700', icon: '👘' },
            { title: 'Fresh Grocery', sub: 'Daily Essentials', color: 'from-green-brand to-green-900', icon: '🍎' }
          ].map((promo, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`relative h-64 rounded-3xl overflow-hidden bg-gradient-to-br ${promo.color} p-8 text-white group cursor-pointer`}
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">{promo.title}</h3>
                <p className="text-lg opacity-80 mb-6">{promo.sub}</p>
                <button className="bg-white text-blue-brand px-6 py-2 rounded-full font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all">
                  Shop Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl opacity-20 group-hover:scale-110 transition-transform">
                {promo.icon}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Categories Grid */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-brand mb-4">Shop by Category</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveTab(cat.name)}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-ivory/30 hover:bg-primary/10 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                >
                  <div className="text-4xl">{cat.icon}</div>
                  <span className="font-bold text-blue-brand text-sm uppercase tracking-wider">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="bg-red-brand text-white p-3 rounded-2xl animate-pulse">
                  <Zap size={32} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-blue-brand">Flash Deals</h2>
                  <p className="text-blue-brand/50 font-medium tracking-widest uppercase text-xs">Limited time offers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-blue-brand/60 font-bold uppercase text-sm">Ends in:</span>
                <div className="flex gap-2">
                  {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="bg-blue-brand text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                        {unit.toString().padStart(2, '0')}
                      </div>
                      {i < 2 && <span className="text-2xl font-bold text-blue-brand">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-10 snap-x no-scrollbar">
              {PRODUCTS.filter(p => p.isFlashDeal).map((product) => (
                <div key={product.id} className="min-w-[300px] snap-start">
                  <ProductCard 
                    product={product} 
                    onAddToCart={addToCart} 
                    onAddToWishlist={addToWishlist} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-4xl font-bold text-blue-brand mb-4">Featured Products</h2>
                <div className="flex gap-4 flex-wrap">
                  {['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        activeTab === tab 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-ivory text-blue-brand/60 hover:bg-primary/10'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <button className="text-primary font-bold hover:underline flex items-center gap-2">
                View All Products <ChevronDown size={16} className="-rotate-90" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard 
                      product={product} 
                      onAddToCart={addToCart} 
                      onAddToWishlist={addToWishlist} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Assamese Culture Banner */}
        <section className="relative py-32 overflow-hidden bg-primary text-white gamusa-border-top gamusa-border-bottom">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 gold-gradient">Celebrating Assam</h2>
              <p className="text-xl md:text-2xl font-assamese mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                মাজুলীৰ পৰা ডিব্ৰুগড়লৈ, আমি সকলোতে ডেলিভাৰী কৰোঁ। <br />
                From Majuli to Dibrugarh, we deliver everywhere.
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                {['Majuli', 'Dibrugarh', 'Guwahati', 'Jorhat', 'Tezpur', 'Silchar'].map((city) => (
                  <div key={city} className="glass px-6 py-3 rounded-full font-bold tracking-widest uppercase text-sm text-gold border-gold/20">
                    {city}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-ivory/50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: <Truck size={32} />, title: 'Free Delivery', desc: 'On orders over ₹499' },
              { icon: <ShieldCheck size={32} />, title: 'Secure Payment', desc: '100% safe transactions' },
              { icon: <RefreshCcw size={32} />, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: <Headphones size={32} />, title: '24/7 Support', desc: 'Dedicated help center' },
              { icon: <Tag size={32} />, title: 'Exclusive Deals', desc: 'Only for app users' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl text-center shadow-sm hover:shadow-xl transition-all"
              >
                <div className="text-primary mb-4 flex justify-center">{item.icon}</div>
                <h4 className="text-lg font-bold text-blue-brand mb-2">{item.title}</h4>
                <p className="text-sm text-blue-brand/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-brand mb-4">What Our Customers Say</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Priyanka Das', role: 'Fashion Enthusiast', text: 'The Muga silk quality is outstanding. Truly authentic Assamese heritage delivered to my doorstep in Bangalore!' },
                { name: 'Rahul Borah', role: 'Tech Professional', text: 'Fast delivery and great packaging. The bamboo lamp looks beautiful in my living room. Highly recommended!' },
                { name: 'Ananya Saikia', role: 'Home Maker', text: 'AxomiMart has made it so easy to get traditional items. The customer support is very helpful and responsive.' }
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-ivory/30 p-8 rounded-3xl relative"
                >
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-blue-brand/70 italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <h5 className="font-bold text-blue-brand">{t.name}</h5>
                      <p className="text-xs text-blue-brand/40 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-blue-brand to-blue-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 gamosa-pattern" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the AxomiMart Family</h2>
              <p className="text-lg opacity-80 mb-10">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => { e.preventDefault(); addToast('Subscribed successfully!'); }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-white/40"
                />
                <button className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-red-brand transition-all shadow-xl active:scale-95">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Brand Marquee */}
        <section className="py-12 border-y border-blue-brand/5 overflow-hidden bg-white">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-20 whitespace-nowrap"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-20">
                {['AxomSilks', 'BrahmaputraBlends', 'MajuliCrafts', 'HeritageAssam', 'GohonaGhar', 'Kheti', 'TechPro', 'SoundWave'].map((brand) => (
                  <span key={brand} className="text-2xl font-bold text-blue-brand/20 uppercase tracking-[0.3em] hover:text-primary transition-colors cursor-default">
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-bg text-white pt-20 pb-10 gamusa-border-top">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="input_file_0.png" alt="AxomiMart" className="w-10 h-10 object-contain" />
              <h2 className="text-2xl font-bold">AxomiMart</h2>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed">
              AxomiMart is Assam's premium e-commerce platform, bringing the finest heritage, culture, and modern essentials to your doorstep.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gold/20 pb-2 inline-block text-gold">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              {['About Us', 'Shop All', 'Offers & Deals', 'New Arrivals', 'Assam Heritage', 'Sellers Program'].map((link) => (
                <li key={link}><button className="hover:text-gold transition-colors">{link}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gold/20 pb-2 inline-block text-gold">Customer Service</h4>
            <ul className="space-y-4 text-white/60">
              {['My Account', 'Order Tracking', 'Wishlist', 'Returns & Refunds', 'Privacy Policy', 'Terms & Conditions'].map((link) => (
                <li key={link}><button className="hover:text-gold transition-colors">{link}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gold/20 pb-2 inline-block text-gold">Contact Us</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold">A:</span>
                <span>Sonari, Charaideo, Assam — 785690</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold font-bold">P:</span>
                <button className="hover:text-gold transition-colors">7002408247</button>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold font-bold">E:</span>
                <button className="hover:text-gold transition-colors">support@axomimart.com</button>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              {['VISA', 'MasterCard', 'UPI', 'RuPay'].map((p) => (
                <div key={p} className="glass px-3 py-1 rounded text-[10px] font-bold tracking-widest border border-gold/10 text-gold">{p}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/10 text-center text-sm text-white/40">
          <p className="font-bold text-gold mb-2">Proudly from Assam</p>
          <p>© 2026 AxomiMart. All rights reserved. Designed with ❤️ in Assam.</p>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-blue-brand/40 backdrop-blur-sm z-[120]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[130] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-blue-brand/5 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-brand flex items-center gap-3">
                  <ShoppingCart size={24} /> Your Cart ({cart.length})
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-ivory rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-8xl mb-6 opacity-20">🛒</div>
                    <h4 className="text-xl font-bold text-blue-brand mb-2">Your cart is empty</h4>
                    <p className="text-blue-brand/50 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-red-brand transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 bg-ivory/20 p-4 rounded-2xl">
                      <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-blue-brand">{item.name}</h5>
                        <p className="text-xs text-blue-brand/40 uppercase font-semibold mb-2">{item.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">₹{item.price}</span>
                          <button 
                            onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-red-brand text-xs font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-ivory/30 border-t border-blue-brand/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-blue-brand/60 font-bold uppercase text-sm">Subtotal</span>
                    <span className="text-2xl font-bold text-blue-brand">
                      ₹{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-red-brand transition-all shadow-xl active:scale-95">
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
          />
        ))}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-2xl z-[100] hover:bg-red-brand transition-all active:scale-90"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
