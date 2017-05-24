// Def functions
var mnt = mnt || {};

mnt.init = function() {
	var _self = this;

    _self.settingsSection.init();
	_self.methods.init();
};

mnt.consts = {
	outputTagForStyles: 'body',
	boldElements: ['.hljs-keyword', '.hljs-attribute', '.hljs-selector-tag', '.hljs-meta-keyword', '.hljs-doctag', '.hljs-name', '.hljs-title', '.hljs-section', 'strong', 'b'],
	fontVariationSettings: 'font-variation-settings',
	fontFeatureSettings: 'font-feature-settings',
	documentParts: ['header', 'body']
};

mnt.fonts = {};

adtFonts = {
	'Monoto-VF.woff': {
		'line-height': 1.19
	}
};

mnt.elements = {
	jsCustomStylesheet: document.getElementById('jsCustomStylesheet').sheet,
	rangeInputs: document.getElementsByClassName('range-input')
};

mnt.helpers = {
    /**
	 * Checks if CSS property is supported
     * @param {string} property
     * @returns {boolean}
     */
    isPropertySupported: function(property) {
        return property in document.body.style;
    },

    /**
	 * Returns string for bold font variant
     * @param {string} fontSettings
     * @param {string} fontName
	 * @returns {string}
     */
    getFontVariationBold: function(fontSettings, fontName) {
        return mnt.fonts[fontName]['bold'] ? fontSettings.replace(/^(.*?"wght" )([\d.]*)(.*)$/, '$1' + mnt.fonts[fontName]['bold'] + '$3') : null;
    },

    /**
	 * Builds a string with complete CSS rule
     * @param {string} selector
     * @param {string} property
     * @param {string|number} value
     * @returns {string}
     */
    setCssRule: function(selector, property, value) {
        return selector + ' { ' + property + ': ' + value + '; }';
    },

    /**
	 * Builds font variation settings array and sets value for bold
     * @returns {Array}
     */
    buildFontVariationSettings: function() {
        var fonts = mnt.fonts,
            fontSettings = [],
            font;

        for (font in fonts) {
            if (fonts.hasOwnProperty(font)) {
                var fontVariation = fonts[font].variation,
                    axis,
                    value;

                for (axis in fontVariation) {
                    if (fontVariation.hasOwnProperty(axis)) {
                        value = fontVariation[axis]['value'] || fontVariation[axis]['default'];
                        fontSettings.push('"' + axis + '" ' + value);
                        if (axis === 'wght') {
                            fonts[font].bold = mnt.helpers.setWghtAxisBoldValue(value, fontVariation[axis]['max']);
                        }
                    }
                }
            }
        }

        return fontSettings;
    },

    /**
	 * Sets bold weight value
     * @param {number} value
     * @param {number} maxValue
     * @returns {number}
     */
    setWghtAxisBoldValue: function(value, maxValue) {
        return value + (maxValue - value) * 0.6;
    }
};

mnt.methods = {
	init: function() {
		var _self = this;

		_self.incompatibilityInform();
        _self.getFontObject(['./fonts/Monoto-VF.woff'], mnt.methods.updateFontsObject);
	},

    /**
	 * Fires an alert for users with incompatible browsers
     */
	incompatibilityInform: function() {
		if (!mnt.helpers.isPropertySupported('fontVariationSettings')) {
			alert('Whoa, hold your horses Dude! Your browser doesn\'t support core fuctionality: font-variation-settings! \nSwitch to Webkit Nightly browser to check out this cool cutting-edge feature! \n** At least you can still play with settings sliders ;) **');
			console.log('Whoa, hold your horses Dude! Your browser doesn\'t support core fuctionality: font-variation-settings! \nSwitch to Webkit Nightly browser to check out this cool cutting-edge feature! \n** At least you can still play with settings sliders ;) **');
		}
	},

	// TODO: do it better
	toggleClass: function(elementID, className, elementWithClass) {
		elementWithClass = elementWithClass || elementID;
		document.querySelector(elementID).addEventListener('click', function() {
			document.querySelector(elementWithClass).classList.toggle(className);
		});
	},

    /**
	 * Updates value and position of output. Saves value to the font object.
     * @param {Element} element
     */
	updateOutputTag: function(element) {
		var children = element.parentNode.children,
			rangeThumbWidth = 10,
			width = element.offsetWidth - rangeThumbWidth,
			newPointPosition = (element.value - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min')),
			outputTag;

        newPointPosition = (!(newPointPosition < 0) && !(newPointPosition > 1)) ? width * newPointPosition : ((newPointPosition < 0) ? 0 : width);
		
		for (var index = 0; index < children.length; index++) {
			if (children[index].tagName.toLowerCase() === 'output') {
				mnt.fonts[element.dataset.fontName].variation[element.name].value = element.value;
				outputTag = children[index];
				outputTag.value = element.value;
				outputTag.style.left = newPointPosition + "px";
            }
		}
	},

    /**
	 * Builds inputs for font variation settings and font feature settings
     * @param {Object} fontProperty
     * @param {string} fontName
     */
	buildInputs: function(fontProperty, fontName) {
		var inputsSectionId = fontName + '-settings',
			inputsSection = document.getElementById(inputsSectionId),
			axis;

		if (typeof fontProperty !== 'object') {
			return;
		}

		if (!inputsSection) {
            inputsSection = document.createElement('ul');
            inputsSection.id = inputsSectionId;
            document.getElementById('settingsSection').appendChild(inputsSection);
		}

		if (Object.prototype.toString.call(fontProperty) === '[object Array]') {
			console.log('it\'s an array');
			return;
		}

		for (axis in fontProperty) {
			if (fontProperty.hasOwnProperty(axis)) {
				var listNode = document.createElement('li'),
					input = document.createElement('input'),
					output = document.createElement('output'),
					label = document.createElement('label'),
					fragment = document.createDocumentFragment();

				listNode.classList.add('input-set', 'range');

				output.classList.add('range-value');
				output.value = fontProperty[axis].default;

				input.classList.add('range-input');
				input.id = fontName + '-' + axis;
				input.setAttribute('data-font-name', fontName);
				input.name = axis;
                input.type = 'range';
                input.min = fontProperty[axis].min;
                input.max = fontProperty[axis].max;
                input.value = fontProperty[axis].default;

				label.classList.add('range-label');
				label.htmlFor = fontName + axis;
				label.innerText = axis;

                fragment.appendChild(output);
                fragment.appendChild(input);
                fragment.appendChild(label);
				inputsSection.appendChild(listNode).appendChild(fragment);
				mnt.methods.updateOutputTag(input);
			}
		}
	},

    /**
	 * Adds input listener for range inputs
     */
	inputsValueListener: function() {
		Array.prototype.forEach.call(mnt.elements.rangeInputs, function(element) {
			element.addEventListener('input', function() {
				mnt.methods.updateOutputTag(this);
				mnt.methods.setFontSettingsStyles(this.dataset.fontName);
			}, false);
		});
	},

    /**
	 * Injects styles to CSS variables
     * @param {string} fontName
     */
	setFontSettingsStyles: function(fontName) {
        if (!fontName) {
            throw new Error('Font name is empty');
        }

		var fontSettings = mnt.helpers.buildFontVariationSettings().join(', '),
			stylesheet = mnt.elements.jsCustomStylesheet,
			selector = ':root',
			cssVarFVS = '--' + mnt.consts.fontVariationSettings,
			cssVarFVSB = '--' + mnt.consts.fontVariationSettings + '-bold',
			fontSettingsBold = mnt.helpers.getFontVariationBold(fontSettings, fontName),
			insertFontVariationSettingsCssRule = function() {
                stylesheet.insertRule(
                    mnt.helpers.setCssRule(
                        selector,
                        cssVarFVS,
                        fontSettings
                    ), stylesheet.cssRules.length
                );

                stylesheet.insertRule(
                    mnt.helpers.setCssRule(
                        selector,
                        cssVarFVSB,
                        fontSettingsBold
                    ), stylesheet.cssRules.length
                );
            };

		if (!stylesheet.cssRules.length) {
            insertFontVariationSettingsCssRule();
            return;
		}

        for (var index = 0; index < stylesheet.cssRules.length; index++) {
            if (stylesheet.cssRules[index].selectorText === selector && stylesheet.cssRules[index].style[0] === cssVarFVS) {
                stylesheet.cssRules[index].style.cssText = cssVarFVS + ': ' + fontSettings;
            }
            if (stylesheet.cssRules[index].selectorText === selector && stylesheet.cssRules[index].style[0] === cssVarFVSB) {
                stylesheet.cssRules[index].style.cssText = cssVarFVSB + ': ' + (fontSettingsBold ? fontSettingsBold : fontSettings);
            }
        }
	},

    /**
	 * Gets and parses font to object
     * @param {Array} fontPathArray
     * @param {function} callback
     */
	getFontObject: function(fontPathArray, callback) {
		var xhr = new XMLHttpRequest(),
			fontInfo;

		for (var index = 0; index < fontPathArray.length; index++) {
            xhr.open('GET', fontPathArray[index]);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var fkBlob = this.response,
                        fkBuffer = new Buffer(fkBlob);
                    fontInfo = fontkit.create(fkBuffer);
                    callback.apply(this, [fontInfo]);
                }
            };

            xhr.send();
		}
	},

    /**
	 * Extracts necessary info from font object and fills mnt.fonts object
     * @param fontInfo
     */
	updateFontsObject: function(fontInfo) {
        var lineHeight,
			fontInfo_OS2 = fontInfo['OS/2'];

        if (fontInfo_OS2) {
        	lineHeight = (fontInfo_OS2.typoAscender - fontInfo_OS2.typoDescender + fontInfo_OS2.typoLineGap) / fontInfo.head.unitsPerEm;
        } else {
        	lineHeight = (fontInfo.hhea.ascent - fontInfo.hhea.descent + fontInfo.hhea.lineGap) / fontInfo.head.unitsPerEm;
        }

        mnt.fonts[fontInfo.postscriptName] = {
        	'line-height': lineHeight || 1.2,
			variation: fontInfo.variationAxes,
			feature: fontInfo.availableFeatures
        };

        mnt.methods.setFontSettingsStyles(fontInfo.postscriptName);
        mnt.methods.buildSettingsSection(fontInfo.postscriptName);
        mnt.methods.inputsValueListener();
	},

    // TODO: rebuild to set FFS properly
    getFontFeatureSettings: function(fontAxes) {
        var fontAxesObj = {};

        for (var index = 0; index < fontAxes.length; index++) {
            var axis = fontAxes[index];

            fontAxesObj[axis.axisTag] = {
                defaultValue: axis.defaultValue,
                minValue: axis.minValue,
                maxValue: axis.maxValue
            };
        }
        return fontAxesObj;
    },

    /**
	 * Builds settings section
     * @param {string} fontName
     */
	buildSettingsSection: function(fontName) {
		var fontNameSelect = document.getElementById('fontName'),
            radio = document.createElement('input'),
            label = document.createElement('label'),
			fonts = mnt.fonts[fontName],
			font;
		if (!fontNameSelect) {
            fontNameSelect = document.createElement('fieldset');
            fontNameSelect.id = 'fontName';
			document.getElementById('settingsSection').appendChild(fontNameSelect);
		}
		label.innerHTML = fontName;
		label.htmlFor = fontName;
		radio.type = 'radio';
		radio.id = fontName;
        radio.value = fontName;
        radio.innerHTML = fontName;
        fontNameSelect.appendChild(radio);
        fontNameSelect.appendChild(label);

        for (font in fonts) {
        	if (fonts.hasOwnProperty(font)) {
                mnt.methods.buildInputs(fonts[font], fontName);
			}
		}
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
document.addEventListener('DOMContentLoaded', function() {
	mnt.init();
});