const urlParams = new URLSearchParams(window.location.search);
const loadValue = urlParams.get('load');
const titleValue = urlParams.get('title');
document.querySelector('iframe').src = __uv$config.prefix + __uv$config.encodeUrl(loadValue);
document.getElementById('Title').innerHTML = titleValue;

function fullscreen() {
    document.getElementById("Container").style.zIndex = 99999;
    document.getElementById("Container").style.width = "100%";
    document.getElementById("Container").style.height = "100%";
    document.getElementById("Container").style.top = 0;
    document.getElementById("Container").style.left = 0;
    document.body.style.overflow = "hidden";
}