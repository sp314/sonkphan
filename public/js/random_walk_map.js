function pointInPolygon(point, polygon) {
  for (var n = polygon.length, i = 0, j = n - 1, x = point[0], y = point[1], inside = false; i < n; j = i++) {
    var xi = polygon[i][0], yi = polygon[i][1],
        xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > y ^ yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function randomColor() {
  colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colors[randInt(0,19)]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function draw(lines, svg) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    drawLine(svg, line)
  }
};

function drawLine(svg, line) {
  window.setTimeout(function() {
    if(line.pip || line.first) {
      svg
      .append('line')
      .attr({
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2, 
        stroke: line.stroke
      });
    }
  }, 1000)
}

function getDrawing(pieces, path, projection, config){
  lines = []
  for (var i0 = 0; i0 < pieces.length; i0++) {
    d = pieces[i0]

    strokeColor = randomColor()
    for(var i1=0; i1<d.geometry.coordinates.length; i1++) {
      if(d.geometry.type=="MultiPolygon") {
        p = d.geometry.coordinates[i1][0]
      }else{
        p = d.geometry.coordinates[i1]
      }

      d2 = {type: "Feature", properties: {}, geometry: {type: "Polygon", coordinates: [p]}}
      centroid = path.centroid(d2)
      area = path.area(d2)
      if(area<config["cutoff_area"]) continue

      lines.push({x1: centroid[0], y1: centroid[1],
                  x2: centroid[0], y2: centroid[1], 
                  pip: true, stroke: strokeColor,
                  first: true})
      strokes = area*(config["density"])

      for(var i2=0;i2<(strokes < 5 ? 5 : strokes);i2++){
        //Take the last line in
        line = lines[lines.length - 1]
        x1 = line.x2
        y1 = line.y2
        

        if(line.pip) {
          // random angle that's a multiple of theta
          theta = randInt(1, 4) * (Math.PI/2)
        } else {
          // if we're outside of the polygon, turn towards the centroid
          dx = centroid[0] - x1
          dy = centroid[1] - y1
          theta = Math.atan2(dy, dx)
          thetaDeg = theta * (180/Math.PI)
          // random angle towards the centroid clamped to theta
          randAngle = randInt(thetaDeg - 90, thetaDeg + 90)
          angle = Math.floor(randAngle/90)*90
          theta = Math.PI * (angle/180)
        }

        scale = Math.sqrt(area) < config["scale"] ? Math.sqrt(area) : config["scale"]
        x2 = x1 + Math.cos(theta)*scale
        y2 = y1 + Math.sin(theta)*scale
        pip = pointInPolygon(projection.invert([x2, y2]), d2.geometry.coordinates[0])
        lines.push({x1: x1, y1: y1,
                    x2: x2, y2: y2, 
                    pip: pip, stroke: strokeColor})
      }
    }
  }
  return lines
}