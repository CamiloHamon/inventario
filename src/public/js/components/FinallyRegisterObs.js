import { Row } from './Row.js';
import { Colums } from './Columns.js';
import { Titles } from './Titles.js';
import { Forms } from './Forms.js';
import { Buttons } from './Buttons.js';
import { TextArea } from './TextArea.js';
import { ReturnCaja } from './ReturnCaja.js';
import { ListClients } from './ListClients.js';

export function FinallyRegisterObs(obs, clients) {
	const d = document,
		$divFinally = d.getElementById('div-finally'),
		$div = Row('div-obs'),
		$col = Colums(12);

	if ($divFinally) $divFinally.remove();

	$div.appendChild($col);
	$div.classList.add('py-5');

	const $form = Forms('finally'),
		$btnSend = Buttons('Enviar'),
		$textarea = TextArea();

	if (obs) {
		const $title = Titles('Describa la Observacion:', 'h5');
		$title.classList.add('mt-2');
		$col.appendChild($title);
		$textarea.setAttribute('id', 'textAreaObs');
		$form.appendChild($textarea);
	}

	if (clients) {
		const $titleTrust = Titles('Seleccione el cliente', 'h5');
		$form.appendChild($titleTrust);
		$form.appendChild(ListClients(clients));
	}

	$form.appendChild($btnSend);
	$btnSend.classList.add('my-3', 'blockMobile');
	$col.appendChild($form);

	$div.appendChild(ReturnCaja());

	return $div;
}
