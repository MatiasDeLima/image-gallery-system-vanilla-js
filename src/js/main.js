// ######## MOBILE MENU ######## //
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    })
}

if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    })
}

// ######## CHANGE BG HEADER ######## //
const scrollHeader = () => {
    const header = document.getElementById('header');
    this.scrollY >= 50 ? header.classList.add('scroll-header')
                       : header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader);

// ====== Fetch API ====== //
/* == possiveis erros ==

 - excesso de requests
 como esta utilizando a API do unsplash eles tem um limite de request pra cliente demo = 50 por hora
 cliente Production = 5000 por hora  cliente Enterprise mais de 5000

 == Limite de taxa excedido ==

 A API do Unsplash geralmente impõe limites de taxa para evitar 
 sobrecarregar o servidor. Se a solicitação exceder esses limites, 
 o servidor pode negar o acesso temporariamente.
*/

// enter your access key for unsplash API
const accessKey = '';
const randomPhotoUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=30`;
const gallery = document.querySelector('.gallery__container');

let currentImage = 0;
let allImages;
let requestCount = 0;
const MAX_REQUESTS_PER_HOUR = 50;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getImages = async () => {
    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
        console.log('Limite de solicitações excedido. Aguardando uma hora.');
        return;
    }

    try {
        const response = await fetch(randomPhotoUrl);
        if (!response.ok) {
            throw new Error('Erro ao obter imagens da API');
        }

        const data = await response.json();
        allImages = data;
        makeImages(allImages);

        requestCount++;
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
    }
};

const makeImages = (data) => {
    data.forEach((item, index) => {
        let img = document.createElement('img');
        img.src = encodeURIComponent(item.urls.regular);
        img.className = 'result__image';

        gallery.appendChild(img);

        img.addEventListener('click', () => {
            currentImage = index;
            showModal(item);
        });
    });
};

const showModal = (item) => {
    let modal = document.querySelector('.image__modal');
    const dowloadBtn = document.querySelector('.download-button');
    const closeModal = document.querySelector('.modal__close');
    const image = document.querySelector('.modal__image');

    modal.classList.remove('modal-hiden');
    dowloadBtn.href = item.links.html;
    image.src = item.urls.regular;
    closeModal.addEventListener('click', () => {
        modal.classList.add('modal-hiden');
    });
};

const preBtn = document.querySelector('.prev');
const nxtBtn = document.querySelector('.next');

preBtn.addEventListener('click', () => {
    if (currentImage > 0) {
        currentImage--;
        showModal(allImages[currentImage]);
    }
});

nxtBtn.addEventListener('click', () => {
    if (currentImage < allImages.length - 1) {
        currentImage++;
        showModal(allImages[currentImage]);
    }
});

// controla a quantidade de imagens chamadas por vez
const getImagesWithDelay = async () => {
    for (let i = 0; i < 5; i++) {
        await delay(1000);
        getImages();
    }
};

getImagesWithDelay();