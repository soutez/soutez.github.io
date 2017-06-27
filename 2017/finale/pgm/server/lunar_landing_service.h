// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#pragma once

#include <random>

#include "common.h"
#include "lunar_landing.h"
#include "microrestd/microrestd.h"

class LunarLandingService : public rest_service {
 public:
  struct ParameterRanges {
    pair<double, double> x, y, v_x, v_y, p, l, r;
  };

  LunarLandingService(ParameterRanges ranges);

  virtual bool handle(rest_request& req) override;

 private:
  bool handle_start(rest_request& req);
  bool handle_state(rest_request& req);
  void update_landing(int id, LunarLanding::Engines engines);
  string serialize_landing_state(unsigned id, const LunarLanding& landing);
  void log_history_entry(ostream& os, LunarLanding::HistoryEntry entry);

  bool handle_index(rest_request& req);
  bool handle_landing(rest_request& req);
  bool handle_client(rest_request& req);

  bool get_id(rest_request& req, int& id, string& error);
  string format_range(pair<double, double>& range);
  bool update_range(rest_request& req, string name, pair<double, double>& range);

  ParameterRanges ranges;
  mt19937 generator;

  vector<LunarLanding> landings;
  vector<unique_ptr<ostream>> landing_logs;
};
