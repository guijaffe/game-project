// Создание приложения PixiJS
const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	width: 980,
	height: 630,
	backgroundColor: 0x159585,
});

// Загрузка фона
PIXI.Assets.load('./assets/images/background.png').then((texture) => {
	const background = new PIXI.Sprite(texture);
	background.width = app.screen.width;
	background.height = app.screen.height;
	app.stage.addChildAt(background, 0);
});

// Загрузка текстур карты и персонажа
PIXI.Assets.load(['./assets/images/map.png', './assets/images/hero.png']).then((textures) => {
	const map = new PIXI.Sprite(textures['./assets/images/map.png']);
	app.stage.addChild(map);

	const hero = new PIXI.Sprite(textures['./assets/images/hero.png']);
	hero.x = 445;
	hero.y = 490;
	hero.anchor.set(0.5);
	app.stage.addChild(hero);

	// Массив точек траектории
	const points = [
		{ x: 445, y: 490 },
		{ x: 500, y: 450 },
		{ x: 530, y: 400 },
		{ x: 550, y: 350 },
		{ x: 600, y: 300 }, // Универ
		{ x: 650, y: 280 },
		{ x: 700, y: 250 },
	];

	let isMoving = false;
	let currentPointIndex = 0;
	let t = 0; // Параметр времени анимации
	let mirrorEffect = 1;

	// Функция easing для плавного движения
	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	// Функция для плавного движения к точке
	function moveToNextPoint() {
		if (currentPointIndex >= points.length - 1) {
			console.log('Достигнута конечная точка маршрута.');
			displayCompletionMessage();
			return;
		}

		const p0 = points[currentPointIndex];
		const p1 = points[currentPointIndex + 1];
		t = 0;
		isMoving = true;

		// Анимация движения
		function animateMove() {
			if (t < 1 && isMoving) {
				t += 0.02; // Скорость анимации

				// Применяем easing
				const easedT = easeInOutQuad(t);

				// Интерполяция между точками
				hero.x = p0.x + (p1.x - p0.x) * easedT;
				hero.y = p0.y + (p1.y - p0.y) * easedT;

				// Эффект зеркалирования
				if (p1.x > p0.x) {
					mirrorEffect = 1;
				} else {
					mirrorEffect = -1;
				}
				hero.scale.x = mirrorEffect;

				requestAnimationFrame(animateMove);
			} else {
				isMoving = false;
				currentPointIndex++;
				console.log(`Точка ${currentPointIndex} достигнута.`);
			}
		}

		animateMove();
	}

	// Сообщение о достижении конечной точки
	function displayCompletionMessage() {
		const messageElement = document.createElement('div');
		messageElement.textContent = 'Достигнута конечная точка маршрута!';
		messageElement.classList.add('completion-message');
		document.body.appendChild(messageElement);

		// Плавное появление и исчезновение
		messageElement.style.opacity = 0;
		setTimeout(() => {
			messageElement.style.opacity = 1;
		}, 100);

		setTimeout(() => {
			messageElement.style.opacity = 0;
			setTimeout(() => {
				messageElement.remove();
			}, 1000);
		}, 3000);
	}

	// Обработчик клика на кнопку "Универ"
	const handleButtonClick = _.throttle(() => {
		if (!isMoving && currentPointIndex < points.length - 1) {
			moveToNextPoint();
		}
	}, 300);

	// Добавляем обработчик клика на кнопку
	const button = document.getElementById('move-button');
	button.addEventListener('click', handleButtonClick);

	// Бесконечная анимация покачивания персонажа
	function bounceAnimation() {
		hero.y += Math.sin(Date.now() / 200) * 0.5;
		requestAnimationFrame(bounceAnimation);
	}
	bounceAnimation();
});
