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

		if(this._getTitle)
		{
			elem.prepend('<div class="bomTitle">'+this._getTitle()+'</div>');
		}
		
		return elem.show();
	};

	//Min
	Bom.MinView = function(hourView, min){
		Bom.MinView.super_.prototype.constructor.call(this);
		this._houeView = hourView;
		this._min = min;
	};

	Bom.Util.inherits(Bom.MinView, Bom.View);

	Bom.MinView.prototype._getClassName = function(){
		return 'bomMin';
	};

	Bom.MinView.prototype._render = function(){
		this._element.addClass('_'+this._min);
		this._element.html('&nbsp;');
		return this._element;
	};

	Bom.MinView.prototype._getTitle = function(){
		return this._min;
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

	Bom.HourView.prototype._getTitle = function(){
		return this._hour+':00';
	};

	Bom.HourView.prototype.getHour = function(){
		return this._hour;
	};

	Bom.HourView.prototype._render = function(){
		var minUnit = this._timeLineView.getMinUnit();
		var count = 60/minUnit;
		for (var i = 0; i < count; i++) {
			var min = new Bom.MinView(this, i*minUnit);
			this._element.append(min.render());
		};

		this._element.addClass('_'+this._hour);

		return this._element;
	};


	//TimeLine
	Bom.TimeLineView = function(startTime, endTime, minUnit){
		Bom.TimeLineView.super_.prototype.constructor.call(this);
		this._startTime = startTime;
		this._endTime = endTime;
		this._minUnit = minUnit;
	};

	Bom.Util.inherits(Bom.TimeLineView, Bom.View);

	Bom.TimeLineView.prototype.getMinUnit = function(){
		return this._minUnit;
	};

	Bom.TimeLineView.prototype._getClassName = function(){
		return 'bomTimeLine';
	};

	Bom.TimeLineView.prototype._render = function(){
		//分は無視する
		var time = this._startTime.getHour();
		var end = this._endTime.getHour();
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

	//TimeSpan
	Bom.TimeSpan = function(startTime, endTime){
		this._startTime = startTime;
		this._endTime = endTime;
	};

	Bom.TimeSpan.prototype.eachHour = function(callback){
		
	};

})();


$(function(){
	var wrap = $("#timetable");
	var timeline = new Bom.TimeLineView(new Bom.Time(10), new Bom.Time(1), 5);
	wrap.append(timeline.render());

	timeline.addActiveSpan();

});