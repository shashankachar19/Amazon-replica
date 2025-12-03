// backend/data/products.js (Simplified 5x5 Data Set)

const products = [
  // ==========================================================
  // 1. ELECTRONICS (5 Products)
  // ==========================================================
  {
    name: 'AirPods Pro (2nd Gen)',
    image: 'images/electronics_1.jpg',
    description: 'Ultimate active noise cancellation and adaptive transparency.',
    brand: 'Apple',
    category: 'Electronics',
    price: 24999,
    countInStock: 10,
    rating: 4.8,
    numReviews: 89,
    _id: "6699a74a16c7b39a0670d8a1"
  },
  {
    name: '4K Ultra HD 55-inch Smart TV',
    image: 'images/electronics_2.jpg',
    description: 'Vivid picture quality with smart streaming features built-in.',
    brand: 'Samsung',
    category: 'Electronics',
    price: 45999,
    countInStock: 5,
    rating: 4.6,
    numReviews: 122,
    _id: "6699a74a16c7b39a0670d8a2"
  },
  {
    name: 'Wireless Mechanical Keyboard',
    image: 'images/electronics_3.jpg',
    description: 'Tactile switches for a satisfying typing experience.',
    brand: 'Logitech',
    category: 'Electronics',
    price: 7999,
    countInStock: 10,
    rating: 4.9,
    numReviews: 75,
    _id: "6699a74a16c7b39a0670d8a3"
  },
  {
    name: 'Noise-Cancelling Headphones',
    image: 'images/electronics_4.jpg',
    description: 'Industry-leading noise cancellation and 30-hour battery life.',
    brand: 'Sony',
    category: 'Electronics',
    price: 15999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 95,
    _id: "6699a74a16c7b39a0670d8a4"
  },
  {
    name: 'Portable Bluetooth Speaker',
    image: 'images/electronics_5.jpg',
    description: 'Rugged, waterproof speaker with punchy bass and long playback.',
    brand: 'JBL',
    category: 'Electronics',
    price: 4999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 60,
    _id: "6699a74a16c7b39a0670d8a5"
  },
  {
    name: 'Wireless Gaming Mouse',
    image: 'images/electronics_6.jpg',
    description: 'High precision gaming mouse with RGB lighting and programmable buttons.',
    brand: 'Razer',
    category: 'Electronics',
    price: 5999,
    countInStock: 10,
    rating: 4.6,
    numReviews: 85,
    _id: "6699a74a16c7b39a0670d8e1"
  },
  {
    name: 'Tablet 10.1 inch Android',
    image: 'images/electronics_7.jpg',
    description: '10.1 inch Android tablet with 4GB RAM and 64GB storage.',
    brand: 'Samsung',
    category: 'Electronics',
    price: 18999,
    countInStock: 10,
    rating: 4.4,
    numReviews: 67,
    _id: "6699a74a16c7b39a0670d8e2"
  },
  {
    name: 'Webcam HD 1080p',
    image: 'images/electronics_8.jpg',
    description: 'Full HD webcam with auto-focus and built-in microphone for video calls.',
    brand: 'Logitech',
    category: 'Electronics',
    price: 3499,
    countInStock: 10,
    rating: 4.5,
    numReviews: 92,
    _id: "6699a74a16c7b39a0670d8e3"
  },

  // ==========================================================
  // 2. APPAREL (8 Products)
  // ==========================================================
  {
    name: 'Men\'s Merino Wool Hiking Socks',
    image: 'images/apparel_1.jpg',
    description: 'Thick, breathable socks designed for long trails.',
    brand: 'Darn Tough',
    category: 'Apparel',
    price: 599,
    countInStock: 10,
    rating: 4.9,
    numReviews: 105,
    _id: "6699a74a16c7b39a0670d8a6"
  },
  {
    name: 'Women\'s Fleece Zip-Up Hoodie',
    image: 'images/apparel_2.jpg',
    description: 'Warm and comfortable hoodie, perfect for layering.',
    brand: 'The North Face',
    category: 'Apparel',
    price: 2499,
    countInStock: 10,
    rating: 4.6,
    numReviews: 80,
    _id: "6699a74a16c7b39a0670d8a7"
  },
  {
    name: 'Classic Denim Jeans (Slim Fit)',
    image: 'images/apparel_3.jpg',
    description: 'Durable cotton denim with a modern slim fit.',
    brand: 'Levi\'s',
    category: 'Apparel',
    price: 2999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 110,
    _id: "6699a74a16c7b39a0670d8a8"
  },
  {
    name: 'Unisex Graphic T-Shirt (Mountain)',
    image: 'images/apparel_4.jpg',
    description: 'Soft cotton tee with a striking mountain graphic design.',
    brand: 'Independent',
    category: 'Apparel',
    price: 899,
    countInStock: 10,
    rating: 4.4,
    numReviews: 40,
    _id: "6699a74a16c7b39a0670d8a9"
  },
  {
    name: 'Leather Bi-Fold Wallet',
    image: 'images/apparel_5.jpg',
    description: 'Genuine leather wallet with RFID blocking technology.',
    brand: 'Coach',
    category: 'Apparel',
    price: 3999,
    countInStock: 10,
    rating: 4.8,
    numReviews: 30,
    _id: "6699a74a16c7b39a0670d8b0"
  },
  {
    name: 'Men\'s Running Shoes',
    image: 'images/apparel_6.jpg',
    description: 'Lightweight running shoes with breathable mesh and cushioned sole.',
    brand: 'Nike',
    category: 'Apparel',
    price: 6999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 125,
    _id: "6699a74a16c7b39a0670d8e4"
  },
  {
    name: 'Women\'s Casual Dress',
    image: 'images/apparel_7.jpg',
    description: 'Elegant casual dress perfect for everyday wear and special occasions.',
    brand: 'Zara',
    category: 'Apparel',
    price: 2999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 78,
    _id: "6699a74a16c7b39a0670d8e5"
  },
  {
    name: 'Unisex Baseball Cap',
    image: 'images/apparel_8.jpg',
    description: 'Adjustable baseball cap with embroidered logo and UV protection.',
    brand: 'Adidas',
    category: 'Apparel',
    price: 1499,
    countInStock: 10,
    rating: 4.3,
    numReviews: 95,
    _id: "6699a74a16c7b39a0670d8e6"
  },

  // ==========================================================
  // 3. HOME & KITCHEN (8 Products)
  // ==========================================================
  {
    name: 'Stainless Steel 6-Piece Cookware Set',
    image: 'images/home_1.jpg',
    description: 'Professional quality stainless steel cookware, induction ready.',
    brand: 'Cuisinart',
    category: 'Home & Kitchen',
    price: 12999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 70,
    _id: "6699a74a16c7b39a0670d8b1"
  },
  {
    name: 'High-Speed Blender with Travel Cup',
    image: 'images/home_2.jpg',
    description: 'Perfect for smoothies, shakes, and quick meal prep.',
    brand: 'NutriChef',
    category: 'Home & Kitchen',
    price: 5999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 55,
    _id: "6699a74a16c7b39a0670d8b2"
  },
  {
    name: 'Bamboo Cutting Board Set',
    image: 'images/home_3.jpg',
    description: 'Set of 3 natural bamboo cutting boards in various sizes.',
    brand: 'Bamboom',
    category: 'Home & Kitchen',
    price: 2499,
    countInStock: 10,
    rating: 4.8,
    numReviews: 90,
    _id: "6699a74a16c7b39a0670d8b3"
  },
  {
    name: 'Ultra Soft 6-Piece Bath Towel Set',
    image: 'images/home_4.jpg',
    description: 'Luxuriously soft Egyptian cotton towels in a neutral color.',
    brand: 'Brooklinen',
    category: 'Home & Kitchen',
    price: 3999,
    countInStock: 10,
    rating: 4.6,
    numReviews: 65,
    _id: "6699a74a16c7b39a0670d8b4"
  },
  {
    name: 'Aroma Diffuser and Essential Oil Kit',
    image: 'images/home_5.jpg',
    description: 'Ultrasonic diffuser with a popular essential oils for relaxation.',
    brand: 'Purosol',
    category: 'Home & Kitchen',
    price: 2999,
    countInStock: 10,
    rating: 4.4,
    numReviews: 45,
    _id: "6699a74a16c7b39a0670d8b5"
  },
  {
    name: 'Coffee Maker with Grinder',
    image: 'images/home_6.jpg',
    description: 'Automatic coffee maker with built-in grinder and programmable timer.',
    brand: 'Breville',
    category: 'Home & Kitchen',
    price: 12999,
    countInStock: 10,
    rating: 4.6,
    numReviews: 87,
    _id: "6699a74a16c7b39a0670d8e7"
  },
  {
    name: 'Non-Stick Frying Pan Set',
    image: 'images/home_7.jpg',
    description: 'Set of 3 non-stick frying pans in different sizes with heat-resistant handles.',
    brand: 'Tefal',
    category: 'Home & Kitchen',
    price: 4999,
    countInStock: 10,
    rating: 4.4,
    numReviews: 112,
    _id: "6699a74a16c7b39a0670d8e8"
  },
  {
    name: 'Smart Air Purifier',
    image: 'images/home_8.jpg',
    description: 'HEPA air purifier with smart controls and air quality monitoring.',
    brand: 'Xiaomi',
    category: 'Home & Kitchen',
    price: 8999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 156,
    _id: "6699a74a16c7b39a0670d8e9"
  },

  // ==========================================================
  // 4. BOOKS (8 Products)
  // ==========================================================
  {
    name: 'The Midnight Library',
    image: 'images/books_1.jpg',
    description: 'A novel about a woman exploring different life choices.',
    brand: 'Matt Haig',
    category: 'Books',
    price: 399,
    countInStock: 10,
    rating: 4.7,
    numReviews: 150,
    _id: "6699a74a16c7b39a0670d8b6"
  },
  {
    name: 'Atomic Habits',
    image: 'images/books_2.jpg',
    description: 'An easy & proven way to build good habits & break bad ones.',
    brand: 'James Clear',
    category: 'Books',
    price: 349,
    countInStock: 10,
    rating: 4.9,
    numReviews: 200,
    _id: "6699a74a16c7b39a0670d8b7"
  },
  {
    name: 'Project Hail Mary',
    image: 'images/books_3.jpg',
    description: 'The latest sci-fi thriller from the author of The Martian.',
    brand: 'Andy Weir',
    category: 'Books',
    price: 449,
    countInStock: 10,
    rating: 4.8,
    numReviews: 130,
    _id: "6699a74a16c7b39a0670d8b8"
  },
  {
    name: 'Where the Crawdads Sing',
    image: 'images/books_4.jpg',
    description: 'A captivating story about nature, survival, and independence.',
    brand: 'Delia Owens',
    category: 'Books',
    price: 299,
    countInStock: 10,
    rating: 4.6,
    numReviews: 180,
    _id: "6699a74a16c7b39a0670d8b9"
  },
  {
    name: 'The 7 Habits of Highly Effective People',
    image: 'images/books_5.jpg',
    description: 'Timeless principles for personal change.',
    brand: 'Stephen Covey',
    category: 'Books',
    price: 399,
    countInStock: 10,
    rating: 4.5,
    numReviews: 115,
    _id: "6699a74a16c7b39a0670d8c0"
  },
  {
    name: 'Think and Grow Rich',
    image: 'images/books_6.jpg',
    description: 'Classic self-help book on achieving success and building wealth.',
    brand: 'Napoleon Hill',
    category: 'Books',
    price: 299,
    countInStock: 10,
    rating: 4.6,
    numReviews: 245,
    _id: "6699a74a16c7b39a0670d8f1"
  },
  {
    name: 'The Psychology of Money',
    image: 'images/books_7.jpg',
    description: 'Timeless lessons on wealth, greed, and happiness from behavioral finance.',
    brand: 'Morgan Housel',
    category: 'Books',
    price: 349,
    countInStock: 10,
    rating: 4.8,
    numReviews: 189,
    _id: "6699a74a16c7b39a0670d8f2"
  },
  {
    name: 'Rich Dad Poor Dad',
    image: 'images/books_8.jpg',
    description: 'What the rich teach their kids about money that the poor and middle class do not.',
    brand: 'Robert Kiyosaki',
    category: 'Books',
    price: 249,
    countInStock: 10,
    rating: 4.5,
    numReviews: 298,
    _id: "6699a74a16c7b39a0670d8f3"
  },

  // ==========================================================
  // 5. SPORTS & OUTDOORS (8 Products)
  // ==========================================================
  {
    name: 'Collapsible Camping Chair',
    image: 'images/sports_1.jpg',
    description: 'Lightweight and portable chair for hiking and camping.',
    brand: 'REI',
    category: 'Sports & Outdoors',
    price: 3999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 60,
    _id: "6699a74a16c7b39a0670d8c1"
  },
  {
    name: 'Yoga Mat with Alignment Lines',
    image: 'images/sports_2.jpg',
    description: 'Non-slip mat, 6mm thick, with body alignment markings.',
    brand: 'Liforme',
    category: 'Sports & Outdoors',
    price: 4999,
    countInStock: 10,
    rating: 4.9,
    numReviews: 85,
    _id: "6699a74a16c7b39a0670d8c2"
  },
  {
    name: 'LED Headlamp for Running',
    image: 'images/sports_3.jpg',
    description: 'Rechargeable, bright headlamp with multiple modes for night activities.',
    brand: 'Black Diamond',
    category: 'Sports & Outdoors',
    price: 2999,
    countInStock: 10,
    rating: 4.6,
    numReviews: 50,
    _id: "6699a74a16c7b39a0670d8c3"
  },
  {
    name: '24oz Insulated Water Bottle',
    image: 'images/sports_4.jpg',
    description: 'Keeps drinks cold for 24 hours and hot for 12 hours.',
    brand: 'Hydro Flask',
    category: 'Sports & Outdoors',
    price: 2499,
    countInStock: 10,
    rating: 4.8,
    numReviews: 100,
    _id: "6699a74a16c7b39a0670d8c4"
  },
  {
    name: 'Football (Official Size 5)',
    image: 'images/sports_5.jpg',
    description: 'High-quality synthetic leather football for practice and games.',
    brand: 'Nike',
    category: 'Sports & Outdoors',
    price: 1999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 70,
    _id: "6699a74a16c7b39a0670d8c5"
  },
  {
    name: 'Resistance Bands Set',
    image: 'images/sports_6.jpg',
    description: 'Complete resistance bands set with handles, door anchor and workout guide.',
    brand: 'Fitnessgear',
    category: 'Sports & Outdoors',
    price: 1999,
    countInStock: 10,
    rating: 4.4,
    numReviews: 134,
    _id: "6699a74a16c7b39a0670d8f4"
  },
  {
    name: 'Badminton Racket Set',
    image: 'images/sports_7.jpg',
    description: 'Professional badminton racket set with shuttlecocks and carrying case.',
    brand: 'Yonex',
    category: 'Sports & Outdoors',
    price: 3499,
    countInStock: 10,
    rating: 4.6,
    numReviews: 89,
    _id: "6699a74a16c7b39a0670d8f5"
  },
  {
    name: 'Trekking Backpack 50L',
    image: 'images/sports_8.jpg',
    description: 'Waterproof trekking backpack with multiple compartments and rain cover.',
    brand: 'Decathlon',
    category: 'Sports & Outdoors',
    price: 4999,
    countInStock: 10,
    rating: 4.7,
    numReviews: 167,
    _id: "6699a74a16c7b39a0670d8f6"
  },
];

module.exports = products;