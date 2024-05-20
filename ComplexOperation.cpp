#include "ComplexOperation.h"
#include "Logger.h"

#include <chrono>

void ComplexOperation::doStuff( std::ostream& stream )
{
    Logger logger( stream );
    aaaaa();
    m_value = 3;

    logTimeAndStep( logger, "started computation" );

    logger << "Doing step 1" << '\n';
    logger << "Doing step 2 - part 1" << '\n';
    logger << "Doing step 2 - part 2" << '\n';
    logger << "Doing step 3 - testing if part 2 worked" << '\n';
    for ( int i = 1; i <= 7; ++i )
    {
        logger << "Step 4 - section " << i << '\n';
    }

    logTimeAndStep( logger, "finished computation" );

    logger << "Done!\n";
}

void ComplexOperation::aaaaa( std::ostream& stream )
{
    Logger logger( stream );

    logTimeAndStep( logger, "started computation" );

    logger << "Doing step 1" << '\n';
    logger << "Doing step 2 - part 1" << '\n';
    logger << "Doing step 2 - part 2" << '\n';
    logger << "Doing step 3 - testing if part 2 worked" << '\n';
    for ( int i = 1; i <= 7; ++i )
    {
        logger << "Step 4 - section " << i << '\n';
    }

    logTimeAndStep( logger, "finished computation" );

    logger << "Done!\n";
}
