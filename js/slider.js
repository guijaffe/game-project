document.addEventListener('DOMContentLoaded', function() {
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
		const friendsItems = document.querySelector('.friends-items');
		let currentIndex = 0;
		const maxVisible = 8;
		const totalIcons = iconsData.length;

		function createIcons() {
			friendsItems.innerHTML = '';

			_.map(iconsData, (icon) => {
				const iconDiv = document.createElement('div');
				iconDiv.classList.add('friends-icons');

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

				friendsItems.appendChild(iconDiv);
			});
		}

		function moveIcons() {
			const iconsElements = friendsItems.querySelectorAll('.friends-icons');
			const totalVisibleIcons = Math.min(maxVisible, iconsElements.length);

			let iconsHTML = '';
			for (let i = 0; i < totalVisibleIcons; i++) {
				const index = (currentIndex + i) % totalIcons;
				const iconData = iconsData[index];

				let iconHTML = '';
				if (iconData.hasPlus) {
					iconHTML += '<div class="plus"></div>';
				}
				if (iconData.hasPerson) {
					iconHTML += '<div class="person-icon"></div>';
				}

				iconsHTML += `<div class="friends-icons">${iconHTML}</div>`;
			}

			friendsItems.innerHTML = iconsHTML;
		}

		const arrowLeft = document.querySelector('.arrow-left');
		arrowLeft.addEventListener('click', _.throttle(function() {
			currentIndex = (currentIndex === 0) ? totalIcons - 1 : currentIndex - 1;
			moveIcons();
		}, 300));

		const arrowRight = document.querySelector('.arrow-right');
		arrowRight.addEventListener('click', _.throttle(function() {
			currentIndex = (currentIndex === totalIcons - 1) ? 0 : currentIndex + 1;
			moveIcons();
		}, 300));

		createIcons();
		moveIcons();
	}
});
