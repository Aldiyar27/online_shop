CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  material VARCHAR(150),
  color VARCHAR(100),
  size TEXT[],
  in_stock BOOLEAN DEFAULT true,
  image TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  comment TEXT,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_item (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(150);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS comment TEXT;

INSERT INTO products (
  id, title, price, category, brand, material, color, size, in_stock, image, description
) VALUES
(1, 'Базовая белая футболка', 7990, 't-shirts', 'UrbanWear', '100% хлопок', 'Белый', ARRAY['S', 'M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'Минималистичная белая футболка свободного кроя из мягкого хлопка.'),
(2, 'Черная oversize футболка', 8990, 't-shirts', 'StreetLine', 'Хлопок 95%, эластан 5%', 'Черный', ARRAY['M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'Стильная oversize футболка в черном цвете для повседневного образа.'),
(3, 'Серое худи', 18990, 'hoodies', 'SoftMood', 'Хлопок 80%, полиэстер 20%', 'Серый', ARRAY['S', 'M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'Теплое худи с капюшоном и мягкой внутренней отделкой.'),
(4, 'Бежевый свитшот', 15990, 'sweatshirts', 'Minimal Club', 'Футер', 'Бежевый', ARRAY['S', 'M', 'L'], true, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'Мягкий свитшот в спокойном бежевом цвете для минималистичных образов.'),
(5, 'Синие джинсы', 21990, 'jeans', 'Denim House', 'Деним', 'Синий', ARRAY['28', '30', '32', '34', '36'], true, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80', 'Классические синие джинсы прямого кроя для повседневной носки.'),
(6, 'Черные джинсы slim fit', 23990, 'jeans', 'Denim House', 'Хлопок 98%, эластан 2%', 'Черный', ARRAY['28', '30', '32', '34'], true, 'https://images.unsplash.com/photo-1511196044526-5cb3bcb7071b?auto=format&fit=crop&w=900&q=80', 'Черные джинсы зауженного кроя с комфортной посадкой.'),
(7, 'Классическая голубая рубашка', 17990, 'shirts', 'Formal Line', 'Хлопок', 'Голубой', ARRAY['S', 'M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'Легкая рубашка для учебы, работы и аккуратного повседневного стиля.'),
(8, 'Белая рубашка regular fit', 16990, 'shirts', 'CleanStyle', 'Хлопок 70%, полиэстер 30%', 'Белый', ARRAY['S', 'M', 'L', 'XL', 'XXL'], true, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'Универсальная белая рубашка прямого кроя для базового гардероба.'),
(9, 'Демисезонная куртка', 39990, 'jackets', 'NorthWay', 'Полиэстер', 'Темно-зеленый', ARRAY['M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'Легкая демисезонная куртка с удобными карманами и защитой от ветра.'),
(10, 'Черная кожаная куртка', 54990, 'jackets', 'Urban Leather', 'Эко-кожа', 'Черный', ARRAY['S', 'M', 'L'], false, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80', 'Стильная куртка из эко-кожи для выразительного городского образа.'),
(11, 'Спортивные брюки', 14990, 'pants', 'MoveFit', 'Хлопок 70%, полиэстер 30%', 'Серый', ARRAY['S', 'M', 'L', 'XL'], true, 'https://images.unsplash.com/photo-1506629905607-d9a297d49b20?auto=format&fit=crop&w=900&q=80', 'Комфортные спортивные брюки для прогулок, тренировок и отдыха.'),
(12, 'Брюки чинос', 19990, 'pants', 'Smart Casual', 'Хлопок', 'Песочный', ARRAY['30', '32', '34', '36'], true, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'Универсальные брюки чинос для аккуратного casual-стиля.'),
(13, 'Летнее платье', 24990, 'dresses', 'SoftBloom', 'Вискоза', 'Молочный', ARRAY['XS', 'S', 'M', 'L'], true, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'Легкое платье из приятной ткани для теплой погоды и прогулок.'),
(14, 'Черное платье midi', 29990, 'dresses', 'Elegant Mood', 'Полиэстер 90%, эластан 10%', 'Черный', ARRAY['S', 'M', 'L'], true, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80', 'Элегантное платье длины midi для вечернего и повседневного образа.'),
(15, 'Юбка плиссе', 17990, 'skirts', 'SoftBloom', 'Полиэстер', 'Бежевый', ARRAY['XS', 'S', 'M', 'L'], true, 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?auto=format&fit=crop&w=900&q=80', 'Легкая плиссированная юбка в мягком оттенке для женственного образа.'),
(16, 'Джинсовая юбка', 15990, 'skirts', 'Denim House', 'Деним', 'Голубой', ARRAY['XS', 'S', 'M'], false, 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=900&q=80', 'Короткая джинсовая юбка для летних и casual-образов.'),
(17, 'Белые кроссовки', 27990, 'shoes', 'StepWay', 'Текстиль, резина', 'Белый', ARRAY['39', '40', '41', '42', '43'], true, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80', 'Удобные белые кроссовки для ежедневной носки.'),
(18, 'Черные ботинки', 34990, 'shoes', 'StreetBoots', 'Эко-кожа, резина', 'Черный', ARRAY['40', '41', '42', '43', '44'], true, 'https://images.unsplash.com/photo-1608256246200-53e8b47bfe2c?auto=format&fit=crop&w=900&q=80', 'Прочные черные ботинки для прохладной погоды и городского стиля.'),
(19, 'Черная бейсболка', 6990, 'accessories', 'UrbanWear', 'Хлопок', 'Черный', ARRAY['ONE SIZE'], true, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80', 'Минималистичная бейсболка с регулируемым ремешком.'),
(20, 'Серый шарф', 9990, 'accessories', 'WarmLine', 'Акрил, шерсть', 'Серый', ARRAY['ONE SIZE'], true, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80', 'Теплый мягкий шарф для осенних и зимних образов.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  brand = EXCLUDED.brand,
  material = EXCLUDED.material,
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  in_stock = EXCLUDED.in_stock,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
