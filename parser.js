// @todo: напишите здесь код парсера

// Ищем подстроку с валютой в цене
const getCurrency = (price) => {
  const currency = {
    "₽": "RUB",
    $: "USD",
    "€": "EUR",
  };
  for (let item in currency) {
    if (price.includes(item)) {
      return currency[item];
    }
  }
};

// Проверяем есть ли в массив класс active
const getStatusLike = (buttonLikeClassList) => {
  for (const item of buttonLikeClassList) {
    if (item === "active") {
      return true;
    } else return false;
  }
};

// Высчитываем скидку
const getDiscount = (a, b) => {
  return parseInt(a) - parseInt(b);
};

//Высчитываем процент скидки
const getDiscountPercent = (a, b) => {
  if (parseInt(a) > parseInt(b)) {
    let x = parseInt(a) - parseInt(b);
    let percent = (x * 100) / parseInt(a);
    return `${percent.toFixed(2)}%`;
  } else return "0%";
};

const getMeta = () => {
  const head = document.querySelector("head");

  const headTitle = head
    .querySelector("title")
    .textContent.split("—")[0]
    .trim(); // Заголовок страницы разделенный "-"
  const pageKeyWords = head
    .querySelector('meta[name="keywords"]')
    .getAttribute("content")
    .split(", ");
  const pageDescription = head
    .querySelector('meta[name="description"]')
    .getAttribute("content"); // Описание страницы
  const ogMetaTag = head.querySelectorAll('meta[property^="og"]'); // Все мета-теги начинающиеся с og

  const ogMetaTags = {};
  ogMetaTag.forEach((teg) => {
    ogMetaTags[teg.getAttribute("property").replace("og:", "")] = teg
      .getAttribute("content")
      .split("—")[0]
      .trim(); //Тут вообще супер не уверена, но как сделать по другому - хз...
  });
  // Итерируемся по всему массиву мета-тегов и записываем ключ/значение
  return {
    language: document.querySelector("html").lang,
    title: headTitle,
    keywords: pageKeyWords,
    description: pageDescription,
    opengraph: ogMetaTags,
  };
};

const getProduct = () => {
  const productSection = document.querySelector(".product");

  const nav = productSection.querySelector("nav");
  const productImage = nav.querySelectorAll("img");
  const productImageSet = [];
  productImage.forEach((img) => {
    productImageSet.push({
      preview: img.getAttribute("src"),
      full: img.dataset.src,
      alt: img.getAttribute("alt"),
    });
  });

  const buttonLikeClassList = productSection.querySelector(".like").classList;

  const categories = productSection.querySelectorAll(".tags span");
  const category = {
    category: [],
    label: [],
    discount: [],
  };
  categories.forEach((item) => {
    switch (item.className) {
      case "green":
        category["category"].push(item.textContent);
        break;

      case "blue":
        category["label"].push(item.textContent);
        break;

      case "red":
        category["discount"].push(item.textContent);
        break;
    }
  }); //Итерируемся по массиву с тегами категорий создаем новый
  // Зелёный отвечает за категорию, синий — за бирку, красный — за скидку

  const salePrice = productSection.querySelector(".price").innerText; // Цена со скидкой
  const newSalePrice = salePrice[1] + salePrice[2]; //Используем необходимую подстроку "50"
  const price = productSection
    .querySelector(".price span")
    .textContent.replace("₽", ""); // Цена без скидки

  const properties = productSection.querySelectorAll(".properties li");
  const propertiesObject = {};
  properties.forEach((item) => {
    propertiesObject[item.firstElementChild.textContent] =
      item.lastElementChild.textContent;
  }); // Переписываем массив в новый ключ/значение - это два разных span

  productSection.querySelector(".description h3").removeAttribute("class");
  const description = productSection
    .querySelector(".description")
    .innerHTML.trim(); //Массив с описанием товара, необходимо вывести html разметку

  return {
    id: productSection.dataset.id,
    images: productImageSet,
    isLiked: getStatusLike(buttonLikeClassList),
    name: document.querySelector("h1").textContent,
    tags: category,
    price: parseInt(newSalePrice),
    oldPrice: parseInt(price),
    discount: getDiscount(price, newSalePrice),
    discountPercent: getDiscountPercent(price, newSalePrice),
    currency: getCurrency(salePrice),
    properties: propertiesObject,
    description: description,
  };
};

const getProductCards = () => {
  const productCardSection = document.querySelector(".suggested");
  const suggestedObject = []; // Пустой объект с массивом.

  const productCards = productCardSection.querySelectorAll("article");
  productCards.forEach((card) => {
    suggestedObject.push({
      name: card.querySelector("h3").textContent,
      description: card.querySelector("p").textContent,
      image: card.querySelector("img").getAttribute("src"),
      price: card.querySelector("b").textContent.replace("₽", ""),
      currency: getCurrency(card.querySelector("b").textContent),
    });
  });
  return suggestedObject;
};

const getReviewCards = () => {
  const reviewsSection = document.querySelector(".reviews");
  const reviewsObject = []; // Пустой объект с массивом.

  const reviewCards = reviewsSection.querySelectorAll("article");
  reviewCards.forEach((card) => {
    reviewsObject.push({
      rating: card.querySelectorAll(".rating .filled").length,
      author: {
        avatar: card.querySelector("img").getAttribute("src"),
        name: card.querySelector(".author span").textContent,
      },
      title: card.querySelector(".title").textContent,
      description: card.querySelector("p").textContent,
      date: card.querySelector(".author i").textContent.replaceAll("/", "."),
    });
  });
  return reviewsObject;
};

function parsePage() {
  return {
    meta: getMeta(),
    product: getProduct(),
    suggested: getProductCards(),
    reviews: getReviewCards(),
  };
}

window.parsePage = parsePage;
