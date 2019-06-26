vn_config = {
  "density": 2.3,
  "scale": 2.6,
  "careful": true,
  "smooth": true,
  "cutoff_area": 20
};

vn_projection = d3.geo.mercator()
  .scale(700)
  .translate([-1160, 290]);

vn_path = d3.geo.path()
  .projection(vn_projection);

vn_svg = d3.select("#vietnam")
  .append("svg")
  .attr("viewBox", "0 0 200 200")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")

d3.json('data/vietnam.json', function (error, json) {
  vn_json = json
  provinces = topojson.feature(vn_json, vn_json.objects.adm2).features
  vn_drawing = getDrawing(provinces, vn_path, vn_projection, vn_config)
  draw(vn_drawing, vn_svg)
})