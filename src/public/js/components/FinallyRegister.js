import { Buttons } from './Buttons.js';
import { Colums } from './Columns.js';
import { Forms } from './Forms.js';
import { ListClients } from './ListClients.js';
import { ReturnCaja } from './ReturnCaja.js';
import { Row } from './Row.js';
import { Text } from './Text.js';
import { Titles } from './Titles.js';

export function FinallyRegister(clients, cambio) {
	const $container = Row('div-finally'),
		$col = Colums(12),
		$formObservation = Forms('observation'),
		$formNoObservation = Forms('finally'),
		$buttonSi = Buttons('Si'),
		$buttonNo = Buttons('No. Enviar'),
		$h5 = Titles('¿Tiene observaciones de esta orden?', 'h5'),
		$col2 = Colums(10);

	if (cambio) {
		const $rowCambio = Row('cambio'),
			$colCambio = Colums(12),
			$titleCambio = Titles('Cambio', 'h5');
		$rowCambio.appendChild($colCambio);
		$colCambio.appendChild($titleCambio);

		const $textCambio = Text(cambio.vueltas);
		$colCambio.appendChild($textCambio);
		$container.appendChild($colCambio);
	}

	$col.appendChild($h5);
	$formObservation.appendChild($buttonSi);

	$formNoObservation.appendChild($buttonNo);

	$container.appendChild($col);
	$col.appendChild($formObservation);
	$col.appendChild($formNoObservation);

	if (clients) {
		$col2.classList.add('my-4', 'mt-md-5');
		const $titleTrust = Titles('¿Es una Orden Fiada?', 'h5');
		$col2.appendChild($titleTrust);
		$col2.appendChild(ListClients(clients));
	}

	$container.appendChild($col2);

	$container.appendChild(ReturnCaja());

	return $container;
}
