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
    b:  lesson("B",  "BBB", undefined, 2),
};

var data = {
    class: "",
    days: [
        day("Den&nbsp;1", 1, [ lessons.b("A") ]),
        day("Den&nbsp;2", 2, [ lessons.a("A") ]),
        day("Den&nbsp;3", 3, [ lessons.a("A") ]),
        day("Den&nbsp;4", 4, [ lessons.a("A") ]),
        day("Den&nbsp;5", 5, [ lessons.a("A") ]),
        day("Den&nbsp;6", 6, [ lessons.a("A") ]),
        day("Den&nbsp;7", 7, [ lessons.b("A") ]),
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

