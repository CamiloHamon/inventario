import ajax from '../helpers/ajax.js';
export function App() {
	const d = document,
		$inputImg = d.getElementById('customFile'),
		$divImg = d.querySelector('.imgProfileEmp'),
		$formImg = d.getElementById('formImg');

	let urlImg = '';

	function getId() {
		const array = location.pathname.split('/');
		return array[array.length - 1];
	}

	const id = getId();

	ajax.listLoans({
		URL: `/empleados/${id}/imgProfile`,
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
		const $inputImg2 = d.getElementById('customFile');
		$inputImg2.setAttribute('disabled', 'true');
		disableBtn();
		const file = d.querySelector('input[type=file]').files[0];
		const reader = new FileReader();
		const $loader = d.createElement('img');
		$loader.src = '/assets/loader.svg';
		$loader.classList = 'loader loaderImg';
		$loader.id = 'loaderImg';

		$divImg.appendChild($loader);

		$divImg.classList.add('filterCustom');

		reader.onloadend = () => {
			$divImg.classList.remove('filterCustom');
			const $loaderImg = d.getElementById('loaderImg');
			if ($loaderImg) $loaderImg.remove();
			$divImg.style.backgroundImage = `url('${reader.result}')`;
			setTimeout(() => {
				$inputImg2.removeAttribute('disabled');
				enableBtn();
			}, 100);
		};

		if (file) reader.readAsDataURL(file);
		else {
			$divImg.classList.remove('filterCustom');
			const $loaderImg = d.getElementById('loaderImg');
			if ($loaderImg) $loaderImg.remove();
			$divImg.style.backgroundImage = urlImg;
			$inputImg2.removeAttribute('disabled');
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
