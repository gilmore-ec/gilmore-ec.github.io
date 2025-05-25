let slideIndex = 1;
showSlides(slideIndex);

//Automatocally run the slideshow based on the time variable.
const time = 3500;
var autorun = setInterval(() => { slideIndex++; showSlides(slideIndex) }, time);

/**
 * Displays the next or previous slide and resets the interval timer
 * 
 * @param {number} n is the slide index
 */
function plusSlides(n) {
  clearInterval(autorun);
  showSlides(slideIndex += n);
  autorun = setInterval(() => { slideIndex++; showSlides(slideIndex) }, time);
}

/**
 * Displays a specific slide and resets the interval timer
 * 
 * @param {number} n is the slide index
 */
function currentSlide(n) {
  clearInterval(autorun);
  showSlides(slideIndex = n);
  autorun = setInterval(() => { slideIndex++; showSlides(slideIndex) }, time);
}

/**
 * Displays the specified slide and activates the dot associated with the slide
 * 
 * @param {number} index is the index of the slide and dot
 */
function showSlides(index) {
  let i;
  let slides = document.getElementsByClassName("proj"); //get the project slides
  let dots = document.getElementsByClassName("dot"); //get the dots
  if (index > slides.length) { slideIndex = 1 } //Ensure index is in bounds of the array
  if (index < 1) { slideIndex = slides.length }//ensure index is greater than 0
  for (i = 0; i < slides.length; i++) {//Reset slides to be hidden
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");//Reset dots to inactive status
  }
  slides[slideIndex - 1].style.display = "block";//displays active slide
  dots[slideIndex - 1].className += " active";//sets the corresponding dot to active
}