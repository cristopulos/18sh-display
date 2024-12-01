"use strict"

module.exports = (title, data) => {
	let css = require("../css/style")(data.style)

	const round = data.round
	const currencySymbol = data.currency

	const cashHoldings = Object.keys(data.cash).map(key => {
		let cash = currencySymbol + data.cash[key].cash
		let value = `<div class="value"></div>`;
		if (data.cash[key].value) {
			value = `<div class="value">(` + currencySymbol + data.cash[key].value + ")</div>"
		}

		let sharesize = "";
		if (data.cash[key].sharesize) {
			sharesize = `<div class="sharesize">(` + data.cash[key].sharesize + `)</div>`
		}
		const className = key.replace(/[^\w\d]/g, "_")
		return `<div class="item" id="${className}"><div class="name ${className}">${key}${sharesize}</div><div class="cash">${cash}</div>${value}</div>`
	})
	const cashHTML = cashHoldings.join("")

	const today = new Date()
	const time =
		today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

	const topBarContent = `
	Pro tip: Zoom in in the browser until the boxes fill up screen nicely. Click an item to move it first on the list. Last refresh: <span id="time">${time}</span> <input type="checkbox" id="networth" name="networth" checked/><label for="networth">Show Networth</label> | <input type="checkbox" id="sharesize" name="sharesize"/><label for="sharesize">Show Company share sizes</label>
	`.trim()

	return `
		<div id="topbar">
			<h1>${title}</h1> <span class="round" id="round">${round}</span> <span>${topBarContent}</span>
		</div>
		<div id="grid">${cashHTML}</div>
	`.trim()
}
