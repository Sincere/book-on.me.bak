(function(){
	Bom = {};

	//Util
	Bom.Util = {};
	Bom.Util.inherits = function(ctor, superCtor) {
		ctor.super_ = superCtor;
		if(Object.create){
			ctor.prototype = Object.create(superCtor.prototype, {
				constructor: {
					value: ctor,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		}
		else
		{
			var f = function (){};
			f.prototype = superCtor.prototype;
			ctor.prototype = new f();
			ctor.constructor = ctor;
		}
	};

	//View
	Bom.View = function(){
		this._element = $('<div class="'+ this._getClassName() +'"></div>');
		this._element.appendTo('body').hide();
	};

	Bom.View.prototype.render = function(){
		var elem = this._render();
		return elem.show();
	};

	//Min
	Bom.QuarterMinView = function(hourView, min){
		Bom.QuarterMinView.super_.prototype.constructor.call(this);
		this._hourView = hourView;
		this._min = min;
	};

	Bom.Util.inherits(Bom.QuarterMinView, Bom.View);

	Bom.QuarterMinView.prototype._getClassName = function(){
		return 'bomMin';
	};

	Bom.QuarterMinView.prototype._render = function(){
		this._element.addClass('_'+ this._min + '-' + (this._min + 15));
		this._element.height(15);
		return this._element;
	};


	//Hour
	Bom.HourView = function(timeLineView, hour){
		Bom.HourView.super_.prototype.constructor.call(this);
		this._hour = hour;
		this._timeLineView = timeLineView;
	};

	Bom.Util.inherits(Bom.HourView, Bom.View);

	Bom.HourView.prototype._getClassName = function(){
		return 'bomHour';
	};

	Bom.HourView.prototype.getHour = function(){
		return this._hour;
	};

	Bom.HourView.prototype._render = function(){
		var minUnit = 15;
		var count = 60/minUnit;
		for (var i = 0; i < count; i++) {
			var min = new Bom.QuarterMinView(this, i*minUnit);
			this._element.append(min.render());
		};

		this._element.addClass('_'+this._hour);

		return this._element;
	};


	//TimeLine
	Bom.TimeLineView = function(timeSpan){
		Bom.TimeLineView.super_.prototype.constructor.call(this);
		this._timeSpan = timeSpan;
	};

	Bom.Util.inherits(Bom.TimeLineView, Bom.View);

	Bom.TimeLineView.prototype._getClassName = function(){
		return 'bomTimeLine';
	};

	Bom.TimeLineView.prototype._render = function(){
		//分は無視する
		var time = this._timeSpan.getStartTime().getHour();
		var end = this._timeSpan.getEndTime().getHour();
		while(true)
		{
			var hourView = new Bom.HourView(this, time);
			this._element.append(hourView.render());

			if(time === end)
			{
				break;
			}

			time += 1;
			if(time == 24)
			{
				time = 0;
			}
		}

		return this._element;
	};


	//Time
	Bom.Time = function(hour, min){
		this._hour = hour === undefined ? 0 : parseInt(hour, 10);
		this._min = min === undefined ? 0 : parseInt(min, 10);
	};

	Bom.Time.prototype.getHour = function(){ return this._hour; };
	Bom.Time.prototype.getMin = function(){ return this._min; };

	Bom.Time.prototype.getDistance = function(targetTime){
		var targetHour = targetTime.getHour();
		if(this._hour > targetHour)
		{
			targetHour += 24;
		}

		var hourDistance = targetHour - this._hour;

		return (hourDistance * 60) + (targetTime.getMin() - this._min);
	};

	//TimeSpan
	Bom.TimeSpan = function(startTime, endTime){
		this._startTime = startTime;
		this._endTime = endTime;
	};

	Bom.TimeSpan.prototype.getDistance = function(){
		return this._startTime.calcMinDistance(this._endTime);
	};

	Bom.TimeSpan.prototype.getStartTime = function(){ return this._startTime; };
	Bom.TimeSpan.prototype.getEndTime = function(){ return this._endTime; };

})();


$(function(){
	var wrap = $("#timetable");
	var timeline = new Bom.TimeLineView(new Bom.TimeSpan(new Bom.Time(10), new Bom.Time(1)));
	wrap.append(timeline.render());

});