// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include <ctime>
#include <fstream>
#include <sstream>

#include "http_resources.h"
#include "lunar_landing_service.h"
#include "make_directory.h"

LunarLandingService::LunarLandingService(ParameterRanges ranges) : ranges(ranges), generator(time(0)) {
  make_directory("logy");
}

bool LunarLandingService::handle(rest_request& req) {
  if (req.method != "GET" && req.method != "POST") return req.respond_method_not_allowed("GET");

  if (req.url == "/start") return handle_start(req);
  if (req.url == "/stav") return handle_state(req);

  if (req.url == "/") return handle_index(req);
  if (req.url == "/pristani") return handle_landing(req);
  if (req.url == "/jsklient") return handle_client(req);

  // Try embedded resources
  string_piece resource_value;
  string resource_mime;
  if (HttpResources::get_resource(req.url.substr(1), resource_value, &resource_mime))
    return req.respond(resource_mime.c_str(), resource_value, false);

  // No handler
  return req.respond_not_found();
}

bool LunarLandingService::handle_start(rest_request& req) {
  double x = uniform_real_distribution<double>(ranges.x.first, ranges.x.second)(generator);
  double y = uniform_real_distribution<double>(ranges.y.first, ranges.y.second)(generator);
  double v_x = uniform_real_distribution<double>(ranges.v_x.first, ranges.v_x.second)(generator);
  double v_y = uniform_real_distribution<double>(ranges.v_y.first, ranges.v_y.second)(generator);
  double p = uniform_real_distribution<double>(ranges.p.first, ranges.p.second)(generator);
  double l = 0, r = 0; int retries = 0;
  while (l + 20 > r && retries++ < 1000) {
    l = uniform_real_distribution<double>(ranges.l.first, ranges.l.second)(generator);
    r = uniform_real_distribution<double>(ranges.r.first, ranges.r.second)(generator);
  }
  if (l + 20 > r) r = l + 20;

  landings.emplace_back(LunarLanding::State(x, y, v_x, v_y, p, l, r));

  char log_name[256];
  time_t now = time(0);
  strftime(log_name, sizeof(log_name), "logy/%H-%M-%S.", localtime(&now));
  landing_logs.emplace_back(unique_ptr<ostream>(new ofstream(log_name + to_string(landings.size()) + ".txt")));
  log_history_entry(*landing_logs.back().get(), landings.back().get_history().back());

  string landing_state = serialize_landing_state(landings.size() - 1, landings.back());

  return req.respond("text/plain", serialize_landing_state(landings.size() - 1, landings.back()));
}

bool LunarLandingService::handle_state(rest_request& req) {
  string error;
  int id; if (!get_id(req, id, error)) return req.respond("text/plain", error);

  LunarLanding& landing = landings[id];

  LunarLanding::Engines engines = landing.get_engines();
  auto up_it = req.params.find("nahoru");
  if (up_it != req.params.end() && (up_it->second == "0" || up_it->second == "1")) engines.up = up_it->second == "1";
  auto left_it = req.params.find("doleva");
  if (left_it != req.params.end() && (left_it->second == "0" || left_it->second == "1")) engines.left = left_it->second == "1";
  auto right_it = req.params.find("doprava");
  if (right_it != req.params.end() && (right_it->second == "0" || right_it->second == "1")) engines.right = right_it->second == "1";

  update_landing(id, engines);

  return req.respond("text/plain", serialize_landing_state(id, landing));
}

void LunarLandingService::update_landing(int id, LunarLanding::Engines engines) {
  unsigned history_entires = landings[id].get_history().size();

  landings[id].update(engines);

  if (landing_logs[id] && history_entires != landings[id].get_history().size())
    log_history_entry(*landing_logs[id].get(), landings[id].get_history().back());
  if (landing_logs[id] && !landings[id].is_running()) landing_logs[id].reset();
}

string LunarLandingService::serialize_landing_state(unsigned id, const LunarLanding& landing) {
  ostringstream os;

  if (landing.is_running()) {
    auto state = landing.get_state();
    os << id + 1 << "\r\n"
       << state.x << ' ' << state.y << "\r\n"
       << state.v_x << ' ' << state.v_y << "\r\n"
       << state.p << "\r\n"
       << state.l << ' ' << state.r << "\r\n";
  } else {
    os << (landing.was_successful() ? "Zdar!" : "Krach!");
  }

  return os.str();
}

void LunarLandingService::log_history_entry(ostream& os, LunarLanding::HistoryEntry entry) {
  os << "Cas: " << fixed << setprecision(2) << entry.t
     << ", X: " << entry.state.x << ", Y: " << entry.state.y
     << ", V_X: " << entry.state.v_x << ", V_Y: " << entry.state.v_y
     << ", P: " << entry.state.p
     << ", L: " << entry.state.l << ", R: " << entry.state.r
     << ", nahoru: " << int(entry.engines.up)
     << ", doleva: " << int(entry.engines.left)
     << ", doprava: " << int(entry.engines.right)
     << "\n";
}

bool LunarLandingService::handle_index(rest_request& req) {
  bool redirect_page = false;
  if (update_range(req, "x", ranges.x)) redirect_page = true;
  if (update_range(req, "y", ranges.y)) redirect_page = true;
  if (update_range(req, "v_x", ranges.v_x)) redirect_page = true;
  if (update_range(req, "v_y", ranges.v_y)) redirect_page = true;
  if (update_range(req, "p", ranges.p)) redirect_page = true;
  if (update_range(req, "l", ranges.l)) redirect_page = true;
  if (update_range(req, "r", ranges.r)) redirect_page = true;

  ostringstream html;
  string_piece resource;

  HttpResources::get_resource("header.html", resource); html.write(resource.str, resource.len);

  if (redirect_page) html << "<script type='text/javascript'> window.location.replace('/') </script>\n";

  html << R"(
          <div class="panel panel-default">
            <div class="panel-heading">Nastavení nové hry</div>
            <div class="panel-body form-horizontal">
             <form action="/" method="post">
              <div class="form-group">
                <label class="col-sm-1 control-label">X:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="x" value=")" << format_range(ranges.x) << R"("></div>
                <label class="col-sm-1 control-label">Y:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="y" value=")" << format_range(ranges.y) << R"("></div>
                <label class="col-sm-1 control-label">V<sub>X</sub>:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="v_x" value=")" << format_range(ranges.v_x) << R"("></div>
                <label class="col-sm-1 control-label">V<sub>Y</sub>:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="v_y" value=")" << format_range(ranges.v_y) << R"("></div>
              </div>
              <div class="form-group">
                <label class="col-sm-1 control-label">P:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="p" value=")" << format_range(ranges.p) << R"("></div>
                <label class="col-sm-1 control-label">L:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="l" value=")" << format_range(ranges.l) << R"("></div>
                <label class="col-sm-1 control-label">R:</label>
                <div class="col-sm-2"><input type="text" class="form-control" name="r" value=")" << format_range(ranges.r) << R"("></div>
                <div class="col-sm-offset-1 col-sm-2"><input type="submit" class="btn btn-primary form-control" value="Nastavit"></div>
              </div>
             </form>
            </div>
          </div>
  )";

  html << R"(
          <div class="panel panel-default">
            <div class="panel-heading">Započatá přistání</div>
            <table class="table table-striped">
  )";
  for (unsigned i = 0; i < landings.size(); i++) {
    update_landing(i, landings[i].get_engines());
    html << "<tr><td><a href='/pristani?id=" << i + 1 << "'>Přistání číslo " << i + 1
         << "<td>Stav: " << (landings[i].is_running() ? "probíhá" :
                             landings[i].was_successful() ? "skončilo úspěchem" : "skončilo neúspěchem");
  }
  html << R"(
            </table>
          </div>
  )";

  HttpResources::get_resource("footer.html", resource); html.write(resource.str, resource.len);
  return req.respond("text/html", html.str());
}

bool LunarLandingService::handle_landing(rest_request& req) {
  string error;
  int id; if (!get_id(req, id, error)) return req.respond("text/plain", error);

  ostringstream html;
  string_piece resource;

  HttpResources::get_resource("header.html", resource); html.write(resource.str, resource.len);

  update_landing(id, landings[id].get_engines());

  html << R"(
          <div class="panel panel-default">
            <div class="panel-heading">Stav přistání</div>
            <div class="panel-body">
  )"   << (landings[id].is_running() ? "Přistání probíhá" :
           landings[id].was_successful() ? "Přistání skončilo úspěchem" : "Přistání skončilo neúspěchem")
       << R"(
            </div>
          </div>
  )";

  html << R"(
          <div class="panel panel-default">
            <div class="panel-heading">Historie přistání</div>
            <table class="table table-striped">
             <tr><th>Čas od začátku přistání<th>Pozice modulu<th>Rychlosti modulu<th>Zbylé palivo<th>Přistávací plocha<th>Motory
  )";
  for (auto entry : landings[id].get_history()) {
    html << "<tr><td>" << fixed << setprecision(2) << entry.t
         << "<td>" << entry.state.x << ", " << entry.state.y
         << "<td>" << entry.state.v_x << ", " << entry.state.v_y
         << "<td>" << entry.state.p
         << "<td>" << entry.state.l << ", " << entry.state.r
         << "<td>nahoru: " << int(entry.engines.up)
         << ", doleva: " << int(entry.engines.left)
         << ", doprava: " << int(entry.engines.right);
  }
  html << R"(
            </table>
          </div>
  )";

  HttpResources::get_resource("footer.html", resource); html.write(resource.str, resource.len);
  return req.respond("text/html", html.str());
}

bool LunarLandingService::handle_client(rest_request& req) {
  stringstream html;

  string_piece resource;
  HttpResources::get_resource("header.html", resource); html.write(resource.str, resource.len);
  HttpResources::get_resource("client.html", resource); html.write(resource.str, resource.len);
  HttpResources::get_resource("footer.html", resource); html.write(resource.str, resource.len);

  return req.respond("text/html", html.str());
}

bool LunarLandingService::get_id(rest_request& req, int& id, string& error) {
  auto id_it = req.params.find("id");
  if (id_it == req.params.end()) return error.assign("Chyba: chybi povinny parametr 'id'!"), false;
  id = atoi(id_it->second.c_str()) - 1;
  if (id < 0 || id >= int(landings.size())) return error.assign("Chyba: neplatna hodnota parametru 'id'!"), false;

  return true;
}

string LunarLandingService::format_range(pair<double, double>& range) {
  ostringstream os;

  os << range.first;
  if (range.second != range.first)
    os << ':' << range.second;

  return os.str();
}

bool LunarLandingService::update_range(rest_request& req, string name, pair<double, double>& range) {
  auto it = req.params.find(name);
  if (it == req.params.end()) return false;

  istringstream is(it->second);

  double first, second;
  if (is >> first) {
    if (!((is.get() == ':') && (is >> second))) second = first;
    range.first = first;
    range.second = second;
  }
  return true;
}
