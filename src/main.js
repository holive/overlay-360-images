import {createMenuFromSchema, bindActiveStateToMenuItems} from './menu'
import './style.css'

let imageData = {}
let schema = {}
let files

window.addEventListener("load", () => {
	readFilesAndCreateSchema()
	loadInitialData()
});

function readFilesAndCreateSchema() {
	const imageInput = document.getElementById('image-input');

	imageInput.addEventListener('change', (event) => {
		files = event.target.files;
		readFilesAndGetImageData(files, imageData)

		schema = buildSchemaFromFileNames(files)
		createMenuFromSchema(schema)
		bindActiveStateToMenuItems()
	});
}

function createSprites(schema, imageData, scene) {
	Object.keys(schema[scene]).forEach((key) => {
		schema[scene][key].forEach((item) => {
			const aSky = document.createElement('a-sky');
			const imgName = [scene, key, item].join('_')

			if (!imageData[imgName]) {
				console.log("image data not found:", imgName)
				return
			}

			aSky.setAttribute('src', imageData[imgName]);
			aSky.setAttribute('data-image', imgName)
			aSky.setAttribute('material', 'alphaTest:1;transparent:true;opacity:0')
			aSky.setAttribute('rotation', '0 -130 0')

			document.getElementById('scene').appendChild(aSky)
		})
	})
}

function loadInitialData() {
	const targetNode = document.getElementById('scene');

	function callback(mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-ready') {
				observer.disconnect();

				const checkImageData = setInterval(() => {
					if (Object.keys(imageData).length == files.length) {
						clearInterval(checkImageData);

						const scene = Object.keys(schema)[0]
						changeBg(imageData, scene)
						createSprites(schema, imageData, scene)
					}
				}, 100);
			}
		}
	}

	const observer = new MutationObserver(callback);
	observer.observe(targetNode, {attributes: true, attributeFilter: ['data-ready']});
}

function changeBg(imgData, imgName) {
	document.getElementById('bg').setAttribute('src', imgData[`${imgName}.jpg`])
}

function readFilesAndGetImageData(files, imageData) {
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
			imageData[file.name] = event.target.result

			if (i == files.length - 1) {
				document.getElementById('scene').setAttribute('data-ready', true)
			}
		});
		reader.readAsDataURL(file);
	}
}

function buildSchemaFromFileNames(files) {
	let scenes = {}
	let sprites = []

	Object.values(files).map((f) => {
		if (f.name.includes('.png')) sprites.push(f.name)
	})

	sprites.map((sprite) => {
		const [scene, item, attribute] = sprite.split('_')

		if (!scenes[scene]) {
			scenes[scene] = {}
		}

		if (!Array.isArray(scenes[scene][item])) {
			scenes[scene][item] = []
		}

		scenes[scene][item].push(attribute)
	})

	return scenes
}

