export default function initSwipers() {
  if (
    !document.querySelector(".products-swiper") ||
    !document.querySelector(".prices__tiles") ||
    !document.querySelector(".cases-swiper-next")
  ) {
    return;
  }

  const productsSwiper = new Swiper(".products-swiper", {
    slidesPerView: 3,
    spaceBetween: 20,

    navigation: {
      nextEl: ".products-swiper-next",
      prevEl: ".products-swiper-prev",
    },

    pagination: {
      el: ".swiper-pagination",
    },

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
        },
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1300: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1570: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  const pricesSwiper = new Swiper(".prices__tiles", {
    slidesPerView: 3,
    spaceBetween: 10,

    navigation: {
      nextEl: ".prices-swiper-next",
      prevEl: ".prices-swiper-prev",
    },

    pagination: {
      el: ".swiper-pagination",
    },

    breakpoints: {
      300: {
        slidesPerView: 1,
        centeredSlides: true,
      },
      360: {
        slidesPerView: 1,
        centeredSlides: true,
      },
      // when window width is >= 480px
      400: {
        slidesPerView: 1,
        centeredSlides: true,
      },

      450: {
        slidesPerView: 1,
        centeredSlides: true,
      },

      500: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 10,
        pagination: {
          el: null,
          clickable: true,
        },
      },
    },
  });

  const casesSwiper = new Swiper(".cases__swiper", {
    slidesPerView: 1,
    spaceBetween: 19,

    navigation: {
      nextEl: document.querySelector(".cases-swiper-next"),
      prevEl: document.querySelector(".cases-swiper-prev"),
    },

    pagination: {
      el: ".cases__pagination",
    },

    breakpoints: {
      // when window width is >= 320px
      360: {
        pagination: {
          enabled: true, // включаем пагинацию на <768px
        },
        spaceBetween: 15,
      },
      // when window width is >= 480px
      400: {
        spaceBetween: 5,
      },
      // when window width is >= 640px
      640: {
        spaceBetween: 5,
      },
      1024: {
        spaceBetween: 20,
      },
      1300: {
        spaceBetween: 19,
      },
      1570: {
        slidesPerView: 1,
      },
    },
  });

  function swiperNav() {
    document
      .querySelector(".cases-swiper-next")
      .classList.remove("swiper-button-disabled");
    document
      .querySelector(".cases-swiper-next")
      .classList.remove("swiper-button-lock");
    document
      .querySelector(".cases-swiper-prev")
      .classList.remove("swiper-button-lock");

    document
      .querySelector(".products-swiper-prev")
      .classList.remove("swiper-button-lock");

    document
      .querySelector(".products-swiper-next")
      .classList.remove("swiper-button-disabled");

    document
      .querySelector(".products-swiper-next")
      .classList.remove("swiper-button-lock");
  }

  swiperNav();
}
