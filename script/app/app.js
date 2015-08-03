/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
*/
function getData(url, callback) {
    'use strict';

    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name: 'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Asd', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'}
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
*/

/**
  Версия API которая возвращает Promise
*/
function getDataPromise(url) {
    'use strict';

    return new Q.Promise(function (resolve, reject) {
        var RESPONSES = {
            '/countries': [
                {name: 'Cameroon', continent: 'Africa'},
                {name: 'Fiji Islands', continent: 'Oceania'},
                {name: 'Guatemala', continent: 'North America'},
                {name: 'Japan', continent: 'Asia'},
                {name: 'Yugoslavia', continent: 'Europe'},
                {name: 'Tanzania', continent: 'Africa'}
            ],
            '/cities': [
                {name: 'Bamenda', country: 'Cameroon'},
                {name: 'Suva', country: 'Fiji Islands'},
                {name: 'Quetzaltenango', country: 'Guatemala'},
                {name: 'Osaka', country: 'Japan'},
                {name: 'Subotica', country: 'Yugoslavia'},
                {name: 'Zanzibar', country: 'Tanzania'}
            ],
            '/populations': [
                {count: 138000, name: 'Bamenda'},
                {count: 77366, name: 'Suva'},
                {count: 90801, name: 'Quetzaltenango'},
                {count: 2595674, name: 'Osaka'},
                {count: 100386, name: 'Subotica'},
                {count: 157634, name: 'Zanzibar'}
            ]
        };

        setTimeout(function () {
            var result = RESPONSES[url];

            if (!result) {
                reject('Unknown url - ' + url);
            }

            resolve(result);
        }, Math.round(Math.random * 1000));

    });
}

var requests = ['/countries', '/cities', '/populations'],
    responses = {},
    countries,
    cities,
    populations,
    answer,
    i;

/**
  исправленный фрагмент подсчета суммарной популяции Африки, из исправлений - только обертка
*/

for (i = 0; i < 3; i++) {
    (function () {
        var request = requests[i],
            callback = function (error, result) {
                responses[request] = result;
                var l = [];
                for (var key in responses) {
                    l.push(key);
                }

                if (l.length == 3) {
                    var c = [], cc = [], p = 0;
                    for (i = 0; i < responses['/countries'].length; i++) {
                        if (responses['/countries'][i].continent === 'Africa') {
                            c.push(responses['/countries'][i].name);
                        }
                    }

                    for (i = 0; i < responses['/cities'].length; i++) {
                        for (j = 0; j < c.length; j++) {
                            if (responses['/cities'][i].country === c[j]) {
                                cc.push(responses['/cities'][i].name);
                            }
                        }
                    }

                    for (i = 0; i < responses['/populations'].length; i++) {
                        for (j = 0; j < cc.length; j++) {
                            if (responses['/populations'][i].name === cc[j]) {
                                p += responses['/populations'][i].count;
                            }
                        }
                    }

                    console.log('Total population in African cities: ' + p);
                }
            };
        getData(request, callback);
    })();
}

/**
  Вторая часть задания
*/

var isCountry = function (name) {
    return countries.some(function (country) {
        return country.name == name;
    });
};

var countPopulation = function (name) {
    var result = 0,
        error = "No such city or country - ",
        callee = arguments.callee;

    if (!isCountry(name)) {
        populations.forEach(function(item) {
            if (item.name == name) {
                result += item.count;
                error = null;
            }
        });

        if (error) {
            error += name;
        }

        return { 'result' : result, 'error' : error };
    }
    else {
        cities.forEach(function (city) {
            if (city.country == name) {
                var response = callee(city.name);
                result += response.result;
                error = response.error;
            }
        });
    }

    return { 'result' : result, 'error' : error };
};

Q.all([getDataPromise('/countries'), getDataPromise('/cities'), getDataPromise('/populations')])
    .then(
        function (result) {
            countries = result[0];
            cities = result[1];
            populations = result[2];
            name = prompt("Enter country or city", "Cameroon");

            answer = countPopulation(name);

            if (answer.error) {
                console.log(answer.error);
            } else {
                console.log("Population in " + name + ": " + answer.result + ".");
            }
        },
        function (reason) {
            console.log(reason);
        }
    );


