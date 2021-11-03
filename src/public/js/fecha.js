import ajax from './helpers/ajax.js';
import moment from './index.js';

moment.locale('es');

(() => {
	const toDay = moment.tz('America/Bogota').format('LL');
	const fecha = document.getElementById('fecha-local');
	fecha.innerHTML = toDay;
})();

function currentTime() {
	return moment().tz('America/Bogota').format('HH:mm:ss');
}

setInterval(async () => {
	const $div = document.getElementById('products-table');
	if ($div) {
		const time = currentTime();
		const timeNow = time.split(':'),
			hr = Number(timeNow[0]),
			min = Number(timeNow[1]),
			sec = Number(timeNow[2]);

		if (validar(hr, min, sec)) {
			await ajax.endTurn('/turno/terminar');
			location.reload();
		}
	}
}, 1000);

function validar(hr, min, sec) {
	if (hr === 23) {
		if (min === 59) {
			if (sec > 57 && sec < 60) {
				return true;
			}
		}
	}
	return false;
}

margin();

function margin() {
	const $divMargin = document.getElementById('divMargin');
	const URLactual = window.location.pathname.split('/');

	const whoULR = URLactual[1];
	if (URLactual.length > 2 && whoULR !== 'turno') {
		$divMargin.classList.add('my-md-2');
	} else $divMargin.classList.add('mt-md-1');

	if (whoULR === 'turno') {
		if (URLactual.length > 2) {
			$divMargin.classList.remove('pos-fecha');
			const $btnCaja = document.getElementById('menuTurnoCaja');
			$btnCaja.classList.remove('d-none');
			const $rowHeader = document.getElementById('rowContentHeader');
			$rowHeader.classList.replace(
				'justify-content-end',
				'justify-content-between'
			);
		} else $divMargin.classList.add('mt-md-1');
	}
}
