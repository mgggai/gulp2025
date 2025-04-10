class AccordionComponent {
	constructor(containerSelector) {
		this.container = document.querySelector(containerSelector);
		if (!this.container) return;

		this.headers = this.container.querySelectorAll("dt");
		this.items = this.container.querySelectorAll("dd");

		this.init();
	}

	init() {
		this.items.forEach((dd) => {
			dd.style.display = "none";
		});

		this.headers.forEach((header) => {
			header.addEventListener("click", () => this.toggle(header));
		});
	}

	toggle(clickedHeader) {
		this.items.forEach((dd) => {
			const header = dd.previousElementSibling;
			if (header !== clickedHeader) {
				dd.style.display = "none";
				header.classList.remove("active");
			}
		});

		const next = clickedHeader.nextElementSibling;
		if (
			next &&
			next.tagName.toLowerCase() === "dd" &&
			next.style.display === "none"
		) {
			next.style.display = "block";
			clickedHeader.classList.add("active");
		} else {
			next.style.display = "none";
			clickedHeader.classList.remove("active");
		}
	}
}

export default AccordionComponent;
