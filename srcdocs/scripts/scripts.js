// Def functions
var mnt = mnt || {};

mnt.init = function() {
	var _self = this;

	_self.methods.init();
	_self.settingsSection.init();
};

mnt.variables = {
	outputTagForStyles: 'body',
	boldElements: ['.hljs-keyword', '.hljs-attribute', '.hljs-selector-tag', '.hljs-meta-keyword', '.hljs-doctag', '.hljs-name', '.hljs-title', '.hljs-section', 'strong', 'b'],
	fontVariationSettings: 'font-variation-settings',
	fontFeatureSettings: 'font-feature-settings'
};

mnt.font = {
	variation: {},
	feature: {},
	properties: {
		wght: 'wght'
	},
	bold: 0
}

adtFonts = {
	'Monoto-VF.woff': {
		'line-height': 1.19
	}
}

mnt.elements = {
	jsCustomStylesheet: document.getElementById('jsCustomStylesheet').sheet,
	rangeInputs: document.getElementsByClassName('range-input')
};

mnt.methods = {
	init: function() {
		var _self = this;

		_self.incompatibilityInform();
		_self.setInputsValue();
		_self.inputsValueListener();
	},

	isPropertySupported: function(property) {
		return property in document.body.style;
	},

	incompatibilityInform: function() {
		if (!mnt.methods.isPropertySupported('fontVariationSettings')) {
			alert('Whoa, hold your horses Dude! Your browser doesn\'t support core fuctionality: font-variation-settings! \nSwitch to Webkit Nightly browser to check out this cool cutting-edge feature! \n** At least you can still play with settings sliders ;) **');
			console.log('Whoa, hold your horses Dude! Your browser doesn\'t support core fuctionality: font-variation-settings! \nSwitch to Webkit Nightly browser to check out this cool cutting-edge feature! \n** At least you can still play with settings sliders ;) **');
		}
	},

	toggleClass: function(elementID, className, elementWithClass) {
		elementWithClass = elementWithClass || elementID;
		document.querySelector(elementID).addEventListener('click', function() {
			document.querySelector(elementWithClass).classList.toggle(className);
		});
	},
	// Gets input value and passes it to output
	updateOutputValue: function(element) {
		var children = element.parentNode.children,
			rangeThumbWidth = 10,
			width = element.offsetWidth - rangeThumbWidth,
			newPoint = (element.value - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min')),
			newPlace,
			outputTag;
		
		newPlace = (!(newPoint < 0) && !(newPoint > 1)) ? width * newPoint : ((newPoint < 0) ? 0 : width);
		
		for (var index = 0; index < children.length; index++) {
			if (children[index].tagName.toLowerCase() === 'output') {
				mnt.font.variation[element.id] = element.value;
				outputTag = children[index];
				outputTag.value = mnt.font.variation[element.id];
				outputTag.style.left = newPlace + "px";
			}
		}
	},
	// Check initial values of range inputs and updates the output values
	setInputsValue: function() {
		Array.prototype.forEach.call(mnt.elements.rangeInputs, function(element) {
			mnt.methods.updateOutputValue(element);
			mnt.methods.setFontSettingsStyles();
		});
	},
	// Adds input listener for range inputs
	inputsValueListener: function() {
		Array.prototype.forEach.call(mnt.elements.rangeInputs, function(element) {
			element.addEventListener('input', function() {
				mnt.methods.updateOutputValue(this);
				mnt.methods.setFontSettingsStyles();
			}, false);
		});
	},
	getFontVariationBold: function(fontSettings) {
		return fontSettings.replace(/^(.*?"wght" )([\d.]*)(.*)$/, '$1' + mnt.font.bold + '$3');
	},
	getCssRule: function(selector, property, value) {
		return selector + ' { ' + property + ': ' + value + '; }';
	},
	getFontSettings: function(settingsType) {
		var fontSettings = [],
			key,
			value;

		for ( key in mnt.font[settingsType] ) {
			if ( mnt.font[settingsType].hasOwnProperty( key ) ) {
				value = mnt.font[settingsType][ key ];
				fontSettings.push( '"' + key + '" ' + value );
				if ( key === mnt.font.properties.wght ) {
					mnt.font.bold = parseInt(value) + (document.getElementById(mnt.font.properties.wght).max - value) * 0.6;
				}
			}
		}

		return fontSettings;
	},
	setFontSettingsStyles: function() {
		var fontSettings = mnt.methods.getFontSettings('variation').join(', '),
			stylesheet = mnt.elements.jsCustomStylesheet;
		
		// for ( var index = stylesheet.cssRules.length - 1; index >= 0; index-- ) {
		// 	if ( stylesheet.cssRules[index].style['0'] === mnt.variables.fontVariationSettings) {
		// 		stylesheet.deleteRule(index);
		// 	}
		// }

		// if (!mnt.methods.isPropertySupported(mnt.variables.fontVariationSettings)) {
		// 	return false;
		// }

		// stylesheet.insertRule(
		// 	mnt.methods.getCssRule(
		// 		mnt.variables.outputTagForStyles, 
		// 		mnt.variables.fontVariationSettings, 
		// 		fontSettings
		// 	), stylesheet.cssRules.length );
		
		// stylesheet.insertRule(
		// 	mnt.methods.getCssRule(
		// 		mnt.variables.boldElements.join(', '), 
		// 		mnt.variables.fontVariationSettings, 
		// 		mnt.methods.getFontVariationBold(fontSettings)
		// 	), stylesheet.cssRules.length );

		stylesheet.insertRule(
			mnt.methods.getCssRule(
				':root', 
				'--' + mnt.variables.fontVariationSettings, 
				fontSettings
			), stylesheet.cssRules.length
		);

		stylesheet.insertRule(
			mnt.methods.getCssRule(
				':root', 
				'--' + mnt.variables.fontVariationSettings + '-bold', 
				mnt.methods.getFontVariationBold(fontSettings)
			), stylesheet.cssRules.length 
		);
	},
	adtLoadPanel: function(fkFontPath) {
		console.log('function begin');
		var xhr = new XMLHttpRequest();
		xhr.open('GET', fkFontPath, true);
		xhr.responseType = 'arraybuffer';

		var fkFont = null;

		xhr.onload = function() {
			console.log('onload');
			if (xhr.readyState == 4) {
				console.log('sth');
				var fkBlob = this.response;
				console.log(this.response);
				var fkBuffer = new Buffer(fkBlob);
				console.log(fkBuffer);
				fkFont = fontkit.create(fkBuffer);
				console.log(fkFont.postscriptName);
				console.log('fkFont.postscriptName');
			}
		}

	  xhr.send();
	}
};

mnt.settingsSection = {
	init: function() {
		// Open settings menu
		// TODO: optimize!
		mnt.methods.toggleClass('#settingsButton', 'open', '#settingsWrapper');
		mnt.methods.toggleClass('#settingsButton', 'open', '.console-content');
	}
};

// Start everything
document.addEventListener("DOMContentLoaded", function() {
	mnt.init();
	mnt.methods.adtLoadPanel('./fonts/Monoto-VF.woff');
});