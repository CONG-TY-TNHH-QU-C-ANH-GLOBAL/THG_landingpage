// Auto-generated from legacy PricingDatabase.js
// Contains real VND-denominated pricing for 25+ countries

export interface PriceEntry {
  weight: string;
  price: string;
}

export type PricingCategory = Record<string, PriceEntry[]>;

export interface OriginPricing {
  standard: PricingCategory;
  cosmetics: PricingCategory;
}

export type PricingDatabase = Record<string, OriginPricing>;

// Auto-generated Smart Pricing Database
export const countryNames: Record<string, string> = {
  "US": "Mỹ (Hoa Kỳ)",
  "UK": "Vương Quốc Anh",
  "DE": "Đức",
  "FR": "Pháp",
  "IT": "Ý (Italia)",
  "ES": "Tây Ban Nha",
  "NL": "Hà Lan",
  "BE": "Bỉ",
  "IE": "Ireland",
  "SE": "Thụy Điển",
  "CH": "Thụy Sĩ",
  "AT": "Áo",
  "PL": "Ba Lan",
  "GR": "Hy Lạp",
  "LV": "Latvia",
  "CA": "Canada",
  "BR": "Brazil",
  "MX": "Mexico",
  "CL": "Chile",
  "HK": "Hồng Kông",
  "AU": "Úc (Australia)",
  "SG": "Singapore",
  "MY": "Malaysia",
  "TH": "Thái Lan",
  "PH": "Philippines",
  "AE": "UAE (Dubai)",
  "SA": "Ả Rập Xê Út",
  "ZA": "Nam Phi",
  "EU1": "Các nước EU1",
  "EU2": "Các nước EU2"
};

export const pricingData: PricingDatabase = {
  "vn": {
    "standard": {
      "US": [
        {
          "weight": "0.05",
          "price": "118,206"
        },
        {
          "weight": "0.1",
          "price": "122,671"
        },
        {
          "weight": "0.15",
          "price": "151,092"
        },
        {
          "weight": "0.2",
          "price": "155,347"
        },
        {
          "weight": "0.25",
          "price": "176,040"
        },
        {
          "weight": "0.3",
          "price": "192,309"
        },
        {
          "weight": "0.35",
          "price": "212,328"
        },
        {
          "weight": "0.4",
          "price": "232,753"
        },
        {
          "weight": "0.45",
          "price": "270,216"
        },
        {
          "weight": "0.5",
          "price": "301,052"
        },
        {
          "weight": "0.55",
          "price": "327,568"
        },
        {
          "weight": "0.6",
          "price": "327,568"
        },
        {
          "weight": "0.65",
          "price": "340,335"
        },
        {
          "weight": "0.7",
          "price": "354,084"
        },
        {
          "weight": "0.75",
          "price": "361,530"
        }
      ],
      "EU1": [
        {
          "weight": "0.1",
          "price": "173,761"
        },
        {
          "weight": "0.1",
          "price": "183,805"
        },
        {
          "weight": "0.5",
          "price": "312,703"
        },
        {
          "weight": "0.5",
          "price": "311,364"
        },
        {
          "weight": "1.0",
          "price": "486,130"
        },
        {
          "weight": "1.0",
          "price": "502,535"
        },
        {
          "weight": "1.5",
          "price": "669,935"
        },
        {
          "weight": "1.5",
          "price": "682,322"
        },
        {
          "weight": "2.0",
          "price": "884,980"
        },
        {
          "weight": "2.0",
          "price": "903,322"
        },
        {
          "weight": "5.0",
          "price": "2,050,453"
        },
        {
          "weight": "5.0",
          "price": "2,130,580"
        },
        {
          "weight": "10.0",
          "price": "3,930,552"
        },
        {
          "weight": "10.0",
          "price": "3,841,830"
        }
      ],
      "UK": [
        {
          "weight": "0.1",
          "price": "165,852"
        },
        {
          "weight": "0.5",
          "price": "285,142"
        },
        {
          "weight": "1.0",
          "price": "433,930"
        },
        {
          "weight": "1.5",
          "price": "582,718"
        },
        {
          "weight": "2.0",
          "price": "754,034"
        },
        {
          "weight": "5.0",
          "price": "1,931,530"
        },
        {
          "weight": "10.0",
          "price": "3,663,716"
        }
      ],
      "CA": [
        {
          "weight": "0.1",
          "price": "224,960"
        },
        {
          "weight": "0.5",
          "price": "400,001"
        },
        {
          "weight": "1.0",
          "price": "618,802"
        },
        {
          "weight": "1.5",
          "price": "837,603"
        },
        {
          "weight": "2.0",
          "price": "1,114,312"
        },
        {
          "weight": "5.0",
          "price": "2,596,211"
        },
        {
          "weight": "10.0",
          "price": "5,041,753"
        }
      ],
      "HK": [
        {
          "weight": "0.1",
          "price": "97,080"
        },
        {
          "weight": "0.5",
          "price": "145,038"
        },
        {
          "weight": "1.0",
          "price": "196,826"
        },
        {
          "weight": "1.5",
          "price": "248,614"
        },
        {
          "weight": "2.0",
          "price": "344,057"
        },
        {
          "weight": "5.0",
          "price": "973,613"
        },
        {
          "weight": "10.0",
          "price": "1,851,444"
        }
      ],
      "AU": [
        {
          "weight": "0.1",
          "price": "148,602"
        },
        {
          "weight": "0.5",
          "price": "271,812"
        },
        {
          "weight": "1.0",
          "price": "425,825"
        },
        {
          "weight": "1.5",
          "price": "579,838"
        },
        {
          "weight": "2.0",
          "price": "812,019"
        },
        {
          "weight": "5.0",
          "price": "1,852,717"
        },
        {
          "weight": "10.0",
          "price": "3,229,481"
        }
      ],
      "SG": [
        {
          "weight": "0.1",
          "price": "100,530"
        },
        {
          "weight": "0.5",
          "price": "164,136"
        },
        {
          "weight": "1.0",
          "price": "243,642"
        },
        {
          "weight": "1.5",
          "price": "323,149"
        },
        {
          "weight": "2.0",
          "price": "434,856"
        },
        {
          "weight": "5.0",
          "price": "1,069,823"
        },
        {
          "weight": "10.0",
          "price": "2,154,103"
        }
      ],
      "BR": [
        {
          "weight": "0.1",
          "price": "308,081"
        },
        {
          "weight": "0.5",
          "price": "609,410"
        },
        {
          "weight": "1.0",
          "price": "968,858"
        },
        {
          "weight": "1.5",
          "price": "1,328,306"
        },
        {
          "weight": "2.0",
          "price": "1,745,417"
        },
        {
          "weight": "5.0",
          "price": "4,248,081"
        },
        {
          "weight": "10.0",
          "price": "8,419,188"
        }
      ],
      "MX": [
        {
          "weight": "0.1",
          "price": "240,111"
        },
        {
          "weight": "0.5",
          "price": "480,094"
        },
        {
          "weight": "1.0",
          "price": "762,028"
        },
        {
          "weight": "1.5",
          "price": "1,043,962"
        },
        {
          "weight": "2.0",
          "price": "1,353,042"
        },
        {
          "weight": "5.0",
          "price": "3,212,525"
        },
        {
          "weight": "10.0",
          "price": "6,311,663"
        }
      ],
      "MY": [
        {
          "weight": "0.1",
          "price": "96,654"
        },
        {
          "weight": "0.5",
          "price": "129,431"
        },
        {
          "weight": "1.0",
          "price": "170,404"
        },
        {
          "weight": "1.5",
          "price": "211,377"
        },
        {
          "weight": "2.0",
          "price": "252,350"
        },
        {
          "weight": "5.0",
          "price": "499,183"
        },
        {
          "weight": "10.0",
          "price": "910,571"
        }
      ],
      "PH": [
        {
          "weight": "0.1",
          "price": "103,980"
        },
        {
          "weight": "0.5",
          "price": "149,700"
        },
        {
          "weight": "1.0",
          "price": "206,850"
        },
        {
          "weight": "1.5",
          "price": "264,000"
        },
        {
          "weight": "2.0",
          "price": "321,150"
        },
        {
          "weight": "5.0",
          "price": "664,050"
        },
        {
          "weight": "10.0",
          "price": "1,235,550"
        }
      ],
      "CL": [
        {
          "weight": "0.1",
          "price": "258,958"
        },
        {
          "weight": "0.5",
          "price": "451,133"
        },
        {
          "weight": "1.0",
          "price": "691,351"
        },
        {
          "weight": "1.5",
          "price": "931,569"
        },
        {
          "weight": "2.0",
          "price": "1,228,881"
        },
        {
          "weight": "5.0",
          "price": "3,012,698"
        },
        {
          "weight": "10.0",
          "price": "5,985,726"
        }
      ],
      "AE": [
        {
          "weight": "0.1",
          "price": "134,815"
        },
        {
          "weight": "0.5",
          "price": "248,343"
        },
        {
          "weight": "1.0",
          "price": "390,253"
        },
        {
          "weight": "1.5",
          "price": "532,163"
        },
        {
          "weight": "2.0",
          "price": "684,249"
        },
        {
          "weight": "5.0",
          "price": "1,515,690"
        },
        {
          "weight": "10.0",
          "price": "3,206,351"
        }
      ],
      "SA": [
        {
          "weight": "0.1",
          "price": "187,034"
        },
        {
          "weight": "0.5",
          "price": "373,425"
        },
        {
          "weight": "1.0",
          "price": "606,415"
        },
        {
          "weight": "1.5",
          "price": "839,404"
        },
        {
          "weight": "2.0",
          "price": "1,072,394"
        },
        {
          "weight": "5.0",
          "price": "2,333,028"
        },
        {
          "weight": "10.0",
          "price": "4,045,672"
        }
      ]
    },
    "cosmetics": {
      "US": [
        {
          "weight": "0.05",
          "price": "305,006"
        },
        {
          "weight": "0.1",
          "price": "332,316"
        },
        {
          "weight": "0.15",
          "price": "356,184"
        },
        {
          "weight": "0.2",
          "price": "382,347"
        },
        {
          "weight": "0.25",
          "price": "364,905"
        },
        {
          "weight": "0.3",
          "price": "388,773"
        },
        {
          "weight": "0.35",
          "price": "412,641"
        },
        {
          "weight": "0.4",
          "price": "436,509"
        },
        {
          "weight": "0.45",
          "price": "460,377"
        },
        {
          "weight": "0.5",
          "price": "472,770"
        },
        {
          "weight": "0.55",
          "price": "495,491"
        },
        {
          "weight": "0.6",
          "price": "518,211"
        },
        {
          "weight": "0.65",
          "price": "540,932"
        },
        {
          "weight": "0.7",
          "price": "563,652"
        },
        {
          "weight": "0.75",
          "price": "531,293"
        },
        {
          "weight": "0.8",
          "price": "552,177"
        },
        {
          "weight": "0.85",
          "price": "573,062"
        },
        {
          "weight": "0.9",
          "price": "593,946"
        },
        {
          "weight": "0.95",
          "price": "614,831"
        },
        {
          "weight": "1.0",
          "price": "635,715"
        }
      ],
      "UK": [
        {
          "weight": "0.1",
          "price": "196,911"
        },
        {
          "weight": "0.2",
          "price": "221,697"
        },
        {
          "weight": "0.3",
          "price": "246,483"
        },
        {
          "weight": "0.4",
          "price": "271,269"
        },
        {
          "weight": "0.5",
          "price": "296,055"
        },
        {
          "weight": "0.6",
          "price": "320,841"
        },
        {
          "weight": "0.7",
          "price": "345,627"
        },
        {
          "weight": "0.8",
          "price": "370,413"
        },
        {
          "weight": "0.9",
          "price": "395,199"
        },
        {
          "weight": "1.0",
          "price": "419,985"
        },
        {
          "weight": "1.5",
          "price": "543,915"
        },
        {
          "weight": "2.0",
          "price": "667,845"
        },
        {
          "weight": "3.0",
          "price": "915,705"
        },
        {
          "weight": "4.0",
          "price": "1,163,565"
        },
        {
          "weight": "5.0",
          "price": "1,411,425"
        },
        {
          "weight": "10.0",
          "price": "2,650,725"
        }
      ],
      "FR": [
        {
          "weight": "0.1",
          "price": "241,434"
        },
        {
          "weight": "0.2",
          "price": "278,613"
        },
        {
          "weight": "0.3",
          "price": "315,792"
        },
        {
          "weight": "0.4",
          "price": "352,971"
        },
        {
          "weight": "0.5",
          "price": "390,150"
        },
        {
          "weight": "0.6",
          "price": "427,329"
        },
        {
          "weight": "0.7",
          "price": "464,508"
        },
        {
          "weight": "0.8",
          "price": "501,687"
        },
        {
          "weight": "0.9",
          "price": "538,866"
        },
        {
          "weight": "1.0",
          "price": "576,045"
        },
        {
          "weight": "1.5",
          "price": "761,940"
        },
        {
          "weight": "2.0",
          "price": "947,835"
        },
        {
          "weight": "3.0",
          "price": "1,319,625"
        },
        {
          "weight": "4.0",
          "price": "1,691,415"
        },
        {
          "weight": "5.0",
          "price": "2,063,205"
        },
        {
          "weight": "10.0",
          "price": "3,922,155"
        }
      ],
      "DE": [
        {
          "weight": "0.1",
          "price": "219,861"
        },
        {
          "weight": "0.2",
          "price": "249,237"
        },
        {
          "weight": "0.3",
          "price": "278,613"
        },
        {
          "weight": "0.4",
          "price": "317,169"
        },
        {
          "weight": "0.5",
          "price": "346,545"
        },
        {
          "weight": "0.6",
          "price": "375,921"
        },
        {
          "weight": "0.7",
          "price": "405,297"
        },
        {
          "weight": "0.8",
          "price": "434,673"
        },
        {
          "weight": "0.9",
          "price": "464,049"
        },
        {
          "weight": "1.0",
          "price": "493,425"
        },
        {
          "weight": "1.5",
          "price": "640,305"
        },
        {
          "weight": "2.0",
          "price": "787,185"
        },
        {
          "weight": "3.0",
          "price": "1,080,945"
        },
        {
          "weight": "4.0",
          "price": "1,374,705"
        },
        {
          "weight": "5.0",
          "price": "1,668,465"
        },
        {
          "weight": "10.0",
          "price": "3,137,265"
        }
      ],
      "IT": [
        {
          "weight": "0.1",
          "price": "251,991"
        },
        {
          "weight": "0.2",
          "price": "290,547"
        },
        {
          "weight": "0.3",
          "price": "329,103"
        },
        {
          "weight": "0.4",
          "price": "367,659"
        },
        {
          "weight": "0.5",
          "price": "406,215"
        },
        {
          "weight": "0.6",
          "price": "444,771"
        },
        {
          "weight": "0.7",
          "price": "483,327"
        },
        {
          "weight": "0.8",
          "price": "521,883"
        },
        {
          "weight": "0.9",
          "price": "560,439"
        },
        {
          "weight": "1.0",
          "price": "598,995"
        },
        {
          "weight": "1.5",
          "price": "791,775"
        },
        {
          "weight": "2.0",
          "price": "984,555"
        },
        {
          "weight": "3.0",
          "price": "1,370,115"
        },
        {
          "weight": "4.0",
          "price": "1,755,675"
        },
        {
          "weight": "5.0",
          "price": "2,141,235"
        },
        {
          "weight": "10.0",
          "price": "4,069,035"
        }
      ],
      "ES": [
        {
          "weight": "0.1",
          "price": "216,189"
        },
        {
          "weight": "0.2",
          "price": "251,073"
        },
        {
          "weight": "0.3",
          "price": "285,957"
        },
        {
          "weight": "0.4",
          "price": "320,841"
        },
        {
          "weight": "0.5",
          "price": "355,725"
        },
        {
          "weight": "0.6",
          "price": "390,609"
        },
        {
          "weight": "0.7",
          "price": "425,493"
        },
        {
          "weight": "0.8",
          "price": "460,377"
        },
        {
          "weight": "0.9",
          "price": "495,261"
        },
        {
          "weight": "1.0",
          "price": "530,145"
        },
        {
          "weight": "1.5",
          "price": "704,565"
        },
        {
          "weight": "2.0",
          "price": "878,985"
        },
        {
          "weight": "3.0",
          "price": "1,227,825"
        },
        {
          "weight": "4.0",
          "price": "1,576,665"
        },
        {
          "weight": "5.0",
          "price": "1,925,505"
        },
        {
          "weight": "10.0",
          "price": "3,669,705"
        }
      ],
      "NL": [
        {
          "weight": "0.1",
          "price": "252,909"
        },
        {
          "weight": "0.2",
          "price": "292,383"
        },
        {
          "weight": "0.3",
          "price": "331,857"
        },
        {
          "weight": "0.4",
          "price": "371,331"
        },
        {
          "weight": "0.5",
          "price": "410,805"
        },
        {
          "weight": "0.6",
          "price": "450,279"
        },
        {
          "weight": "0.7",
          "price": "489,753"
        },
        {
          "weight": "0.8",
          "price": "529,227"
        },
        {
          "weight": "0.9",
          "price": "568,701"
        },
        {
          "weight": "1.0",
          "price": "608,175"
        },
        {
          "weight": "1.5",
          "price": "805,545"
        },
        {
          "weight": "2.0",
          "price": "1,002,915"
        },
        {
          "weight": "3.0",
          "price": "1,397,655"
        },
        {
          "weight": "4.0",
          "price": "1,792,395"
        },
        {
          "weight": "5.0",
          "price": "2,187,135"
        },
        {
          "weight": "10.0",
          "price": "4,160,835"
        }
      ],
      "BE": [
        {
          "weight": "0.1",
          "price": "249,237"
        },
        {
          "weight": "0.2",
          "price": "294,220"
        },
        {
          "weight": "0.3",
          "price": "339,201"
        },
        {
          "weight": "0.4",
          "price": "384,183"
        },
        {
          "weight": "0.5",
          "price": "429,165"
        },
        {
          "weight": "0.6",
          "price": "474,147"
        },
        {
          "weight": "0.7",
          "price": "519,129"
        },
        {
          "weight": "0.8",
          "price": "564,111"
        },
        {
          "weight": "0.9",
          "price": "609,093"
        },
        {
          "weight": "1.0",
          "price": "654,075"
        },
        {
          "weight": "1.5",
          "price": "878,985"
        },
        {
          "weight": "2.0",
          "price": "1,103,895"
        },
        {
          "weight": "3.0",
          "price": "1,553,715"
        },
        {
          "weight": "4.0",
          "price": "2,003,535"
        },
        {
          "weight": "5.0",
          "price": "2,453,355"
        },
        {
          "weight": "10.0",
          "price": "4,702,455"
        }
      ],
      "IE": [
        {
          "weight": "0.1",
          "price": "253,827"
        },
        {
          "weight": "0.2",
          "price": "298,809"
        },
        {
          "weight": "0.3",
          "price": "343,791"
        },
        {
          "weight": "0.4",
          "price": "388,773"
        },
        {
          "weight": "0.5",
          "price": "433,755"
        },
        {
          "weight": "0.6",
          "price": "478,737"
        },
        {
          "weight": "0.7",
          "price": "523,719"
        },
        {
          "weight": "0.8",
          "price": "523,719"
        },
        {
          "weight": "0.9",
          "price": "523,719"
        },
        {
          "weight": "1.0",
          "price": "523,719"
        },
        {
          "weight": "1.5",
          "price": "523,719"
        },
        {
          "weight": "2.0",
          "price": "523,719"
        },
        {
          "weight": "3.0",
          "price": "523,719"
        },
        {
          "weight": "4.0",
          "price": "523,719"
        },
        {
          "weight": "5.0",
          "price": "523,719"
        },
        {
          "weight": "10.0",
          "price": "523,719"
        }
      ],
      "SE": [
        {
          "weight": "0.1",
          "price": "204,255"
        },
        {
          "weight": "0.2",
          "price": "236,385"
        },
        {
          "weight": "0.3",
          "price": "268,515"
        },
        {
          "weight": "0.4",
          "price": "331,857"
        },
        {
          "weight": "0.5",
          "price": "364,905"
        },
        {
          "weight": "0.6",
          "price": "397,953"
        },
        {
          "weight": "0.7",
          "price": "431,001"
        },
        {
          "weight": "0.8",
          "price": "464,049"
        },
        {
          "weight": "0.9",
          "price": "497,097"
        },
        {
          "weight": "1.0",
          "price": "530,145"
        },
        {
          "weight": "1.5",
          "price": "695,385"
        },
        {
          "weight": "2.0",
          "price": "860,625"
        },
        {
          "weight": "3.0",
          "price": "1,191,105"
        },
        {
          "weight": "4.0",
          "price": "1,521,585"
        },
        {
          "weight": "5.0",
          "price": "1,852,065"
        },
        {
          "weight": "10.0",
          "price": "3,504,465"
        }
      ],
      "CH": [
        {
          "weight": "0.1",
          "price": "346,545"
        },
        {
          "weight": "0.2",
          "price": "383,265"
        },
        {
          "weight": "0.3",
          "price": "419,985"
        },
        {
          "weight": "0.4",
          "price": "456,705"
        },
        {
          "weight": "0.5",
          "price": "493,425"
        },
        {
          "weight": "0.6",
          "price": "530,145"
        },
        {
          "weight": "0.7",
          "price": "566,865"
        },
        {
          "weight": "0.8",
          "price": "603,585"
        },
        {
          "weight": "0.9",
          "price": "640,305"
        },
        {
          "weight": "1.0",
          "price": "677,025"
        },
        {
          "weight": "1.5",
          "price": "860,625"
        },
        {
          "weight": "2.0",
          "price": "1,044,225"
        },
        {
          "weight": "3.0",
          "price": "1,411,425"
        },
        {
          "weight": "4.0",
          "price": "1,778,625"
        },
        {
          "weight": "5.0",
          "price": "2,145,825"
        },
        {
          "weight": "10.0",
          "price": "3,981,825"
        }
      ],
      "AT": [
        {
          "weight": "0.1",
          "price": "243,270"
        },
        {
          "weight": "0.2",
          "price": "277,695"
        },
        {
          "weight": "0.3",
          "price": "312,120"
        },
        {
          "weight": "0.4",
          "price": "346,545"
        },
        {
          "weight": "0.5",
          "price": "380,970"
        },
        {
          "weight": "0.6",
          "price": "415,395"
        },
        {
          "weight": "0.7",
          "price": "449,820"
        },
        {
          "weight": "0.8",
          "price": "484,245"
        },
        {
          "weight": "0.9",
          "price": "518,670"
        },
        {
          "weight": "1.0",
          "price": "553,095"
        },
        {
          "weight": "1.5",
          "price": "725,220"
        },
        {
          "weight": "2.0",
          "price": "897,345"
        },
        {
          "weight": "3.0",
          "price": "1,241,595"
        },
        {
          "weight": "4.0",
          "price": "1,585,845"
        },
        {
          "weight": "5.0",
          "price": "1,930,095"
        },
        {
          "weight": "10.0",
          "price": "3,651,345"
        }
      ]
    }
  },
  "cn": {
    "standard": {
      "US": [
        {
          "weight": "0.1",
          "price": "$6.84"
        },
        {
          "weight": "0.2",
          "price": "$9.00"
        },
        {
          "weight": "0.3",
          "price": "$11.07"
        },
        {
          "weight": "0.4",
          "price": "$13.50"
        },
        {
          "weight": "0.5",
          "price": "$15.89"
        },
        {
          "weight": "0.6",
          "price": "$18.36"
        },
        {
          "weight": "0.7",
          "price": "$20.82"
        },
        {
          "weight": "0.8",
          "price": "$21.89"
        },
        {
          "weight": "0.9",
          "price": "$24.34"
        },
        {
          "weight": "1.0",
          "price": "$26.79"
        },
        {
          "weight": "1.1",
          "price": "$29.23"
        },
        {
          "weight": "1.2",
          "price": "$31.68"
        },
        {
          "weight": "1.3",
          "price": "$34.13"
        },
        {
          "weight": "1.4",
          "price": "$36.57"
        }
      ],
      "UK": [
        {
          "weight": "0.1",
          "price": "$4.20"
        },
        {
          "weight": "0.2",
          "price": "$5.54"
        },
        {
          "weight": "0.3",
          "price": "$6.88"
        },
        {
          "weight": "0.4",
          "price": "$8.36"
        },
        {
          "weight": "0.5",
          "price": "$9.73"
        },
        {
          "weight": "0.6",
          "price": "$11.11"
        },
        {
          "weight": "0.7",
          "price": "$12.48"
        },
        {
          "weight": "0.8",
          "price": "$13.86"
        },
        {
          "weight": "0.9",
          "price": "$15.23"
        },
        {
          "weight": "1.0",
          "price": "$16.61"
        },
        {
          "weight": "1.1",
          "price": "$18.38"
        },
        {
          "weight": "1.2",
          "price": "$19.79"
        },
        {
          "weight": "1.3",
          "price": "$21.20"
        },
        {
          "weight": "1.4",
          "price": "$22.61"
        }
      ],
      "DE": [
        {
          "weight": "0.1",
          "price": "$5.54"
        },
        {
          "weight": "0.2",
          "price": "$6.96"
        },
        {
          "weight": "0.3",
          "price": "$8.57"
        },
        {
          "weight": "0.4",
          "price": "$10.00"
        },
        {
          "weight": "0.5",
          "price": "$11.52"
        },
        {
          "weight": "0.6",
          "price": "$13.04"
        },
        {
          "weight": "0.7",
          "price": "$14.55"
        },
        {
          "weight": "0.8",
          "price": "$16.07"
        },
        {
          "weight": "0.9",
          "price": "$17.59"
        },
        {
          "weight": "1.0",
          "price": "$19.11"
        },
        {
          "weight": "1.1",
          "price": "$20.63"
        },
        {
          "weight": "1.2",
          "price": "$22.14"
        },
        {
          "weight": "1.3",
          "price": "$23.66"
        },
        {
          "weight": "1.4",
          "price": "$25.18"
        }
      ],
      "FR": [
        {
          "weight": "0.1",
          "price": "$5.04"
        },
        {
          "weight": "0.2",
          "price": "$7.04"
        },
        {
          "weight": "0.3",
          "price": "$8.75"
        },
        {
          "weight": "0.4",
          "price": "$10.54"
        },
        {
          "weight": "0.5",
          "price": "$12.32"
        },
        {
          "weight": "0.6",
          "price": "$14.39"
        },
        {
          "weight": "0.7",
          "price": "$16.11"
        },
        {
          "weight": "0.8",
          "price": "$17.82"
        },
        {
          "weight": "0.9",
          "price": "$19.54"
        },
        {
          "weight": "1.0",
          "price": "$21.25"
        },
        {
          "weight": "1.1",
          "price": "$22.96"
        },
        {
          "weight": "1.2",
          "price": "$24.68"
        },
        {
          "weight": "1.3",
          "price": "$26.39"
        },
        {
          "weight": "1.4",
          "price": "$28.11"
        }
      ],
      "IT": [
        {
          "weight": "0.1",
          "price": "$5.82"
        },
        {
          "weight": "0.2",
          "price": "$7.18"
        },
        {
          "weight": "0.3",
          "price": "$8.54"
        },
        {
          "weight": "0.4",
          "price": "$9.89"
        },
        {
          "weight": "0.5",
          "price": "$11.25"
        },
        {
          "weight": "0.6",
          "price": "$12.61"
        },
        {
          "weight": "0.7",
          "price": "$13.96"
        },
        {
          "weight": "0.8",
          "price": "$15.32"
        },
        {
          "weight": "0.9",
          "price": "$16.68"
        },
        {
          "weight": "1.0",
          "price": "$18.04"
        },
        {
          "weight": "1.1",
          "price": "$19.39"
        },
        {
          "weight": "1.2",
          "price": "$20.75"
        },
        {
          "weight": "1.3",
          "price": "$22.11"
        },
        {
          "weight": "1.4",
          "price": "$23.46"
        }
      ],
      "ES": [
        {
          "weight": "0.1",
          "price": "$4.70"
        },
        {
          "weight": "0.2",
          "price": "$6.18"
        },
        {
          "weight": "0.3",
          "price": "$7.66"
        },
        {
          "weight": "0.4",
          "price": "$9.14"
        },
        {
          "weight": "0.5",
          "price": "$10.63"
        },
        {
          "weight": "0.6",
          "price": "$12.11"
        },
        {
          "weight": "0.7",
          "price": "$13.59"
        },
        {
          "weight": "0.8",
          "price": "$15.07"
        },
        {
          "weight": "0.9",
          "price": "$16.55"
        },
        {
          "weight": "1.0",
          "price": "$18.04"
        },
        {
          "weight": "1.1",
          "price": "$19.52"
        },
        {
          "weight": "1.2",
          "price": "$21.00"
        },
        {
          "weight": "1.3",
          "price": "$22.48"
        },
        {
          "weight": "1.4",
          "price": "$23.96"
        }
      ],
      "NL": [
        {
          "weight": "0.1",
          "price": "$5.50"
        },
        {
          "weight": "0.2",
          "price": "$7.25"
        },
        {
          "weight": "0.3",
          "price": "$8.71"
        },
        {
          "weight": "0.4",
          "price": "$10.25"
        },
        {
          "weight": "0.5",
          "price": "$11.79"
        },
        {
          "weight": "0.6",
          "price": "$13.32"
        },
        {
          "weight": "0.7",
          "price": "$14.86"
        },
        {
          "weight": "0.8",
          "price": "$16.39"
        },
        {
          "weight": "0.9",
          "price": "$17.93"
        },
        {
          "weight": "1.0",
          "price": "$19.46"
        },
        {
          "weight": "1.1",
          "price": "$21.00"
        },
        {
          "weight": "1.2",
          "price": "$22.54"
        },
        {
          "weight": "1.3",
          "price": "$24.07"
        },
        {
          "weight": "1.4",
          "price": "$25.61"
        }
      ],
      "AT": [
        {
          "weight": "0.1",
          "price": "$5.84"
        },
        {
          "weight": "0.1",
          "price": "$5.39"
        },
        {
          "weight": "0.2",
          "price": "$7.57"
        },
        {
          "weight": "0.2",
          "price": "$7.06"
        },
        {
          "weight": "0.3",
          "price": "$9.30"
        },
        {
          "weight": "0.3",
          "price": "$8.73"
        },
        {
          "weight": "0.4",
          "price": "$11.04"
        },
        {
          "weight": "0.4",
          "price": "$10.40"
        },
        {
          "weight": "0.5",
          "price": "$12.77"
        },
        {
          "weight": "0.5",
          "price": "$12.07"
        },
        {
          "weight": "0.6",
          "price": "$14.50"
        },
        {
          "weight": "0.6",
          "price": "$13.74"
        },
        {
          "weight": "0.7",
          "price": "$16.23"
        },
        {
          "weight": "0.7",
          "price": "$15.41"
        },
        {
          "weight": "0.8",
          "price": "$17.96"
        },
        {
          "weight": "0.8",
          "price": "$17.09"
        },
        {
          "weight": "0.9",
          "price": "$19.70"
        },
        {
          "weight": "0.9",
          "price": "$18.76"
        },
        {
          "weight": "1.0",
          "price": "$21.43"
        },
        {
          "weight": "1.0",
          "price": "$20.43"
        },
        {
          "weight": "1.1",
          "price": "$23.16"
        },
        {
          "weight": "1.1",
          "price": "$22.10"
        },
        {
          "weight": "1.2",
          "price": "$24.89"
        },
        {
          "weight": "1.2",
          "price": "$23.77"
        },
        {
          "weight": "1.3",
          "price": "$26.63"
        },
        {
          "weight": "1.3",
          "price": "$25.44"
        },
        {
          "weight": "1.4",
          "price": "$28.36"
        },
        {
          "weight": "1.4",
          "price": "$27.11"
        }
      ],
      "PL": [
        {
          "weight": "0.1",
          "price": "$3.57"
        },
        {
          "weight": "0.2",
          "price": "$5.18"
        },
        {
          "weight": "0.3",
          "price": "$7.18"
        },
        {
          "weight": "0.4",
          "price": "$8.68"
        },
        {
          "weight": "0.5",
          "price": "$10.18"
        },
        {
          "weight": "0.6",
          "price": "$11.68"
        },
        {
          "weight": "0.7",
          "price": "$13.18"
        },
        {
          "weight": "0.8",
          "price": "$14.68"
        },
        {
          "weight": "0.9",
          "price": "$16.18"
        },
        {
          "weight": "1.0",
          "price": "$17.68"
        },
        {
          "weight": "1.1",
          "price": "$19.18"
        },
        {
          "weight": "1.2",
          "price": "$20.68"
        },
        {
          "weight": "1.3",
          "price": "$22.18"
        },
        {
          "weight": "1.4",
          "price": "$23.68"
        }
      ],
      "CA": [
        {
          "weight": "0.1",
          "price": "$5.23"
        },
        {
          "weight": "0.2",
          "price": "$6.75"
        },
        {
          "weight": "0.3",
          "price": "$8.25"
        },
        {
          "weight": "0.4",
          "price": "$9.75"
        },
        {
          "weight": "0.5",
          "price": "$11.52"
        },
        {
          "weight": "0.6",
          "price": "$13.04"
        },
        {
          "weight": "0.7",
          "price": "$14.55"
        },
        {
          "weight": "0.8",
          "price": "$16.21"
        },
        {
          "weight": "0.9",
          "price": "$17.75"
        },
        {
          "weight": "1.0",
          "price": "$19.29"
        },
        {
          "weight": "1.1",
          "price": "$21.00"
        },
        {
          "weight": "1.2",
          "price": "$22.54"
        },
        {
          "weight": "1.3",
          "price": "$24.07"
        },
        {
          "weight": "1.4",
          "price": "$25.61"
        }
      ],
      "SG": [
        {
          "weight": "0.1",
          "price": "$3.48"
        },
        {
          "weight": "0.2",
          "price": "$4.11"
        },
        {
          "weight": "0.3",
          "price": "$4.73"
        },
        {
          "weight": "0.4",
          "price": "$5.36"
        },
        {
          "weight": "0.5",
          "price": "$5.98"
        },
        {
          "weight": "0.6",
          "price": "$6.61"
        },
        {
          "weight": "0.7",
          "price": "$7.23"
        },
        {
          "weight": "0.8",
          "price": "$7.86"
        },
        {
          "weight": "0.9",
          "price": "$8.48"
        },
        {
          "weight": "1.0",
          "price": "$9.11"
        },
        {
          "weight": "1.1",
          "price": "$9.73"
        },
        {
          "weight": "1.2",
          "price": "$10.36"
        },
        {
          "weight": "1.3",
          "price": "$10.98"
        },
        {
          "weight": "1.4",
          "price": "$11.61"
        }
      ],
      "MY": [
        {
          "weight": "0.1",
          "price": "$3.25"
        },
        {
          "weight": "0.2",
          "price": "$3.64"
        },
        {
          "weight": "0.3",
          "price": "$4.04"
        },
        {
          "weight": "0.4",
          "price": "$4.43"
        },
        {
          "weight": "0.5",
          "price": "$4.82"
        },
        {
          "weight": "0.6",
          "price": "$5.21"
        },
        {
          "weight": "0.7",
          "price": "$5.61"
        },
        {
          "weight": "0.8",
          "price": "$6.00"
        },
        {
          "weight": "0.9",
          "price": "$6.39"
        },
        {
          "weight": "1.0",
          "price": "$6.79"
        },
        {
          "weight": "1.1",
          "price": "$7.18"
        },
        {
          "weight": "1.2",
          "price": "$7.57"
        },
        {
          "weight": "1.3",
          "price": "$7.96"
        },
        {
          "weight": "1.4",
          "price": "$8.36"
        }
      ],
      "TH": [
        {
          "weight": "0.1",
          "price": "$1.89"
        },
        {
          "weight": "0.2",
          "price": "$2.36"
        },
        {
          "weight": "0.3",
          "price": "$2.82"
        },
        {
          "weight": "0.4",
          "price": "$3.29"
        },
        {
          "weight": "0.5",
          "price": "$3.75"
        },
        {
          "weight": "0.6",
          "price": "$4.21"
        },
        {
          "weight": "0.7",
          "price": "$4.68"
        },
        {
          "weight": "0.8",
          "price": "$5.14"
        },
        {
          "weight": "0.9",
          "price": "$5.61"
        },
        {
          "weight": "1.0",
          "price": "$6.07"
        },
        {
          "weight": "1.1",
          "price": "$6.54"
        },
        {
          "weight": "1.2",
          "price": "$7.00"
        },
        {
          "weight": "1.3",
          "price": "$7.46"
        },
        {
          "weight": "1.4",
          "price": "$7.93"
        }
      ],
      "PH": [
        {
          "weight": "0.1",
          "price": "$3.39"
        },
        {
          "weight": "0.1",
          "price": "$7.52"
        },
        {
          "weight": "0.2",
          "price": "$4.11"
        },
        {
          "weight": "0.2",
          "price": "$10.39"
        },
        {
          "weight": "0.3",
          "price": "$4.82"
        },
        {
          "weight": "0.3",
          "price": "$13.27"
        },
        {
          "weight": "0.4",
          "price": "$5.54"
        },
        {
          "weight": "0.4",
          "price": "$16.14"
        },
        {
          "weight": "0.5",
          "price": "$6.25"
        },
        {
          "weight": "0.5",
          "price": "$19.02"
        },
        {
          "weight": "0.6",
          "price": "$6.96"
        },
        {
          "weight": "0.6",
          "price": "$21.89"
        },
        {
          "weight": "0.7",
          "price": "$7.68"
        },
        {
          "weight": "0.7",
          "price": "$24.77"
        },
        {
          "weight": "0.8",
          "price": "$8.39"
        },
        {
          "weight": "0.8",
          "price": "$27.64"
        },
        {
          "weight": "0.9",
          "price": "$9.11"
        },
        {
          "weight": "0.9",
          "price": "$30.52"
        },
        {
          "weight": "1.0",
          "price": "$9.82"
        },
        {
          "weight": "1.0",
          "price": "$33.39"
        },
        {
          "weight": "1.1",
          "price": "$17.18"
        },
        {
          "weight": "1.1",
          "price": "$36.27"
        },
        {
          "weight": "1.2",
          "price": "$17.93"
        },
        {
          "weight": "1.2",
          "price": "$39.14"
        },
        {
          "weight": "1.3",
          "price": "$18.68"
        },
        {
          "weight": "1.3",
          "price": "$42.02"
        },
        {
          "weight": "1.4",
          "price": "$19.43"
        },
        {
          "weight": "1.4",
          "price": "$44.89"
        }
      ],
      "BR": [
        {
          "weight": "0.1",
          "price": "$9.55"
        },
        {
          "weight": "0.2",
          "price": "$11.07"
        },
        {
          "weight": "0.3",
          "price": "$12.59"
        },
        {
          "weight": "0.4",
          "price": "$14.11"
        },
        {
          "weight": "0.5",
          "price": "$15.63"
        },
        {
          "weight": "0.6",
          "price": "$17.14"
        },
        {
          "weight": "0.7",
          "price": "$18.66"
        },
        {
          "weight": "0.8",
          "price": "$20.18"
        },
        {
          "weight": "0.9",
          "price": "$21.70"
        },
        {
          "weight": "1.0",
          "price": "$23.21"
        },
        {
          "weight": "1.1",
          "price": "$24.73"
        },
        {
          "weight": "1.2",
          "price": "$26.25"
        },
        {
          "weight": "1.3",
          "price": "$27.77"
        },
        {
          "weight": "1.4",
          "price": "$29.29"
        }
      ],
      "GR": [
        {
          "weight": "0.1",
          "price": "$4.89"
        },
        {
          "weight": "0.2",
          "price": "$6.57"
        },
        {
          "weight": "0.3",
          "price": "$8.25"
        },
        {
          "weight": "0.4",
          "price": "$9.93"
        },
        {
          "weight": "0.5",
          "price": "$11.61"
        },
        {
          "weight": "0.6",
          "price": "$13.29"
        },
        {
          "weight": "0.7",
          "price": "$14.96"
        },
        {
          "weight": "0.8",
          "price": "$16.64"
        },
        {
          "weight": "0.9",
          "price": "$18.32"
        },
        {
          "weight": "1.0",
          "price": "$20.00"
        },
        {
          "weight": "1.1",
          "price": "$21.68"
        },
        {
          "weight": "1.2",
          "price": "$23.36"
        },
        {
          "weight": "1.3",
          "price": "$25.04"
        },
        {
          "weight": "1.4",
          "price": "$26.71"
        }
      ],
      "IE": [
        {
          "weight": "0.1",
          "price": "$6.13"
        },
        {
          "weight": "0.2",
          "price": "$8.14"
        },
        {
          "weight": "0.3",
          "price": "$10.16"
        },
        {
          "weight": "0.4",
          "price": "$12.18"
        },
        {
          "weight": "0.5",
          "price": "$14.20"
        },
        {
          "weight": "0.6",
          "price": "$16.21"
        },
        {
          "weight": "0.7",
          "price": "$18.23"
        },
        {
          "weight": "0.8",
          "price": "$20.25"
        },
        {
          "weight": "0.9",
          "price": "$22.27"
        },
        {
          "weight": "1.0",
          "price": "$24.29"
        },
        {
          "weight": "1.1",
          "price": "$26.30"
        },
        {
          "weight": "1.2",
          "price": "$28.32"
        },
        {
          "weight": "1.3",
          "price": "$30.34"
        },
        {
          "weight": "1.4",
          "price": "$32.36"
        }
      ],
      "SE": [
        {
          "weight": "0.1",
          "price": "$4.36"
        },
        {
          "weight": "0.2",
          "price": "$5.86"
        },
        {
          "weight": "0.3",
          "price": "$7.36"
        },
        {
          "weight": "0.4",
          "price": "$9.11"
        },
        {
          "weight": "0.5",
          "price": "$10.45"
        },
        {
          "weight": "0.6",
          "price": "$11.79"
        },
        {
          "weight": "0.7",
          "price": "$13.13"
        },
        {
          "weight": "0.8",
          "price": "$14.46"
        },
        {
          "weight": "0.9",
          "price": "$15.80"
        },
        {
          "weight": "1.0",
          "price": "$17.14"
        },
        {
          "weight": "1.1",
          "price": "$18.48"
        },
        {
          "weight": "1.2",
          "price": "$19.82"
        },
        {
          "weight": "1.3",
          "price": "$21.16"
        },
        {
          "weight": "1.4",
          "price": "$22.50"
        }
      ],
      "AU": [
        {
          "weight": "0.1",
          "price": "$8.14"
        },
        {
          "weight": "0.1",
          "price": "$4.52"
        },
        {
          "weight": "0.2",
          "price": "$9.14"
        },
        {
          "weight": "0.2",
          "price": "$5.29"
        },
        {
          "weight": "0.3",
          "price": "$10.14"
        },
        {
          "weight": "0.3",
          "price": "$6.05"
        },
        {
          "weight": "0.4",
          "price": "$11.14"
        },
        {
          "weight": "0.4",
          "price": "$7.36"
        },
        {
          "weight": "0.5",
          "price": "$12.14"
        },
        {
          "weight": "0.5",
          "price": "$8.13"
        },
        {
          "weight": "0.6",
          "price": "$13.14"
        },
        {
          "weight": "0.6",
          "price": "$9.07"
        },
        {
          "weight": "0.7",
          "price": "$14.14"
        },
        {
          "weight": "0.7",
          "price": "$9.84"
        },
        {
          "weight": "0.8",
          "price": "$15.14"
        },
        {
          "weight": "0.8",
          "price": "$10.61"
        },
        {
          "weight": "0.9",
          "price": "$16.14"
        },
        {
          "weight": "0.9",
          "price": "$11.38"
        },
        {
          "weight": "1.0",
          "price": "$17.14"
        },
        {
          "weight": "1.0",
          "price": "$12.14"
        },
        {
          "weight": "1.1",
          "price": "$18.14"
        },
        {
          "weight": "1.1",
          "price": "$13.27"
        },
        {
          "weight": "1.2",
          "price": "$19.14"
        },
        {
          "weight": "1.2",
          "price": "$14.04"
        },
        {
          "weight": "1.3",
          "price": "$20.14"
        },
        {
          "weight": "1.3",
          "price": "$14.80"
        },
        {
          "weight": "1.4",
          "price": "$21.14"
        },
        {
          "weight": "1.4",
          "price": "$15.57"
        }
      ],
      "MX": [
        {
          "weight": "0.1",
          "price": "$5.09"
        },
        {
          "weight": "0.2",
          "price": "$7.14"
        },
        {
          "weight": "0.3",
          "price": "$9.38"
        },
        {
          "weight": "0.4",
          "price": "$11.43"
        },
        {
          "weight": "0.5",
          "price": "$13.48"
        },
        {
          "weight": "0.6",
          "price": "$15.54"
        },
        {
          "weight": "0.7",
          "price": "$17.59"
        },
        {
          "weight": "0.8",
          "price": "$19.64"
        },
        {
          "weight": "0.9",
          "price": "$21.70"
        },
        {
          "weight": "1.0",
          "price": "$23.75"
        },
        {
          "weight": "1.1",
          "price": "$26.16"
        },
        {
          "weight": "1.2",
          "price": "$28.21"
        },
        {
          "weight": "1.3",
          "price": "$30.27"
        },
        {
          "weight": "1.4",
          "price": "$32.32"
        }
      ],
      "AE": [
        {
          "weight": "0.1",
          "price": "$5.01"
        },
        {
          "weight": "0.2",
          "price": "$5.94"
        },
        {
          "weight": "0.3",
          "price": "$6.87"
        },
        {
          "weight": "0.4",
          "price": "$7.80"
        },
        {
          "weight": "0.5",
          "price": "$8.73"
        },
        {
          "weight": "0.6",
          "price": "$9.66"
        },
        {
          "weight": "0.7",
          "price": "$10.59"
        },
        {
          "weight": "0.8",
          "price": "$11.51"
        },
        {
          "weight": "0.9",
          "price": "$12.44"
        },
        {
          "weight": "1.0",
          "price": "$13.37"
        },
        {
          "weight": "1.1",
          "price": "$14.30"
        },
        {
          "weight": "1.2",
          "price": "$15.23"
        },
        {
          "weight": "1.3",
          "price": "$16.16"
        },
        {
          "weight": "1.4",
          "price": "$17.09"
        }
      ]
    },
    "cosmetics": {
      "US": [
        {
          "weight": "0.1",
          "price": "$7.80"
        },
        {
          "weight": "0.2",
          "price": "$10.88"
        },
        {
          "weight": "0.3",
          "price": "$14.02"
        },
        {
          "weight": "0.4",
          "price": "$17.27"
        },
        {
          "weight": "0.5",
          "price": "$20.71"
        },
        {
          "weight": "0.6",
          "price": "$23.99"
        },
        {
          "weight": "0.7",
          "price": "$27.28"
        },
        {
          "weight": "0.8",
          "price": "$28.82"
        },
        {
          "weight": "0.9",
          "price": "$32.15"
        },
        {
          "weight": "1.0",
          "price": "$35.47"
        },
        {
          "weight": "1.1",
          "price": "$38.80"
        },
        {
          "weight": "1.2",
          "price": "$42.12"
        },
        {
          "weight": "1.3",
          "price": "$45.44"
        },
        {
          "weight": "1.4",
          "price": "$48.77"
        },
        {
          "weight": "1.5",
          "price": "$52.09"
        },
        {
          "weight": "1.6",
          "price": "$55.42"
        },
        {
          "weight": "1.7",
          "price": "$58.75"
        },
        {
          "weight": "1.8",
          "price": "$62.07"
        },
        {
          "weight": "1.9",
          "price": "$65.40"
        },
        {
          "weight": "2.0",
          "price": "$68.72"
        },
        {
          "weight": "2.1",
          "price": "$72.05"
        },
        {
          "weight": "2.2",
          "price": "$75.37"
        },
        {
          "weight": "2.3",
          "price": "$78.70"
        },
        {
          "weight": "2.4",
          "price": "$82.02"
        },
        {
          "weight": "2.5",
          "price": "$85.35"
        },
        {
          "weight": "2.6",
          "price": "$88.67"
        },
        {
          "weight": "2.7",
          "price": "$92.00"
        },
        {
          "weight": "2.8",
          "price": "$95.33"
        },
        {
          "weight": "2.9",
          "price": "$98.65"
        },
        {
          "weight": "3.0",
          "price": "$101.98"
        },
        {
          "weight": "4.0",
          "price": "$135.20"
        },
        {
          "weight": "5.0",
          "price": "$168.44"
        }
      ],
      "UK": [
        {
          "weight": "0.1",
          "price": "$4.20"
        },
        {
          "weight": "0.2",
          "price": "$5.54"
        },
        {
          "weight": "0.3",
          "price": "$6.88"
        },
        {
          "weight": "0.4",
          "price": "$8.36"
        },
        {
          "weight": "0.5",
          "price": "$9.73"
        },
        {
          "weight": "0.6",
          "price": "$11.11"
        },
        {
          "weight": "0.7",
          "price": "$12.48"
        },
        {
          "weight": "0.8",
          "price": "$13.86"
        },
        {
          "weight": "0.9",
          "price": "$15.23"
        },
        {
          "weight": "1.0",
          "price": "$16.61"
        },
        {
          "weight": "1.1",
          "price": "$18.38"
        },
        {
          "weight": "1.2",
          "price": "$19.79"
        },
        {
          "weight": "1.3",
          "price": "$21.20"
        },
        {
          "weight": "1.4",
          "price": "$22.61"
        }
      ],
      "DE": [
        {
          "weight": "0.1",
          "price": "$5.54"
        },
        {
          "weight": "0.2",
          "price": "$6.96"
        },
        {
          "weight": "0.3",
          "price": "$8.57"
        },
        {
          "weight": "0.4",
          "price": "$10.00"
        },
        {
          "weight": "0.5",
          "price": "$11.52"
        },
        {
          "weight": "0.6",
          "price": "$13.04"
        },
        {
          "weight": "0.7",
          "price": "$14.55"
        },
        {
          "weight": "0.8",
          "price": "$16.07"
        },
        {
          "weight": "0.9",
          "price": "$17.59"
        },
        {
          "weight": "1.0",
          "price": "$19.11"
        },
        {
          "weight": "1.1",
          "price": "$20.63"
        },
        {
          "weight": "1.2",
          "price": "$22.14"
        },
        {
          "weight": "1.3",
          "price": "$23.66"
        },
        {
          "weight": "1.4",
          "price": "$25.18"
        }
      ],
      "FR": [
        {
          "weight": "0.1",
          "price": "$5.04"
        },
        {
          "weight": "0.2",
          "price": "$7.04"
        },
        {
          "weight": "0.3",
          "price": "$8.75"
        },
        {
          "weight": "0.4",
          "price": "$10.54"
        },
        {
          "weight": "0.5",
          "price": "$12.32"
        },
        {
          "weight": "0.6",
          "price": "$14.39"
        },
        {
          "weight": "0.7",
          "price": "$16.11"
        },
        {
          "weight": "0.8",
          "price": "$17.82"
        },
        {
          "weight": "0.9",
          "price": "$19.54"
        },
        {
          "weight": "1.0",
          "price": "$21.25"
        },
        {
          "weight": "1.1",
          "price": "$22.96"
        },
        {
          "weight": "1.2",
          "price": "$24.68"
        },
        {
          "weight": "1.3",
          "price": "$26.39"
        },
        {
          "weight": "1.4",
          "price": "$28.11"
        }
      ],
      "IT": [
        {
          "weight": "0.1",
          "price": "$5.82"
        },
        {
          "weight": "0.2",
          "price": "$7.18"
        },
        {
          "weight": "0.3",
          "price": "$8.54"
        },
        {
          "weight": "0.4",
          "price": "$9.89"
        },
        {
          "weight": "0.5",
          "price": "$11.25"
        },
        {
          "weight": "0.6",
          "price": "$12.61"
        },
        {
          "weight": "0.7",
          "price": "$13.96"
        },
        {
          "weight": "0.8",
          "price": "$15.32"
        },
        {
          "weight": "0.9",
          "price": "$16.68"
        },
        {
          "weight": "1.0",
          "price": "$18.04"
        },
        {
          "weight": "1.1",
          "price": "$19.39"
        },
        {
          "weight": "1.2",
          "price": "$20.75"
        },
        {
          "weight": "1.3",
          "price": "$22.11"
        },
        {
          "weight": "1.4",
          "price": "$23.46"
        }
      ],
      "ES": [
        {
          "weight": "0.1",
          "price": "$4.70"
        },
        {
          "weight": "0.2",
          "price": "$6.18"
        },
        {
          "weight": "0.3",
          "price": "$7.66"
        },
        {
          "weight": "0.4",
          "price": "$9.14"
        },
        {
          "weight": "0.5",
          "price": "$10.63"
        },
        {
          "weight": "0.6",
          "price": "$12.11"
        },
        {
          "weight": "0.7",
          "price": "$13.59"
        },
        {
          "weight": "0.8",
          "price": "$15.07"
        },
        {
          "weight": "0.9",
          "price": "$16.55"
        },
        {
          "weight": "1.0",
          "price": "$18.04"
        },
        {
          "weight": "1.1",
          "price": "$19.52"
        },
        {
          "weight": "1.2",
          "price": "$21.00"
        },
        {
          "weight": "1.3",
          "price": "$22.48"
        },
        {
          "weight": "1.4",
          "price": "$23.96"
        }
      ],
      "NL": [
        {
          "weight": "0.1",
          "price": "$5.50"
        },
        {
          "weight": "0.2",
          "price": "$7.25"
        },
        {
          "weight": "0.3",
          "price": "$8.71"
        },
        {
          "weight": "0.4",
          "price": "$10.25"
        },
        {
          "weight": "0.5",
          "price": "$11.79"
        },
        {
          "weight": "0.6",
          "price": "$13.32"
        },
        {
          "weight": "0.7",
          "price": "$14.86"
        },
        {
          "weight": "0.8",
          "price": "$16.39"
        },
        {
          "weight": "0.9",
          "price": "$17.93"
        },
        {
          "weight": "1.0",
          "price": "$19.46"
        },
        {
          "weight": "1.1",
          "price": "$21.00"
        },
        {
          "weight": "1.2",
          "price": "$22.54"
        },
        {
          "weight": "1.3",
          "price": "$24.07"
        },
        {
          "weight": "1.4",
          "price": "$25.61"
        }
      ],
      "AT": [
        {
          "weight": "0.1",
          "price": "$5.84"
        },
        {
          "weight": "0.1",
          "price": "$5.39"
        },
        {
          "weight": "0.2",
          "price": "$7.57"
        },
        {
          "weight": "0.2",
          "price": "$7.06"
        },
        {
          "weight": "0.3",
          "price": "$9.30"
        },
        {
          "weight": "0.3",
          "price": "$8.73"
        },
        {
          "weight": "0.4",
          "price": "$11.04"
        },
        {
          "weight": "0.4",
          "price": "$10.40"
        },
        {
          "weight": "0.5",
          "price": "$12.77"
        },
        {
          "weight": "0.5",
          "price": "$12.07"
        },
        {
          "weight": "0.6",
          "price": "$14.50"
        },
        {
          "weight": "0.6",
          "price": "$13.74"
        },
        {
          "weight": "0.7",
          "price": "$16.23"
        },
        {
          "weight": "0.7",
          "price": "$15.41"
        },
        {
          "weight": "0.8",
          "price": "$17.96"
        },
        {
          "weight": "0.8",
          "price": "$17.09"
        },
        {
          "weight": "0.9",
          "price": "$19.70"
        },
        {
          "weight": "0.9",
          "price": "$18.76"
        },
        {
          "weight": "1.0",
          "price": "$21.43"
        },
        {
          "weight": "1.0",
          "price": "$20.43"
        },
        {
          "weight": "1.1",
          "price": "$23.16"
        },
        {
          "weight": "1.1",
          "price": "$22.10"
        },
        {
          "weight": "1.2",
          "price": "$24.89"
        },
        {
          "weight": "1.2",
          "price": "$23.77"
        },
        {
          "weight": "1.3",
          "price": "$26.63"
        },
        {
          "weight": "1.3",
          "price": "$25.44"
        },
        {
          "weight": "1.4",
          "price": "$28.36"
        },
        {
          "weight": "1.4",
          "price": "$27.11"
        }
      ],
      "PL": [
        {
          "weight": "0.1",
          "price": "$3.57"
        },
        {
          "weight": "0.2",
          "price": "$5.18"
        },
        {
          "weight": "0.3",
          "price": "$7.18"
        },
        {
          "weight": "0.4",
          "price": "$8.68"
        },
        {
          "weight": "0.5",
          "price": "$10.18"
        },
        {
          "weight": "0.6",
          "price": "$11.68"
        },
        {
          "weight": "0.7",
          "price": "$13.18"
        },
        {
          "weight": "0.8",
          "price": "$14.68"
        },
        {
          "weight": "0.9",
          "price": "$16.18"
        },
        {
          "weight": "1.0",
          "price": "$17.68"
        },
        {
          "weight": "1.1",
          "price": "$19.18"
        },
        {
          "weight": "1.2",
          "price": "$20.68"
        },
        {
          "weight": "1.3",
          "price": "$22.18"
        },
        {
          "weight": "1.4",
          "price": "$23.68"
        }
      ],
      "CA": [
        {
          "weight": "0.1",
          "price": "$5.23"
        },
        {
          "weight": "0.2",
          "price": "$6.75"
        },
        {
          "weight": "0.3",
          "price": "$8.25"
        },
        {
          "weight": "0.4",
          "price": "$9.75"
        },
        {
          "weight": "0.5",
          "price": "$11.52"
        },
        {
          "weight": "0.6",
          "price": "$13.04"
        },
        {
          "weight": "0.7",
          "price": "$14.55"
        },
        {
          "weight": "0.8",
          "price": "$16.21"
        },
        {
          "weight": "0.9",
          "price": "$17.75"
        },
        {
          "weight": "1.0",
          "price": "$19.29"
        },
        {
          "weight": "1.1",
          "price": "$21.00"
        },
        {
          "weight": "1.2",
          "price": "$22.54"
        },
        {
          "weight": "1.3",
          "price": "$24.07"
        },
        {
          "weight": "1.4",
          "price": "$25.61"
        }
      ],
      "SG": [
        {
          "weight": "0.1",
          "price": "$3.48"
        },
        {
          "weight": "0.2",
          "price": "$4.11"
        },
        {
          "weight": "0.3",
          "price": "$4.73"
        },
        {
          "weight": "0.4",
          "price": "$5.36"
        },
        {
          "weight": "0.5",
          "price": "$5.98"
        },
        {
          "weight": "0.6",
          "price": "$6.61"
        },
        {
          "weight": "0.7",
          "price": "$7.23"
        },
        {
          "weight": "0.8",
          "price": "$7.86"
        },
        {
          "weight": "0.9",
          "price": "$8.48"
        },
        {
          "weight": "1.0",
          "price": "$9.11"
        },
        {
          "weight": "1.1",
          "price": "$9.73"
        },
        {
          "weight": "1.2",
          "price": "$10.36"
        },
        {
          "weight": "1.3",
          "price": "$10.98"
        },
        {
          "weight": "1.4",
          "price": "$11.61"
        }
      ],
      "MY": [
        {
          "weight": "0.1",
          "price": "$3.25"
        },
        {
          "weight": "0.2",
          "price": "$3.64"
        },
        {
          "weight": "0.3",
          "price": "$4.04"
        },
        {
          "weight": "0.4",
          "price": "$4.43"
        },
        {
          "weight": "0.5",
          "price": "$4.82"
        },
        {
          "weight": "0.6",
          "price": "$5.21"
        },
        {
          "weight": "0.7",
          "price": "$5.61"
        },
        {
          "weight": "0.8",
          "price": "$6.00"
        },
        {
          "weight": "0.9",
          "price": "$6.39"
        },
        {
          "weight": "1.0",
          "price": "$6.79"
        },
        {
          "weight": "1.1",
          "price": "$7.18"
        },
        {
          "weight": "1.2",
          "price": "$7.57"
        },
        {
          "weight": "1.3",
          "price": "$7.96"
        },
        {
          "weight": "1.4",
          "price": "$8.36"
        }
      ],
      "TH": [
        {
          "weight": "0.1",
          "price": "$1.89"
        },
        {
          "weight": "0.2",
          "price": "$2.36"
        },
        {
          "weight": "0.3",
          "price": "$2.82"
        },
        {
          "weight": "0.4",
          "price": "$3.29"
        },
        {
          "weight": "0.5",
          "price": "$3.75"
        },
        {
          "weight": "0.6",
          "price": "$4.21"
        },
        {
          "weight": "0.7",
          "price": "$4.68"
        },
        {
          "weight": "0.8",
          "price": "$5.14"
        },
        {
          "weight": "0.9",
          "price": "$5.61"
        },
        {
          "weight": "1.0",
          "price": "$6.07"
        },
        {
          "weight": "1.1",
          "price": "$6.54"
        },
        {
          "weight": "1.2",
          "price": "$7.00"
        },
        {
          "weight": "1.3",
          "price": "$7.46"
        },
        {
          "weight": "1.4",
          "price": "$7.93"
        }
      ],
      "PH": [
        {
          "weight": "0.1",
          "price": "$3.39"
        },
        {
          "weight": "0.1",
          "price": "$7.52"
        },
        {
          "weight": "0.2",
          "price": "$4.11"
        },
        {
          "weight": "0.2",
          "price": "$10.39"
        },
        {
          "weight": "0.3",
          "price": "$4.82"
        },
        {
          "weight": "0.3",
          "price": "$13.27"
        },
        {
          "weight": "0.4",
          "price": "$5.54"
        },
        {
          "weight": "0.4",
          "price": "$16.14"
        },
        {
          "weight": "0.5",
          "price": "$6.25"
        },
        {
          "weight": "0.5",
          "price": "$19.02"
        },
        {
          "weight": "0.6",
          "price": "$6.96"
        },
        {
          "weight": "0.6",
          "price": "$21.89"
        },
        {
          "weight": "0.7",
          "price": "$7.68"
        },
        {
          "weight": "0.7",
          "price": "$24.77"
        },
        {
          "weight": "0.8",
          "price": "$8.39"
        },
        {
          "weight": "0.8",
          "price": "$27.64"
        },
        {
          "weight": "0.9",
          "price": "$9.11"
        },
        {
          "weight": "0.9",
          "price": "$30.52"
        },
        {
          "weight": "1.0",
          "price": "$9.82"
        },
        {
          "weight": "1.0",
          "price": "$33.39"
        },
        {
          "weight": "1.1",
          "price": "$17.18"
        },
        {
          "weight": "1.1",
          "price": "$36.27"
        },
        {
          "weight": "1.2",
          "price": "$17.93"
        },
        {
          "weight": "1.2",
          "price": "$39.14"
        },
        {
          "weight": "1.3",
          "price": "$18.68"
        },
        {
          "weight": "1.3",
          "price": "$42.02"
        },
        {
          "weight": "1.4",
          "price": "$19.43"
        },
        {
          "weight": "1.4",
          "price": "$44.89"
        }
      ],
      "BR": [
        {
          "weight": "0.1",
          "price": "$9.55"
        },
        {
          "weight": "0.2",
          "price": "$11.07"
        },
        {
          "weight": "0.3",
          "price": "$12.59"
        },
        {
          "weight": "0.4",
          "price": "$14.11"
        },
        {
          "weight": "0.5",
          "price": "$15.63"
        },
        {
          "weight": "0.6",
          "price": "$17.14"
        },
        {
          "weight": "0.7",
          "price": "$18.66"
        },
        {
          "weight": "0.8",
          "price": "$20.18"
        },
        {
          "weight": "0.9",
          "price": "$21.70"
        },
        {
          "weight": "1.0",
          "price": "$23.21"
        },
        {
          "weight": "1.1",
          "price": "$24.73"
        },
        {
          "weight": "1.2",
          "price": "$26.25"
        },
        {
          "weight": "1.3",
          "price": "$27.77"
        },
        {
          "weight": "1.4",
          "price": "$29.29"
        }
      ],
      "GR": [
        {
          "weight": "0.1",
          "price": "$4.89"
        },
        {
          "weight": "0.2",
          "price": "$6.57"
        },
        {
          "weight": "0.3",
          "price": "$8.25"
        },
        {
          "weight": "0.4",
          "price": "$9.93"
        },
        {
          "weight": "0.5",
          "price": "$11.61"
        },
        {
          "weight": "0.6",
          "price": "$13.29"
        },
        {
          "weight": "0.7",
          "price": "$14.96"
        },
        {
          "weight": "0.8",
          "price": "$16.64"
        },
        {
          "weight": "0.9",
          "price": "$18.32"
        },
        {
          "weight": "1.0",
          "price": "$20.00"
        },
        {
          "weight": "1.1",
          "price": "$21.68"
        },
        {
          "weight": "1.2",
          "price": "$23.36"
        },
        {
          "weight": "1.3",
          "price": "$25.04"
        },
        {
          "weight": "1.4",
          "price": "$26.71"
        }
      ],
      "IE": [
        {
          "weight": "0.1",
          "price": "$6.13"
        },
        {
          "weight": "0.2",
          "price": "$8.14"
        },
        {
          "weight": "0.3",
          "price": "$10.16"
        },
        {
          "weight": "0.4",
          "price": "$12.18"
        },
        {
          "weight": "0.5",
          "price": "$14.20"
        },
        {
          "weight": "0.6",
          "price": "$16.21"
        },
        {
          "weight": "0.7",
          "price": "$18.23"
        },
        {
          "weight": "0.8",
          "price": "$20.25"
        },
        {
          "weight": "0.9",
          "price": "$22.27"
        },
        {
          "weight": "1.0",
          "price": "$24.29"
        },
        {
          "weight": "1.1",
          "price": "$26.30"
        },
        {
          "weight": "1.2",
          "price": "$28.32"
        },
        {
          "weight": "1.3",
          "price": "$30.34"
        },
        {
          "weight": "1.4",
          "price": "$32.36"
        }
      ],
      "SE": [
        {
          "weight": "0.1",
          "price": "$4.36"
        },
        {
          "weight": "0.2",
          "price": "$5.86"
        },
        {
          "weight": "0.3",
          "price": "$7.36"
        },
        {
          "weight": "0.4",
          "price": "$9.11"
        },
        {
          "weight": "0.5",
          "price": "$10.45"
        },
        {
          "weight": "0.6",
          "price": "$11.79"
        },
        {
          "weight": "0.7",
          "price": "$13.13"
        },
        {
          "weight": "0.8",
          "price": "$14.46"
        },
        {
          "weight": "0.9",
          "price": "$15.80"
        },
        {
          "weight": "1.0",
          "price": "$17.14"
        },
        {
          "weight": "1.1",
          "price": "$18.48"
        },
        {
          "weight": "1.2",
          "price": "$19.82"
        },
        {
          "weight": "1.3",
          "price": "$21.16"
        },
        {
          "weight": "1.4",
          "price": "$22.50"
        }
      ],
      "AU": [
        {
          "weight": "0.1",
          "price": "$8.14"
        },
        {
          "weight": "0.1",
          "price": "$4.52"
        },
        {
          "weight": "0.2",
          "price": "$9.14"
        },
        {
          "weight": "0.2",
          "price": "$5.29"
        },
        {
          "weight": "0.3",
          "price": "$10.14"
        },
        {
          "weight": "0.3",
          "price": "$6.05"
        },
        {
          "weight": "0.4",
          "price": "$11.14"
        },
        {
          "weight": "0.4",
          "price": "$7.36"
        },
        {
          "weight": "0.5",
          "price": "$12.14"
        },
        {
          "weight": "0.5",
          "price": "$8.13"
        },
        {
          "weight": "0.6",
          "price": "$13.14"
        },
        {
          "weight": "0.6",
          "price": "$9.07"
        },
        {
          "weight": "0.7",
          "price": "$14.14"
        },
        {
          "weight": "0.7",
          "price": "$9.84"
        },
        {
          "weight": "0.8",
          "price": "$15.14"
        },
        {
          "weight": "0.8",
          "price": "$10.61"
        },
        {
          "weight": "0.9",
          "price": "$16.14"
        },
        {
          "weight": "0.9",
          "price": "$11.38"
        },
        {
          "weight": "1.0",
          "price": "$17.14"
        },
        {
          "weight": "1.0",
          "price": "$12.14"
        },
        {
          "weight": "1.1",
          "price": "$18.14"
        },
        {
          "weight": "1.1",
          "price": "$13.27"
        },
        {
          "weight": "1.2",
          "price": "$19.14"
        },
        {
          "weight": "1.2",
          "price": "$14.04"
        },
        {
          "weight": "1.3",
          "price": "$20.14"
        },
        {
          "weight": "1.3",
          "price": "$14.80"
        },
        {
          "weight": "1.4",
          "price": "$21.14"
        },
        {
          "weight": "1.4",
          "price": "$15.57"
        }
      ],
      "MX": [
        {
          "weight": "0.1",
          "price": "$5.09"
        },
        {
          "weight": "0.2",
          "price": "$7.14"
        },
        {
          "weight": "0.3",
          "price": "$9.38"
        },
        {
          "weight": "0.4",
          "price": "$11.43"
        },
        {
          "weight": "0.5",
          "price": "$13.48"
        },
        {
          "weight": "0.6",
          "price": "$15.54"
        },
        {
          "weight": "0.7",
          "price": "$17.59"
        },
        {
          "weight": "0.8",
          "price": "$19.64"
        },
        {
          "weight": "0.9",
          "price": "$21.70"
        },
        {
          "weight": "1.0",
          "price": "$23.75"
        },
        {
          "weight": "1.1",
          "price": "$26.16"
        },
        {
          "weight": "1.2",
          "price": "$28.21"
        },
        {
          "weight": "1.3",
          "price": "$30.27"
        },
        {
          "weight": "1.4",
          "price": "$32.32"
        }
      ],
      "AE": [
        {
          "weight": "0.1",
          "price": "$5.01"
        },
        {
          "weight": "0.2",
          "price": "$5.94"
        },
        {
          "weight": "0.3",
          "price": "$6.87"
        },
        {
          "weight": "0.4",
          "price": "$7.80"
        },
        {
          "weight": "0.5",
          "price": "$8.73"
        },
        {
          "weight": "0.6",
          "price": "$9.66"
        },
        {
          "weight": "0.7",
          "price": "$10.59"
        },
        {
          "weight": "0.8",
          "price": "$11.51"
        },
        {
          "weight": "0.9",
          "price": "$12.44"
        },
        {
          "weight": "1.0",
          "price": "$13.37"
        },
        {
          "weight": "1.1",
          "price": "$14.30"
        },
        {
          "weight": "1.2",
          "price": "$15.23"
        },
        {
          "weight": "1.3",
          "price": "$16.16"
        },
        {
          "weight": "1.4",
          "price": "$17.09"
        }
      ]
    },
    "battery": {
      "US": [
        {
          "weight": "0.1",
          "price": "$7.27"
        },
        {
          "weight": "0.2",
          "price": "$9.30"
        },
        {
          "weight": "0.3",
          "price": "$11.52"
        },
        {
          "weight": "0.4",
          "price": "$14.01"
        },
        {
          "weight": "0.5",
          "price": "$16.27"
        },
        {
          "weight": "0.6",
          "price": "$18.76"
        },
        {
          "weight": "0.7",
          "price": "$21.25"
        },
        {
          "weight": "0.8",
          "price": "$22.24"
        },
        {
          "weight": "0.9",
          "price": "$24.71"
        },
        {
          "weight": "1.0",
          "price": "$27.18"
        },
        {
          "weight": "1.1",
          "price": "$29.65"
        },
        {
          "weight": "1.2",
          "price": "$32.12"
        },
        {
          "weight": "1.3",
          "price": "$34.59"
        },
        {
          "weight": "1.4",
          "price": "$37.06"
        },
        {
          "weight": "1.5",
          "price": "$39.53"
        },
        {
          "weight": "1.6",
          "price": "$42.00"
        },
        {
          "weight": "1.7",
          "price": "$44.47"
        },
        {
          "weight": "1.8",
          "price": "$46.94"
        },
        {
          "weight": "1.9",
          "price": "$49.41"
        },
        {
          "weight": "2.0",
          "price": "$51.88"
        },
        {
          "weight": "2.1",
          "price": "$54.35"
        },
        {
          "weight": "2.2",
          "price": "$56.82"
        },
        {
          "weight": "2.3",
          "price": "$59.29"
        },
        {
          "weight": "2.4",
          "price": "$61.75"
        },
        {
          "weight": "2.5",
          "price": "$64.22"
        },
        {
          "weight": "2.6",
          "price": "$66.69"
        },
        {
          "weight": "2.7",
          "price": "$69.16"
        },
        {
          "weight": "2.8",
          "price": "$71.63"
        },
        {
          "weight": "2.9",
          "price": "$74.10"
        },
        {
          "weight": "3.0",
          "price": "$76.57"
        },
        {
          "weight": "3.1",
          "price": "$79.04"
        },
        {
          "weight": "3.2",
          "price": "$81.51"
        },
        {
          "weight": "3.3",
          "price": "$83.98"
        },
        {
          "weight": "3.4",
          "price": "$86.45"
        },
        {
          "weight": "3.5",
          "price": "$88.92"
        },
        {
          "weight": "3.6",
          "price": "$91.39"
        },
        {
          "weight": "3.7",
          "price": "$93.86"
        },
        {
          "weight": "3.8",
          "price": "$96.33"
        },
        {
          "weight": "3.9",
          "price": "$98.80"
        },
        {
          "weight": "4.0",
          "price": "$101.27"
        },
        {
          "weight": "4.1",
          "price": "$103.74"
        },
        {
          "weight": "4.2",
          "price": "$106.20"
        },
        {
          "weight": "4.3",
          "price": "$108.67"
        },
        {
          "weight": "4.4",
          "price": "$111.14"
        },
        {
          "weight": "4.5",
          "price": "$113.61"
        },
        {
          "weight": "4.6",
          "price": "$116.08"
        },
        {
          "weight": "4.7",
          "price": "$118.55"
        },
        {
          "weight": "4.8",
          "price": "$121.02"
        },
        {
          "weight": "4.9",
          "price": "$123.49"
        },
        {
          "weight": "5.0",
          "price": "$125.96"
        }
      ],
      "UK": [
        {
          "weight": "0.1",
          "price": "$4.33"
        },
        {
          "weight": "0.2",
          "price": "$5.59"
        },
        {
          "weight": "0.3",
          "price": "$6.85"
        },
        {
          "weight": "0.4",
          "price": "$8.27"
        },
        {
          "weight": "0.5",
          "price": "$9.57"
        },
        {
          "weight": "0.6",
          "price": "$10.87"
        },
        {
          "weight": "0.7",
          "price": "$12.17"
        },
        {
          "weight": "0.8",
          "price": "$13.48"
        },
        {
          "weight": "0.9",
          "price": "$14.78"
        },
        {
          "weight": "1.0",
          "price": "$16.08"
        },
        {
          "weight": "1.1",
          "price": "$17.80"
        },
        {
          "weight": "1.2",
          "price": "$19.14"
        },
        {
          "weight": "1.3",
          "price": "$20.48"
        },
        {
          "weight": "1.4",
          "price": "$21.82"
        },
        {
          "weight": "1.5",
          "price": "$23.16"
        },
        {
          "weight": "1.6",
          "price": "$24.50"
        },
        {
          "weight": "1.7",
          "price": "$25.84"
        },
        {
          "weight": "1.8",
          "price": "$27.18"
        },
        {
          "weight": "1.9",
          "price": "$28.52"
        },
        {
          "weight": "2.0",
          "price": "$29.86"
        },
        {
          "weight": "2.1",
          "price": "$31.20"
        },
        {
          "weight": "2.2",
          "price": "$32.54"
        },
        {
          "weight": "2.3",
          "price": "$33.88"
        },
        {
          "weight": "2.4",
          "price": "$35.22"
        },
        {
          "weight": "2.5",
          "price": "$36.56"
        },
        {
          "weight": "2.6",
          "price": "$37.90"
        },
        {
          "weight": "2.7",
          "price": "$39.24"
        },
        {
          "weight": "2.8",
          "price": "$40.58"
        },
        {
          "weight": "2.9",
          "price": "$41.92"
        },
        {
          "weight": "3.0",
          "price": "$43.26"
        },
        {
          "weight": "3.1",
          "price": "$44.60"
        },
        {
          "weight": "3.2",
          "price": "$45.94"
        },
        {
          "weight": "3.3",
          "price": "$47.28"
        },
        {
          "weight": "3.4",
          "price": "$48.62"
        },
        {
          "weight": "3.5",
          "price": "$49.96"
        },
        {
          "weight": "3.6",
          "price": "$51.30"
        },
        {
          "weight": "3.7",
          "price": "$52.64"
        },
        {
          "weight": "3.8",
          "price": "$53.98"
        },
        {
          "weight": "3.9",
          "price": "$55.32"
        },
        {
          "weight": "4.0",
          "price": "$56.66"
        },
        {
          "weight": "4.1",
          "price": "$58.00"
        },
        {
          "weight": "4.2",
          "price": "$59.34"
        },
        {
          "weight": "4.3",
          "price": "$60.68"
        },
        {
          "weight": "4.4",
          "price": "$62.02"
        },
        {
          "weight": "4.5",
          "price": "$63.36"
        },
        {
          "weight": "4.6",
          "price": "$64.70"
        },
        {
          "weight": "4.7",
          "price": "$66.04"
        },
        {
          "weight": "4.8",
          "price": "$67.38"
        },
        {
          "weight": "4.9",
          "price": "$68.72"
        },
        {
          "weight": "5.0",
          "price": "$70.06"
        }
      ],
      "DE": [
        {
          "weight": "0.1",
          "price": "$6.13"
        },
        {
          "weight": "0.2",
          "price": "$7.85"
        },
        {
          "weight": "0.3",
          "price": "$9.76"
        },
        {
          "weight": "0.4",
          "price": "$11.33"
        },
        {
          "weight": "0.5",
          "price": "$13.11"
        },
        {
          "weight": "0.6",
          "price": "$14.89"
        },
        {
          "weight": "0.7",
          "price": "$16.67"
        },
        {
          "weight": "0.8",
          "price": "$18.45"
        },
        {
          "weight": "0.9",
          "price": "$20.23"
        },
        {
          "weight": "1.0",
          "price": "$22.01"
        },
        {
          "weight": "1.1",
          "price": "$23.79"
        },
        {
          "weight": "1.2",
          "price": "$25.57"
        },
        {
          "weight": "1.3",
          "price": "$27.36"
        },
        {
          "weight": "1.4",
          "price": "$29.14"
        },
        {
          "weight": "1.5",
          "price": "$30.92"
        },
        {
          "weight": "1.6",
          "price": "$32.70"
        },
        {
          "weight": "1.7",
          "price": "$34.48"
        },
        {
          "weight": "1.8",
          "price": "$36.26"
        },
        {
          "weight": "1.9",
          "price": "$38.04"
        },
        {
          "weight": "2.0",
          "price": "$39.82"
        },
        {
          "weight": "2.1",
          "price": "$41.60"
        },
        {
          "weight": "2.2",
          "price": "$43.38"
        },
        {
          "weight": "2.3",
          "price": "$45.16"
        },
        {
          "weight": "2.4",
          "price": "$46.94"
        },
        {
          "weight": "2.5",
          "price": "$48.72"
        },
        {
          "weight": "2.6",
          "price": "$50.50"
        },
        {
          "weight": "2.7",
          "price": "$52.28"
        },
        {
          "weight": "2.8",
          "price": "$54.06"
        },
        {
          "weight": "2.9",
          "price": "$55.84"
        },
        {
          "weight": "3.0",
          "price": "$57.62"
        },
        {
          "weight": "3.1",
          "price": "$59.40"
        },
        {
          "weight": "3.2",
          "price": "$61.18"
        },
        {
          "weight": "3.3",
          "price": "$62.96"
        },
        {
          "weight": "3.4",
          "price": "$64.74"
        },
        {
          "weight": "3.5",
          "price": "$66.52"
        },
        {
          "weight": "3.6",
          "price": "$68.30"
        },
        {
          "weight": "3.7",
          "price": "$70.08"
        },
        {
          "weight": "3.8",
          "price": "$71.86"
        },
        {
          "weight": "3.9",
          "price": "$73.64"
        },
        {
          "weight": "4.0",
          "price": "$75.42"
        },
        {
          "weight": "4.1",
          "price": "$77.20"
        },
        {
          "weight": "4.2",
          "price": "$78.98"
        },
        {
          "weight": "4.3",
          "price": "$80.76"
        },
        {
          "weight": "4.4",
          "price": "$82.54"
        },
        {
          "weight": "4.5",
          "price": "$84.32"
        },
        {
          "weight": "4.6",
          "price": "$86.10"
        },
        {
          "weight": "4.7",
          "price": "$87.88"
        },
        {
          "weight": "4.8",
          "price": "$89.67"
        },
        {
          "weight": "4.9",
          "price": "$91.45"
        },
        {
          "weight": "5.0",
          "price": "$93.23"
        }
      ],
      "FR": [
        {
          "weight": "0.1",
          "price": "$5.80"
        },
        {
          "weight": "0.2",
          "price": "$7.77"
        },
        {
          "weight": "0.3",
          "price": "$9.74"
        },
        {
          "weight": "0.4",
          "price": "$11.72"
        },
        {
          "weight": "0.5",
          "price": "$14.07"
        },
        {
          "weight": "0.6",
          "price": "$16.00"
        },
        {
          "weight": "0.7",
          "price": "$17.94"
        },
        {
          "weight": "0.8",
          "price": "$19.87"
        },
        {
          "weight": "0.9",
          "price": "$21.80"
        },
        {
          "weight": "1.0",
          "price": "$23.74"
        },
        {
          "weight": "1.1",
          "price": "$25.67"
        },
        {
          "weight": "1.2",
          "price": "$27.60"
        },
        {
          "weight": "1.3",
          "price": "$29.54"
        },
        {
          "weight": "1.4",
          "price": "$31.47"
        },
        {
          "weight": "1.5",
          "price": "$33.40"
        },
        {
          "weight": "1.6",
          "price": "$35.34"
        },
        {
          "weight": "1.7",
          "price": "$37.27"
        },
        {
          "weight": "1.8",
          "price": "$39.20"
        },
        {
          "weight": "1.9",
          "price": "$41.14"
        },
        {
          "weight": "2.0",
          "price": "$43.07"
        },
        {
          "weight": "2.1",
          "price": "$45.00"
        },
        {
          "weight": "2.2",
          "price": "$46.94"
        },
        {
          "weight": "2.3",
          "price": "$48.87"
        },
        {
          "weight": "2.4",
          "price": "$50.81"
        },
        {
          "weight": "2.5",
          "price": "$52.74"
        },
        {
          "weight": "2.6",
          "price": "$54.67"
        },
        {
          "weight": "2.7",
          "price": "$56.61"
        },
        {
          "weight": "2.8",
          "price": "$58.54"
        },
        {
          "weight": "2.9",
          "price": "$60.47"
        },
        {
          "weight": "3.0",
          "price": "$62.41"
        },
        {
          "weight": "3.1",
          "price": "$64.34"
        },
        {
          "weight": "3.2",
          "price": "$66.27"
        },
        {
          "weight": "3.3",
          "price": "$68.21"
        },
        {
          "weight": "3.4",
          "price": "$70.14"
        },
        {
          "weight": "3.5",
          "price": "$72.07"
        },
        {
          "weight": "3.6",
          "price": "$74.01"
        },
        {
          "weight": "3.7",
          "price": "$75.94"
        },
        {
          "weight": "3.8",
          "price": "$77.87"
        },
        {
          "weight": "3.9",
          "price": "$79.81"
        },
        {
          "weight": "4.0",
          "price": "$81.74"
        },
        {
          "weight": "4.1",
          "price": "$83.67"
        },
        {
          "weight": "4.2",
          "price": "$85.61"
        },
        {
          "weight": "4.3",
          "price": "$87.54"
        },
        {
          "weight": "4.4",
          "price": "$89.47"
        },
        {
          "weight": "4.5",
          "price": "$91.41"
        },
        {
          "weight": "4.6",
          "price": "$93.34"
        },
        {
          "weight": "4.7",
          "price": "$95.27"
        },
        {
          "weight": "4.8",
          "price": "$97.21"
        },
        {
          "weight": "4.9",
          "price": "$99.14"
        },
        {
          "weight": "5.0",
          "price": "$101.07"
        }
      ],
      "IT": [
        {
          "weight": "0.1",
          "price": "$6.49"
        },
        {
          "weight": "0.2",
          "price": "$8.19"
        },
        {
          "weight": "0.3",
          "price": "$9.90"
        },
        {
          "weight": "0.4",
          "price": "$11.60"
        },
        {
          "weight": "0.5",
          "price": "$13.30"
        },
        {
          "weight": "0.6",
          "price": "$15.01"
        },
        {
          "weight": "0.7",
          "price": "$16.71"
        },
        {
          "weight": "0.8",
          "price": "$18.42"
        },
        {
          "weight": "0.9",
          "price": "$20.12"
        },
        {
          "weight": "1.0",
          "price": "$21.82"
        },
        {
          "weight": "1.1",
          "price": "$23.53"
        },
        {
          "weight": "1.2",
          "price": "$25.23"
        },
        {
          "weight": "1.3",
          "price": "$26.93"
        },
        {
          "weight": "1.4",
          "price": "$28.64"
        },
        {
          "weight": "1.5",
          "price": "$30.34"
        },
        {
          "weight": "1.6",
          "price": "$32.05"
        },
        {
          "weight": "1.7",
          "price": "$33.75"
        },
        {
          "weight": "1.8",
          "price": "$35.45"
        },
        {
          "weight": "1.9",
          "price": "$37.16"
        },
        {
          "weight": "2.0",
          "price": "$38.86"
        },
        {
          "weight": "2.1",
          "price": "$41.37"
        },
        {
          "weight": "2.2",
          "price": "$43.11"
        },
        {
          "weight": "2.3",
          "price": "$44.85"
        },
        {
          "weight": "2.4",
          "price": "$46.59"
        },
        {
          "weight": "2.5",
          "price": "$48.34"
        },
        {
          "weight": "2.6",
          "price": "$50.08"
        },
        {
          "weight": "2.7",
          "price": "$51.82"
        },
        {
          "weight": "2.8",
          "price": "$53.56"
        },
        {
          "weight": "2.9",
          "price": "$55.30"
        },
        {
          "weight": "3.0",
          "price": "$57.05"
        },
        {
          "weight": "3.1",
          "price": "$58.79"
        },
        {
          "weight": "3.2",
          "price": "$60.53"
        },
        {
          "weight": "3.3",
          "price": "$62.27"
        },
        {
          "weight": "3.4",
          "price": "$64.01"
        },
        {
          "weight": "3.5",
          "price": "$65.76"
        },
        {
          "weight": "3.6",
          "price": "$67.50"
        },
        {
          "weight": "3.7",
          "price": "$69.24"
        },
        {
          "weight": "3.8",
          "price": "$70.98"
        },
        {
          "weight": "3.9",
          "price": "$72.72"
        },
        {
          "weight": "4.0",
          "price": "$74.47"
        },
        {
          "weight": "4.1",
          "price": "$76.21"
        },
        {
          "weight": "4.2",
          "price": "$77.95"
        },
        {
          "weight": "4.3",
          "price": "$79.69"
        },
        {
          "weight": "4.4",
          "price": "$81.43"
        },
        {
          "weight": "4.5",
          "price": "$83.18"
        },
        {
          "weight": "4.6",
          "price": "$84.92"
        },
        {
          "weight": "4.7",
          "price": "$86.66"
        },
        {
          "weight": "4.8",
          "price": "$88.40"
        },
        {
          "weight": "4.9",
          "price": "$90.14"
        },
        {
          "weight": "5.0",
          "price": "$91.89"
        }
      ],
      "ES": [
        {
          "weight": "0.1",
          "price": "$5.26"
        },
        {
          "weight": "0.2",
          "price": "$7.08"
        },
        {
          "weight": "0.3",
          "price": "$8.90"
        },
        {
          "weight": "0.4",
          "price": "$10.72"
        },
        {
          "weight": "0.5",
          "price": "$12.54"
        },
        {
          "weight": "0.6",
          "price": "$14.36"
        },
        {
          "weight": "0.7",
          "price": "$16.18"
        },
        {
          "weight": "0.8",
          "price": "$17.99"
        },
        {
          "weight": "0.9",
          "price": "$19.81"
        },
        {
          "weight": "1.0",
          "price": "$21.63"
        },
        {
          "weight": "1.1",
          "price": "$23.45"
        },
        {
          "weight": "1.2",
          "price": "$25.27"
        },
        {
          "weight": "1.3",
          "price": "$27.09"
        },
        {
          "weight": "1.4",
          "price": "$28.91"
        },
        {
          "weight": "1.5",
          "price": "$30.72"
        },
        {
          "weight": "1.6",
          "price": "$32.54"
        },
        {
          "weight": "1.7",
          "price": "$34.36"
        },
        {
          "weight": "1.8",
          "price": "$36.18"
        },
        {
          "weight": "1.9",
          "price": "$38.00"
        },
        {
          "weight": "2.0",
          "price": "$39.82"
        },
        {
          "weight": "2.1",
          "price": "$42.84"
        },
        {
          "weight": "2.2",
          "price": "$44.72"
        },
        {
          "weight": "2.3",
          "price": "$46.59"
        },
        {
          "weight": "2.4",
          "price": "$48.47"
        },
        {
          "weight": "2.5",
          "price": "$50.35"
        },
        {
          "weight": "2.6",
          "price": "$52.22"
        },
        {
          "weight": "2.7",
          "price": "$54.10"
        },
        {
          "weight": "2.8",
          "price": "$55.97"
        },
        {
          "weight": "2.9",
          "price": "$57.85"
        },
        {
          "weight": "3.0",
          "price": "$59.73"
        },
        {
          "weight": "3.1",
          "price": "$61.60"
        },
        {
          "weight": "3.2",
          "price": "$63.48"
        },
        {
          "weight": "3.3",
          "price": "$65.35"
        },
        {
          "weight": "3.4",
          "price": "$67.23"
        },
        {
          "weight": "3.5",
          "price": "$69.11"
        },
        {
          "weight": "3.6",
          "price": "$70.98"
        },
        {
          "weight": "3.7",
          "price": "$72.86"
        },
        {
          "weight": "3.8",
          "price": "$74.73"
        },
        {
          "weight": "3.9",
          "price": "$76.61"
        },
        {
          "weight": "4.0",
          "price": "$78.49"
        },
        {
          "weight": "4.1",
          "price": "$80.36"
        },
        {
          "weight": "4.2",
          "price": "$82.24"
        },
        {
          "weight": "4.3",
          "price": "$84.11"
        },
        {
          "weight": "4.4",
          "price": "$85.99"
        },
        {
          "weight": "4.5",
          "price": "$87.87"
        },
        {
          "weight": "4.6",
          "price": "$89.74"
        },
        {
          "weight": "4.7",
          "price": "$91.62"
        },
        {
          "weight": "4.8",
          "price": "$93.49"
        },
        {
          "weight": "4.9",
          "price": "$95.37"
        },
        {
          "weight": "5.0",
          "price": "$97.25"
        }
      ],
      "NL": [
        {
          "weight": "0.1",
          "price": "$6.22"
        },
        {
          "weight": "0.2",
          "price": "$8.54"
        },
        {
          "weight": "0.3",
          "price": "$10.43"
        },
        {
          "weight": "0.4",
          "price": "$12.44"
        },
        {
          "weight": "0.5",
          "price": "$14.45"
        },
        {
          "weight": "0.6",
          "price": "$16.46"
        },
        {
          "weight": "0.7",
          "price": "$18.47"
        },
        {
          "weight": "0.8",
          "price": "$20.48"
        },
        {
          "weight": "0.9",
          "price": "$22.49"
        },
        {
          "weight": "1.0",
          "price": "$24.50"
        },
        {
          "weight": "1.1",
          "price": "$26.51"
        },
        {
          "weight": "1.2",
          "price": "$28.52"
        },
        {
          "weight": "1.3",
          "price": "$30.53"
        },
        {
          "weight": "1.4",
          "price": "$32.54"
        },
        {
          "weight": "1.5",
          "price": "$34.55"
        },
        {
          "weight": "1.6",
          "price": "$36.56"
        },
        {
          "weight": "1.7",
          "price": "$38.57"
        },
        {
          "weight": "1.8",
          "price": "$40.58"
        },
        {
          "weight": "1.9",
          "price": "$42.59"
        },
        {
          "weight": "2.0",
          "price": "$44.60"
        },
        {
          "weight": "2.1",
          "price": "$44.60"
        },
        {
          "weight": "2.2",
          "price": "$46.52"
        },
        {
          "weight": "2.3",
          "price": "$48.43"
        },
        {
          "weight": "2.4",
          "price": "$50.35"
        },
        {
          "weight": "2.5",
          "price": "$52.26"
        },
        {
          "weight": "2.6",
          "price": "$54.17"
        },
        {
          "weight": "2.7",
          "price": "$56.09"
        },
        {
          "weight": "2.8",
          "price": "$58.00"
        },
        {
          "weight": "2.9",
          "price": "$59.92"
        },
        {
          "weight": "3.0",
          "price": "$61.83"
        },
        {
          "weight": "3.1",
          "price": "$63.75"
        },
        {
          "weight": "3.2",
          "price": "$65.66"
        },
        {
          "weight": "3.3",
          "price": "$67.57"
        },
        {
          "weight": "3.4",
          "price": "$69.49"
        },
        {
          "weight": "3.5",
          "price": "$71.40"
        },
        {
          "weight": "3.6",
          "price": "$73.32"
        },
        {
          "weight": "3.7",
          "price": "$75.23"
        },
        {
          "weight": "3.8",
          "price": "$77.15"
        },
        {
          "weight": "3.9",
          "price": "$79.06"
        },
        {
          "weight": "4.0",
          "price": "$80.97"
        },
        {
          "weight": "4.1",
          "price": "$82.89"
        },
        {
          "weight": "4.2",
          "price": "$84.80"
        },
        {
          "weight": "4.3",
          "price": "$86.72"
        },
        {
          "weight": "4.4",
          "price": "$88.63"
        },
        {
          "weight": "4.5",
          "price": "$90.55"
        },
        {
          "weight": "4.6",
          "price": "$92.46"
        },
        {
          "weight": "4.7",
          "price": "$94.37"
        },
        {
          "weight": "4.8",
          "price": "$96.29"
        },
        {
          "weight": "4.9",
          "price": "$98.20"
        },
        {
          "weight": "5.0",
          "price": "$100.12"
        }
      ],
      "AT": [
        {
          "weight": "0.1",
          "price": "$6.59"
        },
        {
          "weight": "0.2",
          "price": "$8.77"
        },
        {
          "weight": "0.3",
          "price": "$10.95"
        },
        {
          "weight": "0.4",
          "price": "$13.13"
        },
        {
          "weight": "0.5",
          "price": "$15.31"
        },
        {
          "weight": "0.6",
          "price": "$17.50"
        },
        {
          "weight": "0.7",
          "price": "$19.68"
        },
        {
          "weight": "0.8",
          "price": "$21.86"
        },
        {
          "weight": "0.9",
          "price": "$24.04"
        },
        {
          "weight": "1.0",
          "price": "$26.23"
        },
        {
          "weight": "1.1",
          "price": "$28.41"
        },
        {
          "weight": "1.2",
          "price": "$30.59"
        },
        {
          "weight": "1.3",
          "price": "$32.77"
        },
        {
          "weight": "1.4",
          "price": "$34.95"
        },
        {
          "weight": "1.5",
          "price": "$37.14"
        },
        {
          "weight": "1.6",
          "price": "$39.32"
        },
        {
          "weight": "1.7",
          "price": "$41.50"
        },
        {
          "weight": "1.8",
          "price": "$43.68"
        },
        {
          "weight": "1.9",
          "price": "$45.87"
        },
        {
          "weight": "2.0",
          "price": "$48.05"
        },
        {
          "weight": "2.1",
          "price": "$50.23"
        },
        {
          "weight": "2.2",
          "price": "$52.41"
        },
        {
          "weight": "2.3",
          "price": "$54.60"
        },
        {
          "weight": "2.4",
          "price": "$56.78"
        },
        {
          "weight": "2.5",
          "price": "$58.96"
        },
        {
          "weight": "2.6",
          "price": "$61.14"
        },
        {
          "weight": "2.7",
          "price": "$63.32"
        },
        {
          "weight": "2.8",
          "price": "$65.51"
        },
        {
          "weight": "2.9",
          "price": "$67.69"
        },
        {
          "weight": "3.0",
          "price": "$69.87"
        },
        {
          "weight": "3.1",
          "price": "$72.05"
        },
        {
          "weight": "3.2",
          "price": "$74.24"
        },
        {
          "weight": "3.3",
          "price": "$76.42"
        },
        {
          "weight": "3.4",
          "price": "$78.60"
        },
        {
          "weight": "3.5",
          "price": "$80.78"
        },
        {
          "weight": "3.6",
          "price": "$82.97"
        },
        {
          "weight": "3.7",
          "price": "$85.15"
        },
        {
          "weight": "3.8",
          "price": "$87.33"
        },
        {
          "weight": "3.9",
          "price": "$89.51"
        },
        {
          "weight": "4.0",
          "price": "$91.69"
        },
        {
          "weight": "4.1",
          "price": "$93.88"
        },
        {
          "weight": "4.2",
          "price": "$96.06"
        },
        {
          "weight": "4.3",
          "price": "$98.24"
        },
        {
          "weight": "4.4",
          "price": "$100.42"
        },
        {
          "weight": "4.5",
          "price": "$102.61"
        },
        {
          "weight": "4.6",
          "price": "$104.79"
        },
        {
          "weight": "4.7",
          "price": "$106.97"
        },
        {
          "weight": "4.8",
          "price": "$109.15"
        },
        {
          "weight": "4.9",
          "price": "$111.33"
        },
        {
          "weight": "5.0",
          "price": "$113.52"
        }
      ],
      "PL": [
        {
          "weight": "0.1",
          "price": "$4.36"
        },
        {
          "weight": "0.2",
          "price": "$6.24"
        },
        {
          "weight": "0.3",
          "price": "$8.33"
        },
        {
          "weight": "0.4",
          "price": "$10.15"
        },
        {
          "weight": "0.5",
          "price": "$11.96"
        },
        {
          "weight": "0.6",
          "price": "$13.78"
        },
        {
          "weight": "0.7",
          "price": "$15.60"
        },
        {
          "weight": "0.8",
          "price": "$17.42"
        },
        {
          "weight": "0.9",
          "price": "$19.24"
        },
        {
          "weight": "1.0",
          "price": "$21.06"
        },
        {
          "weight": "1.1",
          "price": "$22.88"
        },
        {
          "weight": "1.2",
          "price": "$24.69"
        },
        {
          "weight": "1.3",
          "price": "$26.51"
        },
        {
          "weight": "1.4",
          "price": "$28.33"
        },
        {
          "weight": "1.5",
          "price": "$30.15"
        },
        {
          "weight": "1.6",
          "price": "$31.97"
        },
        {
          "weight": "1.7",
          "price": "$33.79"
        },
        {
          "weight": "1.8",
          "price": "$35.61"
        },
        {
          "weight": "1.9",
          "price": "$37.42"
        },
        {
          "weight": "2.0",
          "price": "$39.24"
        },
        {
          "weight": "2.1",
          "price": "$41.06"
        },
        {
          "weight": "2.2",
          "price": "$42.88"
        },
        {
          "weight": "2.3",
          "price": "$44.70"
        },
        {
          "weight": "2.4",
          "price": "$46.52"
        },
        {
          "weight": "2.5",
          "price": "$48.34"
        },
        {
          "weight": "2.6",
          "price": "$50.15"
        },
        {
          "weight": "2.7",
          "price": "$51.97"
        },
        {
          "weight": "2.8",
          "price": "$53.79"
        },
        {
          "weight": "2.9",
          "price": "$55.61"
        },
        {
          "weight": "3.0",
          "price": "$57.43"
        },
        {
          "weight": "3.1",
          "price": "$59.25"
        },
        {
          "weight": "3.2",
          "price": "$61.07"
        },
        {
          "weight": "3.3",
          "price": "$62.88"
        },
        {
          "weight": "3.4",
          "price": "$64.70"
        },
        {
          "weight": "3.5",
          "price": "$66.52"
        },
        {
          "weight": "3.6",
          "price": "$68.34"
        },
        {
          "weight": "3.7",
          "price": "$70.16"
        },
        {
          "weight": "3.8",
          "price": "$71.98"
        },
        {
          "weight": "3.9",
          "price": "$73.80"
        },
        {
          "weight": "4.0",
          "price": "$75.61"
        },
        {
          "weight": "4.1",
          "price": "$77.43"
        },
        {
          "weight": "4.2",
          "price": "$79.25"
        },
        {
          "weight": "4.3",
          "price": "$81.07"
        },
        {
          "weight": "4.4",
          "price": "$82.89"
        },
        {
          "weight": "4.5",
          "price": "$84.71"
        },
        {
          "weight": "4.6",
          "price": "$86.53"
        },
        {
          "weight": "4.7",
          "price": "$88.34"
        },
        {
          "weight": "4.8",
          "price": "$90.16"
        },
        {
          "weight": "4.9",
          "price": "$91.98"
        },
        {
          "weight": "5.0",
          "price": "$93.80"
        }
      ],
      "CA": [
        {
          "weight": "0.1",
          "price": "$5.76"
        },
        {
          "weight": "0.2",
          "price": "$7.54"
        },
        {
          "weight": "0.3",
          "price": "$9.30"
        },
        {
          "weight": "0.4",
          "price": "$11.06"
        },
        {
          "weight": "0.5",
          "price": "$13.21"
        },
        {
          "weight": "0.6",
          "price": "$15.01"
        },
        {
          "weight": "0.7",
          "price": "$16.81"
        },
        {
          "weight": "0.8",
          "price": "$18.61"
        },
        {
          "weight": "0.9",
          "price": "$20.41"
        },
        {
          "weight": "1.0",
          "price": "$22.21"
        },
        {
          "weight": "1.1",
          "price": "$24.20"
        },
        {
          "weight": "1.2",
          "price": "$26.00"
        },
        {
          "weight": "1.3",
          "price": "$27.80"
        },
        {
          "weight": "1.4",
          "price": "$29.59"
        },
        {
          "weight": "1.5",
          "price": "$31.39"
        },
        {
          "weight": "1.6",
          "price": "$34.73"
        },
        {
          "weight": "1.7",
          "price": "$36.62"
        },
        {
          "weight": "1.8",
          "price": "$38.52"
        },
        {
          "weight": "1.9",
          "price": "$40.41"
        },
        {
          "weight": "2.0",
          "price": "$42.31"
        },
        {
          "weight": "2.1",
          "price": "$45.00"
        },
        {
          "weight": "2.2",
          "price": "$46.94"
        },
        {
          "weight": "2.3",
          "price": "$48.87"
        },
        {
          "weight": "2.4",
          "price": "$50.81"
        },
        {
          "weight": "2.5",
          "price": "$52.74"
        },
        {
          "weight": "2.6",
          "price": "$54.67"
        },
        {
          "weight": "2.7",
          "price": "$56.61"
        },
        {
          "weight": "2.8",
          "price": "$58.54"
        },
        {
          "weight": "2.9",
          "price": "$60.47"
        },
        {
          "weight": "3.0",
          "price": "$62.41"
        },
        {
          "weight": "3.1",
          "price": "$64.34"
        },
        {
          "weight": "3.2",
          "price": "$66.27"
        },
        {
          "weight": "3.3",
          "price": "$68.21"
        },
        {
          "weight": "3.4",
          "price": "$70.14"
        },
        {
          "weight": "3.5",
          "price": "$72.07"
        },
        {
          "weight": "3.6",
          "price": "$74.01"
        },
        {
          "weight": "3.7",
          "price": "$75.94"
        },
        {
          "weight": "3.8",
          "price": "$77.87"
        },
        {
          "weight": "3.9",
          "price": "$79.81"
        },
        {
          "weight": "4.0",
          "price": "$81.74"
        },
        {
          "weight": "4.1",
          "price": "$83.67"
        },
        {
          "weight": "4.2",
          "price": "$85.61"
        },
        {
          "weight": "4.3",
          "price": "$87.54"
        },
        {
          "weight": "4.4",
          "price": "$89.47"
        },
        {
          "weight": "4.5",
          "price": "$91.41"
        },
        {
          "weight": "4.6",
          "price": "$93.34"
        },
        {
          "weight": "4.7",
          "price": "$95.27"
        },
        {
          "weight": "4.8",
          "price": "$97.21"
        },
        {
          "weight": "4.9",
          "price": "$99.14"
        },
        {
          "weight": "5.0",
          "price": "$101.07"
        }
      ]
    }
  }
};

