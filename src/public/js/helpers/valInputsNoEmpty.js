export function valInNoEmpty($divFinally, listProducts) {
	if ($divFinally) $divFinally.remove();
	return listProducts.length > 0 ? true : false;
}
