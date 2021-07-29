var prisoners = document.getElementById('prisoners');
var thousand = document.getElementById('thousand');
var counter = document.getElementById('counter');
var title = document.getElementById('title');
var html = document.getElementsByTagName('html');
var curve_wrapper_outer = document.getElementById('curve-wrapper-outer');
var url_params = new URLSearchParams(window.location.search);
var mute = url_params.get('mute');
var unscroll = url_params.get('unscroll');
var scroll_count = 0;

if (mute) {
  html[0].classList.add('mute')
}
if (unscroll) {
  html[0].classList.add('unscroll')
}

if (!mute) {
  var citations = document.querySelectorAll('.citation');
  citations.forEach(function(citation, i){
    citation.innerHTML = i+1;
  })

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        html[0].classList = (unscroll) ? "unscroll" : "";
        html[0].classList.add(entry.target.dataset.background);
      }
    })
  })
  document.querySelectorAll('[data-background]').forEach(function(target){
    observer.observe(target);
  });

  var until_recently_shown = false;
  var since_it_began_shown = false;

  var curveObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        if (entry.target.id === 'since-it-began') {
          since_it_began_shown = true;
        }
        if (entry.target.id === 'until-recently') {
          until_recently_shown = true;
        }
        if (entry.target.id === 'none-of-this') {
          since_it_began_shown = false;
          until_recently_shown = false;
          curve_wrapper_outer.classList.remove('stretched');
          curve_wrapper_outer.classList.remove('show-correlation');
        }
      }
      //Item leaves the screen by scroll down
      if (entry.target.id === 'until-recently'
        && !entry.isIntersecting
       && until_recently_shown === true) {
        if ((entry.target.offsetTop - window.scrollY - window.innerHeight) < 0) {
          //User is scrolling down (i.e. normal scroll)
          curve_wrapper_outer.classList.add('stretched');
        }
        else {
          //User is scrolling up (i.e. reverse scroll)
          curve_wrapper_outer.classList.remove('stretched');
        }
      }

      //Item leaves the screen by scroll down
      if (entry.target.id === 'since-it-began'
        && !entry.isIntersecting
        && until_recently_shown === true) {
        if ((entry.target.offsetTop - window.scrollY - window.innerHeight) < 0) {
          curve_wrapper_outer.classList.add('show-correlation');
        }
        else {
          curve_wrapper_outer.classList.remove('show-correlation');
        }
      }
    })
  })
  document.querySelectorAll('.curve-section').forEach(function(target){
    curveObserver.observe(target);
  });
  var letterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
      else {
        entry.target.classList.remove('animate');
      }
    })
  })
  var letters = document.getElementById('animated-letters');
  letterObserver.observe(letters);

  function toggleExpand(outer, inner) {
    var outerEl = document.getElementById(outer);
    var innerEl = document.getElementById(inner);
    var offset = Math.abs(outerEl.offsetTop - innerEl.offsetTop);
    innerEl.style.top = offset + 'px';
    outerEl.classList.add('expanded')
  }

  function showTooltip(e) {
    var tooltip = e.parentElement.getElementsByClassName('tooltip')[0]
    tooltip.classList.add('open')
  }
  function closeTooltip(e) {
    e.parentElement.classList.remove('open');
  }
}

window.addEventListener('scroll', function(e) {
  scroll_count = getScrollCount();
  if (scroll_count > 2000) {
    counter.innerHTML = scroll_count.toLocaleString();
  }
  else {
    counter.innerHTML = '';
  }
});

var population = 1000000;

function getScrollCount() {
  var body = document.documentElement || document.body;
  var total_height = prisoners.clientHeight;
  var scroll_percent = (body.scrollTop - prisoners.offsetTop + body.clientHeight) / total_height;
  var count = Math.floor(scroll_percent * population);
  return count;
}

function setBounds() {
  var browser_width = window.innerWidth || document.body.clientWidth;
  var people_width = Math.floor((browser_width - 30) / 30) * 30;
  var icons_per_card = 1;
  var pixel_height_per_card = 60;
  var pixel_width_per_card = 30;

  var cards_per_row = browser_width / pixel_width_per_card;
  var icons_per_row = icons_per_card * cards_per_row;
  var number_of_rows = population/icons_per_row;

  var height = Math.floor(number_of_rows * pixel_height_per_card);
  prisoners.style.height = height + "px";
  prisoners.style.width = people_width + "px";

  if (!mute) {
    var thousand_height = Math.floor((1000/icons_per_row) * pixel_height_per_card);
    thousand.style.height = thousand_height + "px";
    thousand.style.width = people_width + "px";
  }
  document.documentElement.style.setProperty('--default-group-width', (people_width / 30) - 4);

  document.querySelectorAll('.group').forEach((d) => {
    let size = parseInt(d.getAttribute('size'));
    let width = parseInt(getComputedStyle(d).getPropertyValue('--group-width'));
    d.style.setProperty('--group-height', Math.floor(size / width));
    d.style.setProperty('--blocker-width', Math.floor(size % width));
    for (let i = 0; i < size; i++) {
      // let p = document.createElement('div');
      // p.classList.add('redpeople');
      // p.style.height = '60px';
      // p.style.width = '30px';
      // d.appendChild(p);
    }
  });
}

setBounds();
window.addEventListener("orientationchange", setBounds);
window.addEventListener("resize", setBounds);
