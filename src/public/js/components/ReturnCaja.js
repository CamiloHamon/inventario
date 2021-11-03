import { Buttons } from './Buttons.js';
import { Colums } from './Columns.js';
import { Icon } from './Icons.js';

export function ReturnCaja() {
	const $col = Colums(12);
	$col.classList.add('my-3', 'col-md-10');
	const $back = Icon('fas fa-cash-register ml-3');

	const $buttonBack = Buttons('Volver a la Caja', 'back');
	$buttonBack.appendChild($back);
	$buttonBack.classList.add('blockMobile');

	$col.appendChild($buttonBack);
	return $col;
}
