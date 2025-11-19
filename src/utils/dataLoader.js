// Utility functions to load barangay data

// Cache for CSV data
let allYearsData = null;

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
};

export const loadBarangayLSTData = async (year) => {
  try {
    // Load CSV data if not cached
    if (!allYearsData) {
      const response = await fetch('/barangay_lst_all_years.csv');
      const csvText = await response.text();
      allYearsData = parseCSV(csvText);
    }

    // Filter data for the selected year
    const yearData = allYearsData.filter(row => parseInt(row.year) === year);

    if (yearData.length === 0) {
      console.warn(`No LST data available for year ${year}`);
      return {};
    }

    // Convert to lookup object
    const barangayData = {};
    yearData.forEach((row) => {
      barangayData[row.barangay] = {
        avgLST: parseFloat(row.avg_lst),
        minLST: parseFloat(row.min_lst),
        maxLST: parseFloat(row.max_lst),
        stdLST: parseFloat(row.std_lst),
        pixelCount: parseInt(row.pixel_count)
      };
    });

    console.log(`Loaded LST data for ${year}:`, Object.keys(barangayData).length, 'barangays');
    return barangayData;
  } catch (error) {
    console.error(`Error loading LST data for year ${year}:`, error);
    return {};
  }
};

// Real population data from Census
// 2020 Census data (used for years 2020-2022)
const population2020 = {
  "Arkong Bato": 11358,
  "Bagbaguin": 15195,
  "Balangkas": 14318,
  "Bignay": 49716,
  "Bisig": 1432,
  "Canumay East": 14657,
  "Canumay West": 26901,
  "Coloong": 12550,
  "Dalandanan": 23640,
  "Gen. T. De Leon": 95809,
  "Isla": 5160,
  "Karuhatan": 41275,
  "Lawang Bato": 23786,
  "Lingunan": 24088,
  "Mabolo": 831,
  "Malanday": 19060,
  "Malinta": 52107,
  "Mapulang Lupa": 30360,
  "Marulas": 59339,
  "Maysan": 23081,
  "Palasan": 6598,
  "Parada": 21001,
  "Pariancillo Villa": 1949,
  "Paso De Blas": 12530,
  "Pasolo": 8150,
  "Poblacion": 221,
  "Pulo": 1126,
  "Punturin": 24437,
  "Rincon": 6940,
  "Tagalag": 3400,
  "Ugong": 55494,
  "Veinte Reales": 24399,
  "Wawang Pulo": 4070
};

// 2024 Census data (used for years 2024-2025)
const population2024 = {
  "Arkong Bato": 10746,
  "Bagbaguin": 15524,
  "Balangkas": 14658,
  "Bignay": 53837,
  "Bisig": 1448,
  "Canumay East": 15058,
  "Canumay West": 26517,
  "Coloong": 13035,
  "Dalandanan": 20084,
  "Gen. T. De Leon": 99317,
  "Isla": 5161,
  "Karuhatan": 42845,
  "Lawang Bato": 23880,
  "Lingunan": 25423,
  "Mabolo": 1122,
  "Malanday": 19344,
  "Malinta": 53486,
  "Mapulang Lupa": 30775,
  "Marulas": 61583,
  "Maysan": 23501,
  "Palasan": 6786,
  "Parada": 21602,
  "Pariancillo Villa": 1989,
  "Paso De Blas": 12882,
  "Pasolo": 8190,
  "Poblacion": 224,
  "Pulo": 1147,
  "Punturin": 25170,
  "Rincon": 7097,
  "Tagalag": 3468,
  "Ugong": 56202,
  "Veinte Reales": 18874,
  "Wawang Pulo": 4198
};

// Function to get population data based on year
export const getPopulationData = (year) => {
  // Years 2020-2022 use 2020 census data
  if (year >= 2020 && year <= 2022) {
    return population2020;
  }
  // Years 2024-2025 use 2024 census data
  else if (year >= 2024 && year <= 2025) {
    return population2024;
  }
  // Default to 2024 data for any other year
  return population2024;
};

// Deprecated: Keep for backward compatibility
export const mockPopulationData = population2024;
