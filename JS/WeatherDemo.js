const city_and_search = document.getElementsByClassName('city')[0];
const overlay = document.getElementsByClassName('search-overlay')[0];
const close_btn = document.getElementsByClassName('close-btn')[0];
const searchInput = document.getElementsByClassName('search-input')[0];
const searchResults = document.getElementsByClassName('search-results')[0];
const mainCard = document.getElementsByClassName('grid_main')[0];
const subCard = document.getElementsByClassName('grid_temp_humi')[0];
const tempRangeCard = document.getElementsByClassName('grid_high_low')[0];
const container = document.getElementsByClassName('container')[0];

console.log(searchResults);

city_and_search.addEventListener('click',openSearch);
close_btn.addEventListener('click',closeSearch);
searchInput.addEventListener('input', performSearch);

function openSearch() {
    overlay.style.display = 'flex';
    searchInput.value = '';
    searchInput.placeholder = '输入城市名或点击定位按钮';
    searchResults.innerHTML = '';
}

function closeSearch() {
    overlay.style.display = 'none';
}

function performSearch() {
    searchResults.innerHTML = '';
    if (searchInput.value === '') {
        searchInput.placeholder = '请输入搜索关键词';
        return;
    }
    cityMatch(searchInput.value.trim().toLowerCase()).then(matchedCities=>{
        matchedCities.forEach(city=>{
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = city[0];
            resultElement.addEventListener('click',()=>weatherGetter(resultElement));
            searchResults.appendChild(resultElement);
        })
    })
}

function weatherGetter(item) {
    let city = item.innerHTML;
    closeSearch();
    city_and_search.innerHTML = city;
    cityMatch(city).then(cities=>{
        code = cities[0][1];
        apis = ['https://restapi.amap.com/v3/weather/weatherInfo?city='+code+'&key=743825297c9d0da6e7188252624e80ac',
            'https://restapi.amap.com/v3/weather/weatherInfo?city='+code+'&extensions=all&key=743825297c9d0da6e7188252624e80ac']
        return apis;
    }).then(apis => {
        fetch(apis[0])
        .then(response => response.json())
        .then(data => {
            // 习惯了，写成cpp的写法了
            let HTMLin ='<div class="current_temp">'+data.lives[0].temperature+'<div class="centi">℃</div></div>';
            HTMLin += '<div class="grid_centigrade_icon">';
            HTMLin += '<img class="cell main_icon" '+iconGetter(data.lives[0].weather)+'>';
            HTMLin += '<div class="cell centi">'+data.lives[0].weather+'</div>';
            HTMLin += '</div>';
            mainCard.innerHTML = HTMLin;

            HTMLin ='<div class="cell">'+data.lives[0].humidity+'%</div>';
            HTMLin += '<div class="cell">'+data.lives[0].windpower+'级</div>'
            HTMLin += '<div class="cell">'+data.lives[0].winddirection+'风</div>'
            HTMLin += '<div class="cell">湿度</div><div class="cell">风速</div><div class="cell">风向</div>'
            subCard.innerHTML = HTMLin;
        }).catch(error => console.error('Error:', error));

        fetch(apis[1])
        .then(response => response.json())
        .then(data => {
            let HTMLin ='<div class="cell">最高：</div>'+
            '<div class="cell">'+data.forecasts[0].casts[0].daytemp+'℃</div>'+
            '<div class="cell">最低：</div>'+
            '<div class="cell">'+data.forecasts[0].casts[0].nighttemp+'℃</div>';
            tempRangeCard.innerHTML = HTMLin;

            document.querySelectorAll('.grid_forecast').forEach(element => {
                element.remove();
            });
            for(i=1;i<4;i++){
                HTMLin ='<div class="date cell">'+data.forecasts[0].casts[i].date+'</div>'+
                '<img '+iconGetter(data.forecasts[0].casts[i].dayweather)+' class="sub_icon cell">'+
                '<div class="cell">'+data.forecasts[0].casts[i].nighttemp+'℃</div>'+
                '<div class="cell">'+data.forecasts[0].casts[i].daytemp+'℃</div>';
                const resultElement = document.createElement('div');
                resultElement.className = 'grid_forecast';
                resultElement.innerHTML = HTMLin;
                container.appendChild(resultElement);
            }
        }).catch(error => console.error('Error:', error));
    })
}

function iconGetter(name) {
        const basePath = 'assets/icons/';
    switch(name) {
        // 基础天气
        case '晴': return `src="${basePath}sunny.png" alt="晴"`;
        case '多云': return `src="${basePath}cloudy.png" alt="多云"`;
        case '阴': return `src="${basePath}overcast.png" alt="阴"`;
        
        // 降水类
        case '小雨': return `src="${basePath}light-rain.png" alt="小雨"`;
        case '中雨': return `src="${basePath}moderate-rain.png" alt="中雨"`;
        case '大雨': return `src="${basePath}heavy-rain.png" alt="大雨"`;
        case '暴雨': return `src="${basePath}storm.png" alt="暴雨"`;
        case '雷阵雨': return `src="${basePath}thunderstorm.png" alt="雷阵雨"`;
        
        // 降雪类
        case '小雪': return `src="${basePath}light-snow.png" alt="小雪"`;
        case '中雪': return `src="${basePath}moderate-snow.png" alt="中雪"`;
        case '大雪': return `src="${basePath}heavy-snow.png" alt="大雪"`;
        
        // 特殊天气
        case '雾': return `src="${basePath}fog.png" alt="雾"`;
        case '霾': return `src="${basePath}haze.png" alt="霾"`;
        
        default: return `src="${basePath}unknown.png" alt="未知天气"`;
    }
}

async function loadExcelFile() {
    try {
        const url = "assets/AMap_adcode_citycode.xlsx";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const file = await response.arrayBuffer();
        const workbook = XLSX.read(file, { type: "array" });
        return workbook;
    } catch (error) {
        console.error("加载Excel失败:", error);
        throw error;
    }
}

// 调用函数加载Excel
function getCityTable() {
    return loadExcelFile()
    .then(workbook=>{
        return workbook.Sheets[workbook.SheetNames[0]];
    })
    .then(worksheet=>{
        raw_data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        return raw_data;
    })
}

function cityMatch(inputName) {
    return getCityTable().then(cities=>{
        
        const matchedCities = cities.filter(
            city => {
                if(city[0].toLowerCase().includes(inputName))
                    return city;
            }
        );
        console.log(matchedCities);
        return matchedCities;
    })
}

function showError(error) {
    console.log(error);
}
