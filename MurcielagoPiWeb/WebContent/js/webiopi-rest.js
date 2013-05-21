var _webiopi;

function w(restUrl) {
	if (_webiopi == undefined) {
		_webiopi = new WebIOPi(restUrl);
	}
	
	return _webiopi;
}

function webiopi(restUrl) {
	return w(restUrl);
}

function WebIOPi(restUrl) {
	this.readyCallback = null;
	this.context = restUrl == null ? "/" : restUrl;
	this.GPIO = Array(54);
	this.PINS = Array(27);

	this.TYPE = {
			DNC: {value: 0, style: "DNC", label: "--"},
			GND: {value: 1, style: "GND", label: "GROUND"},
			V33: {value: 2, style: "V33", label: "3.3V"},
			V50: {value: 3, style: "V50", label: "5.0V"},
			GPIO: {value: 4, style: "GPIO", label: "GPIO"}
	};
	
	this.ALT = {
			I2C: {name: "I2C", enabled: false, gpios: []},
			SPI: {name: "SPI", enabled: false, gpios: []},
			UART: {name: "UART", enabled: false, gpios: []},
			ONEWIRE: {name: "ONEWIRE", enabled: false, gpios: []}
		};
		
	// init GPIOs
	for (var i=0; i<this.GPIO.length; i++) {
		var gpio = Object();
		gpio.value = 0;
		gpio.func = "IN";
		gpio.mapped = false;
		this.GPIO[i] = gpio;
	}

	// init ALTs
	this.addALT(this.ALT.I2C, 0, "SDA");
	this.addALT(this.ALT.I2C, 1, "SCL");
	this.addALT(this.ALT.I2C, 2, "SDA");
	this.addALT(this.ALT.I2C, 3, "SCL");

	this.addALT(this.ALT.SPI,  7, "CE1");
	this.addALT(this.ALT.SPI,  8, "CE0");
	this.addALT(this.ALT.SPI,  9, "MISO");
	this.addALT(this.ALT.SPI, 10, "MOSI");
	this.addALT(this.ALT.SPI, 11, "SCLK");
	
	this.addALT(this.ALT.UART, 14, "TX");
	this.addALT(this.ALT.UART, 15, "RX");
	
	this.addALT(this.ALT.ONEWIRE, 4, "");
}

WebIOPi.prototype.init = function() {
	$.getJSON(w().context + "map", function(data) {
		var count = w().PINS.length;
		for (i = 0; i<count-1; i++) {
			var type = w().TYPE.GPIO;
			var label = data[i];
			
			if (label == "DNC") {
				type = w().TYPE.DNC;
			}
			else if (label == "GND") {
				type = w().TYPE.GND;
			}
			else if (label == "V33") {
				type = w().TYPE.V33;
			}
			else if (label == "V50") {
				type = w().TYPE.V50;
			}
			
			if (type.value != w().TYPE.GPIO.value) {
				label = type.label;
			}
			
			w().map(i+1, type, label);
		}
		if (w().readyCallback != null) {
			w().readyCallback();
		}

		w().checkVersion();
	});
}


WebIOPi.prototype.ready = function (cb) {
	w().readyCallback = cb;
}

WebIOPi.prototype.map = function (pin, type, value) {
	w().PINS[pin] = Object();
	w().PINS[pin].type = type
	w().PINS[pin].value = value;
	
	if (type.value == w().TYPE.GPIO.value) {
		w().GPIO[value].mapped = true;
	}
}

WebIOPi.prototype.addALT = function (alt, gpio, name) {
	var o = Object();
	o.gpio = gpio;
	o.name = name;
	alt.gpios.push(o);
}

WebIOPi.prototype.updateValue = function (gpio, value) {
	w().GPIO[gpio].value = value;
}

WebIOPi.prototype.updateFunction = function (gpio, func) {
	w().GPIO[gpio].func = func;
}


WebIOPi.prototype.updateALT = function (alt, enable) {
	alt.enabled = enable;
}

WebIOPi.prototype.refreshGPIO = function (repeat) {
	$.getJSON(w().context + "*", function(data) {
		w().updateALT(w().ALT.I2C, data["I2C"]);
		w().updateALT(w().ALT.SPI, data["SPI"]);
		w().updateALT(w().ALT.UART, data["UART"]);
		w().updateALT(w().ALT.ONEWIRE, data["ONEWIRE"]);
		
		$.each(data["GPIO"], function(gpio, data) {
	    	w().updateFunction(gpio, data["function"]);
	    	if ( ((gpio != 4) && ((data["function"] == "IN") || (data["function"] == "OUT"))
	    		|| ((gpio == 4) && (w().ALT.ONEWIRE["enabled"] == false)))){
	    		w().updateValue(gpio, data["value"]);
	    	}
	    	//else if (data["function"] == "PWM") {
	    	//	w().updateSlider(gpio, "ratio", data["ratio"]);
	    	//	w().updateSlider(gpio, "angle", data["angle"]);
	    	//}
		});
	});
	if (repeat === true) {
		setTimeout(function(){w().refreshGPIO(repeat)}, 1000);
	}
}


WebIOPi.prototype.checkVersion = function () {
	var version;
	
	$.get(w().context + "version", function(data) {});
}

WebIOPi.prototype.digitalRead = function (gpio, callback) {
	if (callback != undefined) {
		$.get(w().context + 'GPIO/' + gpio + "/value", function(data) {
			w().updateValue(gpio, data);
			callback(gpio, data);
		});
	}
	return w().GPIO[gpio].value;
}

WebIOPi.prototype.digitalWrite = function (gpio, value, callback) {
	if (w().GPIO[gpio].func.toUpperCase()=="OUT") {
		$.post(w().context + 'GPIO/' + gpio + "/value/" + value, function(data) {
			w().updateValue(gpio, data);
			if (callback != undefined) {
				callback(gpio, data);
			}
		});
	}
	else {
		//console.log(w().GPIO[gpio].func);
	}
}

WebIOPi.prototype.getFunction = function (gpio, callback) {
	if (callback != undefined) {
		$.get(w().context + 'GPIO/' + gpio + "/function", function(data) {
			w().updateFunction(gpio, data);
			callback(gpio, data);
		});
	}
	return w().GPIO[gpio].func;
}
WebIOPi.prototype.setFunction = function (gpio, func, callback) {
	$.post(w().context + 'GPIO/' + gpio + "/function/" + func, function(data) {
		w().updateFunction(gpio, data);
		if (callback != undefined) {
			callback(gpio, data);
		}
	});
}

WebIOPi.prototype.toggleValue = function (gpio) {
	var value = (w().GPIO[gpio].value == 1) ? 0 : 1;
	w().digitalWrite(gpio, value);
}

WebIOPi.prototype.toggleFunction = function (gpio) {
	var value = (w().GPIO[gpio].func == "IN") ? "OUT" : "IN";
	w().setFunction(gpio, value)
}

WebIOPi.prototype.outputSequence = function (gpio, period, sequence, callback) {
	$.post(w().context + 'GPIO/' + gpio + "/sequence/" + period + "," + sequence, function(data) {
		w().updateValue(gpio, data);
		if (callback != undefined) {
			callback(gpio, data);
		}
	});
}

WebIOPi.prototype.callMacro = function (macro, args, callback) {
	if (args == undefined) {
		args = "";
	}
	$.post(w().context + 'macros/' + macro + "/" + args, function(data) {
		if (callback != undefined) {
			callback(macro, args, data);
		}
	});
}
