const db = require('../database/connection');

const productSpecial = {};

productSpecial.findByIdProd = async (idProduct) => {
	const product = await db.query(
		`SELECT pe.fk_idProductCaseSpecial AS idProduct, pe.amount FROM detailsprodcasespecial pe WHERE pe.idProduct = ${idProduct}`
	);

	return product;
};

productSpecial.insertProdSpecial = async () => {
	const product = await db.query(
		`INSERT INTO productcasespecial (idproductCaseSpecial) VALUES (NULL)`
	);
	return product;
};

productSpecial.insertDetails = async (idProduct, amount, idCaseSpecial) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO detailsprodcasespecial (idDetailsProdCaseSpecial, idProduct, amount, fk_idProductCaseSpecial) VALUES (NULL, '${idProduct}', '${amount}', '${idCaseSpecial}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

module.exports = productSpecial;
