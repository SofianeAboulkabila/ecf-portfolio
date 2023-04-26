const heroBanner = document.querySelectorAll("#hero-banner");
const switchClick = document.querySelectorAll(".switch");

function nuit() {
  switchClick.forEach(function(switchElem) {
    const inputElem = switchElem.querySelector("input");
    inputElem.addEventListener("click", function() {
      heroBanner.forEach(function(banner) {
        if (inputElem.checked) {
          banner.classList.add("nuit");
        } else {
          banner.classList.remove("nuit");
        }
      });
    });
  });
}
