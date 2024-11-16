window.onload = function () {
	const tableBody = document.getElementById('tableBody');
	const sortedData = getSortedRatingData(data.rating);

	// Рендерим всех пользователей из `rating`, отмечаем друзей из `friends`
	renderTable(sortedData, tableBody, data.friends);
};

/**
 * Функция сортировки данных рейтинга
 * @param {Array} ratingData - Массив объектов с данными пользователей
 * @returns {Array} - Отсортированный массив по очкам (по убыванию)
 */
function getSortedRatingData(ratingData) {
	return ratingData.sort((a, b) => Number(b.points) - Number(a.points));
}

/**
 * Функция для рендеринга таблицы
 * @param {Array} sortedData - Отсортированные данные рейтинга
 * @param {HTMLElement} tableBody - Контейнер для строк таблицы
 * @param {Array} friends - Массив с друзьями
 */
function renderTable(sortedData, tableBody, friends) {
	// Очистка таблицы
	tableBody.innerHTML = '';

	// Для каждого элемента из отсортированных данных создаем строку
	sortedData.forEach((user, index) => {
		const row = document.createElement('div');
		row.classList.add('table-content');

		// Проверка, является ли пользователь другом
		const isFriend = friends.some(friend => friend.id === user.id);

		// Если это друг, добавляем класс для подсветки строки
		if (isFriend) {
			row.classList.add('friend-highlight');
		}

		// Заполняем строку данными
		row.innerHTML = `
            <div class="cell">${index + 1}</div>
            <div class="cell">${user.name} ${user.lastName}</div>
            <div class="cell">${user.points}</div>
        `;

		// Добавляем строку в таблицу
		tableBody.appendChild(row);
	});
}
