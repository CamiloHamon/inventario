export function Titles(text, type) {
	const $title = document.createElement(type);
	$title.textContent = text;
	$title.classList = 'pb-3';
	return $title;
}
