// CsvReader.hpp
#ifndef CSVREADER_HPP
#define CSVREADER_HPP

#include <string>
#include <vector>

struct PrefectureData {
    std::string name;
    int population;
};

class CsvReader {
public:
    CsvReader(const std::string& filename);
    std::vector<PrefectureData> read();

private:
    std::string filename;
};

#endif // CSVREADER_HPP
