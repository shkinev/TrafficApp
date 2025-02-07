function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // Формат HH:MM:SS
}

function parseTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes, seconds);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

function getIntervalInfo(directionData, currentTime) {
    for (let interval of directionData.intervals) {
        const startTime = parseTime(interval.start);
        const endTime = parseTime(interval.end);
        const now = parseTime(currentTime);

        if (now >= startTime && now <= endTime) {
            return { currentInterval: interval, remainingTime: (endTime - now) / 1000 };
        }
    }
    return null;
}

function getNextInterval(directionData, currentTime) {
    const now = parseTime(currentTime);
    const sortedIntervals = directionData.intervals.map(interval => ({
        ...interval,
        startTime: parseTime(interval.start)
    })).sort((a, b) => a.startTime - b.startTime);

    for (let interval of sortedIntervals) {
        if (parseTime(interval.start) > now) {
            return interval;
        }
    }
    return sortedIntervals[0]; // Если текущего интервала нет, возвращаем первый
}

function updateTrafficSignalInfo() {
    const data = {
        left: {
            direct: 'С левого берега',
            intervals: [
                { start: "05:00:00", end: "08:30:00" },
                { start: "09:30:00", end: "11:00:00" },
                { start: "12:15:00", end: "13:45:00" },
                { start: "15:00:00", end: "16:30:00" },
                { start: "19:45:00", end: "20:30:00" },
                { start: "21:15:00", end: "23:00:00" }
            ]
        },
        right: {
            direct: 'С правого берега',
            intervals: [
                { start: "08:30:00", end: "09:30:00" },
                { start: "11:00:00", end: "12:15:00" },
                { start: "13:45:00", end: "15:00:00" },
                { start: "16:30:00", end: "19:45:00" },
                { start: "20:30:00", end: "21:15:00" },
                { start: "23:00:00", end: "23:59:59" },
                { start: "00:00:00", end: "05:00:00" }
            ]
        }
    };

    const currentTime = getCurrentTime();
    let currentDirection = null;
    let currentIntervalInfo = null;
    let futureDirection = null;
    let futureInterval = null;

    const leftInfo = getIntervalInfo(data.left, currentTime);
    const rightInfo = getIntervalInfo(data.right, currentTime);

    if (leftInfo) {
        currentDirection = data.left.direct;
        currentIntervalInfo = leftInfo;
        futureDirection = data.right.direct;
        futureInterval = getNextInterval(data.right, currentTime);
    } else if (rightInfo) {
        currentDirection = data.right.direct;
        currentIntervalInfo = rightInfo;
        futureDirection = data.left.direct;
        futureInterval = getNextInterval(data.left, currentTime);
    }

    // Объединяем интервалы "23:00:00 - 23:59:59" и "00:00:00 - 05:00:00"
    if (currentIntervalInfo && (currentIntervalInfo.currentInterval.start === "23:00:00" || currentIntervalInfo.currentInterval.start === "00:00:00")) {
        currentIntervalInfo.currentInterval = { start: "23:00:00", end: "05:00:00" };
    }
    if (futureInterval && (futureInterval.start === "23:00:00" || futureInterval.start === "00:00:00")) {
        futureInterval = { start: "23:00:00", end: "05:00:00" };
    }

    // Если активен интервал "23:00:00 - 23:59:59", добавляем 5 часов к таймеру
    let remainingTime = currentIntervalInfo ? currentIntervalInfo.remainingTime : 0;
    let now2 = new Date();
    if (now2.toLocaleTimeString() >= "23:00:00" && now2.toLocaleTimeString() <= "23:59:59") {
        remainingTime += 5 * 3600;
    }

    // Обновляем интерфейс
    document.querySelector('.direction__body').textContent = currentDirection || 'Нет активного направления';
    document.querySelector('.interval__body').textContent = currentIntervalInfo ? `${currentIntervalInfo.currentInterval.start} - ${currentIntervalInfo.currentInterval.end}` : 'Нет активного интервала';
    document.querySelector('.timer').textContent = currentIntervalInfo ? formatTime(remainingTime) : 'N/A';
    document.querySelector('.future__direct').textContent = futureDirection || 'Нет информации';
    document.querySelector('.future__body').textContent = futureInterval ? `${futureInterval.start} - ${futureInterval.end}` : 'Нет информации';
}

// Обновляем информацию каждую секунду
setInterval(updateTrafficSignalInfo, 1000);