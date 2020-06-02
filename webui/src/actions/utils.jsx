const URL_REGEX = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);

export function isUrl(x) {
    return x.match(URL_REGEX);
}

export function image(src) {
    return window.APP_CONTEXT_PATH + '/images/' + src;
}


export function humanSize(size) {
    const K = 1024;
    if (size < K) {
        return `${size} bytes`;
    } else if (size < K * K) {
        return `${(size/K).toFixed(2)} KiB`;
    } else if (size < K * K * K) {
        return `${(size/K/K).toFixed(2)} MiB`;
    } else {
        return `${(size/K/K/K).toFixed(2)} GiB`;
    }
}

export function processLanguage(language) {
    const array = LANG_MAP[language];
    if (array && array.length) {
        return {
            label: array[0],
            value: array[1],
        }
    }
    return null;
}

export function processMediatype(mediatype) {
    if (mediatype) {
        return {
            label: mediatype,
            value: mediatype,
        }
    }
    return null;
}


export const iso_639_3_to_639_1 = function(lang3) {
    return ISO_639_3_TO_639_1_MAP[lang3];
}

const LANG_MAP = {
    "en": ["English", "eng"],
    "eng": ["English", "eng"],
    "cop": ["Coptic", "cop"],
    "got": ["Gothic", "got"],
    "grc": ["Ancient Greek", "grc"],
    "af": ["Afrikaans", "afr"],
    "afr": ["Afrikaans", "afr"],
    "sq": ["Albanian", "sqi"],
    "sqi": ["Albanian", "sqi"],
    "ar": ["Arabic", "ara"],
    "ara": ["Arabic", "ara"],
    "hy": ["Armenian", "hye"],
    "hye": ["Armenian", "hye"],
    "eu": ["Basque", "eus"],
    "eus": ["Basque", "eus"],
    "be": ["Belarusian", "bel"],
    "bel": ["Belarusian", "bel"],
    "bs": ["Bosnian", "bos"],
    "bos": ["Bosnian", "bos"],
    "bg": ["Bulgarian", "bul"],
    "bul": ["Bulgarian", "bul"],
    "ca": ["Catalan", "cat"],
    "cat": ["Catalan", "cat"],
    "hr": ["Croatian", "hrv"],
    "hrv": ["Croatian", "hrv"],
    "cu": ["Old Church Slavonic", "chu"],
    "chu": ["Old Church Slavonic", "chu"],
    "cs": ["Czech", "ces"],
    "ces": ["Czech", "ces"],
    "da": ["Danish", "dan"],
    "dan": ["Danish", "dan"],
    "nl": ["Dutch", "nld"],
    "nld": ["Dutch", "nld"],
    "eo": ["Esperanto", "epo"],
    "epo": ["Esperanto", "epo"],
    "et": ["Estonian", "est"],
    "est": ["Estonian", "est"],
    "ga": ["Irish", "gle"],
    "gle": ["Irish", "gle"],
    "fi": ["Finnish", "fin"],
    "fin": ["Finnish", "fin"],
    "fr": ["French", "fra"],
    "fra": ["French", "fra"],
    "fy": ["Frisian", "fry"],
    "fry": ["Frisian", "fry"],
    "gl": ["Galician", "glg"],
    "glg": ["Galician", "glg"],
    "ka": ["Georgian", "kat"],
    "kat": ["Georgian", "kat"],
    "de": ["German", "deu"],
    "deu": ["German", "deu"],
    "el": ["Greek", "ell"],
    "ell": ["Greek", "ell"],
    "he": ["Hebrew", "heb"],
    "heb": ["Hebrew", "heb"],
    "hi": ["Hindu", "hin"],
    "hin": ["Hindu", "hin"],
    "hu": ["Hungarian", "hun"],
    "hun": ["Hungarian", "hun"],
    "is": ["Icelandic", "isl"],
    "isl": ["Icelandic", "isl"],
    "id": ["Indonesian", "ind"],
    "ind": ["Indonesian", "ind"],
    "it": ["Italian", "ita"],
    "ita": ["Italian", "ita"],
    "ja": ["Japanese", "jpn"],
    "jpn": ["Japanese", "jpn"],
    "kn": ["Kannada", "kan"],
    "kan": ["Kannada", "kan"],
    "kk": ["Kazakh", "kaz"],
    "kaz": ["Kazakh", "kaz"],
    "ko": ["Korean", "kor"],
    "kor": ["Korean", "kor"],
    "ku": ["Kurdish", "kur"],
    "kur": ["Kurdish", "kur"],
    "la": ["Latin", "lat"],
    "lat": ["Latin", "lat"],
    "lv": ["Latvian", "lav"],
    "lav": ["Latvian", "lav"],
    "lt": ["Lithuanian", "lit"],
    "lit": ["Lithuanian", "lit"],
    "mk": ["Macedonian", "mkd"],
    "mkd": ["Macedonian", "mkd"],
    "ml": ["Malagasy", "mlg"],
    "mlg": ["Malagasy", "mlg"],
    "no": ["Norwegian", "nor"],
    "nor": ["Norwegian", "nor"],
    "nb": ["Norwegian Bokmål", "nob"],
    "nob": ["Norwegian Bokmål", "nob"],
    "nn": ["Norwegian Nynorsk", "nno"],
    "nno": ["Norwegian Nynorsk", "nno"],
    "fa": ["Persian", "fas"],
    "fas": ["Persian", "fas"],
    "pl": ["Polish", "pol"],
    "pol": ["Polish", "pol"],
    "pt": ["Portuguese", "por"],
    "por": ["Portuguese", "por"],
    "ro": ["Romanian", "ron"],
    "ron": ["Romanian", "ron"],
    "ru": ["Russian", "rus"],
    "rus": ["Russian", "rus"],
    "sa": ["Sanskrit", "san"],
    "san": ["Sanskrit", "san"],
    "sr": ["Serbian", "srp"],
    "srp": ["Serbian", "srp"],
    "sk": ["Slovak", "slk"],
    "slk": ["Slovak", "slk"],
    "sl": ["Slovenian", "slv"],
    "slv": ["Slovenian", "slv"],
    "es": ["Spanish", "spa"],
    "spa": ["Spanish", "spa"],
    "sw": ["Swahili", "swa"],
    "swa": ["Swahili", "swa"],
    "sv": ["Swedish", "swe"],
    "swe": ["Swedish", "swe"],
    "ta": ["Tamil", "tam"],
    "tam": ["Tamil", "tam"],
    "th": ["Thai", "tha"],
    "tha": ["Thai", "tha"],
    "tr": ["Turkish", "tur"],
    "tur": ["Turkish", "tur"],
    "uk": ["Ukrainian", "ukr"],
    "ukr": ["Ukrainian", "ukr"],
    "ur": ["Urdu", "urd"],
    "urd": ["Urdu", "urd"],
    "ug": ["Uighur", "uig"],
    "uig": ["Uighur", "uig"],
    "vi": ["Vietnamese", "vie"],
    "vie": ["Vietnamese", "vie"],
    "cy": ["Welsh", "cym"],
    "cym": ["Welsh", "cym"],
    "zh": ["Chinese", "zho"],
    "zho": ["Chinese", "zho"],
}

// no ISO 639-1 code for Ancient Greek (grc), Coptic (cop), Gothic (got)
const ISO_639_3_TO_639_1_MAP = {
    "generic" : "generic",
    "afr": "af",
    "ara": "ar",
    "bel": "be",
    "bos": "bs",
    "bul": "bg",
    "cat": "ca",
    "ces": "cs",
    "chu": "cu",
    "cop": "xx",
    "cym": "cy",
    "dan": "da",
    "deu": "de",
    "ell": "el",
    "eng": "en",
    "epo": "eo",
    "est": "et",
    "eus": "eu",
    "fas": "fa",
    "fin": "fi",
    "fra": "fr",
    "fry": "fy",
    "gle": "ga",
    "glg": "gl",
    "got": "xx",
    "grc": "xx",
    "heb": "he",
    "hin": "hi",
    "hrv": "hr",
    "hun": "hu",
    "hye": "hy",
    "ind": "id",
    "isl": "is",
    "ita": "it",
    "jpn": "ja",
    "kan": "kn",
    "kat": "ka",
    "kaz": "kk",
    "kor": "ko",
    "kur": "ku",
    "lat": "la",
    "lav": "lv",
    "lit": "lt",
    "mkd": "mk",
    "mlg": "ml",
    "nld": "nl",
    "nno": "nn",
    "nob": "nb",
    "nor": "no",
    "pol": "pl",
    "por": "pt",
    "ron": "ro",
    "rus": "ru",
    "san": "sa",
    "slk": "sk",
    "slv": "sl",
    "spa": "es",
    "sqi": "sq",
    "srp": "sr",
    "swa": "sw",
    "swe": "sv",
    "tam": "ta",
    "tur": "tr",
    "uig": "ug",
    "ukr": "uk",
    "urd": "ur",
    "vie": "vi",
    "zho": "zh",
}
