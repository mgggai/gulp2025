class TabsComponent {
	constructor(containerSelector) {
		this.container = document.querySelector(containerSelector);
		if (!this.container) return;

		this.tabs = this.container.querySelectorAll('.tabs-block__tab');
		this.contents = this.container.querySelectorAll('.tabs-block__item');

		this.init();
	}

	init() {
		// Скрыть все контенты, кроме первого
		this.contents.forEach((item, index) => {
			item.style.display = index === 0 ? 'block' : 'none';
		});

		// Добавить активный класс первой вкладке
		this.tabs[0].classList.add('active');

		// Назначить обработчики
		this.tabs.forEach((tab, index) => {
			tab.addEventListener('click', () => this.activateTab(index));
		});
	}

	activateTab(index) {
		this.tabs.forEach(t => t.classList.remove('active'));
		this.tabs[index].classList.add('active');

		this.contents.forEach(content => {
			content.style.display = 'none';
		});

		const selected = this.contents[index];
		selected.style.opacity = 0;
		selected.style.display = 'block';

		let opacity = 0;
		const fadeIn = setInterval(() => {
			if (opacity >= 1) {
				clearInterval(fadeIn);
			} else {
				opacity += 0.1;
				selected.style.opacity = opacity;
			}
		}, 30);
	}
}

export default TabsComponent;