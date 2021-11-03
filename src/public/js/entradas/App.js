import { calcTam } from '../helpers/calcTam.js';
import ajax from '../helpers/ajax.js';
import { filterInputs } from '../helpers/filterInputs.js';
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
		URL: '/inventario/listEntradas',
		CBSUCCESS: (products) => {
			d.querySelector('.loader').remove();
			listProducts = products;
			if (listProducts.length > 0) {
				show();
				filterInputs($table, $search, listProducts);
			} else {
				removeItems();
			}
			calcTam();
		},
		CBERROR: (error) => {},
	});

	$search.addEventListener('keyup', () => {
		if (listProducts.length > 0) {
			show();
			filterInputs($table, $search, listProducts);
		} else {
			removeItems();
		}
	});

	function removeItems() {
		d.getElementById('divSearch').remove();
		d.getElementById('divTable').remove();
		d.getElementById('alertasEntradas').insertAdjacentHTML(
			'beforeend',
			`
		<div class="row justify-content-center mt-md-3">
        <div class="col-12 col-md-6 px-md-0">
            <div class="alert alert-info py-5" role="alert">
                <h4 class="alert-heading text-center pb-md-3">¡Aún no tiene Entradas!</h4>
                <p class="text-justify">En esta parte se mostarán todas las entradas de productos registradas en el día. Para poder registrar una entrada, ir al
                    botón rojo que dice: <strong>Agregar entrada</strong>.</p>
                <p class="text-justify">Una vez le de click en el botón, lo llevará a la sección de <strong>agregar una entrada</strong>.
                    Allí debe seleccionar <strong>el producto</strong>, el <strong>precio</strong> y la <strong>cantidad</strong>.
                </p>
            </div>
        </div>
    </div>
		`
		);
	}

	function show() {
		const $show = d.querySelectorAll('.ocultar');
		$show.forEach((el) => {
			el.classList.remove('d-none');
		});
	}
}
