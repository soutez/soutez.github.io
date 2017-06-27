function day(name, start, hours) {
    var ret = [];
    hours.forEach(function (hour) {
        if (!Array.isArray(hour))
            hour = [hour];
        
        hour.forEach(function (lesson) {
            lesson.hour = lesson.hour || start;
            ret.push(lesson); 
        });
        
        if (hour[0] != undefined)
            start += hour[0].duration || 1;
        else
            start++;
    });
    return {
        name: name,
        lessons: ret
    };
}

function lesson (s, t, g, d, w) {
    return function (r, d2, g2, w2) {
        return {
            subject: s,
            teacher: t,
            room: r,
            duration: d2 || d,
            group: g2 || g,
            week: w2 || w,
            setHour: function (h) {
                this.hour = h;
                return this;
            },
        };
    }
}

var lessons = {
    a:  lesson("A",  "AAA"),
    b:  lesson("B",  "BBB"),
    c:  lesson("C",  "CCC"),
    d:  lesson("D",  "DDD"),
    e:  lesson("E",  "EEE"),
    f:  lesson("F",  "FFF"),
};

function copy(lesson, count) {
    var ret = [];
    while (count-- > 0)
        ret.push(lesson("X"));
    return ret;
}

var data = {
    class: "",
    days: [
        day("Test", 0, [
            lessons.f("X"),
            copy(lessons.b, 3),
            copy(lessons.c, 5),
            copy(lessons.e, 11),
            copy(lessons.d, 7),
            copy(lessons.a, 2), 
        ]),
    ],
    hours: {
        "-1": "6:15 &ndash; 7:00",
        0:  "7:05 &ndash; 7:55",
        1:  "8:00 &ndash; 8:45",
        2:  "8:55 &ndash; 9:40",
        3:  "9:50 &ndash; 10:35",
        4: "10:55 &ndash; 11:40",
        5: "11:50 &ndash; 12:35",
        6: "12:40 &ndash; 13:25",
        7: "13:30 &ndash; 14:15",
        8: "14:20 &ndash; 15:05",
        9: "15:10 &ndash; 15:55",
    },
};

$(function () {
    var table = $("table.schedule");
    
    data = JSON.parse(JSON.stringify(data));
    
    schedule.fill(table, data);
    
    $("<pre>").text(JSON.stringify(data)).insertAfter(table);
});

