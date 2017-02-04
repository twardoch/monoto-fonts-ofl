// Def functions

var mnt = mnt || {};

mnt.init = function() {
	var _self = this;

	_self.settings.init();
};

mnt.methods = {
	init: function() {
		var _self = this;

		_self.toggleClass();
	},
	toggleClass: function(elementID, className, elementWithClass) {
		elementWithClass = elementWithClass || elementID;
		document.querySelector(elementID).addEventListener('click', function() {
			document.querySelector(elementWithClass).classList.toggle(className);
		});
	},
	setInputsValue: function() {
		document.querySelectorAll('.range').forEach(function(element) {
			element.setAttribute('data-value', element.value);
		});
	}
};

mnt.settings = {
	init: function() {
		mnt.methods.setInputsValue();
		
		// Open settings menu
		mnt.methods.toggleClass('#settingsButton', 'open', '#settingsWrapper');
	}
};

// Start everything
mnt.init();