// @TODO: YOUR CODE HERE!
// This is fairly "boilerplate" from the homework...
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initialize default axis Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// //**********************************************//

// Retrieve data from the csv file and execute everything below
d3.csv("assets/data/data.csv")
    .then(function(data){
        //Step1:  parse data
        data.forEach(function(data) {
            //x values
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            //y values
            data.obesity = +data.obesity;
            // data.smokes = +data.smokes;
            // data.healthcare = +data.healthcare;
            //console.log(data.poverty);
        });
        
        //Step2: Create scale functions
        // Create function to update xScale function upon click
            //create xscale
        function xScale(data, chosenXaxis){
            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(data, d => d[chosenXaxis]),
                         d3.max(data, d => d[chosenXaxis])])
                .range(([0, width]));
            return xLinearScale;
        }
            //create yscale
        function yScale(data, chosenYAxis){
            var yLinearScale = d3.scaleLinear()
                .domain([d3.min(data, d => d[chosenYAxis]),
                         d3.max(data, d => d[chosenYAxis])])
                .range(([height,0]));
            return yLinearScale;
        }
            // define x and y Linear scale
        var xLinearScale = xScale(data, chosenXAxis);
        var yLinearScale = yScale(data, chosenYAxis);

        //Step3: Create axis functions
        //Create function to update xAxis upon click
        function renderXAxis(newXScale, xAxis) {
            var bottomAxis = d3.axisBottom(newXScale);
            xAxis.transition()
                .duration(1000)
                .call(bottomAxis);
            return xAxis;
        }
        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        

        //Step4:  Create fucntion to update marker group with a transition
            //new markers
        function renderMarkers(markersGroup, newXScale, chosenXAxis) {
            
            markersGroup.transition()
                .duration(1000)
                .attr("cx", d => newXScale(d[chosenXAxis]));
            
            return markersGroup;
        }
            //function used to update markers group with new tooltip
        function updateToolTip(chosenXAxis, markersGroup) {
            if (chosenXAxis === "poverty") {
                var label = "Poverty";
            }
            else if (chosenXAxis === "age") {
                var label = "age";
            }
            else if (chosenXAxis === "income") {
                var label = "income";
            }

            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([80,-60])
                .html(function(d) {
                    return(`${d.value}<br>${d[chosenXAxis]}`);
                });
            markersGroup.call(toolTip);

            markersGroup.on("mouseover", function(data){
                toolTip.show(data);
            })
                // onmouse event
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);
                });

            return markersGroup;
        }

        //Step5:  Append Axes
            //Append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
            // append y axis
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis)
        
        //Step6: Append initial markers
        var markersGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.obesity))
            .attr("r", 12)
            .attr("fill", "pink")
            .attr("opacity", ".5");
        
        // // Create group for 3 x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty %");

        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income(MedianAge");
        
        // // // Create group for 3 y-axis labels
        // var ylabelsGroup = chartGroup.append("g")
            
        // var obesityLabel = ylabelsGroup.append("text")
        //     .attr("transform", "rotate(-90)")    
        //     .attr("y", -50)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .attr("value", "obesity") // value to grab for event listener
        //     .classed("active", true)
        //     .text("Obesity (%)");

        // var smokesLabel = ylabelsGroup.append("text")
        //     .attr("transform", "rotate(-90)")    
        //     .attr("y", -70)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .attr("value", "smokes") // value to grab for event listener
        //     .classed("inactive", true)
        //     .text("Smokes (%)");

        // var healthcareLabel = ylabelsGroup.append("text")
        //     .attr("transform", "rotate(-90)")    
        //     .attr("y", -90)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .attr("value", "income") // value to grab for event listener
        //     .classed("inactive", true)
        //     .text("Lacks Healthcare (%)");


        var markersGroup = updateToolTip(chosenXAxis, markersGroup);

        // // x axis labels event listener
        xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;
                console.log(chosenXAxis)

                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates markers with new x values
                markersGroup = renderMarkers(markersGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                markersGroup = updateToolTip(chosenXAxis, markersGroup);

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
                else if (chosenXAxis === "poverty") {
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        });


    
});


