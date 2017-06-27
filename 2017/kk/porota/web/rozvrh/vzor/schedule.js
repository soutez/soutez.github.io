var schedule = {};

function gcd(a, b) {
    while (true) {
       if (a == 0) return b;
        b %= a;
        if (b == 0) return a;
        a %= b;
    }
}

schedule.dayRowspan = function (hourCounters) {
    return hourCounters.reduce(function (a, b) {
        if (a == 0) return b;
        if (b == 0) return a;
        return a * b / gcd(a, b);
    }, 1);
};

schedule.prepareDay = function (day, data) {
    day = $.extend({
        name: "",
        lessons: []
    }, day);

    var dataDay = {
        name: day.name,
        rows: [],
        lessons: []
    };
    data.days.push(dataDay);
    
    var hourCounters = [];

    day.lessons.forEach(function (lesson, lessonId) {
        lesson = $.extend({
            subject: "what?",
            teacher: "who?",
            room: "where?",
            hour: 1,
            duration: 1,
            rowspan: 0,
        }, lesson);
        dataDay.lessons.push(lesson);

        hourCounters[lesson.hour] = hourCounters[lesson.hour] || 0;
        hourCounters[lesson.hour]++
    });
    
    dataDay.lessons.sort(function (a, b) {
        return a.hour - b.hour;
    });

    dataDay.rowspan = schedule.dayRowspan(hourCounters);
    var rowIds = [];
    dataDay.rows = Array.apply(null, new Array(dataDay.rowspan)).map(function () {
        return [];
    });

    dataDay.lessons.forEach(function (lesson) {
        lesson.rowspan = dataDay.rowspan / hourCounters[lesson.hour];
        data.firstHour = Math.min(data.firstHour, lesson.hour);
        data.lastHour = Math.max(data.lastHour, lesson.hour - 1 + lesson.duration);

        rowIds[lesson.hour] = rowIds[lesson.hour] || 0;
        dataDay.rows[rowIds[lesson.hour]].push(lesson);
        rowIds[lesson.hour] += lesson.rowspan;
    });
};

schedule.prepare = function (rawData) {
    rawData = $.extend({
        days: []
    }, rawData);

    var data = {
        firstHour: 9,
        lastHour: -1,
        days: []
    };
    
    rawData.days.forEach(function (day) {
        schedule.prepareDay(day, data);
    });
    
    return data;
};

schedule.fill = function (table, rawData) {
    table.html("").prepend(
        $("<caption></caption>").text("Rozvrh " + rawData.class)
    );
    var colgroup = $("<colgroup/>").appendTo(table);
    var thead = $("<thead/>").appendTo(table);
    
    var data = schedule.prepare(rawData);

    var col = $("<col/>").appendTo(colgroup);
    var tr = $("<tr/>").appendTo(thead);
    tr.append($("<th/>")); // day name col
    
    for (var hour = data.firstHour; hour <= data.lastHour; hour++) {
        var col = $("<col/>").appendTo(colgroup);
        var th = $("<th/>").text(hour).appendTo(tr);
        th.append($("<small/>").html(rawData.hours[hour]));
    }
    
    data.days.forEach(function (day, dayId) {
        schedule.createDay(day, dayId, $("<tbody/>").appendTo(table), data);
    });
};

schedule.createDay = function (day, dayId, tbody, data) {
    tbody.addClass(dayId % 2 ? "day-odd" : "day-even");
    day.rows.forEach(function (row, rowId) {
        var tr = $("<tr/>").appendTo(tbody);
        if (rowId == 0) {
            tr.append(schedule.dayHead(day).attr("rowspan", day.rowspan));
        }
        hour = data.firstHour;
        row.forEach(function (lesson, lessonId) {
            while (rowId == 0 && hour < lesson.hour) {
                tr.append($("<td colspan='1' class='free'/>")
                    .attr("rowspan", day.rowspan));
                hour++;
            }
            var td = schedule.createLesson(lesson, lessonId, tr);
            if (lesson.rowspan == day.rowspan)
                td.addClass("full");
            td.css("font-size", "" + Math.pow(lesson.rowspan / day.rowspan, 0.5) + "em");
            hour += lesson.duration;
        });

        while (rowId == 0 && hour <= data.lastHour) {
            tr.append($("<td colspan='1' class='free'/>")
                .attr("rowspan", day.rowspan));
            hour++;
        }
    });
};

schedule.dayHead = function (day) {
    return $("<th/>").append($("<span/>").html(day.name));
};

schedule.createLesson = function (lesson, lessonId, tr) {
    var td = $("<td/>").appendTo(tr);
    td.attr("colspan", lesson.duration);
    td.attr("rowspan", lesson.rowspan);
    if (lesson.week != undefined)
        td.append($("<span/>")
            .addClass("week")
            .text(lesson.week + ":"));
    td.append($("<strong/>")
        .text(lesson.subject));
    td.append($("<span/>")
        .addClass("tcr")
        .text(lesson.teacher));
    td.append($("<span/>")
        .addClass("room")
        .text("(" + lesson.room + ")"));
    if (lesson.group != undefined)
        td.append($("<span/>")
            .addClass("grp")
            .text("[" + lesson.group + "]"));
    return td;
};

