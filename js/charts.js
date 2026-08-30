const canvas = document.getElementById("line-chart");
const ctx = canvas.getContext("2d");

const tooltip = document.getElementById("tooltip");

// ======================================
// DATA
// ======================================

const data = {
  "1M": {
    labels: ["May", "Jun"],
    values: [22.5, 24.8],
  },

  "3M": {
    labels: ["Apr", "May", "Jun"],
    values: [21.5, 22.5, 24.8],
  },

  "6M": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [18.5, 19.2, 20.0, 21.4, 22.5, 24.8],
  },

  "1Y": {
    labels: [
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],

    values: [
      14.2, 15.0, 15.6, 16.5, 17.2, 18.0, 18.6, 19.3, 20.1, 21.4, 22.5, 24.8,
    ],
  },
};

// ======================================
// CURRENT PERIOD
// ======================================

let currentPeriod = "1Y";

// ======================================
// POINTS
// ======================================

let points = [];

// ======================================
// SET CANVAS SIZE
// ======================================

function resizeCanvas() {
  const container = document.querySelector(".chart-container");

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  drawChart(currentPeriod);
}

// ======================================
// DRAW CHART
// ======================================

function drawChart(period) {
  currentPeriod = period;

  const labels = data[period].labels;
  const values = data[period].values;

  // Clear canvas

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ==================================
  // CHART AREA
  // ==================================

  const left = 70;
  const right = canvas.width - 20;

  const top = 20;
  const bottom = canvas.height - 45;

  // ==================================
  // MIN AND MAX
  // ==================================

  const min = Math.min(...values);
  const max = Math.max(...values);

  const padding = 1;

  const minValue = min - padding;
  const maxValue = max + padding;

  // ==================================
  // CREATE POINTS
  // ==================================

  points = [];

  for (let i = 0; i < values.length; i++) {
    let x;

    if (values.length === 1) {
      x = left;
    } else {
      x = left + (i / (values.length - 1)) * (right - left);
    }

    const y =
      bottom -
      ((values[i] - minValue) / (maxValue - minValue)) * (bottom - top);

    points.push({
      x: x,

      y: y,

      value: values[i],

      label: labels[i],
    });
  }

  // ==================================
  // GRID LINES
  // ==================================

  const gridCount = 4;

  ctx.strokeStyle = "#e5e7eb";

  ctx.lineWidth = 1;

  for (let i = 0; i <= gridCount; i++) {
    const y = top + (i / gridCount) * (bottom - top);

    ctx.beginPath();

    ctx.moveTo(left, y);

    ctx.lineTo(right, y);

    ctx.stroke();
  }

  // ==================================
  // Y LABELS
  // ==================================

  ctx.font = "12px Arial";

  ctx.fillStyle = "#667085";

  ctx.textAlign = "right";

  for (let i = 0; i <= gridCount; i++) {
    const value = maxValue - (i / gridCount) * (maxValue - minValue);

    const y = top + (i / gridCount) * (bottom - top);

    ctx.fillText("₹" + value.toFixed(1) + " Cr", left - 10, y + 4);
  }

  // ==================================
  // X LABELS
  // ==================================

  ctx.textAlign = "center";

  ctx.fillStyle = "#667085";

  ctx.font = "12px Arial";

  for (const point of points) {
    ctx.fillText(point.label, point.x, canvas.height - 15);
  }

  // ==================================
  // GREEN AREA
  // ==================================

  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.lineTo(points[points.length - 1].x, bottom);

  ctx.lineTo(points[0].x, bottom);

  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, top, 0, bottom);

  gradient.addColorStop(0, "rgba(0, 159, 117, 0.35)");

  gradient.addColorStop(1, "rgba(0, 159, 117, 0)");

  ctx.fillStyle = gradient;

  ctx.fill();

  // ==================================
  // GREEN LINE
  // ==================================

  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = "#009f75";

  ctx.lineWidth = 2.5;

  ctx.stroke();

  // ==================================
  // CIRCLES
  // ==================================

  for (const point of points) {
    ctx.beginPath();

    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);

    ctx.fillStyle = "white";

    ctx.fill();

    ctx.strokeStyle = "#009f75";

    ctx.lineWidth = 2;

    ctx.stroke();
  }
}

// ======================================
// HOVER
// ======================================

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;

  const mouseY = event.clientY - rect.top;

  for (const point of points) {
    const distance = Math.sqrt(
      (mouseX - point.x) ** 2 + (mouseY - point.y) ** 2,
    );

    if (distance <= 10) {
      showTooltip(point);

      return;
    }
  }

  tooltip.style.display = "none";
});

// ======================================
// TOOLTIP
// ======================================

function showTooltip(point) {
  tooltip.innerHTML = `

        <strong>
            ₹${point.value.toFixed(1)} Cr
        </strong>

        <br>

        <span>
            ${point.label} · portfolio value
        </span>

    `;

  tooltip.style.display = "block";

  let x = point.x + 15;

  let y = point.y - 55;

  // If tooltip goes outside right

  if (x + tooltip.offsetWidth > canvas.clientWidth) {
    x = point.x - tooltip.offsetWidth - 15;
  }

  // If tooltip goes above

  if (y < 0) {
    y = point.y + 15;
  }

  tooltip.style.left = x + "px";

  tooltip.style.top = y + "px";
}

// ======================================
// HIDE TOOLTIP
// ======================================

canvas.addEventListener("mouseleave", function () {
  tooltip.style.display = "none";
});

// ======================================
// BUTTONS
// ======================================

const buttons = {
  "1M": document.getElementById("btn1M"),

  "3M": document.getElementById("btn3M"),

  "6M": document.getElementById("btn6M"),

  "1Y": document.getElementById("btn1Y"),
};

function selectPeriod(period) {
  // Draw chart

  drawChart(period);

  // Remove active from ALL buttons

  for (const button of Object.values(buttons)) {
    button.classList.remove("active");
  }

  // Add active to selected button

  buttons[period].classList.add("active");
}

// ======================================
// BUTTON EVENTS
// ======================================

buttons["1M"].addEventListener("click", () => selectPeriod("1M"));

buttons["3M"].addEventListener("click", () => selectPeriod("3M"));

buttons["6M"].addEventListener("click", () => selectPeriod("6M"));

buttons["1Y"].addEventListener("click", () => selectPeriod("1Y"));

// ======================================
// START
// ======================================

resizeCanvas();

selectPeriod("1Y");

// ======================================
// RESPONSIVE
// ======================================

window.addEventListener("resize", resizeCanvas);
