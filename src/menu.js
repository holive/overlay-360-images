function createMenuFromSchema(schema) {
	const htmlElement = schemaToHtml(schema);

	document.getElementById("mySidenav").appendChild(htmlElement);
	document.getElementById("mySidenav").style.width = "250px";
	document.querySelector('input').classList.add('hide')
}

function schemaToHtml(obj) {
	const ul = document.createElement('ul');

	for (const key in obj) {
		const li = document.createElement('li');
		li.classList.add('room');

		const p = document.createElement('p');
		p.textContent = key;
		li.appendChild(p);

		const innerObj = obj[key];
		const innerKeys = Object.keys(innerObj);

		if (innerKeys.length > 0) {
			const innerUl = document.createElement('ul');

			for (const innerKey of innerKeys) {
				const innerArray = innerObj[innerKey];

				const innerLi = document.createElement('li');
				innerLi.classList.add('item');
				innerLi.textContent = innerKey;

				const innerUl2 = document.createElement('ul');

				for (const attribute of innerArray) {
					const innerLi2 = document.createElement('li');
					innerLi2.classList.add('attribute');
					innerLi2.textContent = attribute.replace('.png', '');
					innerLi2.setAttribute('data-image', [key, innerKey, attribute].join('_'))

					innerLi2.addEventListener('click', onAttributeClick({key, innerKey, attribute}))
					innerUl2.appendChild(innerLi2);
				}

				innerLi.appendChild(innerUl2);
				innerUl.appendChild(innerLi);
			}

			li.appendChild(innerUl);
		}

		ul.appendChild(li);
	}

	return ul;
}

function onAttributeClick({key, innerKey, attribute}) {
	return ({target}) => {
		const sceneItem = [key, innerKey].join('_')
		const aSky = document.querySelector(`a-sky[data-image="${[sceneItem, attribute].join('_')}"]`)

		const siblings = document.querySelectorAll(`a-sky[data-image^="${sceneItem}"]`);
		siblings.forEach(sibling => {
			if (String(sibling.getAttribute('data-image')) != target.getAttribute('data-image')) {
				sibling.setAttribute('material', 'opacity', 0);
			}
		});

		const opacity = aSky?.getAttribute('material')?.opacity
		aSky?.setAttribute('material', 'opacity', opacity ? 0 : 1)
	}
}

function bindActiveStateToMenuItems() {
	const attributeElements = document.querySelectorAll('.attribute');

	attributeElements.forEach(function (attributeElement) {
		attributeElement.addEventListener('click', function () {
			const parent = this.parentNode;
			const siblings = parent.children;

			for (let i = 0; i < siblings.length; i++) {
				const sibling = siblings[i];
				if (sibling != this) {
					sibling.classList.remove('active');
				}
			}

			this.classList.toggle('active');
		});
	});
}

export {bindActiveStateToMenuItems, createMenuFromSchema}