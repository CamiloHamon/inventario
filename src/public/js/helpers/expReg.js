export function expReg(text) {
	let result = false;
	const exR = /^([1-9])(([0-9]){1,2})?([*]([1-9])([0-9]{1,2})?)?$/;
	if (exR.test(text)) result = true;
	return result;
}
