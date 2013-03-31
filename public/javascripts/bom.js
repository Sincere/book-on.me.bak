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

	Bom.View.prototype.getElement = function(){
		return this._element;
	};

	Bom.View.prototype.render = function(){
		var elem = this._render();
		return elem.show();
	};

	//Min
	Bom.MinView = function(hourView, min, minUnit){
		Bom.MinView.super_.prototype.constructor.call(this);
		this._hourView = hourView;
		this._min = min;
		this._minUnit = minUnit;
	};

	Bom.Util.inherits(Bom.MinView, Bom.View);

	Bom.MinView.prototype._getClassName = function(){
		return 'bomMin';
	};

	Bom.MinView.prototype._render = function(){
		this._element.addClass('_'+ (this._min + this._minUnit));
		this._element.height(this._minUnit);
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
			var min = new Bom.MinView(this, i*minUnit, minUnit);
			this._element.append(min.render());
		}

		this._element.addClass('_'+this._hour);

		return this._element;
	};


	//TimeLine
	Bom.TimeLineView = function(timeSpan){
		Bom.TimeLineView.super_.prototype.constructor.call(this);
		this._timeSpan = timeSpan;
		this._hourViews = [];
	};

	Bom.Util.inherits(Bom.TimeLineView, Bom.View);

	Bom.TimeLineView.prototype._getClassName = function(){
		return 'bomTimeLineWrap';
	};

	Bom.TimeLineView.prototype._render = function(){
		var timeline = $('<div class="bomTimeLine" />').appendTo(this._element);
		//分は無視する
		var time = this._timeSpan.getStartTime().getHour();
		var end = this._timeSpan.getEndTime().getHour();
		while(true)
		{
			var hourView = new Bom.HourView(this, time);
			timeline.append(hourView.render());
			this._hourViews.push(hourView);

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

	Bom.TimeLineView.prototype.refreshRuler = function(){
		var self = this;
		self._element.addClass('hasRuler');

		var rulerWrap = $('<div class="bomRuler" />').prependTo(self._element);

		this._hourViews.forEach(function(hourView){
			var hourRuler = $('<div class="hour">'+hourView.getHour()+':00'+'</div>');
			rulerWrap.append(hourRuler);
			hourRuler.height(hourView.getElement().outerHeight());
		});
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
	var totalWidth = 0;
	for (var i = 0; i < 20; i++) {
		var timeline = new Bom.TimeLineView(new Bom.TimeSpan(new Bom.Time(10), new Bom.Time(1)));
		wrap.append(timeline.render());

		if(i % 5 === 0){
			timeline.refreshRuler();
		}

		if(i % 2 === 0){
			timeline.getElement().addClass('even');
		}else{
			timeline.getElement().addClass('odd');
		}

		totalWidth += timeline.getElement().width();	
	}

	wrap.width(totalWidth);

});