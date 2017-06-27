// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#pragma once

#include <chrono>

#include "common.h"

class LunarLanding {
 public:
  struct State {
    double x, y, v_x, v_y, p, l, r;

    State() {}
    State(double x, double y, double v_x, double v_y, double p, double l, double r) :
      x(x), y(y), v_x(v_x), v_y(v_y), p(p), l(l), r(r) {}
  };

  struct Engines {
    bool up, left, right;

    Engines() {}
    Engines(bool up, bool left, bool right)
        : up(up), left(left), right(right) {}
  };

  struct HistoryEntry {
    State state;
    Engines engines;
    double t;

    HistoryEntry(State state, Engines engines, double t)
        : state(state), engines(engines), t(t) {}
  };

  LunarLanding(State state);
  void update(Engines engines);

  bool is_running() const;
  bool was_successful() const;

  const State& get_state() const;
  const Engines& get_engines() const;

  const vector<HistoryEntry>& get_history() const;

 private:
  bool running;
  bool successful;

  State state;
  Engines engines;
  chrono::steady_clock::time_point t_start;
  double t_current;

  vector<HistoryEntry> history;
};
