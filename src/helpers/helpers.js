const helper = {};

helper.decimal = (price) => {
	return new Intl.NumberFormat().format(price);
};

module.exports = helper;
