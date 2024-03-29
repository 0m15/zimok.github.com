
if (typeof jQuery != "undefined" && jQuery && jQuery.fn) {
	jQuery.fn.pixastic = function(action, options) {
		var newElements = [];
		this.each(
			function () {
				var res = Pixastic.process(this, action, options);
				if (res) {
					newElements.push(res);
				}
			}
		);
		if (newElements.length > 0)
			return jQuery(newElements);
		else
			return this;
	};

};
