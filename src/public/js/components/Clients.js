export function Clients(clients) {
	const $option = document.createElement('option');
	const fullName = `${clients.name} - ${clients.complement}`;
	$option.textContent = fullName.toLocaleUpperCase();
	$option.setAttribute('id', `client-${clients.idClient}`);
	$option.value = clients.idClient;

	return $option;
}
