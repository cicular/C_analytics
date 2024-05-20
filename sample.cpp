// CsvReader.cpp
#include "CsvReader.hpp"
#include <fstream>
#include <sstream>
#include <iostream>

CsvReader::CsvReader(const std::string& filename) : filename(filename) {}

std::vector<PrefectureData> CsvReader::read() {
    std::vector<PrefectureData> data;
    std::ifstream file(filename);

    if (!file.is_open()) {
        std::cerr << "Error: Could not open file " << filename << std::endl;
        return data;
    }

    std::string line;
    while (std::getline(file, line)) {
        std::stringstream ss(line);
        std::string name;
        std::string populationStr;
        if (std::getline(ss, name, ',') && std::getline(ss, populationStr, ',')) {
            try {
                int population = std::stoi(populationStr);
                data.push_back({name, population});
            } catch (const std::invalid_argument& e) {
                std::cerr << "Error: Invalid population value for " << name << std::endl;
            }
        }
    }

    file.close();
    return data;
}
