// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include "common.h"
#include "lunar_landing_service.h"
#include "microrestd/microrestd.h"

int main(int argc, char* argv[]) {
  int port = argc >= 2 ? atoi(argv[1]) : 8000;

  LunarLandingService::ParameterRanges ranges;
  ranges.x = argc >= 3 ? make_pair(atof(argv[2]), atof(argv[2])) : make_pair(10., 190.);
  ranges.y = argc >= 4 ? make_pair(atof(argv[3]), atof(argv[3])) : make_pair(90., 190.);
  ranges.v_x = argc >= 5 ? make_pair(atof(argv[4]), atof(argv[4])) : make_pair(-10., 10.);
  ranges.v_y = argc >= 6 ? make_pair(atof(argv[5]), atof(argv[5])) : make_pair(-10., 10.);
  ranges.p = argc >= 7 ? make_pair(atof(argv[6]), atof(argv[6])) : make_pair(20., 20.);
  ranges.l = argc >= 8 ? make_pair(atof(argv[7]), atof(argv[7])) : make_pair(5., 195.);
  ranges.r = argc >= 9 ? make_pair(atof(argv[8]), atof(argv[8])) : make_pair(5., 195.);

  LunarLandingService service(ranges);
  rest_server server;

  cerr << "Spoustim server na portu " << port << endl;
  if (!server.start(&service, port))
    return cerr << "Nelze otevrit server na zadanem portu!" << endl, 1;

  server.wait_until_signalled();
  server.stop();

  return 0;
}
