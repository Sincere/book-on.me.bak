$(function(){
	var wrap = $("#timetable");
	var totalWidth = 0;
	var timeLines = [];
	for (var i = 0; i < 20; i++) {
		var timeLine = new Timeline.LineView(new Timeline.TimeSpan(new Timeline.Time(10), new Timeline.Time(1)));
		wrap.append(timeLine.render());

		if(i % 5 === 0){
			timeLine.refreshRuler();
		}

		if(i % 2 === 0){
			timeLine.getElement().addClass('even');
		}else{
			timeLine.getElement().addClass('odd');
		}

		totalWidth += timeLine.getElement().width();
	}

	wrap.width(totalWidth);

});