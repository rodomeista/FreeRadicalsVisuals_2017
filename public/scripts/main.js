// Date for removing image container
const date = new Date();

// Remove the assesio logo at 11pm
const HOUR_TO_EXPIRE_IMAGE = 16;

function removeLogoInterval() {
  const imgContainer = document.querySelector("#image-container");
  if (imgContainer == null) return;
  const currentHour = date.getHours();
  // Either remove the image, or re-trigger the interval
  (currentHour >= HOUR_TO_EXPIRE_IMAGE) ?
    imgContainer.remove() :
    setTimeout(removeLogoInterval, 50000);
}

window.onload = removeLogoInterval;