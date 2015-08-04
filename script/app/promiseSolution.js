(function () {
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

    var cities,
        populations,
        answer,
        name;

    var isCountry = function (name) {
        return cities.some(function (city) {
            return city.country == name;
        });
    };

    var isCity = function () {
        return cities.some(function (city) {
            return city.name == name;
        });
    }

    var countPopulationCity = function (name) {
        var result = 0;

        populations.forEach(function (city) {
            if (city.name == name) {
                result = city.count;
            }
        });

        return result;
    }

    var countPopulation = function (name) {
        var result = 0;

        if (isCountry(name)) {
            cities.forEach(function (city) {
                if (city.country == name) {
                    result += countPopulationCity(city.name);
                }
            });

            return { result: result, error: null };
        }

        if (isCity(name)) {
            result = countPopulationCity(name);

            return { result: result, error: null };
        }

        return { result: null, error: "No such city or country - " + name + "." };
    };

    Q.all([getDataPromise('/cities'), getDataPromise('/populations')])
        .then(
            function (result) {
                cities = result[0];
                populations = result[1];
                name = prompt("Enter country or city", "Cameroon");

                answer = countPopulation(name);

                console.log("/---------------- Promise solution ----------------/")
                if (answer.error) {
                    console.log(answer.error)
                }
                else {
                    console.log("Population in " + name + ": " + answer.result + ".");
                }


            },
            function (reason) {
                console.log(reason);
            }
        );
})();
