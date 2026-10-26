const fs = require('fs');
const path = require('path');

// ================ تنظیمات ================
const CONFIG = {
  COFFE_USER_ID: '-YeWaGb_Qw',
  START_DATE: '2025-12-26T00:00:00.000Z',
  END_DATE: '2026-06-26T00:00:00.000Z',
  DAILY_ORDERS: 80,
  TOTAL_USERS: 80,
  OUTPUT_FILE: 'cofeorders.json',
  IMAGE_URL:
    'http://localhost:3001/public/4b6599d7-bb94-4391-b217-a0e340bacfcb.png',
};

// ================ دیتاهای ثابت ================
const MENU_ITEMS = [
  // صبحانه
  {
    id: 'MENU_BREAKFAST_1',
    title: 'صبحانه کامل سنتی',
    price: 185000,
    category: 'CAT_BREAKFAST',
    type: 'breakfast',
  },
  {
    id: 'MENU_BREAKFAST_2',
    title: 'املت قارچ و پنیر',
    price: 145000,
    category: 'CAT_BREAKFAST',
    type: 'breakfast',
  },

  // پیتزا
  {
    id: 'MENU_PIZZA_1',
    title: 'پیتزا مارگاریتا',
    price: 280000,
    category: 'CAT_PIZZA',
    type: 'pizza',
  },
  {
    id: 'MENU_PIZZA_2',
    title: 'پیتزا مخلوط',
    price: 330000,
    category: 'CAT_PIZZA',
    type: 'pizza',
  },
  {
    id: 'MENU_PIZZA_3',
    title: 'پیتزا گوشت و قارچ',
    price: 350000,
    category: 'CAT_PIZZA',
    type: 'pizza',
  },

  // پاستا
  {
    id: 'MENU_PASTA_1',
    title: 'پاستا کاربونارا',
    price: 195000,
    category: 'CAT_PASTA',
    type: 'pasta',
  },
  {
    id: 'MENU_PASTA_2',
    title: 'پاستا پستو',
    price: 185000,
    category: 'CAT_PASTA',
    type: 'pasta',
  },
  {
    id: 'MENU_PASTA_3',
    title: 'پاستا بولونیز',
    price: 210000,
    category: 'CAT_PASTA',
    type: 'pasta',
  },

  // سالاد
  {
    id: 'MENU_SALAD_1',
    title: 'سالاد سزار',
    price: 178000,
    category: 'CAT_SALAD',
    type: 'salad',
  },
  {
    id: 'MENU_SALAD_2',
    title: 'سالاد یونانی',
    price: 145000,
    category: 'CAT_SALAD',
    type: 'salad',
  },
  {
    id: 'MENU_SALAD_3',
    title: 'سالاد فصل',
    price: 120000,
    category: 'CAT_SALAD',
    type: 'salad',
  },

  // نوشیدنی گرم
  {
    id: 'MENU_HOTDRINK_1',
    title: 'اسپرسو سینگل',
    price: 65000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_2',
    title: 'اسپرسو دوبل',
    price: 72000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_3',
    title: 'کاپوچینو',
    price: 95000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_4',
    title: 'لاته',
    price: 108000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_5',
    title: 'موکا',
    price: 115000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_6',
    title: 'کارامل ماکیاتو',
    price: 120000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_HOTDRINK_7',
    title: 'آمریکانو',
    price: 85000,
    category: 'CAT_HOTDRINK',
    type: 'drink',
  },

  // نوشیدنی سرد
  {
    id: 'MENU_COLDDRINK_1',
    title: 'آیس لاته',
    price: 125000,
    category: 'CAT_COLDDRINK',
    type: 'drink',
  },
  {
    id: 'MENU_COLDDRINK_2',
    title: 'آیس موکا',
    price: 135000,
    category: 'CAT_COLDDRINK',
    type: 'drink',
  },

  // دسر
  {
    id: 'MENU_DESSERT_1',
    title: 'کیک شکلاتی',
    price: 98000,
    category: 'CAT_DESSERT',
    type: 'dessert',
  },
  {
    id: 'MENU_DESSERT_2',
    title: 'تیرامیسو',
    price: 125000,
    category: 'CAT_DESSERT',
    type: 'dessert',
  },

  // پیش غذا
  {
    id: 'MENU_APPETIZER_1',
    title: 'سیب زمینی سرخ کرده',
    price: 85000,
    category: 'CAT_APPETIZER',
    type: 'appetizer',
  },
  {
    id: 'MENU_APPETIZER_2',
    title: 'گوشت و پنیر',
    price: 145000,
    category: 'CAT_APPETIZER',
    type: 'appetizer',
  },
];

const OTHER_OPTIONS_PAY = [
  { title: 'مالیات', percent: 9 },
  { title: 'حق سرویس', price: 150000 },
  { title: 'هزینه ارسال', price: 250000 },
];

const TABLES = [
  { id: 'URthvuWOh6', name: 'میز یک' },
  { id: 'H7mwNxfhxQ', name: 'میز دو' },
  { id: 'mtfhWweyrM', name: 'میز vip' },
];

const DESCRIPTIONS = [
  '',
  'لطفا بدون پیاز',
  'سس اضافه لطفا',
  'داغ باشه',
  'بسته بندی کنین',
  'سفارش ویژه',
  'بدون سیر',
  'با سس اضافه',
];

const PAY_TYPES = ['cash', 'online'];
const ACTIONS = ['waiting', 'confirmed', 'done'];

// ================ توابع کمکی ================
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomWeighted = (items, weights) => {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
};

// ================ تولید کاربران ================
const generateUsers = () => {
  const users = [];
  const firstName = [
    'علی',
    'محمد',
    'حسین',
    'رضا',
    'مهدی',
    'سعید',
    'امیر',
    'حامد',
    'مجید',
    'سینا',
    'نیما',
    'پارسا',
    'آرش',
    'کاوه',
    'بهرام',
    'فرهاد',
    'شایان',
    'آرمان',
    'کیان',
    'ایلیا',
  ];
  const lastName = [
    'احمدی',
    'محمدی',
    'حسینی',
    'رضایی',
    'کریمی',
    'موسوی',
    'عباسی',
    'قاسمی',
    'نظری',
    'صادقی',
  ];

  for (let i = 1; i <= CONFIG.TOTAL_USERS; i++) {
    const fName = getRandomItem(firstName);
    const lName = getRandomItem(lastName);
    users.push({
      _id: `USER_${String(i).padStart(2, '0')}`,
      phoneNumber: `0913${String(1000000 + i).padStart(7, '0')}`,
      userType: 'simple',
      firstName: fName,
      lastName: lName,
      isConfirmed: true,
      isActive: true,
      smsCount: 400,
      createdAt: { $date: CONFIG.START_DATE },
      updatedAt: { $date: CONFIG.START_DATE },
      __v: 0,
    });
  }
  return users;
};

// ================ تولید سفارشات ================
const generateOrders = () => {
  const orders = [];
  const startDate = new Date(CONFIG.START_DATE);
  const endDate = new Date(CONFIG.END_DATE);

  // لیست کاربران
  const users = [];
  for (let i = 1; i <= CONFIG.TOTAL_USERS; i++) {
    users.push(`USER_${String(i).padStart(2, '0')}`);
  }

  let orderCounter = 0;
  let currentDate = new Date(startDate);
  const imageUrl = CONFIG.IMAGE_URL;

  // وزن‌دهی به آیتم‌ها برای شبیه‌سازی واقعی‌تر
  const menuWeights = [
    15,
    8, // صبحانه
    12,
    18,
    10, // پیتزا
    8,
    6,
    10, // پاستا
    12,
    8,
    6, // سالاد
    20,
    15,
    25,
    28,
    18,
    22,
    15, // نوشیدنی گرم
    20,
    15, // نوشیدنی سرد
    10,
    8, // دسر
    10,
    8, // پیش غذا
  ];

  while (currentDate <= endDate) {
    // روزانه تعداد سفارش مشخص
    const dailyOrders = CONFIG.DAILY_ORDERS;

    for (let i = 0; i < dailyOrders; i++) {
      // انتخاب کاربر (چرخشی برای توزیع یکنواخت)
      const user = users[orderCounter % users.length];

      // تعداد آیتم‌های سفارش (1 تا 5)
      const itemCount = getRandomWeighted([1, 2, 3, 4, 5], [20, 35, 25, 15, 5]);
      const items = [];
      let totalItemPrice = 0;

      // انتخاب آیتم‌ها (با احتمال تکرار)
      const usedItems = [];
      for (let j = 0; j < itemCount; j++) {
        // شانس تکرار آیتم 30%
        let menuItem;
        if (j > 0 && Math.random() < 0.3 && usedItems.length > 0) {
          menuItem = getRandomItem(usedItems);
        } else {
          menuItem = getRandomWeighted(MENU_ITEMS, menuWeights);
          usedItems.push(menuItem);
        }

        const count = getRandomWeighted([1, 2, 3, 4], [50, 30, 15, 5]);
        const price = menuItem.price;
        const totalPrice = price * count;
        totalItemPrice += totalPrice;

        items.push({
          _id: menuItem.id,
          title: menuItem.title,
          description: '',
          image: imageUrl,
          price: price,
          totalPrice: totalPrice,
          ingredients: [],
          count: count,
          index: getRandomInt(1, 10),
          isActive: true,
          user: CONFIG.COFFE_USER_ID,
          menuCategory: menuItem.category,
        });
      }

      // محاسبه هزینه‌های اضافی
      let tax = 0;
      let service = 0;
      let delivery = 0;

      for (const option of OTHER_OPTIONS_PAY) {
        if (option.percent) {
          tax += (totalItemPrice * option.percent) / 100;
        }
        if (option.price && option.title === 'حق سرویس') {
          service = option.price;
        }
        if (option.price && option.title === 'هزینه ارسال') {
          delivery = option.price;
        }
      }

      const finalPrice = Math.ceil(totalItemPrice + tax + service + delivery);

      // وضعیت سفارش (85% پرداخت شده)
      const isPayed = Math.random() < 0.85;

      // وضعیت action بر اساس پرداخت
      let action = 'waiting';
      let isCofeConfirmed = false;
      let payType = '';
      let table = null;

      if (isPayed) {
        const actionRand = Math.random();
        if (actionRand < 0.3) {
          action = 'waiting';
          isCofeConfirmed = false;
        } else if (actionRand < 0.6) {
          action = 'confirmed';
          isCofeConfirmed = true;
        } else {
          action = 'done';
          isCofeConfirmed = true;
        }
        payType = getRandomItem(PAY_TYPES);
        // 80% سفارش‌های پرداخت شده میز دارند
        if (Math.random() < 0.8) {
          table = getRandomItem(TABLES).id;
        }
      }

      // زمان سفارش (بین 8 صبح تا 10 شب)
      const orderDate = new Date(currentDate);
      orderDate.setHours(
        getRandomInt(8, 22),
        getRandomInt(0, 59),
        getRandomInt(0, 59),
      );

      orders.push({
        _id: `ORDER_${String(orderCounter + 1).padStart(5, '0')}`,
        items: items,
        otherOptionsPay: OTHER_OPTIONS_PAY.map((o) => ({ ...o })),
        action: action,
        description: getRandomItem(DESCRIPTIONS),
        payType: payType,
        totalPrice: finalPrice,
        totalItemPrice: totalItemPrice,
        isPayed: isPayed,
        isCofeConfirmed: isCofeConfirmed,
        cofeUser: CONFIG.COFFE_USER_ID,
        userOrdered: user,
        table: table,
        createdAt: { $date: orderDate.toISOString() },
        updatedAt: { $date: orderDate.toISOString() },
        __v: 0,
      });

      orderCounter++;
    }

    // رفتن به روز بعد
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return orders;
};

// ================ تولید فایل‌های JSON ================
const generateAllData = () => {
  console.log('🚀 شروع تولید دیتا...');
  console.log(`📅 بازه زمانی: ${CONFIG.START_DATE} تا ${CONFIG.END_DATE}`);
  console.log(`📊 تعداد سفارش روزانه: ${CONFIG.DAILY_ORDERS}`);

  // تولید کاربران
  console.log('👤 تولید کاربران...');
  const users = generateUsers();
  const usersFile = path.join(__dirname, 'users.json');
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  console.log(`✅ کاربران ذخیره شد: ${users.length} کاربر`);

  // تولید سفارشات
  console.log('📦 تولید سفارشات...');
  const orders = generateOrders();
  const ordersFile = path.join(__dirname, CONFIG.OUTPUT_FILE);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  console.log(`✅ سفارشات ذخیره شد: ${orders.length} سفارش`);

  // محاسبه آمار
  let totalRevenue = 0;
  let totalOrders = orders.length;
  let payedOrders = 0;
  let confirmedOrders = 0;
  let doneOrders = 0;

  orders.forEach((order) => {
    if (order.isPayed) payedOrders++;
    if (order.action === 'confirmed') confirmedOrders++;
    if (order.action === 'done') doneOrders++;
    if (order.isPayed) totalRevenue += order.totalPrice;
  });

  console.log('\n📊 آمار تولید شده:');
  console.log(`   - تعداد کل سفارشات: ${totalOrders}`);
  console.log(
    `   - سفارشات پرداخت شده: ${payedOrders} (${((payedOrders / totalOrders) * 100).toFixed(1)}%)`,
  );
  console.log(`   - سفارشات تایید شده: ${confirmedOrders}`);
  console.log(`   - سفارشات انجام شده: ${doneOrders}`);
  console.log(`   - درآمد کل: ${totalRevenue.toLocaleString()} تومان`);
  console.log(
    `   - میانگین قیمت هر سفارش: ${Math.round(totalRevenue / payedOrders).toLocaleString()} تومان`,
  );

  console.log(`\n📁 فایل‌های تولید شده:`);
  console.log(`   - ${usersFile}`);
  console.log(`   - ${ordersFile}`);

  console.log('\n✅ تولید دیتا با موفقیت انجام شد!');
};

// ================ اجرا ================
generateAllData();
