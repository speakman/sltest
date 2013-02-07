L.Control.SLMarkers = L.Control.extend({
    options: {
        position: 'topright'
    },

    markerTypes: [
        { name: 'snowmobile', title: "Information om skoterled" },
        { name: 'info', title: "Allmän information" },
        { name: 'blocking', title: "Blockerad skoterled" },
        { name: 'warning', title: 'Varning, fara!' },
        { name: 'maperror', title: 'Rapportera kartfel' },
        { name: 'cancel', title: 'Avbryt' }
    ],

    onAdd: function (map) {
        this._state = 0;
        this._map = map;
        this._initContainer();
        return this._markerAddButton();
    },

    onRemove: function(map) {
    },

    _markerAddButton: function() {
        var className = 'moreinfo';
        var wrapper = L.DomUtil.create('div', className);
        var link = L.DomUtil.create('a', className, wrapper);
        var text = document.createTextNode("Lägg till markör");
        var _this = this;

        link.href="#";
        link.title = "Lägg till markör";
        link.appendChild(text);

        L.DomEvent.on(link, 'click', function () {
            if (_this._state == 0) {
                _this._state = 1;
            } else {
                _this._state = 0;
            }
            _this._syncState();
        });

        return wrapper;
    },

    _createButton: function (className, text) {
        var button = L.DomUtil.create(
            'button', 'slmarkers-button slmarkers-button-' + className);
        var textElement = document.createTextNode(text);

        button.appendChild(textElement);

        return button;
    },

    _initCoordinatesFrame: function (parent) {
        var _this = this;

        var frame = L.DomUtil.create(
            'div', 'slmarkers-infoframe-content ' +
                'slmarkers-content-coordinates', parent);

        var el = L.DomUtil.create(
            'div', 'slmarkers-infoframe-content-wrapper', frame);

        var infoText = L.DomUtil.create('h2', 'slmarkers-info-text', el);
        infoText.appendChild(document.createTextNode(
            'Välj position med krysset'));

        var okButton = this._createButton('setmark', 'Fortsätt');
        var cancelButton = this._createButton('cancel', 'Avbryt');

        L.DomEvent.on(okButton, 'click', function () {
            _this._state++;
            _this._syncState();
        });

        L.DomEvent.on(cancelButton, 'click', function () {
            _this._state = 0;
            _this._syncState();
        });

        el.appendChild(okButton);
        el.appendChild(cancelButton);

        return frame;
    },

    _initMarkerTypeFrame: function (parent) {
        var _this = this;
        var frame = L.DomUtil.create(
            'div', 'slmarkers-infoframe-content ' +
                'slmarkers-content-type', parent);

        var el = L.DomUtil.create(
            'div', 'slmarkers-infoframe-content-wrapper', frame);

        var infoText = L.DomUtil.create('h2', 'slmarkers-info-text', el);
        infoText.appendChild(document.createTextNode(
            'Välj typ av markering'));

        for (var i = 0; i < this.markerTypes.length; i++) {
            var name = this.markerTypes[i].name;
            var title = this.markerTypes[i].title;

            var button = this._createButton(name, title);
            L.DomEvent.on(button, 'click', function () {
                _this._state = 0;
                _this._syncState();
            });

            el.appendChild(button);
        }

        return frame;
    },

    _initContainer: function() {
        this._frames = {};
        this._frames.crossHair =
            L.DomUtil.create('div', 'slmarkers-cross', this._map._container);
        this._frames.infoFrame =
            L.DomUtil.create('div', 'slmarkers-infoframe', this._map._container);
        this._frames.contentCoordinates = this._initCoordinatesFrame(this._frames.infoFrame);
        this._frames.contentType = this._initMarkerTypeFrame(this._frames.infoFrame);
    },

    _syncState: function () {
        var _this = this;

        switch (_this._state) {
        case 0:
            _this._frames.crossHair.style.display = "none";
            _this._frames.infoFrame.style.display = "none";
            _this._frames.contentCoordinates.style.display = "none";
            _this._frames.contentType.style.display = "none";
            break;
        case 1:
            _this._frames.crossHair.style.display = "block";
            _this._frames.infoFrame.style.display = "block";
            _this._frames.contentCoordinates.style.display = "block";
            _this._frames.contentType.style.display = "none";
            break;
        case 2:
            _this._frames.crossHair.style.display = "none";
            _this._frames.infoFrame.style.display = "block";
            _this._frames.contentCoordinates.style.display = "none";
            _this._frames.contentType.style.display = "block";
            break;
        }
    }
});

L.control.slmarkers = function (options) {
    return new L.Control.SLMarkers(options);
};
