import { calcTam } from '../helpers/calcTam.js';
import ajax from '../helpers/ajax.js';
import { filterMenu } from '../helpers/filterMenu.js';
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
		URL: '/inventario/carta/list',
		CBSUCCESS: (products) => {
			d.querySelector('.loader').remove();
			listProducts = products;
			filterMenu($table, $search, listProducts);
		},
		CBERROR: (error) => {},
	});

	$search.addEventListener('keyup', () => {
		filterMenu($table, $search, listProducts);
	});
}
