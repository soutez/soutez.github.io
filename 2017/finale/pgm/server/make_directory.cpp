// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include "make_directory.h"

#ifdef _WIN32

#include <direct.h>

bool make_directory(const char* dirname) {
  return _mkdir(dirname) == 0;
}

#else

#include <sys/stat.h>
#include <sys/types.h>

bool make_directory(const char* dirname) {
  return mkdir(dirname, 0755) == 0;
}

#endif
