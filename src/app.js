const queryString = require('query-string');
import data from './characters.json';
import lazyframe from "lazyframe";

var mainPictures = [];
var mainImgSerie = [];
var mainImgDetail = [];

function createElement(tag, className, attribute, content) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (attribute) element.setAttribute(attribute.name, attribute.value);
    if (content) element.innerHTML = content;
    return element;
}

function loadInfoCharacter(characterId){
    const parsedHash = queryString.parse(location.hash);
    const id = characterId ? characterId : parsedHash.id;
    const characterSelected = data.find(a => a.id == id);

    const characterDetailDOM = document.getElementById("characterDetail");
    if(mainPictures.length == 0){
      mainPictures = [...characterDetailDOM.children].filter(node => node.classList.contains("pictureMain"));
    }
    if(mainImgSerie.length == 0){
      mainImgSerie = [...characterDetailDOM.children].filter(node => node.classList.contains("figureSerie"));
    }
    if(mainImgDetail.length == 0){
      mainImgDetail = [...characterDetailDOM.children].filter(node => node.classList.contains("pictureDetail"));
    }

    const title = createElement('h1', "tituloSection", undefined, characterSelected.title);
    characterDetailDOM.appendChild(title);

    const pictureMain = mainPictures.find(a => a.id === characterSelected.mainImg);
    pictureMain.classList.remove('hidden');
    pictureMain.classList.add("showPictureMain");
    title.after(pictureMain);

    const sectionDesc = createElement('section', 'descriptionDetail');

    const pictureDetail = mainImgDetail.find(a => a.id === characterSelected.detailImg);
    pictureDetail.classList.remove('hidden');
    pictureDetail.classList.add("showPictureMain");
    sectionDesc.append(pictureDetail);

    const contentParragraphs = createElement('div');
    characterSelected.parragraphs.forEach(p => {
        const parragraph = createElement('p', undefined, undefined, p);
        contentParragraphs.appendChild(parragraph);
    });
    sectionDesc.appendChild(contentParragraphs);
    characterDetailDOM.appendChild(sectionDesc);

    const secondImg = mainImgSerie.find(a => a.id === characterSelected.secondImg);
    secondImg.classList.remove('hidden');
    secondImg.classList.add("showPictureMain");
    sectionDesc.after(secondImg);

    const sectionList = createElement('section', 'listDetail');
    const cabeceraList = createElement('h1', 'titleSubsection');
    sectionList.appendChild(cabeceraList);

    const intro = createElement('p', undefined, undefined, `Algunos de los mejores momentos de ${characterSelected.name} en Friends son los siguientes:`);
    const lista = createElement('ul', undefined, undefined);
    characterSelected.list.forEach(l => {
        const li = createElement('li', undefined, undefined, l.title);
        const p = createElement('p', undefined, undefined, l.content);
        li.appendChild(p);
        if (l.imgId) {
            const picture = createElement('picture');
            const img = createElement('img');
            img.src = l.hrefImg;
            picture.appendChild(img);
            li.appendChild(picture);
        }
        if(l.video) {
            const containerVideo = createElement('div', 'lazyframe');
            containerVideo.setAttribute('data-vendor','youtube');
            containerVideo.setAttribute('data-src', l.video);
            containerVideo.setAttribute('data-autoplay', false);
            containerVideo.setAttribute('data-thumbnail', 'https://i.ytimg.com/vi/8ZduC725ATk/hqdefault.jpg');
            containerVideo.setAttribute('id', l.idThumbnail);
            lazyframe(containerVideo,{
                lazyload: true,
                autoplay: false
            });
            li.appendChild(containerVideo);
        }
        lista.appendChild(li);
    });
    sectionList.appendChild(intro);
    sectionList.appendChild(lista);
    characterDetailDOM.appendChild(sectionList);

    const characters = document.querySelector(".characters");
    characters.childNodes.forEach(a => {
        if(a.classList && a.classList.contains("oculto")) a.classList.remove("oculto");
    });

    const linkSelected = document.getElementById(`${id}`)
    linkSelected.classList.add("oculto");
    document.title = document.title.replace('${character}', characterSelected.title);
}

function cleanPage(){
    const characterDetailDOM = document.getElementById("characterDetail");
    while (characterDetailDOM.firstChild) {
        characterDetailDOM.removeChild(characterDetailDOM.firstChild);
    }
}

function cleanThumbnail(){
  var iframes = document.getElementsByClassName('lazyframe');
  [...iframes].forEach(i =>{
    i.style.backgroundImage = null;
  });

}

loadInfoCharacter();

const characters = document.querySelector(".characters");

characters.childNodes.forEach(a=> a.addEventListener('click', function(evt){
    cleanPage();
    loadInfoCharacter(evt.currentTarget.id);
    window.scrollTo(0, 0);
    location.hash = `#id=${evt.currentTarget.id}`;
    setTimeout(() => cleanThumbnail(), 1000);
}));

window.addEventListener('load', () => cleanThumbnail());
