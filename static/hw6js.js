//Used to prevent multiple responses from being returned before one response has been rendered
var firstTabResponseLoaded = true;
var secondTabResponseLoaded1 = true;
var secondTabResponseLoaded2 = true;
var thirdTabResponseLoaded = true;
var fourthTabResponseLoaded = true;

function submitQuery() {

    if (firstTabResponseLoaded === false || secondTabResponseLoaded1 === false || secondTabResponseLoaded2 === false || thirdTabResponseLoaded === false || fourthTabResponseLoaded === false) {
        return
    }

    //Getting the ticker value which is sent as a parameter through the fetch URL
    var ticker = document.getElementById('searchId');
    tickerValue = String.prototype.toUpperCase.call(ticker.value);
    tickerValue = tickerValue.trim();
    //console.log(ticker.value);


    //Clearing the content under the Latest News tab (if it exists)
    var parent = document.getElementById("news");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }


    //Clearing the green and red arrows added to the DOM under Stock Summary tab
    var divs = document.getElementsByClassName("arrow-images");
    while (divs[0]) {
        divs[0].parentNode.removeChild(divs[0]);
    }


    //Company tab
    firstTabResponseLoaded = false;
    fetch(`${window.origin}/company?param1=${tickerValue}`, {cache: "no-store"})
    .then( response => response.json())
    .then( response => {

        //Toggling between the Error <div> and the Content <div>
        if (JSON.stringify(response) === '{}') {
            var x = document.getElementById("toggleDiv");
            if (x.style.display === "block") {
                x.style.display = "none";
            }
            var y = document.getElementById("errorDiv");
            y.style.display = "block";

        } else {
            var x = document.getElementById("errorDiv");
            if (x.style.display === "block") {
                x.style.display = "none";
            }
            var y = document.getElementById("toggleDiv");
            y.style.display = "block";
            
            //Resetting the active tabs once a search has been made
            var z;
            z = document.getElementsByClassName("content");

            var tablinks;
            tablinks = document.getElementsByClassName("nav-bar-btn");
            for (var i = 0; i < z.length; i++) {
                tablinks[i].className = tablinks[i].className.replace('nav-bar-btn-active-color' , 'nav-bar-btn-color');
            }
            

            com = document.getElementById("company");
            stockSum = document.getElementById("stockSummary");
            ch = document.getElementById("charts");
            n = document.getElementById("news");

            //Setting the tab which was being displayed previously, as active, once a new search has been made
            if (com.style.display === "block") {
                document.getElementById("firstTab").className += " nav-bar-btn-active-color";
            } else if (stockSum.style.display === "block") {
                document.getElementById("secondTab").className += " nav-bar-btn-active-color";
            } else if (ch.style.display === "block") {
                document.getElementById("thirdTab").className += " nav-bar-btn-active-color";
            } else if (n.style.display === "block") {
                document.getElementById("fourthTab").className += " nav-bar-btn-active-color";
            } else {
                document.getElementById("company").style.display = "block";
                document.getElementById("firstTab").className += " nav-bar-btn-active-color";
            }
        }

        //Displaying the content of the Company tab
        var companyLogo = document.getElementById("company-logo");
        companyLogo.setAttribute("src", `${response.logo}`);

        var companyName = document.getElementById("company-name");
        companyName.innerText = `${response.name}`;

        var stockTickerSymbol = document.getElementById("stock-ticker-symbol");
        stockTickerSymbol.innerText = `${response.ticker}`;
        var tickerReturnedByAPI = response.ticker;

        var stockExchangeCode = document.getElementById("stock-exchange-code");
        stockExchangeCode.innerText = `${response.exchange}`;

        var companyIPODate = document.getElementById("company-ipo-date");
        companyIPODate.innerText = `${response.ipo}`;

        var category = document.getElementById("category");
        category.innerText = `${response.finnhubIndustry}`;

        firstTabResponseLoaded = true;

        if (JSON.stringify(response) !== '{}') {

            var stockTickerSymbol2 = document.getElementById("stock-ticker-symbol-2");
            stockTickerSymbol2.innerText = `${tickerValue}`;

            //Stock Summary
            secondTabResponseLoaded1 = false;
            fetch(`${window.origin}/stocksummary?param1=${tickerValue}`, {cache: "no-store"})
            .then( response => response.json())
            .then( response => {

                console.log(response);

                //Getting the right date format which needs to be displayed
                var date = new Date(response.t * 1000);   
                const dayOfMonth = date.getDate();
                const month = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();

                //Displaying the content of the Stock Summary tab
                var tradingDay = document.getElementById("trading-day");
                tradingDay.innerText = `${dayOfMonth} ` + `${month}, ` + `${year}`;

                var previousClosingPrice = document.getElementById("previous-closing-price");
                previousClosingPrice.innerText = `${response.pc}`;

                var openingPrice = document.getElementById("opening-price");
                openingPrice.innerText = `${response.o}`;

                var highPrice = document.getElementById("high-price");
                highPrice.innerText = `${response.h}`;

                var lowPrice = document.getElementById("low-price");
                lowPrice.innerText = `${response.l}`;

                var change = document.getElementById("change");
                var changep = document.getElementById("change-p");
                if (`${response.d}` > 0) {
                        changep.innerHTML = `${response.d}`;
                        change.innerHTML += "<div class='arrow-images' style='display: inline; float: left; padding-left: 2px;'><img src='static/img/GreenArrowUp.png' width='15px' height='15px' /></div>";
                }
                else if (`${response.d}` < 0) {
                    changep.innerHTML = `${response.d}`;
                    change.innerHTML += "<div class='arrow-images' style='display: inline; float: left; padding-left: 2px;'><img src='static/img/RedArrowDown.png' width='15px' height='15px' /></div>";
                }
                else {
                    changep.innerHTML = `${response.d}`;
                }

                var percentChange = document.getElementById("percent-change");
                var percentChangep = document.getElementById("percent-change-p");
                if (`${response.dp}` > 0) {
                    percentChangep.innerHTML = `${response.dp}`;
                    percentChange.innerHTML += "<div class='arrow-images' style='display: inline; float: left; padding-left: 2px;'><img src='static/img/GreenArrowUp.png' width='15px' height='15px' /></div>";
                }
                else if (`${response.d}` < 0) {
                    percentChangep.innerHTML = `${response.dp}`;
                    percentChange.innerHTML += "<div class='arrow-images' style='display: inline; float: left; padding-left: 2px;'><img src='static/img/RedArrowDown.png' width='15px' height='15px' /></div>";
                }
                else {
                    percentChangep.innerHTML = `${response.dp}`;
                }

                secondTabResponseLoaded1 = true;
            })
            .catch((error) => {
                console.error('Error:', error)
            });


            //Recommendation Trends
            secondTabResponseLoaded2 = false;
            fetch(`${window.origin}/recommendationtrends?param1=${tickerValue}`, {cache: "no-store"})
            .then( response => response.json())
            .then( response => {

                console.log(response);

                var strongSell = document.getElementById("strong-sell");
                strongSell.innerText = `${response.strongSell}`;

                var sell = document.getElementById("sell");
                sell.innerText = `${response.sell}`;

                var hold = document.getElementById("hold");
                hold.innerText = `${response.hold}`;

                var buy = document.getElementById("buy");
                buy.innerText = `${response.buy}`;

                var strongBuy = document.getElementById("strong-buy");
                strongBuy.innerText = `${response.strongBuy}`;
                
                secondTabResponseLoaded2 = true;

            })
            .catch((error) => {
                console.error('Error:', error)
            });


            //Charts
            thirdTabResponseLoaded = false;
            fetch(`${window.origin}/charts?param1=${tickerValue}`, {cache: "no-store"})
            .then( response => response.json())
            .then( response => {
                console.log(response);

                var clearCharts = document.getElementById("charts");
                clearCharts.innerHTML = '';

                if (response["t"] && response["c"] && response["v"]) {

                    var timeStockPriceLst = [];
                    var timeVolumeLst = [];

                    //Creating the input data for the charts in the right format
                    for (var i = 0; i < response["t"].length; i++) {
                        timeStockPriceLst.push([response["t"][i]* 1000, response["c"][i]]);
                        timeVolumeLst.push([response["t"][i]* 1000, response["v"][i]]);
                    }

                    // console.log(timeStockPriceLst.length);
                    // console.log(timeVolumeLst.length);

                    //Getting today's date to display in the Chart title
                    var dt = new Date();
                    m = '' + (dt.getMonth() + 1),
                    d = '' + dt.getDate(),
                    y = dt.getFullYear();

                    if (m.length < 2) 
                        m = '0' + m;
                    if (d.length < 2) 
                        d = '0' + d;

                    dt = [y, m, d].join('-');

                    // Create the chart
                    Highcharts.stockChart('charts', {

                        //Sets the initial Zoom level
                        rangeSelector: {
                            selected: 0,

                            inputEnabled: false,

                            buttons: [{
                                type: 'day',
                                count: 7,
                                text: '7d'
                            }, {
                                type: 'day',
                                count: 15,
                                text: '15m'
                            }, {
                                type: 'month',
                                count: 1,
                                text: '1m'
                            }, {
                                type: 'month',
                                count: 3,
                                text: '3m'
                            }, {
                                type: 'month',
                                count: 6,
                                text: '6m'
                            }]
                        },

                        title: {
                            // text: `Stock Price ${tickerReturnedByAPI} ${response["fromDate"]}`
                            text: `Stock Price ${tickerReturnedByAPI} ${dt}`
                        },
                
                        subtitle: {
                            text: '<a id="finnhub-link" href="https://finnhub.io/" target="_blank" style="text-decoration: underline;">Source: Finnhub</a>',
                            useHTML: true
                        },

                        yAxis: [{
                            title: {
                                text: 'Stock Price'
                            },
                            opposite: false
                        },
                        {
                            title: {
                                text: 'Volume'
                            },
                            opposite: true
                        }],

                        series: [{
                            name: 'Stock Price',
                            pointPlacement: 'on',
                            data: timeStockPriceLst,
                            type: 'area',
                            threshold: null,
                            tooltip: {
                                valueDecimals: 2,
                                formatter: function() {
                                    var tooltipArray = ['MONTH: <b>'];
                                    return tooltipArray;
                                }
                            },
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            }
                        },
                        {
                            type: 'column',
                            pointWidth: 3,
                            name: 'Volume',
                            data: timeVolumeLst,
                            yAxis: 1,
                            pointPlacement: 'on'
                        }]
                    });

                }

                thirdTabResponseLoaded = true;

            })
            .catch((error) => {
                console.error('Error:', error)
            });


            //Latest News
            fourthTabResponseLoaded = false;
            fetch(`${window.origin}/latestnews?param1=${tickerValue}`, {cache: "no-store"})
            .then( response => response.json())
            .then( response => {

                //console.log(response);

                let i = 0;
                while (i < Object.keys(response).length) {

                    const parentDiv = document.getElementById("news");

                    const div = document.createElement("div");
                    div.setAttribute("class", "news-item");
                    div.setAttribute("id", "news-item" + `${i}`);
                    parentDiv.appendChild(div);

                    newsItem = document.getElementById("news-item" + `${i}`);

                    const image = document.createElement("img");
                    image.setAttribute("class", "news-logo");
                    image.setAttribute("id", "news-logo" + `${i}`);
                    image.setAttribute("src", `${response[i]["image"]}`);

                    const newsItemText = document.createElement("div");
                    newsItemText.setAttribute("class", "news-item-text");
                    newsItemText.setAttribute("id", "news-item-text" + `${i}`);

                    newsItem.appendChild(image);
                    newsItem.appendChild(newsItemText);

                    const text = document.getElementById("news-item-text" + `${i}`);

                    const headline = document.createElement("h1");
                    headline.setAttribute("class", "headline");
                    headline.innerText = `${response[i]["headline"]}`;

                    const datePublished = document.createElement("p");
                    datePublished.setAttribute("class", "date");

                    var date = new Date(response[i]["datetime"] * 1000);   
                    const dayOfMonth = date.getDate();
                    const month = date.toLocaleString('default', { month: 'long' });
                    const year = date.getFullYear();
                    datePublished.innerText = `${dayOfMonth} ` + `${month}, ` + `${year}`;

                    const linkToPost = document.createElement("a");
                    linkToPost.setAttribute("class", "link-to-post");
                    linkToPost.setAttribute("href", `${response[i]["url"]}`);
                    linkToPost.setAttribute("target", "_blank");
                    linkToPost.innerText = "See Original Post";

                    text.appendChild(headline);
                    text.appendChild(datePublished);
                    text.appendChild(linkToPost);

                    i++;
                }

                fourthTabResponseLoaded = true;

            })
            .catch((error) => {
                console.error('Error:', error)
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error)
    });
    
}


function turnOffDisplay() {

    var x = document.getElementById("toggleDiv");
    var y = document.getElementById("errorDiv");
    x.style.display = "none";
    y.style.display = "none";


    var z;
    z = document.getElementsByClassName("content");
    for (var i = 0; i < z.length; i++) {
        z[i].style.display = "none";
    }


    //Clearing the content under the Latest News tab (if it exists)
    var parent = document.getElementById("news");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }


    //Clearing the green and red arrows added to the DOM under Stock Summary tab
    var divs = document.getElementsByClassName("arrow-images");
    while (divs[0]) {
        divs[0].parentNode.removeChild(divs[0]);
    }

}


//Opening the right tab when a search is made (Content tab, by default, or the tab which was being displayed before the current search was made)
function openTab(e, content) {

    var x, tablinks;

    x = document.getElementsByClassName("content");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("nav-bar-btn");
    for (var i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace('nav-bar-btn-active-color' , 'nav-bar-btn-color');
    }

    document.getElementById(content).style.display = "block";
    e.currentTarget.className += " nav-bar-btn-active-color";
}