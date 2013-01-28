L.SLMarkers = L.Class.extend({
    initialize: function() {
    },

    onAdd: function (map) {
	this._map = map;

	this._initContainer();
	this._setPosition();
    },

    onRemove: function(map) {
    },

    _setPosition: function() {
	var pos = this._map.getCenter();
	L.DomUtil.setPosition(this._el, pos);
    },

    _initContainer: function() {
	var el = L.DomUtil.create('div', 'slmarker-cross', this._map._container);

	el.style.backgroundImage = "url(images/cross.png)";
	el.style.zIndex = "10000";
	el.style.width = "200px";
	el.style.height = "200px";
	el.style.marginTop = "-100px";
	el.style.marginLeft = "-100px";
	el.style.position = "absolute";
	el.style.top = "50%";
	el.style.left = "50%";

	this._el = el;
    }
});
