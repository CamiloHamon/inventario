import { calcTam } from '../helpers/calcTam.js';
import ajax from '../helpers/ajax.js';
import { filterInv } from '../helpers/filterInv.js';
import { Loader } from '../components/Loader.js';

export async function App() {
	const d = document;
	//const DOM
	const $table = d.getElementById('products-table'),
		$search = d.getElementById('search-products');

	//
	let listProducts;
	//stetic
	const $alertUser = d.getElementById('alertUser');
	if ($alertUser) {
		$alertUser.classList.remove('my-3');
		$alertUser.classList.add('mt-3');
	}

	$table.insertAdjacentElement('afterend', Loader());

	ajax.listLoans({
		URL: '/inventario/listProducts',
		CBSUCCESS: (products) => {
			d.querySelector('.loader').remove();
			listProducts = products;
			filterInv($table, $search, listProducts);
		},
		CBERROR: (error) => {},
	});

	$search.addEventListener('keyup', () => {
		filterInv($table, $search, listProducts);
	});
}
