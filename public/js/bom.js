$(function(){
	var tl = Timeline;
	var wrap = $("#timetable");
	var totalWidth = 0;
	var timelines = [];
	for (var i = 0; i < 20; i++) {
		var timeline = new tl.LineView(new tl.TimeSpan(new tl.Time(10), new tl.Time(1)));
		wrap.append(timeline.render());

		if(i % 5 === 0){
			timeline.setRulerView(new tl.RulerView());
		}

		if(i % 2 === 0){
			timeline.getElement().addClass('even');
		}else{
			timeline.getElement().addClass('odd');
		}

		timelines.push(timeline);

		totalWidth += timeline.getElement().width();
	}

	// wrap.width(totalWidth);


	timelines[0].addEventView(tl.EventView.create([10,0], [12,0], 'disable'));
	timelines[1].addEventView(tl.EventView.create([10,0], [11,15], 'disable'));
	timelines[2].addEventView(tl.EventView.create([10,0], [11,15], 'disable'));
	timelines[3].addEventView(tl.EventView.create([10,0], [11,0], 'disable'));
	timelines[4].addEventView(tl.EventView.create([10,0], [11,0], 'disable'));

	timelines[0].addEventView(tl.EventView.create([12,0], [13,30], 'pink'));
	timelines[0].addEventView(tl.EventView.create([13,45], [15,15], 'yellow'));
	timelines[1].addEventView(tl.EventView.create([11,15], [14,0], 'blue'));
	timelines[1].addEventView(tl.EventView.create([14,0], [16,0], 'green'));
	timelines[3].addEventView(tl.EventView.create([11,0], [16,0], 'orange'));

	$("#actions button").click(function(){
		var elem = $(this);
		switch(elem.attr('class')){
			case 'left':
				timelines.forEach(function(timeline){
					timeline.updateLineWidth(-2);
				});
				break;
			case 'right':
				timelines.forEach(function(timeline){
					timeline.updateLineWidth(2);
				});
				break;
			case 'up':
				timelines.forEach(function(timeline){
					timeline.updateHeightPerMin(-0.1);
				});
				break;
			case 'down':
				timelines.forEach(function(timeline){
					timeline.updateHeightPerMin(0.1);
				});
				break;
		}
	});
});