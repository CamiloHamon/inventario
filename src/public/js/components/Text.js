export function Text(text, classes) {
	const $textSuccess = document.createElement('p');
	$textSuccess.textContent = text;
	$textSuccess.classList = classes;
	return $textSuccess;
}
