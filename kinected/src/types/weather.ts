export type WeatherData = {
    list: {
        dt_txt: string;
        main: {
            temp: number;
            temp_max: number;
            temp_min: number;
        };
        weather: {
            main: string;
        }[];
    }[];
};

export type ActualWeather = {
    main: {
        temp: number;
    };
    weather: {
        main: string;
    }[];
};

export type DailyWeather = {
    date: string;
    temp: number;
    maxTemp: number;
    minTemp: number;
    weather: string;
};
