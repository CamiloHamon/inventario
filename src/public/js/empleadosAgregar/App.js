import { Loader } from '../components/Loader.js';

export function App() {
	const d = document,
		$inputImg = d.getElementById('customFile'),
		$divImg = d.querySelector('.imgProfileEmp'),
		$imagen = d.getElementById('imagenPerfil'),
		$save = d.getElementById('save'),
		$form = d.getElementById('form');

	const urlImg = '/img/profile.png';
	const h = $imagen.clientHeight;
	let urlFinally = '';

	$divImg.style.backgroundImage = `url('${urlImg}')`;
	$divImg.style.backgroundPosition = 'top';
	$divImg.style.backgroundSize = 'cover';
	$divImg.style.backgroundRepeat = 'no-repeat';

	$inputImg.addEventListener('change', () => {
		const $inputImg2 = d.getElementById('customFile');
		$inputImg2.setAttribute('disabled', 'true');
		const file = d.querySelector('input[type=file]').files[0];
		const reader = new FileReader();
		disableBtn();

		$divImg.classList.add('filterCustom');

		reader.onloadend = () => {
			$divImg.classList.remove('filterCustom');
			$divImg.style.backgroundImage = `url('${reader.result}')`;
			urlFinally = reader.result;
			setTimeout(() => {
				$inputImg2.removeAttribute('disabled');
				enableBtn();
			}, 100);
		};

		if (file) reader.readAsDataURL(file);
		else {
			$inputImg2.removeAttribute('disabled');
			$divImg.style.backgroundImage = `url('${urlImg}')`;
			urlFinally = urlImg;
			$divImg.classList.remove('filterCustom');
		}
	});

	$save.addEventListener('click', () => {
		$imagen.remove();
		const $changeImg = d.getElementById('changeImg');
		$changeImg.style.height = `${h}px`;
		$changeImg.classList.add('w-100');
		$changeImg.classList.add('rounded-circle');
		$changeImg.style.backgroundImage = `url('${urlFinally}')`;
		$changeImg.style.backgroundPosition = 'top';
		$changeImg.style.backgroundSize = 'cover';
		$changeImg.style.backgroundRepeat = 'no-repeat';
	});

	$form.addEventListener('submit', () => {
		disableBtn();
		const $btn = d.getElementById('btn-submit');
		$btn.innerHTML =
			'<span style="display: flex;">Creando... <img src="/assets/loader.svg" alt="Cargando..." class="loader m-0 ml-2" style="height: 1.5rem;"></span>';
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
