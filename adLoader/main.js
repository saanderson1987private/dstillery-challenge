const main = document.getElementById('main');

const images = {
  book: {
    src: 'images/book.jpg',
    href: 'http://a.co/hOdomrV',
    text: 'Buy the book!'
  },
  movie: {
    src: 'images/movie.jpg',
    href: 'http://a.co/aGbuX8V',
    text: 'Buy the movie!'
  },
  shirt: {
    src: 'images/shirt.jpg',
    href: 'http://nightchannels.com/the-shining-film-shirt/',
    text: 'Get a shirt!'
  },
};
const imageNames = Object.keys(images);

const image = document.createElement('div');
image.classList.add('img-container');
image.innerHTML = `
  <a>
    <img />
    <div></div>
  </a>

`;

function createImage(imageName) {
  const newImage = image.cloneNode(true);
  newImage.getElementsByTagName('a')[0].href = images[imageName].href;
  newImage.getElementsByTagName('div')[0].innerText = images[imageName].text;
  newImage.getElementsByTagName('img')[0].classList.add(imageName);
  return newImage;
}

function loadImage(el) {
  if (el.src === '') {
    const imageName = el.classList[0];
    const imageElements = document.getElementsByClassName(imageName);
    for (let i = 0; i < imageElements.length; i++) {
      imageElements[i].src = images[imageName].src;
    }
  }
}

function onView(el, callback) {
  function handleEvent() {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) callback();
  }
  addEventListener('DOMContentLoaded', handleEvent, false);
  addEventListener('load', handleEvent, false);
  addEventListener('scroll', handleEvent, false);
  addEventListener('resize', handleEvent, false);
}

const section = document.createElement('div');
const part1 = document.createElement('div');
const part2 = document.createElement('div');
const part3 = document.createElement('div');
const part1text = document.createElement('div');
const part2text = document.createElement('div');
const part3text = document.createElement('p');
part3text.style.textIndent = '40px';
part3text.style.margin = '20px 0px';
const proverb = document.createElement('p');
const proverbText = document.createTextNode('All work and no play makes Jack a dull boy. ');
proverb.appendChild(proverbText);

let indentation = 0;
let up = true;
for (let i = 0; i <= 40; i++) {
  part1text.appendChild(proverb.cloneNode(true));
  let proverbIndented = proverb.cloneNode(true);
  proverbIndented.style.marginLeft = `${indentation}px`;
  part2text.appendChild(proverbIndented);
  if (i === 20) up = false;
  if (up) {
    indentation += 10;
  } else {
    indentation -= 10;
  }
  part3text.appendChild(proverbText.cloneNode(true));
}

const parts = [part1, part2, part3];
const partTexts = [part1text, part2text, part3text];
for (let i = 0; i < parts.length; i++) {
    parts[i].classList.add('part');
    parts[i].appendChild(partTexts[i]);
    const partImage = createImage(imageNames[i]);
    parts[i].appendChild(partImage);
}
parts.forEach( part => {
  section.appendChild(part);
});

for (let i = 0; i < 10; i++) {
  main.appendChild(section.cloneNode(true));
}

const imgEls = document.getElementsByTagName('img');
for (let i = 0; i < imgEls.length; i++) {
  onView(imgEls[i], () => loadImage(imgEls[i]));
}
