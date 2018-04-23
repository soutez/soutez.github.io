// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include <algorithm>
#include <fstream>

#include "../common.h"

vector<pair<string, string>> resources = {
  {"bootstrap.min.css", "text/css"},
  {"bootstrap.min.js", "text/javascript"},
  {"client.html", "text/html"},
  {"footer.html", "text/html"},
  {"header.html", "text/html"},
  {"jquery.min.js", "text/javascript"},
  {"lunar_lander.ico", "image/x-icon"},
  {"lunar_lander.svg", "image/svg+xml"},
};

string get_variable_name(string file) {
  string variable_name = file;
  replace(variable_name.begin(), variable_name.end(), '.', '_');
  return variable_name;
}

int main(void) {
  cout <<
R"(// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include "http_resources.h"

class HttpResourcesData {
 public:
)";

  for (auto&& resource : resources) {
    cout << "    static unsigned char " << get_variable_name(resource.first) << "[];\n";
  }

  cout << "};\n\n";

  for (auto&& resource : resources) {
    cout << "unsigned char HttpResourcesData::" << get_variable_name(resource.first) << "[] = {\n  ";
    ifstream is("resources/" + resource.first);
    if (!is.is_open()) return cerr << "Cannot open file resources/" << resource.first << endl, 1;
    for (int count = 0, chr; (chr = is.get()) != EOF; count++)
      cout << chr << ((count & 0x1F) == 0x1F ? ",\n  " : ",");
    cout << "};\n";
  }

  cout << "\nbool HttpResources::get_resource(const string& name, string_piece& value, string* mime) {\n";
  for (auto&& resource : resources) {
    cout << "  if (name == \"" << resource.first << "\") {\n"
         << "    value.str = (const char*)HttpResourcesData::" << get_variable_name(resource.first) << ";\n"
         << "    value.len = sizeof(HttpResourcesData::" << get_variable_name(resource.first) << ");\n"
         << "    if (mime) mime->assign(\"" << resource.second << "\");\n"
         << "    return true;\n"
         << "  }\n\n";
  }
  cout << "  return false;\n"
       << "}\n";

  return 0;
}

