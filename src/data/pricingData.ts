export interface PriceRow {
  kg: number;
  [key: string]: number | undefined;
}

export interface BulkZone {
  name: string;
  prices: Record<number, number>;
  sla: string;
}

export const pricingData = {
  "loPin": [
    {
      "name": "Zone 1 (Tây US)",
      "prices": {
        "12": 11.61,
        "21": 11.07,
        "71": 10.36,
        "100": 10
      },
      "sla": "6-8 BSD"
    }
  ],
  "loMypham": [
    {
      "name": "Zone 1 (Tây US)",
      "prices": {
        "12": 11.79,
        "21": 11.25,
        "71": 10.54,
        "100": 10.18
      },
      "sla": "6-8 BSD"
    }
  ],
  "vatData": [
    {
      "country": "Spain",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Sweden",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Slovenia",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Slovakia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Luxembourg",
      "vat": "17%",
      "service": "2%"
    },
    {
      "country": "Maltese",
      "vat": "18%",
      "service": "2%"
    },
    {
      "country": "Ireland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Latvia",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Romania",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Poland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Portugal",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Netherlands",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Italy",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Estonia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Denmark",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Lithuania",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Czech Republic",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Hungary",
      "vat": "27%",
      "service": "2%"
    },
    {
      "country": "Finland",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "Greece",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "Germany",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "France",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Cyprus",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Canada",
      "vat": "18%",
      "service": "2%"
    },
    {
      "country": "Croatia",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Bulgaria",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Belgium",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Austria",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Slovenia",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Spain",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Maltese",
      "vat": "18%",
      "service": "2%"
    },
    {
      "country": "Ireland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Italy",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Finland",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "France",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Romania",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Poland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Sweden",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Luxembourg",
      "vat": "17%",
      "service": "2%"
    },
    {
      "country": "Netherlands",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Slovakia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Portugal",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Bulgaria",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Latvia",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Greece",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "Lithuania",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Cyprus",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Germany",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Hungary",
      "vat": "27%",
      "service": "2%"
    },
    {
      "country": "Estonia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Denmark",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Austria",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Croatia",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Czech Republic",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Belgium",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Mexico",
      "vat": "33.5%",
      "service": "2%"
    },
    {
      "country": "Slovakia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Portugal",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Romania",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Luxembourg",
      "vat": "17%",
      "service": "2%"
    },
    {
      "country": "Netherlands",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Sweden",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Spain",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Poland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Slovenia",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Maltese",
      "vat": "18%",
      "service": "2%"
    },
    {
      "country": "Lithuania",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Germany",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Denmark",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Ireland",
      "vat": "23%",
      "service": "2%"
    },
    {
      "country": "Hungary",
      "vat": "27%",
      "service": "2%"
    },
    {
      "country": "Latvia",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Greece",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "Canada",
      "vat": "18%",
      "service": "2%"
    },
    {
      "country": "Italy",
      "vat": "22%",
      "service": "2%"
    },
    {
      "country": "Czech Republic",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "France",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Finland",
      "vat": "24%",
      "service": "2%"
    },
    {
      "country": "Estonia",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Cyprus",
      "vat": "19%",
      "service": "2%"
    },
    {
      "country": "Croatia",
      "vat": "25%",
      "service": "2%"
    },
    {
      "country": "Belgium",
      "vat": "21%",
      "service": "2%"
    },
    {
      "country": "Austria",
      "vat": "20%",
      "service": "2%"
    },
    {
      "country": "Bulgaria",
      "vat": "20%",
      "service": "2%"
    }
  ],
  "remoteSurcharge": [
    {
      "kg": 0.05,
      "usd": 1.95
    },
    {
      "kg": 0.1,
      "usd": 1.95
    },
    {
      "kg": 0.15,
      "usd": 2.25
    },
    {
      "kg": 0.2,
      "usd": 2.25
    },
    {
      "kg": 0.25,
      "usd": 2.85
    },
    {
      "kg": 0.3,
      "usd": 2.85
    },
    {
      "kg": 0.35,
      "usd": 4.2
    },
    {
      "kg": 0.4,
      "usd": 4.2
    },
    {
      "kg": 0.45,
      "usd": 4.2
    },
    {
      "kg": 0.5,
      "usd": 6.6
    },
    {
      "kg": 0.55,
      "usd": 6.6
    },
    {
      "kg": 0.6,
      "usd": 6.6
    },
    {
      "kg": 0.65,
      "usd": 6.6
    },
    {
      "kg": 0.7,
      "usd": 6.6
    },
    {
      "kg": 0.75,
      "usd": 6.6
    },
    {
      "kg": 0.8,
      "usd": 6.6
    },
    {
      "kg": 0.85,
      "usd": 6.6
    },
    {
      "kg": 0.9,
      "usd": 6.6
    },
    {
      "kg": 0.95,
      "usd": 7.51
    },
    {
      "kg": 1,
      "usd": 7.51
    },
    {
      "kg": 1.1,
      "usd": 7.51
    },
    {
      "kg": 1.2,
      "usd": 7.51
    },
    {
      "kg": 1.3,
      "usd": 7.51
    },
    {
      "kg": 1.4,
      "usd": 7.66
    },
    {
      "kg": 1.5,
      "usd": 7.66
    },
    {
      "kg": 1.6,
      "usd": 7.66
    },
    {
      "kg": 1.7,
      "usd": 7.66
    },
    {
      "kg": 1.8,
      "usd": 7.66
    },
    {
      "kg": 1.9,
      "usd": 8.11
    },
    {
      "kg": 2,
      "usd": 8.11
    },
    {
      "kg": 2.1,
      "usd": 8.11
    },
    {
      "kg": 2.2,
      "usd": 8.11
    },
    {
      "kg": 2.3,
      "usd": 8.41
    },
    {
      "kg": 2.4,
      "usd": 8.41
    },
    {
      "kg": 2.5,
      "usd": 8.41
    },
    {
      "kg": 2.6,
      "usd": 8.41
    },
    {
      "kg": 2.7,
      "usd": 8.41
    },
    {
      "kg": 2.8,
      "usd": 8.86
    },
    {
      "kg": 2.9,
      "usd": 8.86
    },
    {
      "kg": 3,
      "usd": 8.86
    },
    {
      "kg": 3.1,
      "usd": 8.86
    },
    {
      "kg": 3.2,
      "usd": 9.31
    },
    {
      "kg": 3.3,
      "usd": 9.31
    },
    {
      "kg": 3.4,
      "usd": 9.31
    },
    {
      "kg": 3.5,
      "usd": 9.31
    },
    {
      "kg": 3.6,
      "usd": 9.31
    },
    {
      "kg": 3.7,
      "usd": 9.76
    },
    {
      "kg": 3.8,
      "usd": 9.76
    },
    {
      "kg": 3.9,
      "usd": 9.76
    },
    {
      "kg": 4,
      "usd": 9.76
    },
    {
      "kg": 4.1,
      "usd": 10.66
    },
    {
      "kg": 4.2,
      "usd": 10.66
    },
    {
      "kg": 4.3,
      "usd": 10.66
    },
    {
      "kg": 4.4,
      "usd": 10.66
    },
    {
      "kg": 4.5,
      "usd": 10.66
    },
    {
      "kg": 4.6,
      "usd": 11.41
    },
    {
      "kg": 4.7,
      "usd": 11.41
    },
    {
      "kg": 4.8,
      "usd": 11.41
    },
    {
      "kg": 4.9,
      "usd": 11.41
    },
    {
      "kg": 5,
      "usd": 12.16
    },
    {
      "kg": 5.1,
      "usd": 12.16
    },
    {
      "kg": 5.2,
      "usd": 12.16
    },
    {
      "kg": 5.3,
      "usd": 12.16
    },
    {
      "kg": 5.4,
      "usd": 12.16
    },
    {
      "kg": 5.5,
      "usd": 12.91
    },
    {
      "kg": 5.6,
      "usd": 12.91
    },
    {
      "kg": 5.7,
      "usd": 12.91
    },
    {
      "kg": 5.8,
      "usd": 12.91
    },
    {
      "kg": 5.9,
      "usd": 13.66
    },
    {
      "kg": 6,
      "usd": 13.66
    },
    {
      "kg": 6.1,
      "usd": 13.66
    },
    {
      "kg": 6.2,
      "usd": 13.66
    },
    {
      "kg": 6.3,
      "usd": 13.66
    },
    {
      "kg": 6.4,
      "usd": 14.41
    },
    {
      "kg": 6.5,
      "usd": 14.41
    },
    {
      "kg": 6.6,
      "usd": 14.41
    },
    {
      "kg": 6.7,
      "usd": 14.41
    },
    {
      "kg": 6.8,
      "usd": 14.41
    },
    {
      "kg": 6.9,
      "usd": 15.01
    },
    {
      "kg": 7,
      "usd": 15.01
    },
    {
      "kg": 7.1,
      "usd": 15.01
    },
    {
      "kg": 7.2,
      "usd": 15.01
    },
    {
      "kg": 7.3,
      "usd": 15.61
    },
    {
      "kg": 7.4,
      "usd": 15.61
    },
    {
      "kg": 7.5,
      "usd": 15.61
    },
    {
      "kg": 7.6,
      "usd": 15.61
    },
    {
      "kg": 7.7,
      "usd": 15.61
    },
    {
      "kg": 7.8,
      "usd": 16.36
    },
    {
      "kg": 7.9,
      "usd": 16.36
    },
    {
      "kg": 8,
      "usd": 16.36
    },
    {
      "kg": 8.1,
      "usd": 16.36
    },
    {
      "kg": 8.2,
      "usd": 16.96
    },
    {
      "kg": 8.3,
      "usd": 16.96
    },
    {
      "kg": 8.4,
      "usd": 16.96
    },
    {
      "kg": 8.5,
      "usd": 16.96
    },
    {
      "kg": 8.6,
      "usd": 16.96
    },
    {
      "kg": 8.7,
      "usd": 17.56
    },
    {
      "kg": 8.8,
      "usd": 17.56
    },
    {
      "kg": 8.9,
      "usd": 17.56
    },
    {
      "kg": 9,
      "usd": 17.56
    },
    {
      "kg": 9.1,
      "usd": 18.16
    },
    {
      "kg": 9.2,
      "usd": 18.16
    },
    {
      "kg": 9.3,
      "usd": 18.16
    },
    {
      "kg": 9.4,
      "usd": 18.16
    },
    {
      "kg": 9.5,
      "usd": 18.16
    },
    {
      "kg": 9.6,
      "usd": 18.61
    },
    {
      "kg": 9.7,
      "usd": 18.61
    },
    {
      "kg": 9.8,
      "usd": 18.61
    },
    {
      "kg": 9.9,
      "usd": 18.61
    },
    {
      "kg": 10,
      "usd": 24.17
    },
    {
      "kg": 10.1,
      "usd": 24.17
    },
    {
      "kg": 10.2,
      "usd": 24.17
    },
    {
      "kg": 10.3,
      "usd": 24.17
    },
    {
      "kg": 10.4,
      "usd": 24.17
    },
    {
      "kg": 10.5,
      "usd": 31.37
    },
    {
      "kg": 10.6,
      "usd": 31.37
    },
    {
      "kg": 10.7,
      "usd": 31.37
    },
    {
      "kg": 10.8,
      "usd": 31.37
    },
    {
      "kg": 10.9,
      "usd": 38.43
    },
    {
      "kg": 11,
      "usd": 38.43
    },
    {
      "kg": 11.1,
      "usd": 38.43
    },
    {
      "kg": 11.2,
      "usd": 38.43
    },
    {
      "kg": 11.3,
      "usd": 38.43
    },
    {
      "kg": 11.4,
      "usd": 39.03
    },
    {
      "kg": 11.5,
      "usd": 39.03
    },
    {
      "kg": 11.6,
      "usd": 39.03
    },
    {
      "kg": 11.7,
      "usd": 39.03
    },
    {
      "kg": 11.8,
      "usd": 39.63
    },
    {
      "kg": 11.9,
      "usd": 39.63
    },
    {
      "kg": 12,
      "usd": 39.63
    },
    {
      "kg": 12.1,
      "usd": 39.63
    },
    {
      "kg": 12.2,
      "usd": 39.63
    },
    {
      "kg": 12.3,
      "usd": 39.78
    },
    {
      "kg": 12.4,
      "usd": 39.78
    },
    {
      "kg": 12.5,
      "usd": 39.78
    },
    {
      "kg": 12.6,
      "usd": 39.78
    },
    {
      "kg": 12.7,
      "usd": 39.78
    },
    {
      "kg": 12.8,
      "usd": 40.23
    },
    {
      "kg": 12.9,
      "usd": 40.23
    },
    {
      "kg": 13,
      "usd": 40.23
    },
    {
      "kg": 13.1,
      "usd": 40.23
    },
    {
      "kg": 13.2,
      "usd": 41.73
    },
    {
      "kg": 13.3,
      "usd": 41.73
    },
    {
      "kg": 13.4,
      "usd": 41.73
    },
    {
      "kg": 13.5,
      "usd": 41.73
    },
    {
      "kg": 13.6,
      "usd": 41.73
    },
    {
      "kg": 13.7,
      "usd": 43.23
    },
    {
      "kg": 13.8,
      "usd": 43.23
    },
    {
      "kg": 13.9,
      "usd": 43.23
    },
    {
      "kg": 14,
      "usd": 43.23
    },
    {
      "kg": 14.1,
      "usd": 44.88
    },
    {
      "kg": 14.2,
      "usd": 44.88
    },
    {
      "kg": 14.3,
      "usd": 44.88
    },
    {
      "kg": 14.4,
      "usd": 44.88
    },
    {
      "kg": 14.5,
      "usd": 44.88
    },
    {
      "kg": 14.6,
      "usd": 46.38
    },
    {
      "kg": 14.7,
      "usd": 46.38
    },
    {
      "kg": 14.8,
      "usd": 46.38
    },
    {
      "kg": 14.9,
      "usd": 46.38
    },
    {
      "kg": 15,
      "usd": 47.89
    },
    {
      "kg": 15.1,
      "usd": 47.89
    },
    {
      "kg": 15.2,
      "usd": 47.89
    },
    {
      "kg": 15.3,
      "usd": 47.89
    },
    {
      "kg": 15.4,
      "usd": 47.89
    },
    {
      "kg": 15.5,
      "usd": 49.39
    },
    {
      "kg": 15.6,
      "usd": 49.39
    },
    {
      "kg": 15.7,
      "usd": 49.39
    },
    {
      "kg": 15.8,
      "usd": 49.39
    },
    {
      "kg": 15.9,
      "usd": 50.74
    },
    {
      "kg": 16,
      "usd": 50.74
    },
    {
      "kg": 16.1,
      "usd": 50.74
    },
    {
      "kg": 16.2,
      "usd": 50.74
    },
    {
      "kg": 16.3,
      "usd": 50.74
    },
    {
      "kg": 16.4,
      "usd": 51.94
    },
    {
      "kg": 16.5,
      "usd": 51.94
    },
    {
      "kg": 16.6,
      "usd": 51.94
    },
    {
      "kg": 16.7,
      "usd": 51.94
    },
    {
      "kg": 16.8,
      "usd": 53.44
    },
    {
      "kg": 16.9,
      "usd": 53.44
    },
    {
      "kg": 17,
      "usd": 53.44
    },
    {
      "kg": 17.1,
      "usd": 53.44
    },
    {
      "kg": 17.2,
      "usd": 53.44
    },
    {
      "kg": 17.3,
      "usd": 55.09
    },
    {
      "kg": 17.4,
      "usd": 55.09
    },
    {
      "kg": 17.5,
      "usd": 55.09
    },
    {
      "kg": 17.6,
      "usd": 55.09
    },
    {
      "kg": 17.7,
      "usd": 56.59
    },
    {
      "kg": 17.8,
      "usd": 56.59
    },
    {
      "kg": 17.9,
      "usd": 56.59
    },
    {
      "kg": 18,
      "usd": 56.59
    },
    {
      "kg": 18.1,
      "usd": 56.59
    },
    {
      "kg": 18.2,
      "usd": 58.09
    },
    {
      "kg": 18.3,
      "usd": 58.09
    },
    {
      "kg": 18.4,
      "usd": 58.09
    },
    {
      "kg": 18.5,
      "usd": 58.09
    },
    {
      "kg": 18.6,
      "usd": 59.29
    },
    {
      "kg": 18.7,
      "usd": 59.29
    },
    {
      "kg": 18.8,
      "usd": 59.29
    },
    {
      "kg": 18.9,
      "usd": 59.29
    },
    {
      "kg": 19,
      "usd": 59.29
    },
    {
      "kg": 19.1,
      "usd": 60.65
    },
    {
      "kg": 19.2,
      "usd": 60.65
    },
    {
      "kg": 19.3,
      "usd": 60.65
    },
    {
      "kg": 19.4,
      "usd": 60.65
    },
    {
      "kg": 19.5,
      "usd": 60.65
    },
    {
      "kg": 19.6,
      "usd": 61.7
    },
    {
      "kg": 19.7,
      "usd": 61.7
    },
    {
      "kg": 19.8,
      "usd": 61.7
    },
    {
      "kg": 19.9,
      "usd": 61.7
    },
    {
      "kg": 20,
      "usd": 63.35
    },
    {
      "kg": 20.1,
      "usd": 63.35
    },
    {
      "kg": 20.2,
      "usd": 63.35
    },
    {
      "kg": 20.3,
      "usd": 63.35
    },
    {
      "kg": 20.4,
      "usd": 63.35
    },
    {
      "kg": 20.5,
      "usd": 64.7
    },
    {
      "kg": 20.6,
      "usd": 64.7
    },
    {
      "kg": 20.7,
      "usd": 64.7
    },
    {
      "kg": 20.8,
      "usd": 64.7
    },
    {
      "kg": 20.9,
      "usd": 66.05
    },
    {
      "kg": 21,
      "usd": 66.05
    },
    {
      "kg": 21.1,
      "usd": 66.05
    },
    {
      "kg": 21.2,
      "usd": 66.05
    },
    {
      "kg": 21.3,
      "usd": 66.05
    },
    {
      "kg": 21.4,
      "usd": 67.7
    },
    {
      "kg": 21.5,
      "usd": 67.7
    },
    {
      "kg": 21.6,
      "usd": 67.7
    },
    {
      "kg": 21.7,
      "usd": 67.7
    },
    {
      "kg": 21.8,
      "usd": 69.35
    },
    {
      "kg": 21.9,
      "usd": 69.35
    },
    {
      "kg": 22,
      "usd": 69.35
    },
    {
      "kg": 22.1,
      "usd": 69.35
    },
    {
      "kg": 22.2,
      "usd": 69.35
    },
    {
      "kg": 22.3,
      "usd": 70.7
    },
    {
      "kg": 22.4,
      "usd": 70.7
    },
    {
      "kg": 22.5,
      "usd": 70.7
    },
    {
      "kg": 22.6,
      "usd": 70.7
    },
    {
      "kg": 22.7,
      "usd": 72.35
    },
    {
      "kg": 22.8,
      "usd": 72.35
    },
    {
      "kg": 22.9,
      "usd": 72.35
    },
    {
      "kg": 23,
      "usd": 72.35
    },
    {
      "kg": 23.1,
      "usd": 72.35
    },
    {
      "kg": 23.2,
      "usd": 74.01
    },
    {
      "kg": 23.3,
      "usd": 74.01
    },
    {
      "kg": 23.4,
      "usd": 74.01
    },
    {
      "kg": 23.5,
      "usd": 74.01
    },
    {
      "kg": 23.6,
      "usd": 75.51
    },
    {
      "kg": 23.7,
      "usd": 75.51
    },
    {
      "kg": 23.8,
      "usd": 75.51
    },
    {
      "kg": 23.9,
      "usd": 75.51
    },
    {
      "kg": 24,
      "usd": 75.51
    },
    {
      "kg": 24.1,
      "usd": 77.01
    },
    {
      "kg": 24.2,
      "usd": 77.01
    },
    {
      "kg": 24.3,
      "usd": 77.01
    },
    {
      "kg": 24.4,
      "usd": 77.01
    },
    {
      "kg": 24.5,
      "usd": 78.21
    },
    {
      "kg": 24.6,
      "usd": 78.21
    },
    {
      "kg": 24.7,
      "usd": 78.21
    },
    {
      "kg": 24.8,
      "usd": 78.21
    },
    {
      "kg": 24.9,
      "usd": 78.21
    },
    {
      "kg": 25,
      "usd": 79.41
    },
    {
      "kg": 25.1,
      "usd": 79.41
    },
    {
      "kg": 25.2,
      "usd": 79.41
    },
    {
      "kg": 25.3,
      "usd": 79.41
    },
    {
      "kg": 25.4,
      "usd": 79.41
    },
    {
      "kg": 25.5,
      "usd": 80.01
    },
    {
      "kg": 25.6,
      "usd": 80.01
    },
    {
      "kg": 25.7,
      "usd": 80.01
    },
    {
      "kg": 25.8,
      "usd": 80.01
    },
    {
      "kg": 25.9,
      "usd": 81.36
    },
    {
      "kg": 26,
      "usd": 81.36
    },
    {
      "kg": 26.1,
      "usd": 81.36
    },
    {
      "kg": 26.2,
      "usd": 81.36
    },
    {
      "kg": 26.3,
      "usd": 81.36
    },
    {
      "kg": 26.4,
      "usd": 82.41
    },
    {
      "kg": 26.5,
      "usd": 82.41
    },
    {
      "kg": 26.6,
      "usd": 82.41
    },
    {
      "kg": 26.7,
      "usd": 82.41
    },
    {
      "kg": 26.8,
      "usd": 83.46
    },
    {
      "kg": 26.9,
      "usd": 83.46
    },
    {
      "kg": 27,
      "usd": 83.46
    },
    {
      "kg": 27.1,
      "usd": 83.46
    },
    {
      "kg": 27.2,
      "usd": 83.46
    },
    {
      "kg": 27.3,
      "usd": 84.36
    },
    {
      "kg": 27.4,
      "usd": 84.36
    },
    {
      "kg": 27.5,
      "usd": 84.36
    },
    {
      "kg": 27.6,
      "usd": 84.36
    },
    {
      "kg": 27.7,
      "usd": 84.51
    },
    {
      "kg": 27.8,
      "usd": 84.51
    },
    {
      "kg": 27.9,
      "usd": 84.51
    },
    {
      "kg": 28,
      "usd": 84.51
    },
    {
      "kg": 28.1,
      "usd": 84.51
    },
    {
      "kg": 28.2,
      "usd": 85.71
    },
    {
      "kg": 28.3,
      "usd": 85.71
    },
    {
      "kg": 28.4,
      "usd": 85.71
    },
    {
      "kg": 28.5,
      "usd": 85.71
    },
    {
      "kg": 28.6,
      "usd": 86.16
    },
    {
      "kg": 28.7,
      "usd": 86.16
    },
    {
      "kg": 28.8,
      "usd": 86.16
    },
    {
      "kg": 28.9,
      "usd": 86.16
    },
    {
      "kg": 29,
      "usd": 86.16
    },
    {
      "kg": 29.1,
      "usd": 86.62
    },
    {
      "kg": 29.2,
      "usd": 86.62
    },
    {
      "kg": 29.3,
      "usd": 86.62
    },
    {
      "kg": 29.4,
      "usd": 86.62
    },
    {
      "kg": 29.5,
      "usd": 87.22
    },
    {
      "kg": 29.6,
      "usd": 87.22
    },
    {
      "kg": 29.7,
      "usd": 87.22
    },
    {
      "kg": 29.8,
      "usd": 87.22
    },
    {
      "kg": 29.9,
      "usd": 87.22
    },
    {
      "kg": 30,
      "usd": 87.82
    }
  ],
};
