$(function() {
    var world = "asset/map/world.json";
    var zhongguo = "asset/map/data-china.json";
    var hainan = "asset/map/data-hainan.json";
    var xizang = "asset/map/data-xizang.json";
    var zhejiang = "asset/map/data-zhejiang.json";
    var yunnan = "asset/map/data-yunnan.json";
    var xinjiang = "asset/map/data-xinjiang.json";
    var tianjin = "asset/map/data-tianjin.json";
    var sichuan = "asset/map/data-sichuan.json";
    var shanxi = "asset/map/data-shanxi.json";
    var shangxi = "asset/map/data-shangxi.json";
    var shanghai = "asset/map/data-shanghai.json";
    var shangdong = "asset/map/data-shangdong.json";
    var qinghai = "asset/map/data-qinghai.json";
    var ningxia = "asset/map/data-ningxia.json";
    var neimenggu = "asset/map/data-neimenggu.json";
    var liaoning = "asset/map/data-liaoning.json";
    var jilin = "asset/map/data-jilin.json";
    var jiangxi = "asset/map/data-jiangxi.json";
    var jiangsu = "asset/map/data-jiangsu.json";
    var hunan = "asset/map/data-hunan.json";
    var hubei = "asset/map/data-hubei.json";
    var henan = "asset/map/data-henan.json";
    var heilongjiang = "asset/map/data-heilongjiang.json";
    var hebei = "asset/map/data-hebei.json";
    var guizhou = "asset/map/data-guizhou.json";
    var guangxi = "asset/map/data-guangxi.json";
    var guangdong = "asset/map/data-guangdong.json";
    var gansu = "asset/map/data-gansu.json";
    var chongqing = "asset/map/data-chongqing.json";
    var aomen = "asset/map/data-aomen.json";
    var anhui = "asset/map/data-anhui.json";
    var beijing = "asset/map/data-beijing.json";
    var fujian = "asset/map/data-fujian.json";
    var xianggang = "asset/map/data-xianggang.json";

    echarts.extendsMap = function(id, opt) {
        // 实例
        var chart = this.init(document.getElementById(id));

        var curGeoJson = opt.geoJson || {};
        var cityMap = {
            '中国': zhongguo,
            '上海': shanghai,
            '河北': hebei,
            '山西': shangxi,
            '内蒙古': neimenggu,
            '辽宁': liaoning,
            '吉林': jilin,
            '黑龙江': heilongjiang,
            '江苏': jiangsu,
            '浙江': zhejiang,
            '安徽': anhui,
            '福建': fujian,
            '江西': jiangxi,
            '山东': shangdong,
            '河南': henan,
            '湖北': hubei,
            '湖南': hunan,
            '广东': guangdong,
            '广西': guangxi,
            '海南': hainan,
            '四川': sichuan,
            '贵州': guizhou,
            '云南': yunnan,
            '西藏': xizang,
            '陕西': shanxi,
            '甘肃': gansu,
            '青海': qinghai,
            '宁夏': ningxia,
            '新疆': xinjiang,
            '北京': beijing,
            '天津': tianjin,
            '重庆': chongqing,
            '香港': xianggang,
            '澳门': aomen
        };
        var curCityUnder = [];
        var geoCoordMap = {};

        function setGeoCoordMap(geo) {

            var features = geo.features;
            for (var i = 0; i < features.length; i++) {
                var f = features[i].properties;
                geoCoordMap[f.name] = f.cp;
            }
        }

        setGeoCoordMap(curGeoJson);

        var defaultOpt = {
            mapName: 'china', // 地图展示
            goDown: false, // 是否下钻
            bgColor: '#404a59', // 画布背景色
            activeArea: ['新疆', '重庆'], // 区域高亮,同echarts配置项
            data: [],
            // 下钻回调(点击的地图名、实例对象option、实例对象)
            callback: function(name, option, instance) {}
        };
        if (opt) opt = this.util.extend(defaultOpt, opt);

        // 层级索引
        var name = [opt.mapName];
        var idx = 0;
        var pos = {
            leftPlus: 115,
            leftCur: 150,
            left: 198,
            top: 50
        };

        var line = [
            [0, 0],
            [8, 11],
            [0, 22]
        ];
        // style
        var style = {
            font: '18px "Microsoft YaHei", sans-serif',
            textColor: '#eee',
            lineColor: 'rgba(147, 235, 248, .8)'
        };

        var handleEvents = {
            /**
             * i 实例对象
             * o option
             * n 地图名
             **/
            resetOption: function(i, o, n) {
                var breadcrumb = this.createBreadcrumb(n);
                var j = name.indexOf(n);
                var l = o.graphic.length;
                o.series[1].mapType = n;
                if (j < 0) {
                    o.graphic.push(breadcrumb);
                    o.graphic[0].children[0].shape.x2 = 145;
                    o.graphic[0].children[1].shape.x2 = 145;
                    if (o.graphic.length > 2) {
                        var cityData = [];
                        var cityJson;
                        for (var x = 0; x < opt.data.length; x++) {
                            if (n === opt.data[x].city) {
                                $(opt.data[x].cityList).each(function(index, data) {
                                    cityJson = {
                                        name: data.name,
                                        value: data.value
                                    };
                                    cityData.push(cityJson)
                                })
                            }
                        }

                        if (cityData != null) {
                            o.series[0].data = handleEvents.initSeriesData(cityData);
                            o.series[1].data = handleEvents.initSeriesData(cityData);
                        } else {
                            o.series[0].data = [];
                            o.series[1].data = [];
                        }


                    }
                    name.push(n);
                    idx++;
                } else {
                    o.graphic.splice(j + 2, l);
                    if (o.graphic.length <= 2) {
                        o.graphic[0].children[0].shape.x2 = 60;
                        o.graphic[0].children[1].shape.x2 = 60;
                        o.series[0].data = handleEvents.initSeriesData(opt.data);
                        o.series[1].data = handleEvents.initSeriesData(opt.data);
                    };
                    name.splice(j + 1, l);
                    idx = j;
                    pos.leftCur -= pos.leftPlus * (l - j - 1);
                };

                o.geo.map = n;
                o.geo.zoom = 0.4;
                //TODO   o.series[0].data=后端获取数据结果
                o.series[0].data.length = 3;
                i.clear();
                this.zoomAnimation(i, o, function(o, i) {
                    opt.callback(n, o, i);
                });
            },

            /**
             * name 地图名
             **/
            createBreadcrumb: function(name) {
                var cityToPinyin = {
                    '中国': 'zhongguo',
                    '上海': 'shanghai',
                    '河北': 'hebei',
                    '山西': 'shangxi',
                    '内蒙古': 'neimenggu',
                    '辽宁': 'liaoning',
                    '吉林': 'jilin',
                    '黑龙江': 'heilongjiang',
                    '江苏': 'jiangsu',
                    '浙江': 'zhejiang',
                    '安徽': 'anhui',
                    '福建': 'fujian',
                    '江西': 'jiangxi',
                    '山东': 'shangdong',
                    '河南': 'henan',
                    '湖北': 'hubei',
                    '湖南': 'hunan',
                    '广东': 'guangdong',
                    '广西': 'guangxi',
                    '海南': 'hainan',
                    '四川': 'sichuan',
                    '贵州': 'guizhou',
                    '云南': 'yunnan',
                    '西藏': 'xizang',
                    '陕西': 'shanxi',
                    '甘肃': 'gansu',
                    '青海': 'qinghai',
                    '宁夏': 'ningxia',
                    '新疆': 'xinjiang',
                    '北京': 'beijing',
                    '天津': 'tianjin',
                    '重庆': 'chongqing',
                    '香港': 'xianggang',
                    '澳门': 'aomen'
                };
                var breadcrumb = {
                    type: 'group',
                    id: name,
                    left: pos.leftCur + pos.leftPlus,
                    top: pos.top + 3,
                    zlevel: 10,
                    children: [{
                        type: 'polyline',
                        left: -90,
                        top: -5,
                        zlevel: 10,
                        shape: {
                            points: line
                        },
                        style: {
                            stroke: '#fff',
                            key: name,
                            lineWidth: 1
                        },
                        onclick: function() {
                            var name = this.style.key;
                            handleEvents.resetOption(chart, option, name);
                        }
                    }, {
                        type: 'text',
                        left: -68,
                        top: 'middle',
                        zlevel: 10,
                        style: {
                            text: name,
                            textAlign: 'center',
                            fill: style.textColor,
                            font: style.font
                        },
                        onclick: function() {
                            var name = this.style.text;
                            handleEvents.resetOption(chart, option, name);
                        }
                    }, {
                        type: 'text',
                        left: -68,
                        top: 10,
                        zlevel: 10,
                        style: {
                            name: name,
                            text: cityToPinyin[name] ? cityToPinyin[name].toUpperCase() : '',
                            textAlign: 'center',
                            fill: style.textColor,
                            font: '12px "Microsoft YaHei", sans-serif',
                        },
                        onclick: function() {
                            // console.log(this.style);
                            var name = this.style.name;
                            handleEvents.resetOption(chart, option, name);
                        }
                    }]
                }

                pos.leftCur += pos.leftPlus;

                return breadcrumb;
            },

            // 设置effectscatter
            initSeriesData: function(data) {
                var temp = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        temp.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                };
               
                return temp;
            },

            zoomAnimation: function(i, o, fn) {
                var count = null,
                    timer = null;
                var zoom = function(per) {
                    if (!count) count = per;
                    count += per;
                    o.geo.zoom = count;

                    i.setOption(o);
                    if (count < 1) {
                        timer = window.requestAnimationFrame(function() {
                            zoom(0.2);
                        });
                    } else {
                        window.cancelAnimationFrame(timer);
                        //fn.call(null, o, i);
                    }
                };
                timer = window.requestAnimationFrame(function() {
                    zoom(0.2);
                });
            }
        };

        var option = {
            backgroundColor: opt.bgColor,
            tooltip: {
                show: true,
                trigger: 'item',
                alwaysShowContent: false,
                backgroundColor: 'rgba(50,50,50,0.7)',
                hideDelay: 100,
                triggerOn: 'mousemove',
                enterable: true,
                formatter: function(params, ticket, callback) {
                    var html = '名称：' + params.data.name + '<br/>' + '坐标：' + params.data.value;

                    return html;
                }
            },
            graphic: [{
                type: 'group',
                left: pos.left,
                top: pos.top - 4,
                zlevel: 10,
                children: [{
                    type: 'line',
                    left: 0,
                    top: -20,
                    shape: {
                        x1: 0,
                        y1: 0,
                        x2: 60,
                        y2: 0
                    },
                    style: {
                        stroke: style.lineColor,
                    }
                }, {
                    type: 'line',
                    left: 0,
                    top: 20,
                    shape: {
                        x1: 0,
                        y1: 0,
                        x2: 60,
                        y2: 0
                    },
                    style: {
                        stroke: style.lineColor,
                    }
                }]
            }, {
                id: name[idx],
                type: 'group',
                zlevel: 10,
                left: pos.left + 2,
                top: pos.top,
                children: [{
                    type: 'polyline',
                    left: 90,
                    top: -12,
                    shape: {
                        points: line
                    },
                    style: {
                        stroke: 'transparent',
                        key: name[0]
                    },
                    onclick: function() {
                        var name = this.style.key;
                        handleEvents.resetOption(chart, option, name);
                    }
                }, {
                    type: 'text',
                    left: 0,
                    top: 'middle',
                    zlevel: 10,
                    style: {
                        text: '中国',
                        textAlign: 'center',
                        fill: style.textColor,
                        font: style.font
                    },
                    onclick: function() {
                        handleEvents.resetOption(chart, option, '中国');
                    }
                }, {
                    type: 'text',
                    left: 0,
                    top: 10,
                    zlevel: 10,
                    style: {
                        text: 'China',
                        textAlign: 'center',
                        fill: style.textColor,
                        font: '12px "Microsoft YaHei", sans-serif',
                    },
                    onclick: function() {
                        handleEvents.resetOption(chart, option, '中国');
                    }
                }]
            }],
            geo: {
                map: opt.mapName,
                roam: true,
                zoom: 1,
                scaleLimit: {
                    max: 5,
                    min: 0.5
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                regions: opt.activeArea.map(function(item) {
                    if (typeof item !== 'string') {
                        return {
                            name: item.name,
                            itemStyle: {
                                normal: {
                                    areaColor: item.areaColor || '#389BB7'
                                }
                            },
                            label: {
                                normal: {
                                    show: item.showLabel,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        }
                    } else {
                        return {
                            name: item,
                            itemStyle: {
                                normal: {
                                    borderColor: '#91e6ff',
                                    areaColor: '#389BB7'
                                }
                            }
                        }
                    }
                })
            },
            legend: {
                orient: 'horizontal',
                y: '100',
                x: 'center',
                data: ['map', 'shadow'],
                textStyle: {
                    color: '#fff',
                    fontWeight: 'bold'
                }
            },
            series: [{
                name: 'map',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: 60,
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: '#FFC848', //FFC848
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        },
                        rich: {
                            top: {
                                lineHeight: 20,
                                color: '#fff'
                            },
                            bottom: {
                                lineHeight: 20,
                                color: '#fff'
                            },
                            hr: {
                                borderColor: '#777',
                                width: 40,
                                lineHeight: 1,
                                borderWidth: 0.5,
                                height: 0
                            }
                        },
                        formatter: function(p) {
                            return ['{top|' + p.name + '}', '{hr|}', '{bottom|test}'].join("\n");
                        }
                    }
                },
                data:(function(){
                    var d=handleEvents.initSeriesData(opt.data);
                    d.length=3;
                    return d;
                })() 
                
            }, {
                name: 'shadow',
                type: 'map',
                roam: true,
                mapType: opt.mapName,
                geoIndex: 0,
                data: handleEvents.initSeriesData(opt.data)
            }]
        };

        chart.setOption(option);
        // 添加事件
        chart.on('click', function(params) {
            var _self = this;
            if (opt.goDown && params.name !== name[idx]) {
                if (cityMap[params.name]) {
                    var url = cityMap[params.name];
                    $.get(url, function(response) {

                        curGeoJson = response;

                        setGeoCoordMap(curGeoJson);

                        var data = [];
                        $.each(curGeoJson.features, function(idx, val) {
                            data.push({
                                name: val.properties.name,
                                value: val.properties.childNum
                            });
                        });

                        $.each(opt.data, function(idx, val) {
                            if (val.name == params.name) {
                                val['city'] = params.name;
                                val['cityList'] = data;
                                return;
                            }
                        });

                        setGeoCoordMap(response);

                        echarts.registerMap(params.name, response);
                        handleEvents.resetOption(_self, option, params.name);
                    });
                }
            }
        });

        chart.setMap = function(mapName) {
            var _self = this;
            if (mapName.indexOf('市') < 0) mapName = mapName + '市';
            var citySource = cityMap[mapName];
            if (citySource) {
                var url = '.asset/map/' + citySource + '.json';
                $.get(url, function(response) {
                    curGeoJson = response;
                    echarts.registerMap(mapName, response);
                    handleEvents.resetOption(_self, option, mapName);
                });
            }

        };

        return chart;
    };

    //加载中国地图
    // world  zhongguo
    $.getJSON(zhongguo, function(geoJson) {
        echarts.registerMap('中国', geoJson);
        var data = [];
        $.each(geoJson.features, function(idx, val) {
            data[val.properties.name] = val.properties.cp;
        });
        var myChart = echarts.extendsMap('chart-panel', {
            geoJson: geoJson,
            bgColor: '#154e90', // 画布背景色
            mapName: '中国', // 地图名
            goDown: true, // 是否下钻
            data: function() {
                var data = [];
                $.each(geoJson.features, function(idx, val) {
                    data.push({
                        name: val.properties.name,
                        value: val.properties.childNum
                    });
                });
                return data;
            }(),
            // 下钻回调
            callback: function(name, option, instance) {
                console.log(name, option, instance);
            },

        });
    })


});