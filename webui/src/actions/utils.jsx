

export function image(src) {
    return window.APP_CONTEXT_PATH + '/images/' + src;
}

export function processLanguage(language) {
    var languageName = null;
    var threeLetterCode = null;

    if (language == "en" || language == "eng") {
        languageName = "English";
        threeLetterCode = "eng";
    } else if (language == "cop") {
        languageName = "Coptic";
        threeLetterCode = "cop";
    } else if (language == "got") {
        languageName = "Gothic";
        threeLetterCode = "got";
    } else if (language == "grc") {
        languageName = "Ancient Greek";
        threeLetterCode = "grc";
    } else if (language == "af" || language == "afr") {
        languageName = "Afrikaans";
        threeLetterCode = "afr";
    } else if (language == "sq" || language == "sqi") {
        languageName = "Albanian";
        threeLetterCode = "sqi";
    } else if (language == "ar" || language == "ara") {
        languageName = "Arabic";
        threeLetterCode = "ara";
    } else if (language == "hy" || language == "hye") {
        languageName = "Armenian";
        threeLetterCode = "hye";
    } else if (language == "eu" || language == "eus") {
        languageName = "Basque";
        threeLetterCode = "eus";
    } else if (language == "be" || language == "bel") {
        languageName = "Belarusian";
        threeLetterCode = "bel";
    } else if (language == "bs" || language == "bos") {
        languageName = "Bosnian";
        threeLetterCode = "bos";
    } else if (language == "bg" || language == "bul") {
        languageName = "Bulgarian";
        threeLetterCode = "bul";
    } else if (language == "ca" || language == "cat") {
        languageName = "Catalan";
        threeLetterCode = "cat";
    } else if (language == "hr" || language == "hrv") {
        languageName = "Croatian";
        threeLetterCode = "hrv";
    } else if (language == "cu" || language == "chu") {
        languageName = "Old Church Slavonic";
        threeLetterCode = "chu";
    } else if (language == "cs" || language == "ces") {
        languageName = "Czech";
        threeLetterCode = "ces";
    } else if (language == "da" || language == "dan") {
        languageName = "Danish";
        threeLetterCode = "dan";
    } else if (language == "nl" || language == "nld") {
        languageName = "Dutch";
        threeLetterCode = "nld";
    } else if (language == "eo" || language == "epo") {
        languageName = "Esperanto";
        threeLetterCode = "epo";
    } else if (language == "et" || language == "est") {
        languageName = "Estonian";
        threeLetterCode = "est";
    } else if (language == "ga" || language == "gle") {
        languageName = "Irish";
        threeLetterCode = "gle";
    } else if (language == "fi" || language == "fin") {
        languageName = "Finnish";
        threeLetterCode = "fin";
    } else if (language == "fr" || language == "fra") {
        languageName = "French";
        threeLetterCode = "fra";
    } else if (language == "fy" || language == "fry") {
        languageName = "Frisian";
        threeLetterCode = "fry";
    } else if (language == "gl" || language == "glg") {
        languageName = "Galician";
        threeLetterCode = "glg";
    } else if (language == "ka" || language == "kat") {
        languageName = "Georgian";
        threeLetterCode = "kat";
    } else if (language == "de" || language == "deu") {
        languageName = "German";
        threeLetterCode = "deu";
    } else if (language == "el" || language == "ell") {
        languageName = "Greek";
        threeLetterCode = "ell";
    } else if (language == "he" || language == "heb") {
        languageName = "Hebrew";
        threeLetterCode = "heb";
    } else if (language == "hi" || language == "hin") {
        languageName = "Hindu";
        threeLetterCode = "hin";
    } else if (language == "hu" || language == "hun") {
        languageName = "Hungarian";
        threeLetterCode = "hun";
    } else if (language == "is" || language == "isl") {
        languageName = "Icelandic";
        threeLetterCode = "isl";
    } else if (language == "id" || language == "ind") {
        languageName = "Indonesian";
        threeLetterCode = "ind";
    } else if (language == "it" || language == "ita") {
        languageName = "Italian";
        threeLetterCode = "ita";
    } else if (language == "ja" || language == "jpn") {
        languageName = "Japanese";
        threeLetterCode = "jpn";
    } else if (language == "kn" || language == "kan") {
        languageName = "Kannada";
        threeLetterCode = "kan";
    } else if (language == "kk" || language == "kaz") {
        languageName = "Kazakh";
        threeLetterCode = "kaz";
    } else if (language == "ko" || language == "kor") {
        languageName = "Korean";
        threeLetterCode = "kor";
    } else if (language == "ku" || language == "kur") {
        languageName = "Kurdish";
        threeLetterCode = "kur";
    } else if (language == "la" || language == "lat") {
        languageName = "Latin";
        threeLetterCode = "lat";
    } else if (language == "lv" || language == "lav") {
        languageName = "Latvian";
        threeLetterCode = "lav";
    } else if (language == "lt" || language == "lit") {
        languageName = "Lithuanian";
        threeLetterCode = "lit";
    } else if (language == "mk" || language == "mkd") {
        languageName = "Macedonian";
        threeLetterCode = "mkd";
    } else if (language == "ml" || language == "mlg") {
        languageName = "Malagasy";
        threeLetterCode = "mlg";
    } else if (language == "no" || language == "nor") {
        languageName = "Norwegian";
        threeLetterCode = "nor";
    } else if (language == "nb" || language == "nob") {
        languageName = "Norwegian Bokmål";
        threeLetterCode = "nob";
    } else if (language == "nn" || language == "nno") {
        languageName = "Norwegian Nynorsk";
        threeLetterCode = "nno";
    } else if (language == "fa" || language == "fas") {
        languageName = "Persian";
        threeLetterCode = "fas";
    } else if (language == "pl" || language == "pol") {
        languageName = "Polish";
        threeLetterCode = "pol";
    } else if (language == "pt" || language == "por") {
        languageName = "Portuguese";
        threeLetterCode = "por";
    } else if (language == "ro" || language == "ron") {
        languageName = "Romanian";
        threeLetterCode = "ron";
    } else if (language == "ru" || language == "rus") {
        languageName = "Russian";
        threeLetterCode = "rus";
    } else if (language == "sa" || language == "san") {
        languageName = "Sanskrit";
        threeLetterCode = "san";
    } else if (language == "sr" || language == "srp") {
        languageName = "Serbian";
        threeLetterCode = "srp";
    } else if (language == "sk" || language == "slk") {
        languageName = "Slovak";
        threeLetterCode = "slk";
    } else if (language == "sl" || language == "slv") {
        languageName = "Slovenian";
        threeLetterCode = "slv";
    } else if (language == "es" || language == "spa") {
        languageName = "Spanish";
        threeLetterCode = "spa";
    } else if (language == "sw" || language == "swa") {
        languageName = "Swahili";
        threeLetterCode = "swa";
    } else if (language == "sv" || language == "swe") {
        languageName = "Swedish";
        threeLetterCode = "swe";
    } else if (language == "ta" || language == "tam") {
        languageName = "Tamil";
        threeLetterCode = "tam";
    } else if (language == "th" || language == "tha") {
        languageName = "Thai";
        threeLetterCode = "tha";
    } else if (language == "tr" || language == "tur") {
        languageName = "Turkish";
        threeLetterCode = "tur";
    } else if (language == "uk" || language == "ukr") {
        languageName = "Ukrainian";
        threeLetterCode = "ukr";
    } else if (language == "ur" || language == "urd") {
        languageName = "Urdu";
        threeLetterCode = "urd";
    } else if (language == "ug" || language == "uig") {
        languageName = "Uighur";
        threeLetterCode = "uig";
    } else if (language == "vi" || language == "vie") {
        languageName = "Vietnamese";
        threeLetterCode = "vie";
    } else if (language == "cy" || language == "cym") {
        languageName = "Welsh";
        threeLetterCode = "cym";
    } else if (language == "zh" || language == "zho") {
        languageName = "Chinese";
        threeLetterCode = "zho";
    } else {
        languageName = "Please identify language";
        threeLetterCode = "any";
    }

    console.log('util/processLanguage', languageName, threeLetterCode)

    return {
        language  : languageName,
        threeLetterCode: threeLetterCode
    };
}
