function Header() {


    var EDGE_STROKE_COLOR = 'rgba(150,150,150,.4)'
    var CIRCLE_FILL_COLOR = 'rgba(150,150,150,.4)'

    var width, height, largeHeader, canvas, ctx, points, target, triangles, animateHeader = true;
    var pointDistanceRatio = 8

    var devicePixelRatio = window.devicePixelRatio || 1

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('canvas');
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = width + "px"
        canvas.style.height = height + "px"
        ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio)

        // create points
        points = []

        for(var x = 0; x < width; x = x + width/pointDistanceRatio) {
            for(var y = 0; y < height; y = y + height/pointDistanceRatio) {
                var px = x + Math.random()*width/pointDistanceRatio;
                var py = y + Math.random()*height/pointDistanceRatio;
                var p = {0: x, 1: y, x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // add logo points
        var logoPoints = {
            topShape: [
                {x: 152, y: 169},
                {x: 114, y: 169},
                {x: 5, y: 5},
                {x: 5, y: 5},
                {x: 184, y: 169}
            ],
            bottomShape: [
                {x: 5, y: 87},
                {x: 5, y: 5},
                {x: 126, y: 5},
                {x: 126, y: 5}
            ]
        }

        console.time("triangulate")
        triangles = triangulate(points);
        console.timeEnd("triangulate")

        // assign a circle to each point
        for(var i in triangles) {
            ['v0','v1','v2'].forEach(function(k) {
                var vertex = triangles[i][k]
                var c = new Circle(vertex, 2+Math.random()*2, CIRCLE_FILL_COLOR);
                vertex.circle = c;
            })
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        // for(var i in points) {
        //     shiftPoint(points[i]);
        // }
    }

    function animate() {
      var currentPoint, currentPointDistance

        if(animateHeader) {
            // clear the context
            ctx.clearRect(0,0,width,height);
            for(var i in triangles) {
                // detect points in range
                currentPoint = triangles[i]
                currentPoint.x = currentPoint.v0.x
                currentPoint.y = currentPoint.v0.y
                currentPointDistance = Math.abs(getDistance(target, currentPoint))
                if(currentPointDistance < 4000) {
                    currentPoint.active = 0.2;
                    currentPoint['v0'].circle.active = 0.3
                    currentPoint['v0'].circle.radiusRatio = 1.25
                } else if(currentPointDistance < 20000) {
                    currentPoint.active = 0.125;
                    currentPoint['v0'].circle.active = 0.2
                    currentPoint['v0'].circle.radiusRatio = 0.8
                } else if(currentPointDistance < 40000) {
                    currentPoint.active = 0.05;
                    currentPoint['v0'].circle.active = 0.1
                    currentPoint['v0'].circle.radiusRatio = 0.5
                } else {
                    currentPoint.active = 0.025;
                    currentPoint['v0'].circle.active = 0.025
                    currentPoint['v0'].circle.radiusRatio = 0.3
                }
                ctx.beginPath();
                drawLines(currentPoint);
                ctx.closePath();
                currentPoint['v0'].circle.draw();

            }
        }
        requestAnimationFrame(animate);
    }




    function shiftPoint(p) {
        // TweenLite
        //   .to(p, 6+1*Math.random(), {
        //       x: p.originX-70+Math.random()*120,
        //       y: p.originY-70+Math.random()*120, ease:Power4.easeInOut,
        //       onComplete: function() {
        //           shiftPoint(p);
        //       }
        //   });
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;

        // for(var i in p.closest) {
        //     triangle = triangles[i]
        //     ctx.beginPath();
        //     ctx.moveTo(triangles[i].v0.x, triangles[i].v0.y);
        //     ctx.lineTo(triangle.v1.x, triangle.v1.y);
        //     ctx.lineTo(p.closest[i].x, p.closest[i].y);
        //     ctx.strokeStyle = 'rgba(120,120,150,'+ p.active+')';
        //     ctx.lineWidth= 1
        //     ctx.stroke();
        // }

        //for(var i = 0; i < triangles.length; i++) {
            var triangle = p//triangles[i]
            ctx.lineWidth = 1
            ctx.moveTo(triangle.v0.x, triangle.v0.y);
            ctx.lineTo(triangle.v1.x, triangle.v1.y);
            ctx.lineTo(triangle.v2.x, triangle.v2.y);
            ctx.strokeStyle = 'rgba(120,120,150,'+p.active+')';
            ctx.stroke();
        //}
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius * _this.radiusRatio, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(100,100,100,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

};

setTimeout(function() {
  var head = new Header()
}, 1000)