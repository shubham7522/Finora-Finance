const canvas = document.getElementById("bar-chart");
const ctx = canvas.getContext("2d");


// =========================
// DATA
// =========================

const data = [20, 60, 40, 90];

const labels = ["Jan", "Feb", "Mar", "Apr"];


// =========================
// CHART AREA
// =========================

const chartLeft = 50;
const chartTop = 20;
const chartBottom = 160;
const chartRight = 580;

const chartHeight = chartBottom - chartTop;


// =========================
// MAX VALUE
// =========================

const maxValue = 100;


// =========================
// Y AXIS
// =========================

ctx.beginPath();

ctx.moveTo(chartLeft, chartTop);

ctx.lineTo(chartLeft, chartBottom);

ctx.stroke();


// =========================
// X AXIS
// =========================

ctx.beginPath();

ctx.moveTo(chartLeft, chartBottom);

ctx.lineTo(chartRight, chartBottom);

ctx.stroke();


// =========================
// Y AXIS LABELS
// =========================

const yLabels = [0, 20, 40, 60, 80, 100];

yLabels.forEach(value => {

    const y =
        chartBottom -
        (value / maxValue) * chartHeight;

    ctx.textAlign = "right";

    ctx.fillText(
        value,
        chartLeft - 10,
        y + 5
    );

});


// =========================
// BARS
// =========================

const barWidth = 50;
const gap = 50;

data.forEach((value, index) => {

    // 1. Convert data value to pixels

    const barHeight =
        (value / maxValue) * chartHeight;


    // 2. Calculate X position

    const x =
        80 + index * (barWidth + gap);


    // 3. Calculate Y position

    const y =
        chartBottom - barHeight;


    // 4. Draw bar

    ctx.fillRect(
        x,
        y,
        barWidth,
        barHeight
    );


    // 5. Draw X label

    ctx.textAlign = "center";

    ctx.fillText(
        labels[index],
        x + barWidth / 2,
        chartBottom + 20
    );

});