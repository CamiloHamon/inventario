const endTurn = {};

endTurn.end = async (idUser) => {
	let result = false;
	const turns = JSON.parse(localStorage.getItem('turnos'));

	for (let i = 0; i < turns.length; i++) {
		if (turns[i].idUser === idUser) {
			turns.splice(i, 1);
		}
	}

	localStorage.setItem('turnos', JSON.stringify(turns));
	result = true;

	return result;
};

module.exports = endTurn;
