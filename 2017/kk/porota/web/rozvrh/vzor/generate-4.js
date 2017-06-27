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

var data = {
    class: "",
    days: [
        {
            name: "T",
            lessons: [
                lesson("X", "X")("X"),
            ]
        }
    ],
    hours: {
        0:  "X",
    },
};

$(function () {
    var table = $("table.schedule");
    
    data = JSON.parse(JSON.stringify(data));
    
    schedule.fill(table, data);
    
    $("<pre>").text(JSON.stringify(data)).insertAfter(table);
});

