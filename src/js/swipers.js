export default function initSwipers() {
  const productsSlider = new Swiper(".products__wrapper__slider", {
    loop: true,
    slidesPerView: 4,
    spaceBetween: 32,

    navigation: {
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
    },

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.5,
        spaceBetween: 20,
        loop: true,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1.5,
        spaceBetween: 20,
        loop: true,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
      },
      1300: {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
      },
      1570: {
        slidesPerView: 4,
        spaceBetween: 32,
        loop: true,
      },
    },
  });
}
