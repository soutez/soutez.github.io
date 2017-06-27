#!/bin/sh

make -C .. clean

(cd .. && /work/ufal/cpp_builtem/compilers/make-remote-osx-clang.sh manfred)
mv ../pristani_na_mesici pristani_na_mesici_v2-osx

(cd .. && /work/ufal/cpp_builtem/compilers/make-linux-gcc-32.sh -j3)
mv ../pristani_na_mesici pristani_na_mesici_v2-linux32

(cd .. && /work/ufal/cpp_builtem/compilers/make-linux-gcc-64.sh -j3)
mv ../pristani_na_mesici pristani_na_mesici_v2-linux64

(cd .. && /work/ufal/cpp_builtem/compilers/make-visual-cpp-32.sh -j3)
mv ../pristani_na_mesici.exe pristani_na_mesici_v2-win32.exe

vi ../Makefile

(cd .. && /work/ufal/cpp_builtem/compilers/make-visual-cpp-64.sh -j3)
mv ../pristani_na_mesici.exe pristani_na_mesici_v2-win64.exe

vi ../Makefile
