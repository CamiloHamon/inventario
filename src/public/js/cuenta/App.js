import ajax from '../helpers/ajax.js';
export function App() {
	const d = document,
		$inputImg = d.getElementById('customFile'),
		$divImg = d.querySelector('.imgProfileEmp'),
		$formImg = d.getElementById('formImg');

	let urlImg = '';

	ajax.listLoans({
		URL: '/cuenta/listName',
		CBSUCCESS: (response) => {
			const data = response[0];

			if (data.img) {
				urlImg = `url('/img/imgProfile/${data.url}')`;
				$divImg.style.backgroundImage = `url('/img/imgProfile/${data.url}')`;
			} else {
				urlImg = "url('/img/profile.png')";
				$divImg.style.backgroundImage = "url('/img/profile.png')";
			}

			$divImg.style.backgroundPosition = 'top';
			$divImg.style.backgroundSize = 'cover';
			$divImg.style.backgroundRepeat = 'no-repeat';
		},
		CBERROR: (erro) => {},
	});

	$inputImg.addEventListener('change', () => {
		$inputImg.setAttribute('disabled', 'true');
		disableBtn();
		const file = d.querySelector('input[type=file]').files[0];
		const reader = new FileReader();

		const $loader = d.createElement('img');
		$loader.src = '/assets/loader.svg';
		$loader.classList = 'loader loaderImg';
		$loader.id = 'loaderImg';
		$divImg.classList.add('filterCustom');
		formImg.appendChild($loader);
		reader.onloadend = () => {
			$divImg.classList.remove('filterCustom');
			const $loaderImg = d.getElementById('loaderImg');
			if ($loaderImg) $loaderImg.remove();
			$divImg.style.backgroundImage = `url('${reader.result}')`;
			setTimeout(() => {
				$inputImg.removeAttribute('disabled');
				enableBtn();
			}, 100);
		};

		if (file) reader.readAsDataURL(file);
		else {
			$divImg.classList.remove('filterCustom');
			const $loaderImg = d.getElementById('loaderImg');
			if ($loaderImg) $loaderImg.remove();
			$divImg.style.backgroundImage = urlImg;
			$inputImg.removeAttribute('disabled');
			enableBtn();
		}
	});

	$formImg.addEventListener('submit', () => {
		disableBtn();
		const $btn = d.getElementById('btn-update');
		$btn.innerHTML =
			'<span style="display: flex;">Actualizando... <img src="/assets/loader.svg" alt="Cargando..." class="loader m-0 ml-2" style="height: 1.5rem;"></span>';
	});

	function enableBtn() {
		const $btns = d.querySelectorAll('button');
		$btns.forEach((el) => {
			el.removeAttribute('disabled');
		});
	}

	function disableBtn() {
		const $btns = d.querySelectorAll('button');
		$btns.forEach((el) => {
			el.setAttribute('disabled', 'true');
		});
	}
}
