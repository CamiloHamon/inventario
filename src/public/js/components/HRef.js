export function HRef(classes, textContent, link) {
	const $back = document.createElement('a');
	$back.textContent = textContent;
	$back.href = link;
	$back.setAttribute('target', '_blank');
	$back.classList = classes;
	return $back;
}
