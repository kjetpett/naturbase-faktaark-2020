
var temaId = getURLParameter('id');
console.log(temaId);
console.log(window.location.protocol);
window.location.replace("..?id=" + temaId);

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,''])[1].replace(/\+/g, '%20'))||null;
}
