import gsap from "gsap";
import GLightbox from "glightbox";
import IMask from "imask";
import Lenis from "lenis";
// import TabsComponent from "./components/tabs";
// import AccordionComponent from './components/accordeon.js';
// import Swiper from "swiper";
// import { Navigation, Parallax, Thumbs, EffectFade } from "swiper/modules";
// import "swiper/css/bundle";

// const sliderReviews = new Swiper(".reviews-slider", {
// 	modules: [Navigation],
// 	speed: 1000,
// 	loop: true,
// 	clickable: true,
// 	slidesPerView: 2,
// 	spaceBetween: 20,
// 	navigation: {
// 		prevEl: "#btn-slider-prev ",
// 		nextEl: "#btn-slider-next ",
// 	},
// });

const lenis = new Lenis({
	autoRaf: true,
});
lenis.on("scroll", (e) => {});

const lightboxForm = GLightbox({
	selector: ".popup-with-form",
	openEffect: "zoom",
	closeEffect: "fade",
	touchNavigation: false,
	loop: false,
	slideShow: false,
	closeButton: false,
	draggable: false,
	keyboardNavigation: false,
	beforeSlideLoad: (slide) => {
		const arrows = document.querySelectorAll(".gprev, .gnext");
		arrows.forEach((el) => (el.style.display = "none"));
	},
});

lightboxForm.on("open", () => {
	const inputs = document.querySelectorAll(".phone");
	const maskOptions = {
		mask: "+{1}(000)000-00-00",
	};
	inputs.forEach((input) => {
		IMask(input, maskOptions);
	});
});




document.querySelectorAll(".form").forEach(function (form) {
	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const formData = new FormData(form);
		fetch("assets/mail.php", {
			method: "POST",
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					setTimeout(function () {
						lightboxForm.close();
					}, 3000);
				} else {
					console.error("Ошибка при отправке формы");
				}
			})
			.catch((error) => {
				console.error("Произошла ошибка:", error);
			});
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const input = document.querySelector("#phone");
	if (input) {
		IMask(input, {
			mask: "+{7}(000)000-00-00",
		});
	}
});

// document.addEventListener('DOMContentLoaded', () => {
// 	new TabsComponent('.tabs-block');
//      new AccordionComponent('.accordeon');
// });



document.addEventListener('DOMContentLoaded', function() {
	if(document.querySelector('.widget')) {
		const widgetCenter = document.querySelector('.widget__center');
		const widget = document.querySelector('.widget');
	
		widgetCenter.addEventListener('click', function() {
			widget.classList.toggle('is-active');
		});
	}
});