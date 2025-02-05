const direction = document.querySelector('.direction__body');
const interval = document.querySelector('.interval__body');
const hoursText = document.querySelector('.timer__hour');
const minutesText = document.querySelector('.timer__minute');
const secondsText = document.querySelector('.timer_second');
const separators = document.querySelector('.timer__separator');
const future = document.querySelector('.future__body');
const futuredir = document.querySelector('.future__direct');
const currentTime = document.querySelector('.current');

const times = {
    left: {
        direct: 'С левого берега',
        start: ["05:00:00", "09:30:00", "12:15:00", "15:00:00", "19:45:00", "21:15:00"],
        end: ["08:30:00", "11:00:00", "13:45:00", "16:30:00", "20:30:00", "23:00:00"]
    },
    right: {
        direct: 'С правого берега',
        start: ["08:30:00", "11:00:00", "13:45:00", "16:30:00", "20:30:00", "23:00:00"],
        end: ["09:30:00", "12:15:00", "15:00:00", "19:45:00", "21:15:00", "05:00:00"]
    }
}



function date() {
    const date = new Date();



    for (let i= 0; i<=times.left.end.length-1; i++) {
        if (times.left.start[i] < date.toLocaleTimeString() && date.toLocaleTimeString() < times.left.end[i]) {
            direction.innerHTML = times.left.direct;
            interval.innerHTML = `${times.left.start[i]} - ${times.left.end[i]}`;
            hoursText.innerHTML = times.left.start[i]
            future.innerHTML = `${times.right.start[i]} - ${times.right.end[i]}`
            futuredir.innerHTML = times.right.direct;

            let dateEnd = new Date();
            dateEnd.setHours(times.left.end[i].split(":")[0]);
            dateEnd.setMinutes(times.left.end[i].split(":")[1]);
            dateEnd.setSeconds(times.left.end[i].split(":")[2]);

            const dateRemaning = new Date()
            dateRemaning.setHours(dateEnd.getHours()-date.getHours());
            dateRemaning.setMinutes(dateEnd.getMinutes()-date.getMinutes());
            dateRemaning.setSeconds(dateEnd.getSeconds()-date.getSeconds());
            hoursText.innerHTML = dateRemaning.getHours();;
            minutesText.innerHTML = `${dateRemaning.getMinutes() >= 10 ? dateRemaning.getMinutes() : '0' + dateRemaning.getMinutes()}`;
            secondsText.innerHTML = `${dateRemaning.getSeconds() >= 10 ? dateRemaning.getSeconds() : '0' + dateRemaning.getSeconds()}`;

        } else if (times.right.start[i] < date.toLocaleTimeString() && date.toLocaleTimeString() < times.right.end[i]) {
            direction.innerHTML = times.right.direct;
            interval.innerHTML = `${times.right.start[i]} - ${times.right.end[i]}`;
            future.innerHTML = `${times.left.start[i+1 >= 6 ? 0 : i+1]} - ${times.left.end[i+1 >= 6 ? 0 : i+1]}`
            futuredir.innerHTML = times.left.direct;

            let dateEnd = new Date();
            dateEnd.setHours(times.right.end[i].split(":")[0]);
            dateEnd.setMinutes(times.right.end[i].split(":")[1]);
            dateEnd.setSeconds(times.right.end[i].split(":")[2]);

            const dateRemaning = new Date()
            dateRemaning.setHours(dateEnd.getHours()-date.getHours());
            dateRemaning.setMinutes(dateEnd.getMinutes()-date.getMinutes());
            dateRemaning.setSeconds(dateEnd.getSeconds()-date.getSeconds());
            hoursText.innerHTML = dateRemaning.getHours();
            minutesText.innerHTML = `${dateRemaning.getMinutes() >= 10 ? dateRemaning.getMinutes() : '0' + dateRemaning.getMinutes()}`;
            secondsText.innerHTML = `${dateRemaning.getSeconds() >= 10 ? dateRemaning.getSeconds() : '0' + dateRemaning.getSeconds()}`;
        }
    }

    // currentTime.innerHTML = `Последнее обновление в ${hh >= 10 ? hh : '0'+ hh}:${mm >= 10 ? mm : '0'+ mm}:${ss >= 10 ? ss : '0'+ ss}. <br>Обновление раз в 15 минут.<br>Либо обновите страницу`;
    }
setInterval(date, 1000);