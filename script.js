const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	width: 980,
	height: 630,
	backgroundColor: 0x159585,
});

PIXI.Assets.load('./assets/images/background.png').then((texture) => {
	const background = new PIXI.Sprite(texture);
	background.width = app.screen.width;
	background.height = app.screen.height;
	app.stage.addChildAt(background, 0);
});

PIXI.Assets.load(['./assets/images/map.png', './assets/images/hero.png']).then((textures) => {
	const map = new PIXI.Sprite(textures['./assets/images/map.png']);
	app.stage.addChild(map);

	const hero = new PIXI.Sprite(textures['./assets/images/hero.png']);
	hero.x = 445;
	hero.y = 463;
	hero.anchor.set(0.5);
	app.stage.addChild(hero);

	const points = [
		{ x: 445, y: 463 },
		{ x: 351, y: 440 },
		{ x: 277, y: 482 },
		{ x: 190, y: 503 },
		{ x: 110, y: 473 },
		{ x: 123, y: 411 },
		{ x: 142, y: 356 },
	];

	let isMoving = false;
	let currentPointIndex = 0;
	let t = 0;
	let mirrorEffect = 1;

	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	const controlPointsList = [
		[
			{ x: 426, y: 473 },
			{ x: 410, y: 418 },
		],
		[
			{ x: 320, y: 463 },
			{ x: 292, y: 481 },
		],
		[
			{ x: 251, y: 502 },
			{ x: 211, y: 507 },
		],
		[
			{ x: 167, y: 504 },
			{ x: 141, y: 498 },
		],
		[
			{ x: 60, y: 445 },
			{ x: 99, y: 427 },
		],
		[
			{ x: 97, y: 385 },
			{ x: 118, y: 364 },
		]
	];

	function moveToNextPoint() {
		const p0 = points[currentPointIndex];
		let p1 = points[currentPointIndex + 1];
		t = 0;
		isMoving = true;

		function animateMove() {
			if (t < 1 && isMoving) {
				t += 0.02;

				const easedT = easeInOutQuad(t);

				const [controlPoint1, controlPoint2] = controlPointsList[currentPointIndex];

				const bezierX = Math.pow(1 - easedT, 3) * p0.x
					+ 3 * Math.pow(1 - easedT, 2) * easedT * controlPoint1.x
					+ 3 * (1 - easedT) * Math.pow(easedT, 2) * controlPoint2.x
					+ Math.pow(easedT, 3) * p1.x;

				const bezierY = Math.pow(1 - easedT, 3) * p0.y
					+ 3 * Math.pow(1 - easedT, 2) * easedT * controlPoint1.y
					+ 3 * (1 - easedT) * Math.pow(easedT, 2) * controlPoint2.y
					+ Math.pow(easedT, 3) * p1.y;

				hero.x = bezierX;
				hero.y = bezierY;

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

	const handleButtonClick = _.throttle(() => {
		if (!isMoving && currentPointIndex < points.length - 1) {
			moveToNextPoint();
		}
	}, 300);

	const button = document.getElementById('move-button');
	button.addEventListener('click', handleButtonClick);

	function bounceAnimation() {
		hero.y += Math.sin(Date.now() / 200) * 0.2;
		requestAnimationFrame(bounceAnimation);
	}
	bounceAnimation();

	let openBtn = document.getElementById('open-btn');
	let overlay = document.getElementById('overlay');
	let closeBtn = document.getElementById('close-btn');

	openBtn.addEventListener('click', function() {
		overlay.style.display = 'block';
	});

	closeBtn.addEventListener('click', function() {
		overlay.style.display = 'none';
	});

	window.addEventListener('click', function(event) {
		if (event.target === overlay) {
			overlay.style.display = 'none';
		}
	});

	app.stage.interactive = true;
	app.stage.on('pointerdown', (event) => {
		const position = event.data.global;
		console.log(`Координаты клика: x = ${position.x}, y = ${position.y}`);
	});

});
