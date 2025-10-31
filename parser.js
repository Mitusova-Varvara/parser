// @todo: напишите здесь код парсера

function parsePage() {
  const head = document.querySelector("head");

  const headTitle = head.querySelector("title").textContent.split("—"); // Заголовок страницы разделенный "-"
  const keyWordsPage = head
    .querySelector('meta[name="keywords"]')
    .getAttribute("content")
    .split(", "); // Ключевые слова для поиска страницы
  const descriptionPage = head.querySelector('meta[name="description"]'); // Описание страницы
  const ogMetaTeg = head.querySelectorAll('meta[property^="og"]'); // Все мета-теги начинающиеся с og

  const ogMetaTegsObject = {}; // Пустой массив
  ogMetaTeg.forEach((teg) => {
    ogMetaTegsObject[teg.getAttribute("property").replace("og:", "")] = teg
      .getAttribute("content")
      .replace(" — Modern Development Tool", ""); //Тут вообще супер не уверена, но как сделать по другому - хз...
  }); // Итерируемся по всему массиву мета-тегов и записываем ключ/значение

  // Секция продуктов
  const productSection = document.querySelector(".product");

  const nav = productSection.querySelector("nav");
  const imageProduct = nav.querySelectorAll("img"); //Получаем все изображения
  const imageProductSet = [];
  imageProduct.forEach((img) => {
    imageProductSet.push({
      preview: img.getAttribute("src"),
      full: img.dataset.src,
      alt: img.getAttribute("alt"),
    });
  });

  const buttonLikeClassList = productSection.querySelector(".like").classList; // Массив классов кнопки "like"

  let getStatusLike = () => {
    for (const item of buttonLikeClassList) {
      if (item === "active") {
        return true;
      } else return false;
    }
  }; // Проверяем есть ли в массив класс active

  const allCatecory = productSection.querySelectorAll(".tags span"); // Массив со всеми тегами категорий
  const category = {
    category: [],
    label: [],
    discount: [],
  }; //Пустой
  allCatecory.forEach((item) => {
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
  const getDiscount = () => {
    return parseInt(price) - parseInt(newSalePrice);
  }; // Высчитываем скидку
  const getDiscountPercent = () => {
    if (parseInt(price) > parseInt(newSalePrice)) {
      let a = parseInt(price) - parseInt(newSalePrice);
      let percent = (a * 100) / parseInt(price);
      return `${percent.toFixed(2)}%`;
    } else return "0%";
  };

  const getCurrency = (price) => {
    if (price.includes("₽")) {
      return "RUB";
    }
    if (price.includes("$")) {
      return "USD";
    }
    if (price.includes("€")) {
      return "EUR";
    }
  }; // Ищем подстроку с валютой в цене

  const properties = productSection.querySelectorAll(".properties li"); //Массив со всеми свойствами
  const propertiesObject = {};
  properties.forEach((item) => {
    propertiesObject[item.firstElementChild.textContent] =
      item.lastElementChild.textContent;
  }); // Переписываем массив в новый ключ/значение - это два разных span

  const getDescriptionProduct = () => {
    productSection.querySelector(".description h3").removeAttribute("class");
    const description = productSection.querySelector(".description").innerHTML;
    return description.trim(); //Массив с описанием товара, необходимо вывести html разметку
  };

  //Работа с карточками товара

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

  //Работа с отзывами

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

  return {
    meta: {
      language: document.querySelector("html").lang,
      title: headTitle[0].trim(),
      keywords: keyWordsPage,
      description: descriptionPage.getAttribute("content"),
      opengraph: ogMetaTegsObject,
    },
    product: {
      id: productSection.dataset.id,
      images: imageProductSet,
      isLiked: getStatusLike(),
      name: document.querySelector("h1").textContent,
      tags: category,
      price: parseInt(newSalePrice),
      oldPrice: parseInt(price),
      discount: getDiscount(),
      discountPercent: getDiscountPercent(),
      currency: getCurrency(salePrice),
      properties: propertiesObject,
      description: getDescriptionProduct(),
    },
    suggested: suggestedObject,
    reviews: reviewsObject,
  };
}

window.parsePage = parsePage;
