// Copyright 2017 Milan Straka, Czech Republic.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#include <cmath>

#include "lunar_landing.h"

LunarLanding::LunarLanding(State state) {
  running = true;
  this->state = state;
  this->engines = Engines(false, false, false);
  t_start = chrono::steady_clock::now();
  t_current = 0.;

  history.emplace_back(state, engines, 0);
}

void LunarLanding::update(Engines engines) {
  if (!running) return;

  double t = chrono::duration<double>(chrono::steady_clock::now() - t_start).count() - t_current;
  if (t < 0) t = 0;

  // Find out whether in t time y <= 10.
  double t_crash = t;
  double a = 0.5 * (-7 + 12 * this->engines.up);
  double b = state.v_y;
  double c = state.y - 10;
  double D = b * b - 4 * a * c;
  if (D > 0) {
    D = sqrt(D);
    double t1 = (-b - D) / (2 * a), t2 = (-b + D) / (2 * a);
    if (t1 >= 0 && t1 < t_crash) t_crash = t1;
    if (t2 >= 0 && t2 < t_crash) t_crash = t2;
  }

  // Find out when the fuel runs out.
  double t_fuel = t;
  if (1 * this->engines.up + 0.5 * this->engines.left + 0.5 * this->engines.right)
    t_fuel = state.p / (1 * this->engines.up + 0.5 * this->engines.left + 0.5 * this->engines.right);

  // If the end-of-fule is the first event
  bool out_of_fuel = false;
  if (t_fuel < t && t_fuel < t_crash)
    out_of_fuel = true, t = t_fuel;
  // Deal with crash
  else if (t_crash < t)
    running = false, t = t_crash;

  state.x = state.x + state.v_x * t + 0.5 * (6 * this->engines.right - 6 * this->engines.left) * t * t;
  state.y = state.y + state.v_y * t + 0.5 * (-7 + 12 * this->engines.up) * t * t;
  state.v_x = state.v_x + (6 * this->engines.right - 6 * this->engines.left) * t;
  state.v_y = state.v_y + (-7 + 12 * this->engines.up) * t;
  state.p = state.p - (1 * this->engines.up + 0.5 * this->engines.left + 0.5 * this->engines.right) * t;

  if (out_of_fuel || state.p <= 0) {
    engines.left = engines.right = engines.up = false;
    state.p = 0;
  }

  if (state.y <= 10)
    running = false;
  if (!running) {
    successful = abs(state.v_x) <= 5 && abs(state.v_y) <= 5 && state.x - 10 >= state.l && state.x + 10 <= state.r;
    state.y = 10;
  }

  if (!running || this->engines.up != engines.up || this->engines.left != engines.left || this->engines.right != engines.right)
    history.emplace_back(state, engines, t_current + t);
  this->t_current += t;
  this->engines = engines;

  if (out_of_fuel)
    update(engines);
}

bool LunarLanding::is_running() const {
  return running;
}

bool LunarLanding::was_successful() const {
  return successful;
}

const LunarLanding::State& LunarLanding::get_state() const {
  return state;
}

const LunarLanding::Engines& LunarLanding::get_engines() const {
  return engines;
}

const vector<LunarLanding::HistoryEntry>& LunarLanding::get_history() const {
  return history;
}
