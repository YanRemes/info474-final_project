// Define the SVG canvas dimensions
const width = 600;
const height = 400;

// Create the SVG canvas
const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load the data from the CSV file
d3.csv('combined_monthly.csv').then(data => {
  // Convert the temperature and precipitation data to numbers
  data.forEach(d => {
    d.actual_mean_temp = +d.actual_mean_temp;
    d.actual_min_temp = +d.actual_min_temp;
    d.actual_max_temp = +d.actual_max_temp;
    d.average_min_temp = +d.average_min_temp;
    d.average_max_temp = +d.average_max_temp;
    d.record_min_temp = +d.record_min_temp;
    d.record_max_temp = +d.record_max_temp;
    d.record_min_temp_year = +d.record_min_temp_year;
    d.record_max_temp_year = +d.record_max_temp_year;
    d.actual_precipitation = +d.actual_precipitation;
    d.average_precipitation = +d.average_precipitation;
    d.record_precipitation = +d.record_precipitation;
  });

  // Define the scale for the circle color based on actual_mean_temp
  const colorScale = d3.scaleQuantize()
    .domain(d3.extent(data, d => d.actual_mean_temp))
    .range(['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000','#8b0000','#5b0000','#3a0000','#260000','#1a0000']);

  // Define the function to filter the data based on the selected city
  const filterData = city => {
    if (city === 'all-cities') {
      return data;
    } else if (city === 'only-charlotte') {
      return data.filter(d => d.city === 'Charlotte');
    } else if (city === 'only-losangeles') {
      return data.filter(d => d.city === 'Los Angeles');
    } else if (city === 'only-indianapolis') {
      return data.filter(d => d.city === 'Indianapolis');
    } else if (city === 'only-jacksonville') {
      return data.filter(d => d.city === 'Jacksonville');
    } else if (city === 'only-chicago') {
      return data.filter(d => d.city === 'Chicago');
    } else if (city === 'only-philadelphia') {
      return data.filter(d => d.city === 'Philadelphia');
    } else if (city === 'only-pheonix') {
      return data.filter(d => d.city === 'Pheonix');
    } else if (city === 'only-houston') {
      return data.filter(d => d.city === 'Houston');
    } else if (city === 'only-newyork') {
      return data.filter(d => d.city === 'New York');
    } else if (city === 'only-seattle') {
      return data.filter(d => d.city === 'Seattle');
    }
  };

  // Define the constant radius for the circles
  const circleRadius = 40;

  // Define the function to handle the category select change event
  const onCategoryChanged = () => {
    const selectedCity = d3.select('#categorySelect').property('value');
    const filteredData = filterData(selectedCity);

    svg.selectAll('circle').remove();
    // svg.selectAll('text').remove();
    svg.selectAll('.label').remove();
  
    // Bind the filtered data to circles
    svg.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => (i % 4) * 100 + 50)
      .attr('cy', (d, i) => Math.floor(i / 4) * 100 + 50)
      .attr('fill', d => colorScale(d.actual_mean_temp))
      .attr('r', circleRadius);  
    // Add the month and year labels to each circle
    const dateParser = d3.timeParse('%Y-%m');
    const dateFormatter = d3.timeFormat('%b %Y');
    svg.selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .text(d => dateFormatter(dateParser(d.date)))
      .attr('x', (d, i) => (i % 4) * 100 + 50)
      .attr('y', (d, i) => Math.floor(i / 4) * 100 + 50)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr("class", 'label');
  };
  // Define the legend scale
const legendScale = d3.scaleLinear()
.domain(d3.extent(data, d => d.actual_mean_temp))
.range([0, 175]);

// Create the legend group
const legendGroup = svg.append('g')
.attr('class', 'legend')
.attr('transform', `translate(${width - 200}, 40)`);

// Add the legend title
legendGroup.append('text')
.attr('class', 'legend-title')
.text('Temperature (°F)')
.attr('x', 20)
.attr('y', -5)

// Add the legend axis
const legendAxis = d3.axisBottom(legendScale)
.tickValues(colorScale.domain())
.tickFormat(d3.format('.0f'));

legendGroup.append('g')
.attr('class', 'legend-axis')
.attr('transform', 'translate(0, 10)')
.call(legendAxis);


// Add the legend color scale
legendGroup.selectAll('.legend-color')
.data(colorScale.range())
.enter()
.append('rect')
.attr('class', 'legend-color')
.attr('x', (d, i) => i * 17.5)
.attr('y', 30)
.attr('width', 20)
.attr('height', 15)
.attr('fill', d => d);

  // Add the category select dropdown to the DOM
  const categorySelect = d3.select('#categorySelect');
  categorySelect.on('change', onCategoryChanged);
});
