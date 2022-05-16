'use strict'

// 메뉴바가 화면이 스크롤되면 고정되고,검은색으로 
const navbar = document.querySelector('.header .nav');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if ( window.scrollY > navbarHeight ) {
    navbar.classList.add('nav-dark'); // nav-dark class 추가
  } else {
      navbar.classList.remove('nav-dark')
    }
})

//Handle scrolling when tapping on the navbar menu
//메뉴에 어떤 타겟을 누를지 모르니까 이걸 event로 받고
//클릭된 타겟의 dataset link를 함수에 전달
const navbarMenu = document.querySelector('.nav-right');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if ( link == null ) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
  selectNavItem(target);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

//Move to contact section when clicking Contact Me btn
const contactMe = document.querySelector('.b-contact');
contactMe.addEventListener('click',() => {
  scrollIntoView('#contact')
})


//Make home slowly fade to transparent as the window scolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
// 아래 document의 eventlistner다. home이 아니라
// as far as I know, scrolling은 documnet같다.
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
})

//Show arrow-up btn up when scrolling down.
//선생이 한거
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// // 내가 한거
//Show arrow-up btn up when scrolling down.
// const arrowUp = document.querySelector('.arrow-up');
// document.addEventListener ('scroll', () => {
//   if ( window.scrollY > homeHeight / 2 ) {
//     arrowUp.classList.remove('arrow-up');
//   } else {
//     arrowUp.classList.add('arrow-up')
//   }
// })

//Move to Home when clicking arrow-up btn
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home')
})

//Show filtered Project when clicking button
const workBtnContainer = document.querySelector('.t3-skill-group');
const projectContainer = document.querySelector('.b3-project');
// 각 프로젝트들을 배열로 받음
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if ( filter == null ) {
    return;
  }

  // Remove the previous selection and select a new one
  const active = document.querySelector('.t3-button.selected');
  active.classList.remove('selected');
  const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');
  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      if ( filter === '*' || filter === project.dataset.type ) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    })
    projectContainer.classList.remove('anim-out');
  }, 300);
})

// 매번 반복되므로 이걸 함수로 빼서 인자로 받음
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({behavior: "smooth"})
}

//turn on the right menu according to your location 
//1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
//2. IntersectionObserver를 이용해서 모든 섹션들을 관찬한다.
//3. 보여지는 섹션에 해당하는 메뉴 아이템들을 활성화 시킨다.

// 아래 배열을 이용해서 모든 섹션과 네비게이션 메뉴 아이템들을 가지고 옴
const sectionIds = [
  '#home',
  '#about',
  '#skill',
  '#mywork',
  '#testimonial',
  '#contact'
];

// 위의 배열을 루프를 돌리면서 섹션 돔요소로 변환하여 새로운 배열을 만드는 
//API는 map이다. 
const sections = sectionIds.map( id => 
  document.querySelector(id));
const navItems = sectionIds.map( id => 
  document.querySelector(`[data-link="${id}"]`));
// console.log(sections); 
// console.log(navItems);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  // console.log(selectedNavItem);
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

const observerOptions = {
  root: null, // 그냥 viewport 이용
  rootMargin: '0px',
  threshold: 0.3,
}

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if ( entry.isIntersecting && entry.intersectionRatio ) {
      const index = sectionIds.indexOf(`#${entry.target.id}`)
      //스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, 
  observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
  if (window.scrollY === 0 ) {
    selectedNavIndex = 0;
  } else if (window.scrollY + window.innerHeight === document.body.clientHeight ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex])
})