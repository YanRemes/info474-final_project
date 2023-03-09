// Define the SVG canvas dimensions
const width = 1000;
const height = 2000;

// Create the SVG canvas
const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

  const tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(d => {
    return `<strong>${d.city}</strong><br>
    <strong>Date:</strong> ${d.date}<br>
    <strong>Min Actual temp:</strong> ${d.actual_min_temp.toFixed(0)}&deg;F<br>
    <strong>Max Actual temp:</strong> ${d.actual_max_temp.toFixed(0)}&deg;F<br>
    <strong>Min Average temp:</strong> ${d.average_min_temp.toFixed(0)}&deg;F<br>
    <strong>Max Average temp:</strong> ${d.average_max_temp.toFixed(0)}&deg;F<br>
    <strong>Min Recorded temp:</strong> ${d.record_min_temp.toFixed(0)}&deg;F<br>
    <strong>Max Recorded temp:</strong> ${d.record_max_temp.toFixed(0)}&deg;F`;
  });

// Call the tooltip on the SVG element
svg.call(tooltip);

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
    chart = svg.append('svg').attr('class', 'chart')

    svg.selectAll('circle').remove();
    svg.selectAll('.chart text').remove();
    svg.selectAll('.bar').remove();
    svg.selectAll('chart y axis').remove();
  
    // Bind the filtered data to circles
    chart.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => (i % 4) * 100 + 90)
      .attr('cy', (d, i) => Math.floor(i / 4) * 100 + 50)
      .attr('fill', d => colorScale(d.actual_mean_temp))
      .attr('r', circleRadius)
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);
    // Add the month and year labels to each circle
    const dateParser = d3.timeParse('%Y-%m');
    const dateFormatter = d3.timeFormat('%b %Y');
    chart.selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .text(d => dateFormatter(dateParser(d.date)))
      .attr('x', (d, i) => (i % 4) * 100 + 90)
      .attr('y', (d, i) => Math.floor(i / 4) * 100 + 50)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr("class", 'label')

      
      
      var x = d3.scaleBand()
    .range([0, 400])
    .padding(0.1);
    
var y = d3.scaleLinear()
    .range([500, 200]);

    x.domain(filteredData.map(function(d) { return d.date; }));
    const yMin = d3.min(filteredData, function(d) { return d.average_precipitation; });
const yMax = d3.max(filteredData, function(d) { return d.average_precipitation; });
y.domain([yMin, yMax]);

    chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(40, 700)")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-90)")
    .attr("dx", "-.8em")
    .attr("dy", "-.5em")
    .style("text-anchor", "end");

  // Draw the y axis
  chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(40, 200)")
      .call(d3.axisLeft(y).ticks(10));

  // Draw the bars
  chart.selectAll(".bar")
      .data(filteredData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date) + 40; })
      .attr("y", function(d) { return y(d.average_precipitation); })
      .attr("width", x.bandwidth())
      .attr("transform", "translate(0, 200)")
      .attr('fill', 'steelblue')
      .attr("height", function(d) { return 500 - y(d.average_precipitation);
});
  };
  // Define the legend scale
const legendScale = d3.scaleLinear()
.domain(d3.extent(data, d => d.actual_mean_temp))
.range([0, 175]);

// Create the legend group
const legendGroup = svg.append('g')
.attr('class', 'legend')
.attr('transform', `translate(${width - 500}, 20)`);

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
