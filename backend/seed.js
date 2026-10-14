// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Product = require('./models/Product');

// Fix querySrv ENOTFOUND on networks with restricted SRV DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

const products = [
  // ===================== ELECTRONICS (15 products) =====================
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung flagship smartphone with Snapdragon 8 Gen 3, 200MP camera, titanium frame, and built-in S Pen.',
    price: 129999,
    category: 'Electronics',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple iPhone 15 Pro Max with aerospace-grade titanium design, A17 Pro chip, Action button, and 5x Telephoto camera.',
    price: 148900,
    category: 'Electronics',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors, 8 microphones, LDAC audio, and up to 30 hours battery life.',
    price: 29990,
    category: 'Electronics',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Apple MacBook Air M3 (15-inch)',
    description: 'Liquid Retina display, 18-hour battery life, 1080p FaceTime HD camera, supercharged by the Apple M3 chip.',
    price: 134900,
    category: 'Electronics',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Dell XPS 15 OLED Laptop',
    description: '15.6-inch 3.5K OLED InfinityEdge touch display, Intel Core i9, 32GB RAM, NVIDIA GeForce RTX 4060 graphics.',
    price: 189990,
    category: 'Electronics',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Apple Watch Series 9 GPS',
    description: 'Always-On Retina display, S9 SiP chip with double tap gesture, precise health and fitness tracking.',
    price: 41900,
    category: 'Electronics',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'iPad Pro 11-inch M4',
    description: 'Ultra Retina XDR display, tandem OLED technology, breakneck performance with Apple M4 chip.',
    price: 99900,
    category: 'Electronics',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Bose QuietComfort Ultra Earbuds',
    description: 'Breakthrough spatialized audio with world-class noise cancellation and CustomTune sound calibration.',
    price: 25900,
    category: 'Electronics',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Sony PlayStation 5 Slim Console',
    description: 'Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback and 3D Audio.',
    price: 49990,
    category: 'Electronics',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    description: '24.2MP full-frame CMOS sensor, 4K60p 10-bit internal video, Dual Pixel CMOS AF II, and in-body image stabilization.',
    price: 215995,
    category: 'Electronics',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'LG C3 55-inch 4K OLED Smart TV',
    description: 'Infinite contrast with self-lit OLED pixels, α9 AI Processor Gen6, Dolby Vision IQ, and 120Hz gaming mode.',
    price: 114990,
    category: 'Electronics',
    stock: 7,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks, 8K DPI track-on-glass sensor, MagSpeed electromagnetic scrolling, and ergonomic thumb rest.',
    price: 8995,
    category: 'Electronics',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    description: 'QMK/VIA wireless custom mechanical keyboard with CNC aluminum body, double-gasket design, and hot-swappable switches.',
    price: 16999,
    category: 'Electronics',
    stock: 16,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    description: 'Ultra-powerful 140W fast two-way charging with smart digital display and 24,000mAh capacity.',
    price: 11999,
    category: 'Electronics',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1609592806787-3d9c792193b2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Kindle Paperwhite (16 GB) 6.8-inch',
    description: 'Now with a 6.8-inch display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    price: 13999,
    category: 'Electronics',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80']
  },

  // ===================== CLOTHING (15 products) =====================
  {
    name: 'Nike Sportswear Tech Fleece Hoodie',
    description: 'Premium lightweight fleece fabric smooth both inside and out, keeping you warm without adding bulk.',
    price: 6495,
    category: 'Clothing',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Adidas Ultraboost Light Running Shoes',
    description: 'Lightweight BOOST cushioning delivers epic energy return with every stride on road or gym.',
    price: 13999,
    category: 'Clothing',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Levi\'s Men\'s 511 Slim Fit Jeans',
    description: 'Classic modern slim cut jeans with room to move, crafted from stretch denim for all-day comfort.',
    price: 3599,
    category: 'Clothing',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Ralph Lauren Classic Oxford Shirt',
    description: 'Signature tailored fit 100% breathable cotton button-down shirt with embroidered pony logo on chest.',
    price: 8990,
    category: 'Clothing',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Zara Oversized Wool Blend Coat',
    description: 'Minimalist double-breasted coat crafted from premium wool blend, peak lapels, and side welt pockets.',
    price: 11990,
    category: 'Clothing',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Calvin Klein Puffer Winter Jacket',
    description: 'Water-resistant, high-loft insulation thermal puffer jacket with detachable hood and signature branding.',
    price: 14499,
    category: 'Clothing',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Nike Air Force 1 \'07 Triple White',
    description: 'The radiance lives on with pristine leather, bold accents, and the perfect amount of flash.',
    price: 8195,
    category: 'Clothing',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Tommy Hilfiger Classic Crewneck Sweater',
    description: 'Pure organic cotton knitted crewneck pullover with iconic flag embroidery on the chest.',
    price: 5999,
    category: 'Clothing',
    stock: 32,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Puma T7 Vintage Track Jacket',
    description: 'Heritage street style with authentic 7cm signature contrast sleeve stripes and athletic fit.',
    price: 4499,
    category: 'Clothing',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Ray-Ban Aviator Classic Sunglasses',
    description: 'Timeless tear-drop shape frame originally designed for U.S. aviators with crystal green G-15 lenses.',
    price: 9990,
    category: 'Clothing',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Fossil Grant Chronograph Leather Watch',
    description: 'Roman numeral markers with a dark blue dial and supple brown genuine leather strap.',
    price: 11495,
    category: 'Clothing',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Under Armour HeatGear Compression Tee',
    description: 'Super-light fabric delivers superior coverage without weighing you down, with 4-way stretch construction.',
    price: 2499,
    category: 'Clothing',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'H&M Relaxed Fit Linen Blend Trousers',
    description: 'Airy linen and cotton weave trousers with elasticized drawstring waistband and tapered legs.',
    price: 2699,
    category: 'Clothing',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Uniqlo Ultra Light Down Vest',
    description: 'Incredibly lightweight and warm 750+ fill power down with water-repellent coating and packable pouch.',
    price: 3990,
    category: 'Clothing',
    stock: 38,
    images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Timberland 6-Inch Premium Waterproof Boot',
    description: 'Rugged nubuck leather boots featuring seam-sealed waterproof construction and anti-fatigue technology.',
    price: 16990,
    category: 'Clothing',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80']
  },

  // ===================== BOOKS (12 products) =====================
  {
    name: 'Atomic Habits by James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 million copies sold worldwide.',
    price: 599,
    category: 'Books',
    stock: 65,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'The Psychology of Money by Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money through behavioral psychology.',
    price: 499,
    category: 'Books',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Deep Work by Cal Newport',
    description: 'Rules for Focused Success in a Distracted World. Transform your productivity and cognitive output.',
    price: 450,
    category: 'Books',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Clean Code: Agile Software Craftsmanship',
    description: 'Robert C. Martin introduces agile practices of cleaning code on the fly to build robust systems.',
    price: 2499,
    category: 'Books',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Sapiens: A Brief History of Humankind',
    description: 'Yuval Noah Harari explores how biology and history have defined us and enhanced human understanding.',
    price: 699,
    category: 'Books',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Designing Data-Intensive Applications',
    description: 'The big ideas behind reliable, scalable, and maintainable systems by Martin Kleppmann.',
    price: 2899,
    category: 'Books',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Thinking, Fast and Slow by Daniel Kahneman',
    description: 'Nobel Memorial Prize winner in Economics Daniel Kahneman takes us on a groundbreaking tour of the mind.',
    price: 599,
    category: 'Books',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Zero to One: Notes on Startups',
    description: 'Peter Thiel shows how we can find singular ways to create new things and build the future.',
    price: 499,
    category: 'Books',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'The Pragmatic Programmer: 20th Anniversary',
    description: 'One of the most significant books on modern software engineering by David Thomas and Andrew Hunt.',
    price: 2699,
    category: 'Books',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Show Your Work! by Austin Kleon',
    description: '10 innovative ways to share your creativity and get discovered in the modern digital age.',
    price: 399,
    category: 'Books',
    stock: 42,
    images: ['https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Can\'t Hurt Me by David Goggins',
    description: 'Master your mind and defy the odds with Navy SEAL David Goggins in this inspirational bestseller.',
    price: 799,
    category: 'Books',
    stock: 36,
    images: ['https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'The Alchemist by Paulo Coelho',
    description: 'The magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.',
    price: 350,
    category: 'Books',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80']
  },

  // ===================== HOME & KITCHEN (15 products) =====================
  {
    name: 'De\'Longhi Dedica Espresso Coffee Machine',
    description: 'Slim Italian 15-bar pump espresso maker with manual milk frother for rich cappuccinos and lattes.',
    price: 22490,
    category: 'Home & Kitchen',
    stock: 16,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Philips Air Fryer XXL 7.2L',
    description: 'Cook delicious meals with up to 90% less fat. 7.2L capacity with 16-in-1 cooking presets.',
    price: 13999,
    category: 'Home & Kitchen',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Dyson V12 Detect Slim Cordless Vacuum',
    description: 'Laser reveals invisible dust on hard floors, piezo sensor intelligently measures dust particles with strong suction.',
    price: 49900,
    category: 'Home & Kitchen',
    stock: 11,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Ninja Professional Plus Kitchen Blender',
    description: '1400 peak watts motor with Total Crushing Blades to pulverize ice to snow for smoothies.',
    price: 9990,
    category: 'Home & Kitchen',
    stock: 19,
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Cast Iron Dutch Oven 6-Quart',
    description: 'Enameled heavy-duty cast iron pot for braising, baking artisan sourdough bread, roasting, and stews.',
    price: 5499,
    category: 'Home & Kitchen',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1584990347449-399c5c93cbba?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Aroma Diffuser & Ultrasonic Humidifier',
    description: '500ml ultrasonic cool mist humidifier with 7 LED ambient color lights and auto waterless shut-off.',
    price: 1899,
    category: 'Home & Kitchen',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, and yogurt maker.',
    price: 8499,
    category: 'Home & Kitchen',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Le Creuset Stoneware 4-Piece Mug Set',
    description: 'Dense stoneware blocks moisture absorption to prevent cracking, finished with impermeable exterior enamel.',
    price: 4990,
    category: 'Home & Kitchen',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Zwilling J.A. Henckels Chef\'s Knife 8-Inch',
    description: 'German high-carbon stainless steel precision-forged from a single piece with ergonomic 3-rivet handle.',
    price: 7999,
    category: 'Home & Kitchen',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Staub Cast Iron Grill Pan 10-Inch',
    description: 'Rough matte black enamel finish requires no seasoning and produces superior sear marks for steaks and veggies.',
    price: 12900,
    category: 'Home & Kitchen',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'OXO Good Grips 10-Piece Airtight Container Set',
    description: 'Stackable, space-efficient storage for dry pantry essentials with push-button airtight seal.',
    price: 6999,
    category: 'Home & Kitchen',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Balmuda The Toaster Steam Oven',
    description: 'Revolutionary steam technology and precise temperature control restore bakery-fresh taste and aroma to any bread.',
    price: 26900,
    category: 'Home & Kitchen',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1583577612013-492f7c234a5f?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Baratza Encore Conical Burr Coffee Grinder',
    description: '40 individual grind settings from fine for espresso to coarse for French press, engineered for uniform extraction.',
    price: 15999,
    category: 'Home & Kitchen',
    stock: 17,
    images: ['https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'KitchenAid Artisan Series 5-Quart Stand Mixer',
    description: 'Iconic planetary mixing action with 10 speeds to gently knead, thoroughly mix and whip ingredients.',
    price: 44990,
    category: 'Home & Kitchen',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Lodge Pre-Seasoned Cast Iron Skillet 12-Inch',
    description: 'Heirloom quality cast iron skillet pre-seasoned with 100% natural vegetable oil for stovetop, oven or campfire.',
    price: 3299,
    category: 'Home & Kitchen',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80']
  },

  // ===================== SPORTS (12 products) =====================
  {
    name: 'Wilson Pro Staff 97 Tennis Racquet',
    description: 'Co-designed with Roger Federer, offering unmatched pinpoint precision and iconic braided graphite feel.',
    price: 19999,
    category: 'Sports',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)',
    description: 'Replaces 15 sets of weights in a compact dial system adjusting from 5 to 52.5 lbs per dumbbell.',
    price: 34999,
    category: 'Sports',
    stock: 9,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Manduka PRO Yoga Mat (6mm High Density)',
    description: 'Dense cushioning for unmatched support, non-slip grip, closed-cell surface keeps sweat from seeping in.',
    price: 9499,
    category: 'Sports',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Spalding NBA Official Leather Game Basketball',
    description: 'Horween leather game ball with superior grip, deep channel design, and true bounce on indoor courts.',
    price: 4999,
    category: 'Sports',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Garmin Forerunner 265 GPS Running Smartwatch',
    description: 'Vibrant AMOLED touchscreen display, training readiness metrics, morning report, and multi-band GPS.',
    price: 42990,
    category: 'Sports',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'TREK Dual Sport Hybrid Bicycle',
    description: 'Versatile do-it-all hybrid bike featuring internal cable routing, hydraulic disc brakes, and puncture-resistant tires.',
    price: 49999,
    category: 'Sports',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Everlast Pro Style Training Boxing Gloves (14oz)',
    description: 'Premium synthetic leather coupled with superior glove construction provides lasting durability and functionality.',
    price: 3499,
    category: 'Sports',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Hydro Flask 32 oz Wide Mouth Water Bottle',
    description: 'TempShield double-wall vacuum insulation keeps drinks ice cold for up to 24 hours or hot for 12 hours.',
    price: 3999,
    category: 'Sports',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Speedo Fastskin Hyper Elite Swimming Goggles',
    description: 'Engineered for world-class racing with hydrodynamic low-profile design and IQfit 3D goggle seal.',
    price: 5499,
    category: 'Sports',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Fitbit Charge 6 Fitness & Health Tracker',
    description: 'Built-in GPS, 40+ exercise modes, 24/7 heart rate monitoring, ECG app, and 7-day battery life.',
    price: 14999,
    category: 'Sports',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Black Diamond Trail Pro Trekking Poles',
    description: 'SmashLock quick release technology for rapid deployment, ergonomic dual-density soft-touch foam grips.',
    price: 8990,
    category: 'Sports',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Osprey Talon 22 Lightweight Hiking Backpack',
    description: 'BioStretch harness and continuous-wrap hipbelt create an incredibly stable carrying system for active pursuits.',
    price: 11999,
    category: 'Sports',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']
  }
];

const seedDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cartsy';
  console.log('Connecting to database...');

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing product collection...');
    await Product.deleteMany({});

    const inserted = await Product.insertMany(products);
    console.log(`\n🎉 Successfully seeded ${inserted.length} high-quality products across all categories!`);

    const summary = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('\nCategory breakdown:');
    summary.forEach(s => console.log(`  • ${s._id}: ${s.count} items`));

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
