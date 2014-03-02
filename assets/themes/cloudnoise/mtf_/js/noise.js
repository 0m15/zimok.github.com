  // set initial attributes
  var audio = null, // new Audio(),
    width = $(document).width(),
    height = $(document).height(),
    canvas = d3.select("#canvas"),
    node = canvas.selectAll("div"),
    fixedComment = false

  // soundcloud
  var SC_CLIENT = 'dad7f819afa400cfee85b08af761fc5c'

  SC.initialize({
    client_id: SC_CLIENT,
  });

  var audioContext = new webkitAudioContext()
  var filter = audioContext.createBiquadFilter()

  var keyMap = {
    '113': 0,
    '119': 1,
    '101': 2,
    '114': 3,
    '116': 4,
    '121': 5,
    '117': 6,
    '105': 7,
    '111': 8,
    '112': 9,
    '97': 10,
    '115': 11,
    '100': 12,
    '102': 13,
    '103': 14,
    '104': 15,
    '106': 16,
    '107': 17,
    '108': 18,
    '122': 19,
    '120': 20,
    '99': 21,
    '118': 22,
    '98': 23,
    '110': 24,
    '109': 25
  }

  var makeNoise = function(d) {
    var osc = audioContext.createOscillator()
    osc.type = 1 // square wave (0, 1, 2, 3)
  
    var curveLength = 100;
    var curve1 = new Float32Array(curveLength);
    var curve2 = new Float32Array(curveLength);
    for (var i = 0; i < curveLength; i++)
        curve1[i] = Math.sin(Math.PI * i / curveLength);
     
    for (var i = 0; i < curveLength; i++)
        curve2[i] = Math.cos(Math.PI * i / curveLength);
     
    var waveTable = audioContext.createWaveTable(curve1, curve2);

    osc.setWaveTable(waveTable);
    osc.connect(audioContext.destination)
    osc.noteOn(audioContext.currentTime)
    setTimeout(function() {
      osc.noteOff(0)
    }, 1000) 
  }

  var popularTracks = []

  //SC.get('/tracks', { q: 'skrillex'}, function(tracks) {
  $.getJSON('sc.json', function(tracks) {

    var nodes = [],
      links = [],
      dataSet = [],
      nodesLength = tracks.length, // `data` declared in nodes.js
      baseRadius = 16,
      maxListens = d3.max(tracks, function(d) { return parseInt(d.comment_count) }),
      minListens = d3.min(tracks, function(d) { return parseInt(d.comment_count) }),
      radius = d3.scale.linear().domain([minListens, maxListens]).range([4, 20]),
      opacity = d3.scale.linear().domain([minListens, maxListens]).range([0.4, 1])
      color = d3.scale.ordinal().domain(["ninja", "rca", "warp", "mr_jacob", "crewdson", "mike_skinner", "xpress_2", "thesinghthing"])
        .range(["#71a097", "#024c9e", "#b29cfa", "#adf166", "#ddd", "#333", "#344"]),
      fontSize = d3.scale.linear().domain([minListens, maxListens]).range([8, 14])
      padding = 50,
      focusAttraction = 4.5,
      scaleHover = 1.25,
      i = 0,
      force = d3.layout.force(),
      currentNode = null
      
    console.log("Width: %d, Height: %d, MaxListens", width, height, maxListens, minListens)

    /*
     * background
     * ========================================================
     */
    var createGrid = function() {
    var cx = width / 2, cy = height / 2, circlePadding = 40, circleLength = width / circlePadding, i = 0, 
      svg = d3.select("body").append("svg").attr("class", "background"), ellips = {}, background = []

    var adder = setInterval(function() {
      var ellipsis = {}
      var baseRadius = 1 * circlePadding
      if(i * circlePadding >= width) {
        clearInterval(adder)
        return 
      }
      ellipsis.radius = i * circlePadding
      ellipsis.x = cx - baseRadius / circlePadding
      ellipsis.y = cy - baseRadius / circlePadding
      ellipsis.i = i
      background.push(ellipsis)

      var circles = svg.selectAll("circle")
        .data(background)
        .enter()
        .append("circle")

      var circle = circles
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
        .attr('r', function(d) { return d.radius * .5 })
        .style("opacity", 0)
        .transition(150)
        .attr('r', function(d) { return d.radius * 5})
        .transition(100)
        .attr('r', function(d) { return d.radius })
        .style("opacity", 1)        
        .style("stroke", function(d) { 
          var alpha = ellipsis.i % 2 == 0 ? 1 : 2
          return "rgba(255, 255, 255, ."+alpha+")"
        })
        .style("stroke-dasharray", function(d) {
          var dash = ellipsis.i % 2 == 0 ? "0,0" : "2,3"
          return dash
        })
        .style("fill", "transparent")
      i += 1
    }, 35)
    }

    createGrid()

    /*
    * clustering
    * ========================================================
    */

    // create *n* random nodes
    dataSet = d3.range(nodesLength).map(function(k) {
      var item = tracks[k]
      return {
        group: item.group,
        index: k,
        x: Math.random() * width,
        y: Math.random() * height,
        radius: radius(item.comment_count),
        initialRadius: radius(item.comment_count),
        color: color(item.group),
        opacity: opacity(item.comment_count),
        name: "",
        comment_count: item.comment_count,
        isParent: true,
        isActive: false,
        fixed: false,
        comments: item.comments,
        firstComment: item.comments[0].comment_text,
        track: item.track_name,
        track_url: item.track_url 
      }
    })

    console.log('Nodes: ', dataSet)

    dataSet = _.shuffle(dataSet)

    /*
    * attributes functions
    * ========================================================
    */

    // convert x, y to top, left
    var setPosition = function() {
      return this.style("left", function (d) {
        //return "translate3d("+Math.round(d.x)+"px, "+Math.round(d.y)+"px, 0)"
        return parseInt(d.x - d.radius) + "px";
      })
      .style("top", function (d) {
        return parseInt(d.y - d.radius) + "px";
      })    
    }

    // convert radius to width, height
    var setRadius = function() {
      // border-left: 5px solid transparent;
      // border-right: 5px solid transparent;
      // border-bottom: 5px solid black;
      return this.style("border-left", function(d) {
        return d.radius + "px solid transparent"
      })
      .style("border-right", function(d) {
        return d.radius + "px solid transparent"
      })    
      .style("border-bottom", function(d) {
        return d.radius + "px solid "+d.color
      })
    }

    var setClass = function() {
      return this.attr("class", function(d) {
        var klass = "node"
        if(d.isParent) klass += " parent-node"
         return klass
      })
    }

    /*
     * force
     * ========================================================
     */

    // tick
    var tick = function(e) {
      var k = .1 * e.alpha
      node
        .call(setPosition)
        .filter(function(d) { return !d.isActive })
        .each(collide(.5))
        .call(setPosition)
    }

    var collide = function(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + radius.domain()[1] + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r

        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2
              || x2 < nx1
              || y1 > ny2
              || y2 < ny1
        })
      }
    }

    force // setup the force layout
      .nodes(nodes)
      .charge(-60)
      .size([width, height])
      .on("tick", tick)

    /*
     * node behavior
     * ========================================================
     */

    $(document).on('keypress', function(e) {
      
      var t = dataSet[keyMap[e.which]].comments[0].comment_text
      speak(t)
      console.log(t)

    })

    var expandComment = function(d) {
      $('#comment-track-title').html('<a target="_blank" href="'+d.track_url+'">'+d.track+'</a>')
      $('#comment-username').html(d.comments[0].user)
      $('#comment-text').html(d.firstComment)
      $('#comment-user-avatar').attr('src', d.comments[0].avatar_url).show()
    }

    var nodeClick = function(d) {
      var current = d
      var item = d3.select(this)
      
      speak(d.firstComment, { wordgap: -1 })

      fixedComment = !fixedComment

      node
      .filter(function(d) { 
        return d.fixed && d.index != current.index
      })
      .each()
      .style("-webkit-transform", function(d) {
        return "scale(1)"
      })

      // collapse node
      if(d.fixed) {
        d.radius = d.initialRadius

      } else {
        d.radius = 100
        expandComment(d)
        d.px = d.x
        d.py = d.y
        item
          .style("opacity", function(d) {
            return "1.0"
          })
      }

      item
        .call(setPosition)
        .call(setRadius)
      
      d.fixed = !d.fixed
      d.isActive = !d.isActive
    }

    var dragger = d3.behavior.drag() 
      .on("dragstart", function(d) {
        d.dragging = true
        d.fixed = true
      })
      .on("drag", function(d, i) {
        var dx = d3.event.dx;
        var dy = d3.event.dy;
        d.px += dx;
        d.py += dy;
        d.x += dx;
        d.y += dy;
        force.on("tick", tick)
        force.start();
      })
      .on("dragend", function(d) {
        if (d.isActive) {
          d.fixed = true;
        } else {
          d.fixed = false;
        }
        d.dragging = false;
        force.start();
      })

    // audio
    // .on('play', function() {
    //   console.log('onplay', currentPlayer)
    //   currentPlayer
    //     .addClass('playing')
    //     .find('.icon-play')
    //     .addClass('icon-pause')
    //   currentPlayer
    //     .find('.track-label')
    //     .html(audio.track.title)
    //   node.filter(function(d) {
    //     return !d.isActive
    //   })
    //   .select('.player')
    //   .attr("class", "player")
    // })
    // .on('playing', function() {

    // })
    // .on('pause', function() {
    //   console.log('onpause', currentPlayer)
    //   currentPlayer
    //     .removeClass('playing')
    //     .find('.icon-play')
    //     .removeClass('icon-pause')
    // })
    // .on('progress', function() {

    // })
    // .on('timeupdate', function() {

    // })
    // .on('ended', function() {})
    // .on('error', function() {})


    /*
    * setup nodes
    * ========================================================
    */

    var setup = function() {
      //makeNoise()
      //speak("test")

      // nodes
      node = canvas.selectAll("div")
        .data(force.nodes(), function(d) { 
          return d.index 
        })


      node.enter()
        .append("div")
        .attr("id", function(d) { 
          speak(d.firstComment, { wordgap: -1 })
          if(!fixedComment) expandComment(d)
          return "node-" + d.index 
        })
        .call(setClass)
        .style("opacity", function(d) {
          return d.opacity
        })
        .style("-webkit-transform", function(d) {
          return "scale(0.1)"
        })
        .transition()
        .duration(100)
        .style("-webkit-transform", function(d) {
          return "scale(5)"
        })
        .transition()
        .duration(50)
        .style("-webkit-transform", function(d) {
          return "scale(1)"
        })

      // circles
      var circles = node
        .append("div")
        .attr("class", "circle")

      circles
        .filter(function(d) { return d.isParent })
        .style("box-shadow", function(d) {
          var rgb = d3.rgb(d.color)
          var rgba = "rgba("+rgb.r+","+rgb.g+","+rgb.b+", .5)"
          //return "inset 0 0 "+d.radius * 3+"px " + rgba
        })
        .style("background", function(d) {
          d.image = d.group + ".jpg"
          //return "rgba(255, 255, 255, "+d.opacity+")"
          //return "url(img/"+d.group+".jpg)"
        })

      // user interaction
      node
        .on("mouseover", function(d) {
          //d.fixed = true
          var self = this
          if(d.isActive) return;
          hoverEvent = setTimeout(function() {
            d3.select(self)
              .transition(100)
              .style("-webkit-transform", function(d) {
                return "scale(1.5)"
              })
          }, 150)
        })
        .on("mouseout", function(d) {
          //d.fixed = false
          var self = this
          if(d.isActive) return;
          hoverEvent && clearTimeout(hoverEvent)
          outEvent = setTimeout(function() {
            d3.select(self)
              .transition(10)
              .style("-webkit-transform", function(d) {
              return "scale(1)"
            })
          }, 150)
        })

      node.on("click", function(d) {
        nodeClick.call(this, d)
      })

    

      // start simulation
      node
        .call(setRadius)
        .call(setPosition)
        .call(dragger)

      node.exit().remove()
      force.start()    
    }

    var createNodes = function(index) {
      var k = 0
      if(index) k = index
      var adder = setInterval(function add() {
        if(k == dataSet.length) {
          clearInterval(adder)
          force.start()
          return
        }
        var n = dataSet[k]
        setTimeout(function() {
          nodes.push(n)
          setup()
        }, Math.random() * 3000)
        k+=1
    }, 1000)
  }

  createNodes()
  }) // sc api call