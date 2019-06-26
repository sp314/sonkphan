hi_config = {
  "density": 6,
  "scale": 2.1,
  "careful": true,
  "smooth": true,
  "cutoff_area": 0
};

hi_projection = d3.geo.mercator()
  .scale(1700)
  .translate([4780, 710]);;

hi_path = d3.geo.path()
  .projection(hi_projection);

hi_svg = d3.select("#hawaii")
  .append("svg")
  .attr("viewBox", "0 0 200 200")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")

d3.json('data/hawaii.json', function (error, json) {
  hi_json = json
  islands = topojson.feature(hi_json, hi_json.objects.islands).features,
    hi_drawing = getDrawing(islands, hi_path, hi_projection, hi_config)
  draw(hi_drawing, hi_svg)
})