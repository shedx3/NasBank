'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__Content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// btn to scroll to
btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect();
  console.log(s1cords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  // window.scrollto({
  //   left: s1cords.left + window.pageXOffset,
  //    top:s1cords.top + window.pageYOffset,
  //  behavior: 'smooth'})

  section1.scrollIntoView({ behavior: 'smooth' });
});

// page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // active tab
  clicked.classList.add('operations__tab--active');

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing an argument into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////////////////////////

// stickyNavigation: intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// sticky nav-bar
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // nav.classList.add('sticky');
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, obs) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  Observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy Loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, obs) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  Observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translatex(${100 * (i - slide)}%)`)
    );
  };
  // next slide

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();
  // event handles
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
    // e.key === 'Arrowright' && nextSlide
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      // const {slide} = e.target.dataset.slide
      const [slide] = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//curSlide -100%,  0%, 100%, 200%
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   console.log(winow.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });// Selecting elements
/*console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSectons = document.querySelectorAll('.section');

document.getElementById('section__1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
document.getElementsByClassName('btn');

// creating and Inserting element
// insertAdjacentHTML;

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cooked for improved functionality and analytics'
message.innerHTML =
  'We use cooked for improved functionality and analytics. <button class = "btn btn--close-cookie">Got It! </button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

// Styles
message.style.backgroundColor = '#37383d';
message.styles.width = '120%';

console.log(message.style.backgroundColor);
console.log(message.style.color);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// attribute
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful logo';

// Non-standard
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes
console.log(logo.dataset.versionNumber);

// classes
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains();
// dont use this
logo.className = 'jonas';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect();
  console.log(s1cords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  // window.scrollto({
  //   left: s1cords.left + window.pageXOffset,
  //    top:s1cords.top + window.pageYOffset,
  //  behavior: 'smooth'})

  section1.scrollIntoView({ behaviour: 'smooth' });
});

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('i love you ');

  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);
// h1.onmouseenter = function (e) {
//   alert('yes welcome');
// };

// rgb(255,255,2555)

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}), ${randomInt(0, 255)}, ${randomInt(0, 255)}`;
// console.log(randomColor(0, 2555));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});
// stop propagation
e.stopPropagation();

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

const h1 = document.querySelector('h1');
// going downwards: child
console.log(h1.querySelector('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); // works only for direct children and gives HTML collection

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'pink';

// Going upwards.parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('.h1').style.background = 'var(--gradient-primary)';

// Going SideWays : Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.tranform = 'scale(0.5)';
});
document.addEventListener('DOMCOntentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built');
});
window.addEventListener('load', function (e) {
  console.log('Page fully loaded');
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log();
  e.returnValue = '';
// })*/
