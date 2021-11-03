export function calcTam() {
	const x = screen.height;

	const header = Math.floor((100 * 100) / x);
	const restante = 100 - header - 5;

	const $cont = document.getElementById('cont');
	$cont.style.height = `${restante}%`;

	const hMainDiv = $cont.clientHeight;

	const $title = document.getElementById('title');
	const hTitle = $title.clientHeight;

	const $search = document.getElementById('divSearch');
	const hSearch = $search.clientHeight;

	let totalH = hMainDiv - hTitle - hSearch - 50;
	if (x >= 768) totalH -= 16;
	const $divTable = document.getElementById('divTable');
	$divTable.style.height = `${totalH}px`;
}
