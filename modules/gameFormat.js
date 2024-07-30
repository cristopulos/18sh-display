"use strict"

const dataFormat = require("./dataFormat")

module.exports = (title, data) => {
	let css = require("../css/style")()

	const content = dataFormat(title, data)

	return `
	<html>
		<head>
			<title>18SH: ${title}</title>
			<style type="text/css">${css}</style>
		</head>
		<body>
			<div id="content">
				${content}
			</div>
			<script type="text/javascript">
				let orderCounter = -1

				function setOrder(target) {
					target.target.parentNode.style.order = orderCounter
					orderCounter--
				}

				function createItem(key) {
					let item = document.createElement('div')
					let name = item.appendChild(document.createElement('div'))
					let cash = item.appendChild(document.createElement('div'))
					let value = item.appendChild(document.createElement('div'))
					const className = key.replace(/[^\\w\\d]/g, "_")
					item.id = className
					item.className = 'item'
					name.className = 'name ' + className
					name.innerHTML = key
					cash.className = 'cash'
					value.className = 'value'
					return item
				}

				const items = document.getElementsByClassName("item")
				for (let item of items) {
					item.addEventListener("click", setOrder)
				}

				function fetchData() {
					const request = new XMLHttpRequest()

					request.addEventListener('load', function () {
						if (this.readyState === 4 && this.status === 200) {

							const showNetworth = document.getElementById("networth").checked;
							const showShareSize = document.getElementById("sharesize").checked;

							const jsonData = JSON.parse(this.responseText)
							document.getElementById("round").innerHTML = jsonData.round
							const jsonItems = Object.keys(jsonData.cash)
							for (let item of jsonItems) {
								const element = document.getElementById(item)
								if ( element != null ) {
									element.childNodes.forEach((node) => {
										if(node.className === 'cash')
											node.innerHTML = jsonData.currency + jsonData.cash[item].cash
										else if (node.className === 'value')
										{
											if(jsonData.cash[item].value && showNetworth)
												node.innerHTML = "(" + jsonData.currency + jsonData.cash[item].value + ")"
											else
												node.innerHTML = ""
										}
										else if (node.className === 'name ' + item)
										{
											if(jsonData.cash[item].sharesize && showShareSize)
												node.innerHTML = item + "<div class='sharesize'>(" + jsonData.cash[item].sharesize + ")</div>"
											else
												node.innerHTML = item
										}
										})
								} else {
									const newElement = createItem(item)
									const parent = document.getElementById("grid")
									parent.appendChild(newElement)
								}
							}
							const gridNodes = document.getElementById("grid").childNodes
							for (let item of gridNodes) {
								const itemKey = item.childNodes[0].innerHTML
								if (! jsonItems.includes(itemKey)) {
									document.getElementById(itemKey).remove()
								}
							}
							const today = new Date()
							const time =
								today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
							document.getElementById("time").innerHTML = time
						}
					});

					request.open('GET', '/18sh/data/${title}', true)
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
					request.send()
				}

				window.setInterval( fetchData, 500 )

			</script>
		</body>
	</html>
	`.trim()
}
