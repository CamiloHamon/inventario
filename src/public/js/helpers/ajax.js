const ajax = {};

ajax.productsMenu = async (props) => {
	const { URL, CBSUCCESS } = props;
	try {
		const RES = await axios.get(URL),
			JSON = await RES.data;
		CBSUCCESS(JSON);
	} catch (error) {
		const MESSAGE = error.statusText || 'Ocurrio un error';
		document
			.getElementById('products-table')
			.insertAdjacentHTML(
				'afterend',
				`<p><b>Error ${error.status}: ${MESSAGE}</b></p>`
			);
		console.log(error);
	}
};

ajax.registerProducts = (props) => {
	const { URL, listProducts, clients, observations, CBSUCCESS, CBERROR } =
		props;

	axios({
		method: 'post',
		url: URL,
		data: {
			listProducts,
			clients,
			observations,
		},
	})
		.then(function (response) {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.endTurn = async (URL) => {
	try {
		await axios.post(URL);
	} catch (error) {
		const MESSAGE = error.statusText || 'Ocurrio un error';
		const $div = document.getElementById('products-table');
		if ($div) {
			$div.insertAdjacentHTML(
				'afterend',
				`<p><b>Error ${error.status}: ${MESSAGE}</b></p>`
			);
		}

		console.log(error);
	}
};

ajax.listLoans = async (props) => {
	const { URL, CBSUCCESS, CBERROR } = props;
	try {
		const RES = await axios.get(URL),
			JSON = await RES.data;
		CBSUCCESS(JSON);
	} catch (error) {
		CBERROR(error);
		//console.log(error);
	}
};

ajax.registerPay = (props) => {
	const { URL, idUser, amount, loans, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data: {
			idUser,
			amount,
			loans,
		},
	})
		.then(function (response) {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.delLoanPay = (props) => {
	const { URL, idUser, idLoan, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data: {
			idUser,
			idLoan,
		},
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.updateLoanPay = (props) => {
	const { URL, price, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data: {
			price,
		},
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.checkCashBox = (props) => {
	const { URL, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};


ajax.saveCashBox = (props) => {
	const { URL, price, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data: {
			price,
		},
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.saldar = (props) => {
	const { URL, trust, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data: {
			trust,
		},
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

ajax.createProduct = (props) => {
	const { URL, data, CBSUCCESS, CBERROR } = props;

	axios({
		method: 'post',
		url: URL,
		data,
	})
		.then((response) => {
			CBSUCCESS(response);
		})
		.catch((err) => {
			CBERROR(err);
		});
};

export default ajax;
