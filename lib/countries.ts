export interface Country {
    name: string;
    code: string; // ISO 2-letter
    phoneCode: string;
    flag: string; // Emoji
    currency: string;
    cities: string[];
}

export const defaultCountryName = "Georgia";

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
        name: "Italy",
        code: "IT",
        phoneCode: "+39",
        flag: "🇮🇹",
        currency: "EUR",
        cities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"]
    },
    {
        name: "Spain",
        code: "ES",
        phoneCode: "+34",
        flag: "🇪🇸",
        currency: "EUR",
        cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"]
    },
    {
        name: "Canada",
        code: "CA",
        phoneCode: "+1",
        flag: "🇨🇦",
        currency: "CAD",
        cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"]
    },
    {
        name: "Australia",
        code: "AU",
        phoneCode: "+61",
        flag: "🇦🇺",
        currency: "AUD",
        cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Sunshine Coast", "Wollongong"]
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
    },
    {
        name: "Poland",
        code: "PL",
        phoneCode: "+48",
        flag: "🇵🇱",
        currency: "PLN",
        cities: ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok"]
    },
    {
        name: "Netherlands",
        code: "NL",
        phoneCode: "+31",
        flag: "🇳🇱",
        currency: "EUR",
        cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"]
    },
    {
        name: "Belgium",
        code: "BE",
        phoneCode: "+32",
        flag: "🇧🇪",
        currency: "EUR",
        cities: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst"]
    },
    {
        name: "Sweden",
        code: "SE",
        phoneCode: "+46",
        flag: "🇸🇪",
        currency: "SEK",
        cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"]
    },
    {
        name: "Switzerland",
        code: "CH",
        phoneCode: "+41",
        flag: "🇨🇭",
        currency: "CHF",
        cities: ["Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne"]
    },
    {
        name: "Austria",
        code: "AT",
        phoneCode: "+43",
        flag: "🇦🇹",
        currency: "EUR",
        cities: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn"]
    },
    {
        name: "Kazakhstan",
        code: "KZ",
        phoneCode: "+7",
        flag: "🇰🇿",
        currency: "KZT",
        cities: ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau"]
    },
    {
        name: "Uzbekistan",
        code: "UZ",
        phoneCode: "+998",
        flag: "🇺🇿",
        currency: "UZS",
        cities: ["Tashkent", "Samarkand", "Namangan", "Andijan", "Nukus", "Bukhara", "Fergana", "Qarshi", "Kokand", "Margilan"]
    },
    {
        name: "China",
        code: "CN",
        phoneCode: "+86",
        flag: "🇨🇳",
        currency: "CNY",
        cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Tianjin", "Wuhan", "Dongguan", "Chongqing", "Xi'an"]
    },
    {
        name: "Japan",
        code: "JP",
        phoneCode: "+81",
        flag: "🇯🇵",
        currency: "JPY",
        cities: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama"]
    },
    {
        name: "India",
        code: "IN",
        phoneCode: "+91",
        flag: "🇮🇳",
        currency: "INR",
        cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"]
    }
].sort((a, b) => a.name.localeCompare(b.name));

export const defaultCountry = countries.find(c => c.name === defaultCountryName) || countries[0];
