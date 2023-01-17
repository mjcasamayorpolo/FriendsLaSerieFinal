import lazyframe from "lazyframe";

function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
}

const urls = [
  "https://www.youtube.com/embed/v5fab46btxU",
  "https://www.youtube.com/embed/1WY5qhd-DgI"
];

urls.forEach((u,i) => {
  const videoContainer = document.getElementById(`video${i}`);
  const lazyVideo = createElement('div', 'lazyframe');
  lazyVideo.setAttribute('data-vendor','youtube');
  lazyVideo.setAttribute('data-src', u);
  lazyVideo.setAttribute('data-autoplay', false);
  lazyframe(lazyVideo,{
      lazyload: true,
      autoplay: false
  });
  videoContainer.appendChild(lazyVideo);
});
