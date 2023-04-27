const heroBanner = document.querySelectorAll("#hero-banner");
const switchClick = document.querySelectorAll(".switch");

let trailEnabled = false; // Variable indiquant si la traînée est activée ou non

function trail() {
  switchClick.forEach(function (switchElem) {
    const inputElem = switchElem.querySelector("input");
    inputElem.addEventListener("click", function () {
      trailEnabled = !trailEnabled; // Inverse la valeur de trailEnabled
    });
  });
}

// CANVAS
// Initialise le canvas et le contexte
function init(id) {
  const canvas = document.getElementById(id);
  const context = canvas.getContext("2d");
  return { canvas, context };
}

// Polyfill pour requestAnimationFrame
(function () {
  const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  window.requestAnimFrame = requestAnimationFrame;
})();

// Une fois la page chargÃ©e
window.onload = function () {
  // Classe Segment
  class Segment {
      constructor(x, y, length) {
          this.width = Math.random() * 0.8 + 0.1;
          this.x0 = x;
          this.y0 = y;
          this.angle = Math.random() * 1 * Math.PI;
          this.x1 = this.x0 + length * Math.cos(this.angle);
          this.y1 = this.y0 + length * Math.sin(this.angle);
          this.length = length;
      }

      update(x, y) {
          this.x0 = x;
          this.y0 = y;
          this.angle = Math.atan2(this.y1 - this.y0, this.x1 - this.x0);
          this.x1 = this.x0 + this.length * Math.cos(this.angle);
          this.y1 = this.y0 + this.length * Math.sin(this.angle);
      }
  }

  // Classe Rope
  class Rope {
      constructor(targetX, targetY, length, width, segmentQuantity, type) {
          this.resolution = type === "l" ? length / 2 : length / segmentQuantity;
          this.type = type;
          this.length = length;
          this.segments = [
              new Segment(targetX, targetY, this.length / this.resolution),
          ];

          for (let i = 1; i < this.resolution; i++) {
              const prevSegment = this.segments[i - 1];
              this.segments.push(
                  new Segment(prevSegment.x1, prevSegment.y1, this.length / this.resolution)
              );
          }

          this.width = width;
      }

      update(target) {
          this.segments[0].update(target.x, target.y);

          for (let i = 1; i < this.resolution; i++) {
              this.segments[i].update(this.segments[i - 1].x1, this.segments[i - 1].y1);
          }
      }

      show(context) {
          if (this.type === "l") {
              context.beginPath();

              for (const segment of this.segments) {
                  context.lineTo(segment.x0, segment.y0);
              }

              const lastSegment = this.segments[this.segments.length - 1];
              context.lineTo(lastSegment.x1, lastSegment.y1);
              context.strokeStyle = "#9412F1";
              context.lineWidth = this.width;
              context.stroke();

              context.beginPath();
              context.arc(
                  this.segments[0].x0,
                  this.segments[0].y0,
                  1,
                  0,
                  2 * Math.PI
              );
              context.fillStyle = "rgba(0, 36, 51, 1)";
              context.fill();

              context.beginPath();
              context.arc(lastSegment.x1, lastSegment.y1, 2, 0, 2 * Math.PI);
              context.fillStyle = "#2196F3";
              context.fill();
          } else {
              for (const segment of this.segments) {
                  context.beginPath();
                  context.arc(
                      segment.x0,
                      segment.y0,
                      segment.width,
                      0,
                      2 * Math.PI
                  );
                  context.fillStyle = "#F7F6C5";
                  context.fill();
              }

              const lastSegment = this.segments[this.segments.length - 1];
              context.beginPath();
              context.arc(lastSegment.x1, lastSegment.y1, 2, 0, 2 * Math.PI);
              context.fillStyle = "#2196F3";
              context.fill();
          }
      }
  }

  const { canvas, context } = init("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ropes = [];
  const randomLengths = [];
  const deltaAngles = [];
  const segmentCount = 100;

  for (let i = 0; i < segmentCount; i++) {
      const type = Math.random() > 0.25 ? "l" : "o";
      ropes.push(
          new Rope(
              canvas.width / 2,
              canvas.height / 2,
              (Math.random() * 1 + 0.5) * 500,
              Math.random() * 0.4 + 0.1,
              Math.random() * 15 + 5,
              type
          )
      );
      randomLengths.push(Math.random() * 2 - 1);
      deltaAngles.push(0);
  }

  const mouse = { x: null, y: null };
  const cursorInside = { value: false };

  canvas.addEventListener("mousemove", (e) => {
      cursorInside.value = true;
      mouse.x = e.pageX - e.target.offsetLeft;
      mouse.y = e.pageY - e.target.offsetTop;
  });

  canvas.addEventListener("mouseleave", () => {
      cursorInside.value = false;
  });

  function updateRopes(target) {
      if (!cursorInside.value) return;

      for (let i = 0; i < ropes.length; i++) {
          const delta = randomLengths[i] > 0 ? (1 - randomLengths[i]) / 10 : (-1 - randomLengths[i]) / 10;
          deltaAngles[i] += delta;
          const xOffset = randomLengths[i] * 35 * Math.cos((i * 2 * Math.PI) / ropes.length + deltaAngles[i]);
          const yOffset = randomLengths[i] * 35 * Math.sin((i * 2 * Math.PI) / ropes.length + deltaAngles[i]);

          ropes[i].update({ x: target.x + xOffset, y: target.y + yOffset });
          ropes[i].show(context);
      }
  }

  function animationLoop() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const target = mouse.x !== null ? mouse : { x: canvas.width / 2, y: canvas.height / 2 };
      updateRopes(target);
      requestAnimationFrame(animationLoop);
  }

  window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  });

  animationLoop();
};

  // BOUNCY + HOVER 

  var myText = document.getElementById('myText');
  var textContent = myText.textContent;
  var letters = textContent.split('');

  var newContent = '';
  for (var i = 0; i < letters.length; i++) {
    newContent += '<span>' + letters[i] + '</span>';
  }

  myText.innerHTML = newContent;

  var spans = myText.getElementsByTagName('span');
  for (var i = 0; i < spans.length; i++) {
    spans[i].addEventListener('mouseover', function () {
      this.classList.add('insertClass');
    });

    spans[i].addEventListener('mouseleave', function () {
      this.classList.remove('insertClass');
    });
  }

