var module = angular.module("myApp",[]);

module.controller("myEmp",function($scope, $http){
    //fetching data from the mocker api. 
    $http.get('http://mocker.egen.io/users/bulk')
    .success(function(response){
        //retrieving emails from response
        var email = new Array(response.length);
        for(var i=0; i<response.length ; i++){            
            email[i] = response[i].email.substring(response[i].email.lastIndexOf("@")+1,response[i].email.lastIndexOf("."));
        }

        //getting distinct categories of email address users use
        var filteredEmail = email.filter(function(item, pos){
            return email.indexOf(item)== pos; 
        });
         
        //Counting different number of users in each e-mail service
        var emailObj = new  Array(filteredEmail.length);         
        var temp = 0;
        for(var i=0;i<filteredEmail.length;i++) {
            emailObj[filteredEmail[i]] = 0;
        }
        for(var i=0; i<email.length; i++){ 
            temp = emailObj[email[i]];
            emailObj[email[i]] = ++temp;
        }

       //Creating an object that contains key as email category and value as user count
        var data=[];
        for(var i=0; i<filteredEmail.length; i++)
        {
            var obj = {key: filteredEmail[i] ,value: emailObj[filteredEmail[i]]}; 
            data.push(obj);
        }
        console.log(data);

        //Initializing all the scaling attributes required for bar chart
        var margin = {top: 50, right: 20, bottom: 70, left: 50},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    
        //Range of x nd y axis
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().range([height, 0]);
        
        //alligning the x nd y axis and declaring number of ticks
        var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(data.length);
                           
        var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);
        
        //selecting SVG element and appending x and y groups            
        var svg = d3.select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");
        
        //Declaring domain for x and y axis                
        x.domain(data.map(function(d) { return d.key; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
      
        //Appending x-axis to svg group
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        //Appending y-axis to svg group
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency of users");
        
        //plotting bars depending on data    
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });
      
    }); 
    
});