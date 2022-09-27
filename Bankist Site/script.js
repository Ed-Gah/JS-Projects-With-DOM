"use-strict";
////////////////////////////
//========================== Modal window =========================
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
// const h1 = document.querySelector("h1");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
// const logo = document.querySelector(".nav__logo");
const nav = document.querySelector(".nav");

//Open the modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//Closing the modal
const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);

// overlay.addEventListener("click", closeModal);

//Handling key press events.

document.addEventListener("keydown", function (e) {
  // checking if an element has a certain class
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////////////////////
//            Button scrolling          //
///////////////////////////////////////////
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Dimensions of current view port
  // document.documentElement.clientHeight,
  // document.documentElement.clientWidth,

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // );

  // Smooth scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: "smooth",
  // });
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////////////////////
// Page Navigation
/////////////////////////////////////////////////////

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//////////////////////////////////////////////
//1. Add event listerner to common parent element
//2. Determin what elemnt originated the event
//////////////////////////////////////////////
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching stratery
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

/////////////////////////////////////////////
// Tabbed Componnet
////////////////////////////////////////////
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active tab
  clicked.classList.add("operations__tab--active");

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////////////////////////////////////
// Menu fade animation
////////////////////////////////////////////////////////////
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')){
  const link = e.target;
  const siblings = link.closest(".nav").querySelectorAll(".nav__link");
  const logo = link.closest(".nav").querySelector("img");

  siblings.forEach((el) => {
    if ((el = !link)) el.style.opacity = this;
  });
  logo.style.opacity = this;
}
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////////////////////////
// Sticky navigation
//////////////////////////////////////////////////////////
// const obsCallBack = function(entries, observer){
//   entries.forEach(entry => {

//   })
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2] //In and out of the view
// }
// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1)

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.Intersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
  // nav.classList.add("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////////////////////////////////////
// Reveal sections. hidden by the section--hidden class
///////////////////////////////////////////////////////////
const allSctions = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSctions.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////////////////////////////
// Lazy loading images. Great for performance
/////////////////////////////////////////////////////////
const imgTarget = document.querySelectorAll("img[data-src]");

const loadingImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Guard Clause
  if (!entry.Intersecting) return;

  // Replace sr with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTarget.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////////////////////////
// Slider
///////////////////////////////////////////////////////////
const slider = function () {
  // Variables
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContianier = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContianier.insertAdjacentHTML(
        "beforeend",
        `
    <button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // createDots();
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots_dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };
  // activatDot(0);

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // goToSlide(0);
  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    }
    {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide;
  });

  dotContianier.addEventListener("click", function (e) {
    if (e.target.classList.contains()) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// First event that happens on html life cycle
//1. dom content loaded.(DomContentLoaded)
// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log("Html parse on dom tree built!", e);
// });

//2. Load window.addEventListiner('load', fuction(e){cl(e)})

//3. Event before user leaves the browser
// window.addEventListener("beforeunload", function (e) {
//   console.log(e);
// e.returnValue = '';
// });

//curSlide = 1: -100%, 0% 100%, 200%
// const initialCoords = section1.getBoundingClientRect();
// section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// Sticky navigation: Intersection Observer API.
/* Take this very important */
// console.log(document.documentElement); // the entire html
// // selecting htmlcollection
// document.getElementsByTagName("button"); //this updates automatically
// const header = document.querySelector(".header");

// // Creating and inserting elements
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.textContent = "We use cookied for imporved function and anlytics";
// message.innerHTML =
//   'We use cookied for improved functionality and anlytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.append(message);

// // Delete elements
// document.querySelector(".btn--close-cookie");
// document.addEventListener("click", function () {
//   message.remove();
// });

// // ============== Styles ===========
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// // ====== Reading Atrributes =========

// // console.log(logo.alt);
// // logo.getAttribute()

// //============= classes ====================
// // logo.classList.add("

// const alertH1 = function (e) {
//   alert("AddEventListener: Great! you are reading headin :D");

//   //Removing Event handler
//   h1.removeEventListener("mouseenter", alertH1);
// };

// h1.addEventListener("mouseenter", alertH1);

// h1.onmouseenter = function (e) {
//   alert("AddEventListener: Great! you are reading headin :D");
// };

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(".nav").addEventListener("click", function (e) {
//   console.log("Nav");
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
// });

///////////////////////////////////////////////
//Difference ways of including js in html
///////////////////////////////////////////////
// 1. Regular, Async, Defer
