mn_config = {
  "density": 1.5,
  "scale": 3,
  "careful": true,
  "smooth": true,
  "cutoff_area": 10
};

mn_projection = d3.geo.mercator()
  .scale(1150)
  .translate([1950, 1140]);

mn_path = d3.geo.path()
  .projection(mn_projection);

mn_svg = d3.select("#minnesota")
  .append("svg")
  .attr("viewBox", "0 0 200 200")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")

d3.json('data/minnesota.json', function (error, json) {
  mn_json = json
  counties = topojson.feature(mn_json, mn_json.objects.counties).features,
    mn_drawing = getDrawing(counties, mn_path, mn_projection, mn_config)
  draw(mn_drawing, mn_svg)
})