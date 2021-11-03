import { Loader } from '../components/Loader.js';
import { Icon } from '../components/Icons.js';
import { Text } from '../components/Text.js';
import ajax from '../helpers/ajax.js';
import { HRef } from '../components/HRef.js';

export async function App() {
	const $body = document.body,
		d = document;
	//logic
	let currentReport = false,
		link = null,
		checkSend = false;

	//DOM ELEMENTS
	const $checkSend = d.getElementById('sendReport'),
		$form = d.getElementById('form-endTurn'),
		$divIcon = d.getElementById('icon'),
		$divReport = d.getElementById('report'),
		$divNamePDF = d.getElementById('namePDF'),
		$contentReport = d.getElementById('contentReport');
	//events DOM

	$checkSend.addEventListener('change', () => {
		const ifChecked = $checkSend.checked;
		checkSend = ifChecked;
		if (ifChecked) {
			if (!currentReport) {
				currentReport = true;
				disableBtn();
				$divReport.appendChild(Loader());
				ajax.listLoans({
					URL: '/pruebaFactura',
					CBSUCCESS: (res) => {
						d.querySelector('.loader').remove();
						enableBtns();
						$divIcon.appendChild(Icon('fas fa-file-pdf red f-size-25'));
						link = `/pdf/${res.name}.pdf`;
						$divNamePDF.appendChild(HRef('red p-0 m-0', res.name, link));
						$contentReport.classList.remove('d-none');
					},
					CBERROR: (error) => {},
				});
			} else {
				$contentReport.classList.remove('d-none');
			}
		} else {
			$contentReport.classList.add('d-none');
		}
	});

	function disableBtn() {
		const $btns = d.querySelectorAll('button');
		$btns.forEach((e) => {
			e.setAttribute('disabled', 'true');
		});

		const $inputs = d.querySelectorAll('input');
		$inputs.forEach((e) => {
			e.setAttribute('disabled', 'true');
		});
	}

	function enableBtns() {
		const $btns = d.querySelectorAll('button');
		$btns.forEach((e) => {
			e.removeAttribute('disabled');
		});

		const $inputs = d.querySelectorAll('input');
		$inputs.forEach((e) => {
			e.removeAttribute('disabled');
		});
	}

	ubicationTurno();

	function ubicationTurno() {
		let URLactual = window.location.pathname.split('/');
		URLactual = URLactual[2];

		const urls = document.querySelectorAll(`#${URLactual}`);
		urls.forEach((el) => {
			el.classList.add('red');
		});
	}

	const $triggerMenu = document.querySelector('.trigger-menu');

	$triggerMenu.addEventListener('click', () => {
		$body.classList.toggle('menu-open');
		if (!$body.classList.contains('menu-open')) {
			$triggerMenu.blur();
		}
	});
}
