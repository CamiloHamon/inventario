export function Colums(tam) {
	const $col = document.createElement('div');
	$col.classList = `col-${tam} text-center`;
	return $col;
}
