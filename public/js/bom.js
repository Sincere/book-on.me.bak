$(function(){
	var tl = Timeline;
	var wrap = $("#timetable");
	var totalWidth = 0;
	var timelines = [];
	for (var i = 0; i < 1; i++) {
		var timeline = new tl.LineView(new tl.TimeSpan(new tl.Time(10), new tl.Time(1)));
		wrap.append(timeline.render());

		if(i % 5 === 0){
			timeline.refreshRuler();
		}

		if(i % 2 === 0){
			timeline.getElement().addClass('even');
		}else{
			timeline.getElement().addClass('odd');
		}

		timelines.push(timeline);

		totalWidth += timeline.getElement().width();
	}

	wrap.width(totalWidth);


	var ev = new tl.EventView(new tl.TimeSpan(new tl.Time(11), new tl.Time(12, 30)), 'gray');
	timelines[0].addEventView(ev);

});