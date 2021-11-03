title();

function title() {
	const $d = document;
	let location = window.location.pathname.split('/');

	if (location[1] !== '') {
		let terURL = '';

		if (location.length > 2) {
			if (location[1] === 'clientes') {
				terURL =
					location[location.length - 1].charAt(0).toLocaleUpperCase() +
					location[location.length - 1].slice(1);
			} else {
				terURL =
					location[2].charAt(0).toLocaleUpperCase() + location[2].slice(1);
			}
		}

		location = location[1].charAt(0).toLocaleUpperCase() + location[1].slice(1);
		$d.title = `${$d.title} | ${location}`;

		if (terURL !== '') {
			$d.title = `${$d.title} - ${terURL}`;
		}
	}
}

export default moment;
