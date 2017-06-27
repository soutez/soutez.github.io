include Makefile.builtem
include microrestd/Makefile.include

PRISTANI_NA_MESICI=$(call obj,main http_resources lunar_landing lunar_landing_service make_directory $(addprefix microrestd/,$(MICRORESTD_OBJECTS)))
ifeq ($(PLATFORM),win-vs)
  PRISTANI_NA_MESICI+=resources/win_resources.res
endif

.PHONY: all exe
all: exe
exe: $(call exe,pristani_na_mesici)

# resources
http_resources.cpp: $(call exe,resources/http_resources_gen) $(wildcard resources/*)
	$(call exe,resources/http_resources_gen) >$@
$(call exe,resources/http_resources_gen): $(call obj,resources/http_resources_gen)
	$(call link_exe,$@,$^,$(call win_subsystem,console))

%.res: %.rc
	rc $<

# executables
$(call exe,pristani_na_mesici): LD_FLAGS+=$(call use_library,$(if $(filter win-%,$(PLATFORM)),$(MICRORESTD_LIBRARIES_WIN),$(MICRORESTD_LIBRARIES_POSIX)))
$(call exe,pristani_na_mesici): $(PRISTANI_NA_MESICI)
	$(call link_exe,$@,$^,$(call win_subsystem,console))

# cleaning
.PHONY: clean
clean:
	@$(call rm,.build $(call all_exe,pristani_na_mesici resources/http_resources_gen) http_resources.cpp resources/win_resources.res)
