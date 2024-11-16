const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	width: 980,
	height: 630,
	backgroundColor: 0x159585,
});

// Загрузка фона с PixiJS
PIXI.Assets.load('./assets/images/background.png').then((texture) => {
	const background = new PIXI.Sprite(texture);
	background.width = app.screen.width;
	background.height = app.screen.height;
	app.stage.addChildAt(background, 0);
});

// Загрузка текстур карты и персонажа с PixiJS
PIXI.Assets.load(['./assets/images/map.png', './assets/images/hero.png']).then((textures) => {
	const map = new PIXI.Sprite(textures['./assets/images/map.png']);
	app.stage.addChild(map);

	const hero = new PIXI.Sprite(textures['./assets/images/hero.png']);
	hero.x = 445;
	hero.y = 490;
	hero.anchor.set(0.5);
	app.stage.addChild(hero);

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
	let t = 0;
	let mirrorEffect = 1;

	// Функция easing для плавного движения
	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	// Функция для плавного движения
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
				t += 0.02;

				const easedT = easeInOutQuad(t);

				hero.x = p0.x + (p1.x - p0.x) * easedT;
				hero.y = p0.y + (p1.y - p0.y) * easedT;

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

// select the open-btn button
	let openBtn = document.getElementById('open-btn');
// select the modal-background
	let overlay = document.getElementById('overlay');
// select the close-btn
	let closeBtn = document.getElementById('close-btn');

// shows the modal when the user clicks open-btn
	openBtn.addEventListener('click', function() {
		overlay.style.display = 'block';
	});

// hides the modal when the user clicks close-btn
	closeBtn.addEventListener('click', function() {
		overlay.style.display = 'none';
	});

// hides the modal when the user clicks outside the modal
	window.addEventListener('click', function(event) {
		// check if the event happened on the modal-background
		if (event.target === overlay) {
			// hides the modal
			overlay.style.display = 'none';
		}
	});


	// Обработчик клика на кнопку "Универ"
	const handleButtonClick = _.throttle(() => {
		if (!isMoving && currentPointIndex < points.length - 1) {
			moveToNextPoint();
		}
	}, 300);

	// Добавить обработчик для кнопки
	const button = document.getElementById('move-button');
	button.addEventListener('click', handleButtonClick);

	// Анимация покачивания персонажа
	function bounceAnimation() {
		hero.y += Math.sin(Date.now() / 200) * 0.5;
		requestAnimationFrame(bounceAnimation);
	}
	bounceAnimation();
});
