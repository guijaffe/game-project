document.addEventListener('DOMContentLoaded', function() {
	// JSON данные слайдера
	const icons = [
		{ hasPlus: true, hasPerson: true },
		{ hasPlus: false, hasPerson: true },
		{ hasPlus: false, hasPerson: true },
		{ hasPlus: false, hasPerson: true },
		{ hasPlus: false, hasPerson: true },
		{ hasPlus: false, hasPerson: false },
		{ hasPlus: false, hasPerson: false },
		{ hasPlus: false, hasPerson: false },
		{ hasPlus: false, hasPerson: false },
	];

	initSlider(icons);

	function initSlider(iconsData) {
		const friendsItems = document.querySelector('.friends-items');  // Новый контейнер для иконок
		let currentIndex = 0;
		const maxVisible = 8; // Количество иконок, которые будут отображаться
		const totalIcons = iconsData.length;

		// Функция для создания иконок
		function createIcons() {
			friendsItems.innerHTML = ''; // Очищаем контейнер перед добавлением

			_.map(iconsData, (icon) => {
				const iconDiv = document.createElement('div');
				iconDiv.classList.add('friends-icons');

				// Добавляем классы plus и person, если они присутствуют
				if (icon.hasPlus) {
					const plusIcon = document.createElement('div');
					plusIcon.classList.add('plus');
					iconDiv.appendChild(plusIcon);
				}
				if (icon.hasPerson) {
					const personIcon = document.createElement('div');
					personIcon.classList.add('person-icon');
					iconDiv.appendChild(personIcon);
				}

				friendsItems.appendChild(iconDiv); // Добавляем иконки в friends-items
			});
		}

		// Функция для зацикленного перемещения иконок
		function moveIcons() {
			const iconsElements = friendsItems.querySelectorAll('.friends-icons');
			const totalVisibleIcons = Math.min(maxVisible, iconsElements.length);

			// Зацикливаем иконки
			let iconsHTML = '';
			for (let i = 0; i < totalVisibleIcons; i++) {
				// Иконки, которые будут перемещаться
				const index = (currentIndex + i) % totalIcons; // Зацикливаем индексы
				const iconData = iconsData[index];

				// Создаём HTML для иконок
				let iconHTML = '';
				if (iconData.hasPlus) {
					iconHTML += '<div class="plus"></div>';
				}
				if (iconData.hasPerson) {
					iconHTML += '<div class="person-icon"></div>';
				}

				iconsHTML += `<div class="friends-icons">${iconHTML}</div>`;
			}

			// Обновляем содержимое контейнера с иконками
			friendsItems.innerHTML = iconsHTML;
		}

		// Обработчик для кнопки влево с _.throttle для предотвращения частых срабатываний
		const arrowLeft = document.querySelector('.arrow-left');
		arrowLeft.addEventListener('click', _.throttle(function() {
			currentIndex = (currentIndex === 0) ? totalIcons - 1 : currentIndex - 1;
			moveIcons();
		}, 300)); // Ограничиваем частоту кликов до одного в 300ms

		// Обработчик для кнопки вправо с _.throttle
		const arrowRight = document.querySelector('.arrow-right');
		arrowRight.addEventListener('click', _.throttle(function() {
			currentIndex = (currentIndex === totalIcons - 1) ? 0 : currentIndex + 1;
			moveIcons();
		}, 300)); // Ограничиваем частоту кликов до одного в 300ms

		// Инициализация слайдера
		createIcons(); // Создаём все иконки
		moveIcons(); // Инициализируем слайдер
	}
});
