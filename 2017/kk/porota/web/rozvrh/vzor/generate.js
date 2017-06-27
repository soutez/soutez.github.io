function day(name, start, hours) {
    var ret = [];
    hours.forEach(function (hour) {
        if (!Array.isArray(hour))
            hour = [hour];
        
        hour.forEach(function (lesson) {
            lesson.hour = start;
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
    m:  lesson("M",  "NVK"),
    cj: lesson("Cj", "DVŘ"),
    hv: lesson("Hv", "ZPV"),
    z: lesson("Z", "SVT"),
    f: lesson("F", "AMP"),
    bi: lesson("Bi", "BNK"),
    chlab: lesson("Ch", "H2O", undefined, 2, "S"),
    tvchl: lesson("Tv", "SLK", "Chl", 2),
    tvdiv: lesson("Tv", "KRS", "Dív", 2),
    aj: lesson("Aj", "TCR", "Aj"),
    nj: lesson("Nj", "LHR", "Nj"),
    fj: lesson("Fj", "INS", "Fj"),
    eko: lesson("EKO", "CZK", undefined, 2),
};

var data = {
    class: "7.Z",
    days: [
        day("Po", 1, [
            [ lessons.m("302", undefined, "SkA"), lessons.cj("S2", undefined, "SkB") ],
            [ lessons.cj("302", undefined, "SkA"), lessons.m("S2", undefined, "SkB") ],
            [
                lessons.aj("Jaz2"),
                lessons.nj("302"),
                lessons.fj("Jaz1"),
            ],
            lessons.hv("Hv"),
            lessons.m("213", 2),
        ]),
        day("Út", 0, [
            lesson("Prg", "MFF")("IVT1"),
            lessons.z("302"),
            lessons.m("302"),
            lessons.bi("302"),
            [
                lessons.aj("Jaz2"),
                lessons.nj("302"),
                lessons.fj("Jaz1"),
            ],
            [],
            [
                lesson("SEM", "EXP", "SEM")("Lab1"),
                lesson("Lit", "ABC", "Lit")("302"),
                lesson("SBI", "VYR", "SBI")("Lab3"),
                lesson("SEF", "OHM", "SEF")("Lab2"),
                lesson("SED", "ARC", "SED")("104"),
            ].map(function (l) { l.duration = 2; return l; }),
        ]),
        day("St", 1, [
            lessons.m("302"),
            lessons.z("302"),
            lessons.f("Lab2"),
            [
                lesson("IVT", "LIN", "IVT1", 2)("IVT3"),
                lesson("IVT", "WIN", "IVT2", 2)("IVT2"),
                lesson("IVT", "OSX", "IVT3", 2)("IVT1"),
            ],
            [],
            [ 
                lessons.chlab("Lab", undefined, "SkA", "S"),
                lessons.chlab("Lab", undefined, "SkB", "L"),
            ]
        ]),
        day("Čt", 1, [
            [ lessons.tvchl("T1"), lessons.tvdiv("T2") ],
            [
                lessons.aj("302"),
                lessons.nj("Jaz1"),
                lessons.fj("Jaz2"),
            ],
            lessons.m("302"),
            [
                lesson("SEM", "EXP", "SEM")("Lab1"),
                lesson("Lit", "ABC", "Lit")("302"),
                lesson("SBI", "VYR", "SBI")("Lab3"),
                lesson("SEF", "OHM", "SEF")("Lab2"),
                lesson("SED", "ARC", "SED")("104"),
            ],
            [],
            lessons.cj("302"),
        ]),
        {
            name: "Pá",
            lessons: [
                lessons.m("302").setHour(2),
                lessons.f("Lab2").setHour(4),
                lessons.hv("302").setHour(3),
                lessons.cj("302").setHour(1),
                lessons.bi("Lab3").setHour(5),
            ],
        },
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

