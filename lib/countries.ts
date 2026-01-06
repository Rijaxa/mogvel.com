export interface Country {
    name: string;
    code: string; // ISO 2-letter
    phoneCode: string;
    flag: string; // Emoji
    currency: string;
    cities: string[];
}

export const countries: Country[] = [
    {
        name: "Georgia",
        code: "GE",
        phoneCode: "+995",
        flag: "🇬🇪",
        currency: "GEL",
        cities: ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Poti", "Khashuri", "Samtredia", "Senaki"]
    },
    {
        name: "United States",
        code: "US",
        phoneCode: "+1",
        flag: "🇺🇸",
        currency: "USD",
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]
    },
    {
        name: "United Kingdom",
        code: "GB",
        phoneCode: "+44",
        flag: "🇬🇧",
        currency: "GBP",
        cities: ["London", "Birmingham", "Manchester", "Glasgow", "Leeds", "Liverpool", "Newcastle", "Sheffield", "Belfast", "Edinburgh"]
    },
    {
        name: "Germany",
        code: "DE",
        phoneCode: "+49",
        flag: "🇩🇪",
        currency: "EUR",
        cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"]
    },
    {
        name: "France",
        code: "FR",
        phoneCode: "+33",
        flag: "🇫🇷",
        currency: "EUR",
        cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"]
    },
    {
        name: "Turkey",
        code: "TR",
        phoneCode: "+90",
        flag: "🇹🇷",
        currency: "TRY",
        cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep", "Antalya", "Konya", "Kayseri", "Mersin"]
    },
    {
        name: "Azerbaijan",
        code: "AZ",
        phoneCode: "+994",
        flag: "🇦🇿",
        currency: "AZN",
        cities: ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Shirvan", "Nakhchivan", "Sheki", "Yevlakh", "Lankaran", "Khachmaz"]
    },
    {
        name: "Armenia",
        code: "AM",
        phoneCode: "+374",
        flag: "🇦🇲",
        currency: "AMD",
        cities: ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Abovyan", "Kapan", "Hrazdan", "Armavir", "Masis", "Charentsavan"]
    },
    {
        name: "Ukraine",
        code: "UA",
        phoneCode: "+380",
        flag: "🇺🇦",
        currency: "UAH",
        cities: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Mariupol"]
    }
];

export const defaultCountry = countries.find(c => c.name === "Georgia")!;
